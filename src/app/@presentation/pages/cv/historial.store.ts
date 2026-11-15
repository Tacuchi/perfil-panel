import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { IVersion } from '../../../@data/interfaces/version';
import { VersionesService } from '../../../@data/services/versiones.service';
import { ToastService } from '../../../@data/services/toast.service';
import { MSG_CARGA_ACEPTADA, MSG_VIGENTE_CAMBIADA } from '../../../Utils/const';

interface HistorialState {
  versiones: IVersion[];
  ocupado: boolean;
  cargado: boolean;
}

/** Estado de la pantalla del CV. Los errores ya los muestra el cliente HTTP; aquí solo se libera el estado. */
@Injectable()
export class HistorialStore {
  private readonly servicio = inject(VersionesService);
  private readonly toast = inject(ToastService);

  private readonly state = signal<HistorialState>({ versiones: [], ocupado: false, cargado: false });

  readonly versiones = computed(() => this.state().versiones);
  readonly ocupado = computed(() => this.state().ocupado);
  readonly cargado = computed(() => this.state().cargado);

  cargar(): void {
    this.ejecutar(this.servicio.listar().pipe(
      tap((versiones) => this.state.update((s) => ({ ...s, versiones, cargado: true }))),
    ));
  }

  /** `alTerminar` dice si la carga se aceptó, para que la pantalla limpie el formulario. */
  subir(pdf: File, word: File | null, alTerminar: (aceptada: boolean) => void): void {
    this.ejecutar(this.servicio.subir(pdf, word).pipe(
      tap(() => {
        this.toast.exito(MSG_CARGA_ACEPTADA);
        this.cargar();
      }),
    ), alTerminar);
  }

  dejarVigente(id: string): void {
    this.ejecutar(this.servicio.dejarVigente(id).pipe(
      tap(() => {
        this.toast.exito(MSG_VIGENTE_CAMBIADA);
        this.cargar();
      }),
    ));
  }

  private ejecutar(peticion: Observable<unknown>, alTerminar?: (exito: boolean) => void): void {
    this.state.update((s) => ({ ...s, ocupado: true }));
    peticion.pipe(finalize(() => this.state.update((s) => ({ ...s, ocupado: false })))).subscribe({
      next: () => alTerminar?.(true),
      error: () => alTerminar?.(false),
    });
  }
}
