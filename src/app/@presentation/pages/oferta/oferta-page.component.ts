import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { EstadoOferta } from '../../../@data/interfaces/oferta';
import { ENCAJES, ESTADOS_OFERTA, MODALIDADES, etiqueta } from '../../../Utils/const';
import { enlaceCorreo } from '../../../Utils/correo';
import { OfertaStore } from './oferta.store';

/** Detalle de una oferta: marcarla, ir a la publicación original o escribir a su contacto. */
@Component({
  selector: 'app-oferta-page',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule],
  providers: [OfertaStore],
  templateUrl: './oferta-page.component.html',
  styleUrl: './oferta-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfertaPageComponent {
  /** Llega de la ruta /ofertas/:id. */
  readonly id = input.required({ transform: numberAttribute });

  protected readonly store = inject(OfertaStore);

  protected readonly marcas: readonly { estado: EstadoOferta; texto: string; icono: string }[] = [
    { estado: 'GUARDADA', texto: 'Guardar', icono: 'bookmark' },
    { estado: 'DESCARTADA', texto: 'Descartar', icono: 'close' },
    { estado: 'POSTULADA', texto: 'Marcar como postulada', icono: 'send' },
  ];

  protected readonly correo = computed(() => {
    const detalle = this.store.detalle();
    return detalle?.correoContacto ? enlaceCorreo(detalle.correoContacto, detalle.oferta.titulo) : null;
  });

  constructor() {
    effect(() => this.store.cargar(this.id()));
  }

  protected encaje(valor: string): string {
    return etiqueta(ENCAJES, valor);
  }

  protected estado(valor: string): string {
    return etiqueta(ESTADOS_OFERTA, valor);
  }

  protected modalidad(valor: string): string {
    return etiqueta(MODALIDADES, valor);
  }
}
