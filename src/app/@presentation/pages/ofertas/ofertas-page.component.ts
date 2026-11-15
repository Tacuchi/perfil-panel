import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { Encaje, EstadoOferta, Fuente, IFiltroOfertas, Modalidad } from '../../../@data/interfaces/oferta';
import {
  ENCAJES,
  ESTADOS_OFERTA,
  FUENTES,
  MODALIDADES,
  MSG_RECOLECCION_EN_CURSO,
  MSG_TODAS_EN_TOPE,
  etiqueta,
  filtroPorDefecto,
} from '../../../Utils/const';
import { FuentesEstadoComponent } from '../../shared/components/fuentes-estado/fuentes-estado.component';
import { OfertaTarjetaComponent } from '../../shared/components/oferta-tarjeta/oferta-tarjeta.component';
import { RecoleccionAvanceComponent } from '../../shared/components/recoleccion-avance/recoleccion-avance.component';
import { OfertasStore } from './ofertas.store';
import { RecoleccionStore } from './recoleccion.store';

/** Un filtro aplicado que se ve como chip y se puede quitar. Las fechas van juntas en un solo chip. */
interface IFiltroAplicado {
  clave: 'encaje' | 'estado' | 'fuente' | 'modalidad' | 'tecnologia' | 'fechas';
  valor?: string;
  texto: string;
}

const SIN_FILTROS: IFiltroOfertas = {
  encaje: [],
  estado: [],
  fuente: [],
  modalidad: [],
  tecnologia: null,
  desde: null,
  hasta: null,
};

/** yyyy-MM-dd → d/M/yyyy, como se muestran las fechas en el panel. */
function fechaVisible(iso: string): string {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return `${dia}/${mes}/${anio}`;
}

/**
 * Lista de ofertas con sus filtros y el estado de cada fuente, que se puede leer ahora; la oferta elegida se abre al
 * lado.
 */
@Component({
  selector: 'app-ofertas-page',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    FuentesEstadoComponent,
    OfertaTarjetaComponent,
    RecoleccionAvanceComponent,
  ],
  templateUrl: './ofertas-page.component.html',
  styleUrl: './ofertas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfertasPageComponent implements OnInit, OnDestroy {
  protected readonly store = inject(OfertasStore);
  protected readonly recoleccion = inject(RecoleccionStore);
  private readonly fb = inject(FormBuilder);

  /** Ventana compacta de Material 3. */
  protected readonly telefono = signal(inject(BreakpointObserver).isMatched('(max-width: 599.98px)'));

  protected readonly encajes = ENCAJES;
  protected readonly estados = ESTADOS_OFERTA;
  protected readonly fuentesCatalogo = FUENTES;
  protected readonly modalidades = MODALIDADES;

  /** Hay una oferta abierta en la ruta hija /ofertas/:id. */
  protected readonly detalleAbierto = signal(false);

  protected readonly filtros = this.fb.nonNullable.group({
    encaje: this.fb.nonNullable.control<Encaje[]>([]),
    estado: this.fb.nonNullable.control<EstadoOferta[]>([]),
    fuente: this.fb.nonNullable.control<Fuente[]>([]),
    modalidad: this.fb.nonNullable.control<Modalidad[]>([]),
    tecnologia: this.fb.control<string | null>(null),
    desde: this.fb.control<string | null>(null),
    hasta: this.fb.control<string | null>(null),
  });

  /** Alguna fuente tiene lecturas disponibles hoy (antes de cargar las fuentes no se sabe: no se bloquea). */
  protected readonly hayLecturas = computed(() => {
    const fuentes = this.store.fuentes();
    return fuentes.length === 0 || fuentes.some((f) => f.lecturasRestantes > 0);
  });

  /** Por qué no se puede lanzar una recolección ahora; null si se puede. */
  protected readonly motivoBloqueo = computed<string | null>(() => {
    if (this.recoleccion.enCurso()) {
      return MSG_RECOLECCION_EN_CURSO;
    }
    return this.hayLecturas() ? null : MSG_TODAS_EN_TOPE;
  });

  /** Lo que filtra la lista ahora (lo aplicado, no lo que se está editando en el formulario). */
  protected readonly aplicados = computed<IFiltroAplicado[]>(() => {
    const filtro = this.store.filtro();
    const chips: IFiltroAplicado[] = [
      ...filtro.encaje.map((v) => ({ clave: 'encaje' as const, valor: v, texto: `Encaje: ${etiqueta(ENCAJES, v)}` })),
      ...filtro.estado.map((v) => ({ clave: 'estado' as const, valor: v, texto: `Estado: ${etiqueta(ESTADOS_OFERTA, v)}` })),
      ...filtro.fuente.map((v) => ({ clave: 'fuente' as const, valor: v, texto: `Fuente: ${etiqueta(FUENTES, v)}` })),
      ...filtro.modalidad.map((v) => ({ clave: 'modalidad' as const, valor: v, texto: etiqueta(MODALIDADES, v) })),
    ];
    if (filtro.tecnologia) {
      chips.push({ clave: 'tecnologia', texto: `Tecnología: ${filtro.tecnologia}` });
    }
    if (filtro.desde && filtro.hasta) {
      chips.push({ clave: 'fechas', texto: `${fechaVisible(filtro.desde)} – ${fechaVisible(filtro.hasta)}` });
    } else if (filtro.desde || filtro.hasta) {
      const texto = filtro.desde ? `Desde ${fechaVisible(filtro.desde)}` : `Hasta ${fechaVisible(filtro.hasta!)}`;
      chips.push({ clave: 'fechas', texto });
    }
    return chips;
  });

  ngOnInit(): void {
    this.filtros.setValue(this.store.filtro());
    this.store.cargar();
    this.recoleccion.entrar();
  }

  ngOnDestroy(): void {
    this.recoleccion.salir();
  }

  protected aplicar(): void {
    const valor = this.filtros.getRawValue();
    const filtro: IFiltroOfertas = { ...valor, desde: valor.desde || null, hasta: valor.hasta || null };
    this.store.aplicar(filtro);
  }

  protected quitar(chip: IFiltroAplicado): void {
    const filtro = { ...this.store.filtro() };
    switch (chip.clave) {
      case 'encaje':
        filtro.encaje = filtro.encaje.filter((v) => v !== chip.valor);
        break;
      case 'estado':
        filtro.estado = filtro.estado.filter((v) => v !== chip.valor);
        break;
      case 'fuente':
        filtro.fuente = filtro.fuente.filter((v) => v !== chip.valor);
        break;
      case 'modalidad':
        filtro.modalidad = filtro.modalidad.filter((v) => v !== chip.valor);
        break;
      case 'tecnologia':
        filtro.tecnologia = null;
        break;
      case 'fechas':
        filtro.desde = null;
        filtro.hasta = null;
        break;
    }
    this.filtrarCon(filtro);
  }

  protected quitarTodos(): void {
    this.filtrarCon({ ...SIN_FILTROS });
  }

  /** El formulario y la lista quedan con el mismo filtro. */
  private filtrarCon(filtro: IFiltroOfertas): void {
    this.filtros.setValue(filtro);
    this.store.aplicar(filtro);
  }

  protected restablecer(): void {
    this.filtros.setValue(filtroPorDefecto());
    this.aplicar();
  }
}
