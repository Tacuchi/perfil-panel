import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/** Navegación entre los módulos del panel. Cada módulo es su propia pantalla. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatTabsModule],
  template: `
    <nav mat-tab-nav-bar [tabPanel]="panel" aria-label="Módulos del panel">
      <a mat-tab-link routerLink="/cv" routerLinkActive #cv="routerLinkActive" [active]="cv.isActive">CV</a>
      <a mat-tab-link routerLink="/ofertas" routerLinkActive #ofertas="routerLinkActive" [active]="ofertas.isActive"
        >Ofertas</a
      >
    </nav>
    <mat-tab-nav-panel #panel><router-outlet /></mat-tab-nav-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
