import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PALETAS, TEMAS, TemaStore } from '../../shared/tema.store';

/** Apariencia del panel en este navegador: tema claro u oscuro y paleta de colores. */
@Component({
  selector: 'app-ajustes-page',
  imports: [MatButtonToggleModule, MatCardModule, MatIconModule],
  templateUrl: './ajustes-page.component.html',
  styleUrl: './ajustes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesPageComponent {
  protected readonly tema = inject(TemaStore);
  protected readonly temas = TEMAS;
  protected readonly paletas = PALETAS;
}
