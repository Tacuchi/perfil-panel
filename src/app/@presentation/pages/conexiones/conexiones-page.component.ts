import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MSG_NINGUNA_LEIBLE, MSG_RECOLECCION_EN_CURSO, MSG_TODAS_EN_TOPE } from '../../../Utils/const';
import { FuentesEstadoComponent } from '../../shared/components/fuentes-estado/fuentes-estado.component';
import { RecoleccionAvanceComponent } from '../../shared/components/recoleccion-avance/recoleccion-avance.component';
import { ConexionesStore } from './conexiones.store';
import { RecoleccionStore } from './recoleccion.store';

/** Cada conexión del monitor con su estado, su lectura a demanda y su pausa; la recolección general y su avance. */
@Component({
  selector: 'app-conexiones-page',
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, FuentesEstadoComponent, RecoleccionAvanceComponent],
  templateUrl: './conexiones-page.component.html',
  styleUrl: './conexiones-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConexionesPageComponent implements OnInit, OnDestroy {
  protected readonly store = inject(ConexionesStore);
  protected readonly recoleccion = inject(RecoleccionStore);

  /** Alguna conexión se puede leer hoy (antes de cargarlas no se sabe: no se bloquea). */
  protected readonly hayLecturas = computed(() => {
    const conexiones = this.store.conexiones();
    return (
      conexiones.length === 0 ||
      conexiones.some(
        (c) => c.via !== 'MAQUINA' && c.estadoConexion === 'LISTA' && (c.via === 'PAGO' || c.lecturasRestantes > 0),
      )
    );
  });

  /** Las conexiones que se leen por un servicio de pago. */
  protected readonly dePago = computed(() => this.store.conexiones().filter((c) => c.via === 'PAGO'));

  /** Por qué no se puede lanzar una recolección ahora; null si se puede. */
  protected readonly motivoBloqueo = computed<string | null>(() => {
    if (this.recoleccion.enCurso()) {
      return MSG_RECOLECCION_EN_CURSO;
    }
    if (this.hayLecturas()) {
      return null;
    }
    // Una de pago que nunca se configuró no cuenta: con las demás en su tope, el motivo sigue siendo el tope.
    const todasListas = this.store
      .conexiones()
      .filter((c) => c.via !== 'MAQUINA' && c.estadoConexion !== 'FALTA_CONFIGURAR')
      .every((c) => c.estadoConexion === 'LISTA');
    return todasListas ? MSG_TODAS_EN_TOPE : MSG_NINGUNA_LEIBLE;
  });

  ngOnInit(): void {
    this.store.cargar();
    this.recoleccion.entrar();
  }

  ngOnDestroy(): void {
    this.recoleccion.salir();
  }
}
