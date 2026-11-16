import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, fromEvent, map, of } from 'rxjs';

type Navegacion = 'menu' | 'riel' | 'barra';

/** Cortes de ventana de Material 3: expandida, mediana y compacta (teléfono). */
const ANCHA = '(min-width: 1200px)';
const MEDIANA = '(min-width: 600px)';

/** Estructura del panel: menú lateral, riel o barra inferior según el ancho, y la barra superior. */
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatRipple,
    MatToolbar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);
  private readonly ventana = inject(BreakpointObserver);
  private readonly ventanaDom = inject(DOCUMENT).defaultView;

  protected readonly modulos = [
    { ruta: '/cv', texto: 'CV', icono: 'description' },
    { ruta: '/ofertas', texto: 'Ofertas', icono: 'work' },
    { ruta: '/conexiones', texto: 'Conexiones', icono: 'cable' },
    { ruta: '/ajustes', texto: 'Ajustes', icono: 'settings' },
  ] as const;

  protected readonly navegacion = toSignal(
    this.ventana.observe([ANCHA, MEDIANA]).pipe(map(() => this.navegacionActual())),
    { initialValue: this.navegacionActual() },
  );

  protected readonly seccion = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map(() => (this.router.routerState.snapshot.root.firstChild?.data['seccion'] as string | undefined) ?? ''),
    ),
    { initialValue: '' },
  );

  /** La barra superior sube a nivel 2 de elevación tonal cuando el contenido se desplaza bajo ella. */
  protected readonly desplazada = toSignal(
    this.ventanaDom
      ? fromEvent(this.ventanaDom, 'scroll', { passive: true }).pipe(map(() => (this.ventanaDom?.scrollY ?? 0) > 0))
      : of(false),
    { initialValue: false },
  );

  private navegacionActual(): Navegacion {
    if (this.ventana.isMatched(ANCHA)) {
      return 'menu';
    }
    return this.ventana.isMatched(MEDIANA) ? 'riel' : 'barra';
  }
}
