import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, computed, inject, signal } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';
import { Fuente } from '../../../@data/interfaces/oferta';
import { IRecoleccion } from '../../../@data/interfaces/recoleccion';
import { RecoleccionService } from '../../../@data/services/recoleccion.service';
import { INTERVALO_AVANCE_MS, enlaceLector } from '../../../Utils/const';
import { ConexionesStore } from './conexiones.store';

/** Abre una dirección en el navegador; en las pruebas se reemplaza para ver qué enlace se intentó abrir. */
export const ABRIR_ENLACE = new InjectionToken<(direccion: string) => void>('ABRIR_ENLACE', {
  providedIn: 'root',
  factory: () => {
    const documento = inject(DOCUMENT);
    return (direccion: string) => documento.location.assign(direccion);
  },
});

interface RecoleccionState {
  recoleccion: IRecoleccion | null;
  lanzando: boolean;
}

/**
 * Recolección a demanda y su avance. Mientras corre, consulta el avance cada segundo; al terminar, vuelve a cargar
 * las conexiones. La consulta vive solo mientras la pantalla de conexiones está abierta. Un error de la consulta la
 * detiene (el cliente HTTP ya lo mostró): seguir preguntando con la sesión vencida no sirve.
 */
@Injectable({ providedIn: 'root' })
export class RecoleccionStore {
  private readonly servicio = inject(RecoleccionService);
  private readonly conexiones = inject(ConexionesStore);
  private readonly abrirEnlace = inject(ABRIR_ENLACE);

  private readonly state = signal<RecoleccionState>({ recoleccion: null, lanzando: false });
  readonly lecturasTerminadas = signal<Partial<Record<Fuente, number>>>({});
  private consulta: Subscription | null = null;

  readonly recoleccion = computed(() => this.state().recoleccion);
  readonly enCurso = computed(() => this.state().recoleccion?.estado === 'EN_CURSO');
  /** No se puede lanzar otra: hay una en curso o se está pidiendo una. */
  readonly ocupada = computed(() => this.enCurso() || this.state().lanzando);

  /** Al abrir la pantalla: recupera la recolección en curso o el último resultado. */
  entrar(): void {
    this.consultar(0);
  }

  /** Al salir de la pantalla no queda ninguna consulta pendiente. */
  salir(): void {
    this.detener();
  }

  lanzar(fuente: Fuente | null): void {
    if (this.ocupada()) {
      return;
    }
    this.state.update((s) => ({ ...s, lanzando: true }));
    this.servicio.lanzar(fuente).subscribe({
      next: (recoleccion) => {
        this.state.set({ recoleccion, lanzando: false });
        this.consultar(INTERVALO_AVANCE_MS);
      },
      // Rechazada (por ejemplo, otra en curso): el motivo ya se mostró; se trae lo que corre ahora.
      error: () => {
        this.state.update((s) => ({ ...s, lanzando: false }));
        this.consultar(0);
      },
    });
  }

  /**
   * Abre una corrida para el lector de la máquina y lanza el lector con su enlace. El código no se guarda: solo viaja
   * en el enlace. El avance se sigue igual que el de las demás recolecciones; si el lector no se reporta, la API
   * cierra la corrida con ese motivo y la barra lo muestra.
   */
  leerDesdeMaquina(): void {
    if (this.ocupada()) {
      return;
    }
    this.state.update((s) => ({ ...s, lanzando: true }));
    this.servicio.abrirCorridaLocal().subscribe({
      next: ({ codigo, avance }) => {
        this.state.set({ recoleccion: avance, lanzando: false });
        this.abrirEnlace(enlaceLector(codigo));
        this.consultar(INTERVALO_AVANCE_MS);
      },
      error: () => {
        this.state.update((s) => ({ ...s, lanzando: false }));
        this.consultar(0);
      },
    });
  }

  private consultar(espera: number): void {
    this.detener();
    // La primera consulta sale en el acto: al abrir la pantalla se ve enseguida lo que corre.
    const avance = espera === 0 ? this.servicio.avance() : timer(espera).pipe(switchMap(() => this.servicio.avance()));
    this.consulta = avance.subscribe({
      next: (recoleccion) => this.recibir(recoleccion),
      error: () => (this.consulta = null),
    });
  }

  private recibir(recoleccion: IRecoleccion): void {
    const previa = this.state().recoleccion;
    const antes = previa?.estado;
    for (const fuente of recoleccion.fuentes) {
      const anterior = previa?.inicio === recoleccion.inicio
        ? previa.fuentes.find((f) => f.fuente === fuente.fuente)?.paso : undefined;
      if (fuente.paso === 'TERMINADA' && anterior !== 'TERMINADA') {
        this.lecturasTerminadas.update((v) => ({ ...v, [fuente.fuente]: (v[fuente.fuente] ?? 0) + 1 }));
        if (recoleccion.estado === 'EN_CURSO') this.conexiones.cargar();
      }
    }
    this.state.update((s) => ({ ...s, recoleccion }));
    if (recoleccion.estado === 'EN_CURSO') {
      this.consultar(INTERVALO_AVANCE_MS);
      return;
    }
    this.consulta = null;
    if (antes === 'EN_CURSO' && recoleccion.estado === 'TERMINADA') {
      this.conexiones.cargar();
    }
  }

  private detener(): void {
    this.consulta?.unsubscribe();
    this.consulta = null;
  }
}
