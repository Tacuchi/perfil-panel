import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VersionesService } from '../../../@data/services/versiones.service';
import { HistorialTablaComponent } from '../../shared/components/historial-tabla/historial-tabla.component';
import { HistorialStore } from './historial.store';

/** Pantalla única del panel: subir una versión del CV y manejar el historial. */
@Component({
  selector: 'app-cv-page',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    HistorialTablaComponent,
  ],
  providers: [HistorialStore],
  templateUrl: './cv-page.component.html',
  styleUrl: './cv-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvPageComponent implements OnInit {
  protected readonly store = inject(HistorialStore);
  protected readonly versiones = inject(VersionesService);
  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.group({
    pdf: this.fb.control<File | null>(null, Validators.required),
    word: this.fb.control<File | null>(null),
  });

  protected readonly urlPdf = (id: string) => this.versiones.urlPdf(id);
  protected readonly urlWord = (id: string) => this.versiones.urlWord(id);

  ngOnInit(): void {
    this.store.cargar();
  }

  protected elegir(campo: 'pdf' | 'word', evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.item(0) ?? null;
    this.formulario.controls[campo].setValue(archivo);
  }

  protected subir(): void {
    const { pdf, word } = this.formulario.getRawValue();
    if (!pdf) {
      return;
    }
    this.store.subir(pdf, word, (aceptada) => {
      if (aceptada) {
        this.formulario.reset();
      }
    });
  }
}
