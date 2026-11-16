import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MSG_NINGUNA_LEIBLE, MSG_RECOLECCION_EN_CURSO, MSG_TODAS_EN_TOPE } from '../../../Utils/const';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { estadoConexion, iconoConexion } from './conexion-estado';
import { ESTADOS_CONEXION } from '../../../Utils/const';
import { RecoleccionAvanceComponent } from '../../shared/components/recoleccion-avance/recoleccion-avance.component';
import { ConexionesStore } from './conexiones.store';
import { RecoleccionStore } from './recoleccion.store';

/** Cada conexión del monitor con su estado, su lectura a demanda y su pausa; la recolección general y su avance. */
@Component({
  selector: 'app-conexiones-page',
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatListModule, RouterLink, RouterOutlet, RecoleccionAvanceComponent],
  templateUrl: './conexiones-page.component.html',
  styleUrl: './conexiones-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConexionesPageComponent implements OnInit, OnDestroy {
  protected readonly store = inject(ConexionesStore);
  protected readonly recoleccion = inject(RecoleccionStore);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly telefono = toSignal(inject(BreakpointObserver).observe('(max-width: 959.98px)').pipe(map((v) => v.matches)), { initialValue: true });
  private readonly seleccion = toSignal(this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    map(() => ({ lista: true, fuente: this.route.firstChild?.snapshot?.paramMap.get('fuente') ?? null })),
  ), { initialValue: { lista: false, fuente: null } });
  protected readonly elegida = computed(() => this.seleccion().fuente);
  protected readonly detalleAbierto = signal(false);
  private readonly inicioEnPantalla = signal<string | null>(null);
  protected readonly avanceDeEstaPantalla = computed(() => {
    const actual = this.recoleccion.recoleccion();
    return actual?.estado === 'EN_CURSO' || (actual?.inicio !== null && actual?.inicio === this.inicioEnPantalla());
  });
  protected readonly estadoDe = estadoConexion;
  protected readonly iconoDe = iconoConexion;
  protected readonly estadosConexion = ESTADOS_CONEXION;

  constructor() {
    effect(() => {
      const actual = this.recoleccion.recoleccion();
      if (actual?.estado === 'EN_CURSO') this.inicioEnPantalla.set(actual.inicio);
    });
    effect(() => {
      const conexiones = this.store.conexiones();
      if (!this.seleccion().lista || this.telefono() || this.elegida() || conexiones.length === 0) return;
      const primera = conexiones.find((c) => c.estado === 'FALLO' || c.estado === 'BLOQUEO' || c.parcial || c.estadoConexion !== 'LISTA') ?? conexiones[0];
      void this.router.navigate([primera.fuente], { relativeTo: this.route, replaceUrl: true });
    });
  }

  protected leyendo(fuente: string): boolean {
    return this.recoleccion.recoleccion()?.fuentes.some((f) => f.fuente === fuente && f.paso === 'LEYENDO') ?? false;
  }

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
