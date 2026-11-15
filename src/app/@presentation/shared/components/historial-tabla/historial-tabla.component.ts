import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { IVersion } from '../../../../@data/interfaces/version';

/** Lista de versiones: descarga y restauración. No llama a la API; avisa a la página. */
@Component({
  selector: 'app-historial-tabla',
  imports: [DatePipe, MatTableModule, MatButtonModule],
  templateUrl: './historial-tabla.component.html',
  styleUrl: './historial-tabla.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialTablaComponent {
  readonly versiones = input.required<IVersion[]>();
  readonly ocupado = input(false);
  readonly urlPdf = input.required<(id: string) => string>();
  readonly urlWord = input.required<(id: string) => string>();
  readonly restaurar = output<string>();

  protected readonly columnas = ['fecha', 'estado', 'descargas', 'acciones'];
}
