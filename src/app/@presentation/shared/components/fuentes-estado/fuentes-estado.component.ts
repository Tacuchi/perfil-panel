import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { EstadoLectura, Fuente, IFuente } from '../../../../@data/interfaces/oferta';
import { ESTADOS_LECTURA, MSG_FUENTE_EN_TOPE } from '../../../../Utils/const';

/**
 * Estado de cada fuente, las lecturas que le quedan hoy y su botón para leerla ahora. Una fuente que falló o bloqueó
 * se ve como tal, nunca como un día sin ofertas.
 */
@Component({
  selector: 'app-fuentes-estado',
  imports: [DatePipe, MatButton, MatIcon],
  templateUrl: './fuentes-estado.component.html',
  styleUrl: './fuentes-estado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuentesEstadoComponent {
  readonly fuentes = input.required<IFuente[]>();
  /** Hay una recolección en curso o se está lanzando una: ningún botón lanza otra. */
  readonly ocupada = input(false);
  readonly leer = output<Fuente>();

  protected readonly msgEnTope = MSG_FUENTE_EN_TOPE;

  protected readonly estados = ESTADOS_LECTURA;
  protected readonly iconos: Readonly<Record<EstadoLectura, string>> = {
    CORRECTA: 'check_circle',
    FALLO: 'error',
    BLOQUEO: 'block',
    SIN_LEER: 'schedule',
  };

  protected conProblema(fuente: IFuente): boolean {
    return fuente.estado === 'FALLO' || fuente.estado === 'BLOQUEO';
  }
}
