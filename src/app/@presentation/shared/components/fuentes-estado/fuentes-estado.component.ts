import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { IFuente } from '../../../../@data/interfaces/oferta';
import { ESTADOS_LECTURA } from '../../../../Utils/const';

/** Estado de cada fuente. Una fuente que falló o bloqueó se ve como tal, nunca como un día sin ofertas. */
@Component({
  selector: 'app-fuentes-estado',
  imports: [DatePipe, MatChipsModule],
  templateUrl: './fuentes-estado.component.html',
  styleUrl: './fuentes-estado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuentesEstadoComponent {
  readonly fuentes = input.required<IFuente[]>();

  protected readonly estados = ESTADOS_LECTURA;

  protected conProblema(fuente: IFuente): boolean {
    return fuente.estado === 'FALLO' || fuente.estado === 'BLOQUEO';
  }
}
