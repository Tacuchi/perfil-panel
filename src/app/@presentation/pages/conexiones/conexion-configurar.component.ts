import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Fuente } from '../../../@data/interfaces/oferta';
import { ConexionPagoComponent } from '../../shared/components/conexion-pago/conexion-pago.component';
import { ConexionesStore } from './conexiones.store';

@Component({
  selector: 'app-conexion-configurar',
  imports: [MatDialogModule, MatButtonModule, ConexionPagoComponent],
  template: `
    <h2 mat-dialog-title>Configurar {{ conexion()?.nombre }}</h2>
    <mat-dialog-content>
      @if (conexion(); as actual) {
        <app-conexion-pago [conexion]="actual" [guardando]="store.ocupado()"
          (guardarClave)="store.cargarClave(actual.fuente, $event)"
          (guardarTope)="store.fijarTope(actual.fuente, $event)" />
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end"><button mat-button mat-dialog-close>Cerrar</button></mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConexionConfigurarComponent {
  protected readonly store = inject(ConexionesStore);
  private readonly fuente = inject<Fuente>(MAT_DIALOG_DATA);
  protected readonly conexion = computed(() => this.store.conexiones().find((c) => c.fuente === this.fuente));
}
