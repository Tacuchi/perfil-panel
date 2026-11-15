import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { IFiltroOfertas, IFuente, IOferta, ITecnologias } from '../../../@data/interfaces/oferta';
import { OfertasService } from '../../../@data/services/ofertas.service';
import { filtroPorDefecto } from '../../../Utils/const';

interface OfertasState {
  ofertas: IOferta[];
  fuentes: IFuente[];
  tecnologias: ITecnologias;
  filtro: IFiltroOfertas;
  ocupado: boolean;
  cargado: boolean;
}

/**
 * Estado de la lista de ofertas. Vive mientras vive el panel: al volver del detalle, el filtro sigue igual.
 * Los errores ya los muestra el cliente HTTP; aquí solo se libera el estado.
 */
@Injectable({ providedIn: 'root' })
export class OfertasStore {
  private readonly servicio = inject(OfertasService);

  private readonly state = signal<OfertasState>({
    ofertas: [],
    fuentes: [],
    tecnologias: { principales: [], secundarias: [] },
    filtro: filtroPorDefecto(),
    ocupado: false,
    cargado: false,
  });

  readonly ofertas = computed(() => this.state().ofertas);
  readonly fuentes = computed(() => this.state().fuentes);
  readonly tecnologias = computed(() => this.state().tecnologias);
  readonly filtro = computed(() => this.state().filtro);
  readonly ocupado = computed(() => this.state().ocupado);
  readonly cargado = computed(() => this.state().cargado);

  cargar(): void {
    this.ejecutar(this.servicio.fuentes().pipe(tap((fuentes) => this.state.update((s) => ({ ...s, fuentes })))));
    this.ejecutar(
      this.servicio.tecnologias().pipe(tap((tecnologias) => this.state.update((s) => ({ ...s, tecnologias })))),
    );
    this.buscar();
  }

  /** Tras una recolección: fuentes y lista con lo recién leído, con el mismo filtro. */
  refrescar(): void {
    this.ejecutar(this.servicio.fuentes().pipe(tap((fuentes) => this.state.update((s) => ({ ...s, fuentes })))));
    this.buscar();
  }

  aplicar(filtro: IFiltroOfertas): void {
    this.state.update((s) => ({ ...s, filtro }));
    this.buscar();
  }

  /**
   * Refleja en la lista una oferta cambiada en el detalle, que ahora convive con ella.
   * Se queda en la lista aunque ya no cumpla el filtro: desaparece al volver a aplicarlo.
   */
  reemplazar(oferta: IOferta): void {
    this.state.update((s) => ({ ...s, ofertas: s.ofertas.map((o) => (o.id === oferta.id ? oferta : o)) }));
  }

  private buscar(): void {
    this.ejecutar(
      this.servicio
        .listar(this.state().filtro)
        .pipe(tap((ofertas) => this.state.update((s) => ({ ...s, ofertas, cargado: true })))),
    );
  }

  private ejecutar(peticion: Observable<unknown>): void {
    this.state.update((s) => ({ ...s, ocupado: true }));
    peticion.pipe(finalize(() => this.state.update((s) => ({ ...s, ocupado: false })))).subscribe({
      error: () => undefined,
    });
  }
}
