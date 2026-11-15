import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { EstadoOferta, IOfertaDetalle } from '../../../@data/interfaces/oferta';
import { OfertasService } from '../../../@data/services/ofertas.service';
import { ToastService } from '../../../@data/services/toast.service';
import { ESTADOS_OFERTA, MSG_ESTADO_CAMBIADO, etiqueta } from '../../../Utils/const';

interface OfertaState {
  detalle: IOfertaDetalle | null;
  ocupado: boolean;
}

/** Estado del detalle de una oferta. */
@Injectable()
export class OfertaStore {
  private readonly servicio = inject(OfertasService);
  private readonly toast = inject(ToastService);

  private readonly state = signal<OfertaState>({ detalle: null, ocupado: false });

  readonly detalle = computed(() => this.state().detalle);
  readonly ocupado = computed(() => this.state().ocupado);

  cargar(id: number): void {
    this.ejecutar(this.servicio.detalle(id).pipe(tap((detalle) => this.state.update((s) => ({ ...s, detalle })))));
  }

  marcar(estado: EstadoOferta): void {
    const actual = this.state().detalle;
    if (!actual) {
      return;
    }
    this.ejecutar(
      this.servicio.marcar(actual.oferta.id, estado).pipe(
        tap((detalle) => {
          this.state.update((s) => ({ ...s, detalle }));
          this.toast.exito(`${MSG_ESTADO_CAMBIADO} ${etiqueta(ESTADOS_OFERTA, estado).toLowerCase()}.`);
        }),
      ),
    );
  }

  private ejecutar(peticion: Observable<unknown>): void {
    this.state.update((s) => ({ ...s, ocupado: true }));
    peticion.pipe(finalize(() => this.state.update((s) => ({ ...s, ocupado: false })))).subscribe({
      error: () => undefined,
    });
  }
}
