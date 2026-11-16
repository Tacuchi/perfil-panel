import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MSG_NINGUNA_LEIBLE, MSG_RECOLECCION_EN_CURSO, MSG_SIN_CONEXIONES_MAQUINA, MSG_TODAS_EN_TOPE } from '../../../Utils/const';
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
      conexiones.some((c) => c.via !== 'MAQUINA' && c.estadoConexion === 'LISTA' && c.lecturasRestantes > 0)
    );
  });

  /** Las conexiones que se leen desde la máquina de la persona. */
  protected readonly deMaquina = computed(() => this.store.conexiones().filter((c) => c.via === 'MAQUINA'));

  /** Alguna conexión de la máquina se puede leer hoy: no está pausada y le quedan lecturas. */
  protected readonly maquinaLeible = computed(() =>
    this.deMaquina().some((c) => !c.pausada && c.lecturasRestantes > 0),
  );

  protected readonly msgSinMaquina = MSG_SIN_CONEXIONES_MAQUINA;

  /** Por qué no se puede lanzar una recolección ahora; null si se puede. */
  protected readonly motivoBloqueo = computed<string | null>(() => {
    if (this.recoleccion.enCurso()) {
      return MSG_RECOLECCION_EN_CURSO;
    }
    if (this.hayLecturas()) {
      return null;
    }
    const todasListas = this.store.conexiones().filter((c) => c.via !== 'MAQUINA').every((c) => c.estadoConexion === 'LISTA');
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
