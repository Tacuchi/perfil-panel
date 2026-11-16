import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ESTADOS_CONEXION, MSG_FUENTE_EN_TOPE, VIAS, REQUISITOS } from '../../../Utils/const';
import { ConexionesStore } from './conexiones.store';
import { RecoleccionStore } from './recoleccion.store';
import { estadoConexion, iconoConexion, dolaresResumen } from './conexion-estado';
import { ConexionConfigurarComponent } from './conexion-configurar.component';
import { ConexionesHistorialComponent } from './conexiones-historial.component';

@Component({
  selector: 'app-conexion-detalle',
  imports: [DatePipe, MatButtonModule, MatIconModule, MatProgressBarModule, ConexionesHistorialComponent],
  templateUrl: './conexion-detalle.component.html',
  styleUrl: './conexion-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConexionDetalleComponent {
  protected readonly store = inject(ConexionesStore);
  protected readonly recoleccion = inject(RecoleccionStore);
  private readonly dialog = inject(MatDialog);
  private readonly configurarPrincipal = viewChild('configurarPrincipal', { read: ElementRef<HTMLButtonElement> });
  private readonly fuente = toSignal(inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('fuente'))));
  protected readonly conexion = computed(() => this.store.conexiones().find((c) => c.fuente === this.fuente()));
  protected readonly leyendo = computed(() => this.recoleccion.recoleccion()?.fuentes.some((f) => f.fuente === this.fuente() && f.paso === 'LEYENDO') ?? false);
  protected readonly estadoDe = estadoConexion;
  protected readonly iconoDe = iconoConexion;
  protected readonly estados = ESTADOS_CONEXION;
  protected readonly vias = VIAS;
  protected readonly requisitos = REQUISITOS;
  protected readonly dolares = dolaresResumen;
  protected readonly msgEnTope = MSG_FUENTE_EN_TOPE;

  protected readonly consumoPorcentaje = computed(() => {
    const conexion = this.conexion();
    return conexion?.topeMensual ? Math.min(100, ((conexion.consumoMes ?? 0) / conexion.topeMensual) * 100) : 0;
  });

  protected configurar(): void {
    const conexion = this.conexion();
    if (!conexion || conexion.via !== 'PAGO') return;
    this.dialog.open(ConexionConfigurarComponent, {
      data: conexion.fuente, width: '560px', maxWidth: 'calc(100vw - 32px)', restoreFocus: this.configurarPrincipal()?.nativeElement ?? true,
    });
  }
}
