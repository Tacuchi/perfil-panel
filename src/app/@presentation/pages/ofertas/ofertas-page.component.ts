import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Encaje, EstadoOferta, Fuente, IFiltroOfertas, Modalidad } from '../../../@data/interfaces/oferta';
import { ENCAJES, ESTADOS_OFERTA, FILTRO_POR_DEFECTO, FUENTES, MODALIDADES } from '../../../Utils/const';
import { FuentesEstadoComponent } from '../../shared/components/fuentes-estado/fuentes-estado.component';
import { OfertaTarjetaComponent } from '../../shared/components/oferta-tarjeta/oferta-tarjeta.component';
import { OfertasStore } from './ofertas.store';

/** Lista de ofertas con sus filtros y el estado de cada fuente. */
@Component({
  selector: 'app-ofertas-page',
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    FuentesEstadoComponent,
    OfertaTarjetaComponent,
  ],
  templateUrl: './ofertas-page.component.html',
  styleUrl: './ofertas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfertasPageComponent implements OnInit {
  protected readonly store = inject(OfertasStore);
  private readonly fb = inject(FormBuilder);

  protected readonly encajes = ENCAJES;
  protected readonly estados = ESTADOS_OFERTA;
  protected readonly fuentesCatalogo = FUENTES;
  protected readonly modalidades = MODALIDADES;

  protected readonly filtros = this.fb.nonNullable.group({
    encaje: this.fb.nonNullable.control<Encaje[]>([]),
    estado: this.fb.nonNullable.control<EstadoOferta[]>([]),
    fuente: this.fb.nonNullable.control<Fuente[]>([]),
    modalidad: this.fb.nonNullable.control<Modalidad[]>([]),
    tecnologia: this.fb.control<string | null>(null),
    desde: this.fb.control<string | null>(null),
    hasta: this.fb.control<string | null>(null),
  });

  ngOnInit(): void {
    this.filtros.setValue(this.store.filtro());
    this.store.cargar();
  }

  protected aplicar(): void {
    const valor = this.filtros.getRawValue();
    const filtro: IFiltroOfertas = { ...valor, desde: valor.desde || null, hasta: valor.hasta || null };
    this.store.aplicar(filtro);
  }

  protected restablecer(): void {
    this.filtros.setValue({ ...FILTRO_POR_DEFECTO });
    this.aplicar();
  }
}
