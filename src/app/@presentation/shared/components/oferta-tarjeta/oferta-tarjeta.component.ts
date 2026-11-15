import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IOferta } from '../../../../@data/interfaces/oferta';
import { ENCAJES, ESTADOS_OFERTA, MODALIDADES, etiqueta } from '../../../../Utils/const';

/** Una oferta de la lista: lo que hace falta para decidir si abrirla. No llama a la API. */
@Component({
  selector: 'app-oferta-tarjeta',
  imports: [DatePipe, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './oferta-tarjeta.component.html',
  styleUrl: './oferta-tarjeta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfertaTarjetaComponent {
  readonly oferta = input.required<IOferta>();

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
