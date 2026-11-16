import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Fuente } from '../../../@data/interfaces/oferta';
import { ILecturaHistorial } from '../../../@data/interfaces/historial-lecturas';
import { ConexionesService } from '../../../@data/services/conexiones.service';
import { estadoConexion, iconoConexion, duracionLectura } from './conexion-estado';
import { RecoleccionStore } from './recoleccion.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conexiones-historial',
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatTableModule, MatProgressBarModule, MatIconModule],
  templateUrl: './conexiones-historial.component.html',
  styleUrl: './conexiones-historial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConexionesHistorialComponent {
  readonly fuente = input.required<Fuente>();
  readonly dePago = input(false);
  private readonly servicio = inject(ConexionesService);
  private readonly recoleccion = inject(RecoleccionStore);
  protected readonly lecturas = signal<ILecturaHistorial[]>([]);
  protected readonly hayMas = signal(false);
  protected readonly cargando = signal(false);
  protected readonly fallo = signal(false);
  protected readonly estadoDe = estadoConexion;
  protected readonly iconoDe = iconoConexion;
  protected readonly duracion = duracionLectura;
  protected readonly ultimaCorrecta = computed(() => this.lecturas().find((l) => l.estado === 'CORRECTA')?.inicio);
  private readonly revision = computed(() => this.recoleccion.lecturasTerminadas()[this.fuente()] ?? 0);
  private consulta?: Subscription;

  constructor() {
    effect((onCleanup) => {
      const fuente = this.fuente();
      this.revision();
      this.cargar(fuente);
      onCleanup(() => this.consulta?.unsubscribe());
    });
  }

  protected verMas(): void {
    if (this.cargando() || !this.hayMas()) return;
    this.cargar(this.fuente(), this.lecturas().at(-1)?.id);
  }

  private cargar(fuente: Fuente, antesDe?: number): void {
    this.consulta?.unsubscribe();
    this.cargando.set(true);
    this.fallo.set(false);
    if (antesDe === undefined) { this.lecturas.set([]); this.hayMas.set(false); }
    this.consulta = this.servicio.historial(fuente, antesDe).subscribe({
      next: (pagina) => {
        this.lecturas.update((anteriores) => antesDe === undefined ? pagina.lecturas : [...anteriores, ...pagina.lecturas.filter((l) => !anteriores.some((a) => a.id === l.id))]);
        this.hayMas.set(pagina.hayMas);
        this.cargando.set(false);
      },
      error: () => { this.fallo.set(true); this.cargando.set(false); },
    });
  }
}
