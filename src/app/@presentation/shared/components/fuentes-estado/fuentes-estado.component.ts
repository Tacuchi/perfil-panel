import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { IConexion } from '../../../../@data/interfaces/conexion';
import { EstadoLectura, Fuente } from '../../../../@data/interfaces/oferta';
import { ESTADOS_CONEXION, ESTADOS_LECTURA, MSG_FUENTE_EN_TOPE, REQUISITOS, VIAS } from '../../../../Utils/const';

/**
 * Una tarjeta por conexión: desde dónde se lee, lo que necesita, el resultado de su última lectura, las lecturas que
 * le quedan hoy, su botón para leerla ahora y el de pausarla o reanudarla. Una fuente que falló o bloqueó se ve como
 * tal, nunca como un día sin ofertas; una pausada o sin configurar no se puede leer.
 */
@Component({
  selector: 'app-fuentes-estado',
  imports: [DatePipe, MatButton, MatIcon],
  templateUrl: './fuentes-estado.component.html',
  styleUrl: './fuentes-estado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuentesEstadoComponent {
  readonly fuentes = input.required<IConexion[]>();
  /** Hay una recolección en curso o se está lanzando una: ningún botón lanza otra. */
  readonly ocupada = input(false);
  /** Se está guardando un cambio de una conexión: los botones de pausa esperan. */
  readonly guardando = input(false);
  readonly leer = output<Fuente>();
  readonly pausar = output<Fuente>();
  readonly reanudar = output<Fuente>();

  protected readonly msgEnTope = MSG_FUENTE_EN_TOPE;

  protected readonly estados = ESTADOS_LECTURA;
  protected readonly estadosConexion = ESTADOS_CONEXION;
  protected readonly vias = VIAS;
  protected readonly requisitos = REQUISITOS;
  protected readonly iconos: Readonly<Record<EstadoLectura, string>> = {
    CORRECTA: 'check_circle',
    FALLO: 'error',
    BLOQUEO: 'block',
    SIN_LEER: 'schedule',
  };

  protected conProblema(fuente: IConexion): boolean {
    return fuente.estado === 'FALLO' || fuente.estado === 'BLOQUEO';
  }

  protected sePuedeLeer(fuente: IConexion): boolean {
    return fuente.estadoConexion === 'LISTA' && fuente.lecturasRestantes > 0;
  }
}
