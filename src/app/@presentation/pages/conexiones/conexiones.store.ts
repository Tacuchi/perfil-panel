import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { IConexion } from '../../../@data/interfaces/conexion';
import { Fuente } from '../../../@data/interfaces/oferta';
import { ConexionesService } from '../../../@data/services/conexiones.service';
import { ToastService } from '../../../@data/services/toast.service';
import { MSG_CLAVE_GUARDADA, MSG_TOPE_GUARDADO } from '../../../Utils/const';

interface ConexionesState {
  conexiones: IConexion[];
  ocupado: boolean;
}

/** Estado de cada conexión. Los errores ya los muestra el cliente HTTP; aquí solo se libera el estado. */
@Injectable({ providedIn: 'root' })
export class ConexionesStore {
  private readonly servicio = inject(ConexionesService);
  private readonly toast = inject(ToastService);

  private readonly state = signal<ConexionesState>({ conexiones: [], ocupado: false });

  readonly conexiones = computed(() => this.state().conexiones);
  readonly ocupado = computed(() => this.state().ocupado);

  cargar(): void {
    this.ejecutar(this.servicio.listar(), (conexiones) => this.state.update((s) => ({ ...s, conexiones })));
  }

  pausar(fuente: Fuente): void {
    this.ejecutar(this.servicio.pausar(fuente), (conexion) => this.reemplazar(conexion));
  }

  reanudar(fuente: Fuente): void {
    this.ejecutar(this.servicio.reanudar(fuente), (conexion) => this.reemplazar(conexion));
  }

  cargarClave(fuente: Fuente, clave: string): void {
    this.ejecutar(this.servicio.cargarClave(fuente, clave), (conexion) => {
      this.reemplazar(conexion);
      this.toast.exito(MSG_CLAVE_GUARDADA);
    });
  }

  fijarTope(fuente: Fuente, tope: number): void {
    this.ejecutar(this.servicio.fijarTope(fuente, tope), (conexion) => {
      this.reemplazar(conexion);
      this.toast.exito(MSG_TOPE_GUARDADO);
    });
  }

  private reemplazar(conexion: IConexion): void {
    this.state.update((s) => ({
      ...s,
      conexiones: s.conexiones.map((c) => (c.fuente === conexion.fuente ? conexion : c)),
    }));
  }

  private ejecutar<T>(peticion: Observable<T>, alRecibir: (valor: T) => void): void {
    this.state.update((s) => ({ ...s, ocupado: true }));
    peticion.pipe(finalize(() => this.state.update((s) => ({ ...s, ocupado: false })))).subscribe({
      next: alRecibir,
      error: () => undefined,
    });
  }
}
