import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';
import { Fuente } from '../../../@data/interfaces/oferta';
import { IRecoleccion } from '../../../@data/interfaces/recoleccion';
import { RecoleccionService } from '../../../@data/services/recoleccion.service';
import { INTERVALO_AVANCE_MS } from '../../../Utils/const';
import { OfertasStore } from './ofertas.store';

interface RecoleccionState {
  recoleccion: IRecoleccion | null;
  lanzando: boolean;
}

/**
 * Recolección a demanda y su avance. Mientras corre, consulta el avance cada segundo; al terminar, vuelve a cargar
 * fuentes y lista. La consulta vive solo mientras la pantalla de ofertas está abierta. Un error de la consulta la
 * detiene (el cliente HTTP ya lo mostró): seguir preguntando con la sesión vencida no sirve.
 */
@Injectable({ providedIn: 'root' })
export class RecoleccionStore {
  private readonly servicio = inject(RecoleccionService);
  private readonly ofertas = inject(OfertasStore);

  private readonly state = signal<RecoleccionState>({ recoleccion: null, lanzando: false });
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
    const antes = this.state().recoleccion?.estado;
    this.state.update((s) => ({ ...s, recoleccion }));
    if (recoleccion.estado === 'EN_CURSO') {
      this.consultar(INTERVALO_AVANCE_MS);
      return;
    }
    this.consulta = null;
    if (antes === 'EN_CURSO' && recoleccion.estado === 'TERMINADA') {
      this.ofertas.refrescar();
    }
  }

  private detener(): void {
    this.consulta?.unsubscribe();
    this.consulta = null;
  }
}
