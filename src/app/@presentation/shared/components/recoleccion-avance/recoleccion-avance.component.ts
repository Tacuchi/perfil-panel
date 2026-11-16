import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { IFuenteEnRecoleccion, IRecoleccion } from '../../../../@data/interfaces/recoleccion';
import { MOTIVOS_CIERRE, MOTIVOS_OMISION, ORIGENES_RECOLECCION, RESULTADOS_LECTURA } from '../../../../Utils/const';

/**
 * Avance de la recolección en curso (barra sobre las fuentes lanzadas y paso de cada una) o resultado de la última.
 * Las omitidas por tope se listan aparte y no cuentan en la barra.
 */
@Component({
  selector: 'app-recoleccion-avance',
  imports: [DatePipe, MatIcon, MatProgressBar],
  templateUrl: './recoleccion-avance.component.html',
  styleUrl: './recoleccion-avance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoleccionAvanceComponent {
  readonly recoleccion = input.required<IRecoleccion>();

  protected readonly origenes = ORIGENES_RECOLECCION;
  protected readonly motivos = MOTIVOS_OMISION;
  protected readonly cierres = MOTIVOS_CIERRE;

  protected readonly enCurso = computed(() => this.recoleccion().estado === 'EN_CURSO');
  protected readonly porcentaje = computed(() => {
    const { terminadas, total } = this.recoleccion();
    return total === 0 ? 0 : Math.round((terminadas / total) * 100);
  });

  protected paso(fuente: IFuenteEnRecoleccion): string {
    switch (fuente.paso) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'LEYENDO':
        return 'Leyendo…';
      case 'TERMINADA':
        return this.resultado(fuente);
    }
  }

  protected icono(fuente: IFuenteEnRecoleccion): string {
    if (fuente.paso === 'PENDIENTE') {
      return 'schedule';
    }
    if (fuente.paso === 'LEYENDO') {
      return 'sync';
    }
    return fuente.resultado === 'CORRECTA' ? 'check_circle' : fuente.resultado === 'BLOQUEO' ? 'block' : 'error';
  }

  private resultado(fuente: IFuenteEnRecoleccion): string {
    const texto = fuente.resultado ? RESULTADOS_LECTURA[fuente.resultado] : RESULTADOS_LECTURA.SIN_LEER;
    if (fuente.resultado !== 'CORRECTA') {
      return texto;
    }
    const n = fuente.ofertasLeidas ?? 0;
    return `${texto}: ${n} ${n === 1 ? 'oferta' : 'ofertas'}`;
  }
}
