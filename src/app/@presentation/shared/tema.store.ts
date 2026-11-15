import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Tema = 'sistema' | 'claro' | 'oscuro';
export type Paleta = 'verde' | 'azul' | 'violeta' | 'neutra' | 'lima';

/** Paletas de styles.scss; cada una tiene su versión clara y oscura. */
export const PALETAS: readonly { valor: Paleta; etiqueta: string }[] = [
  { valor: 'verde', etiqueta: 'Verde' },
  { valor: 'azul', etiqueta: 'Azul' },
  { valor: 'violeta', etiqueta: 'Violeta' },
  { valor: 'neutra', etiqueta: 'Neutra' },
  { valor: 'lima', etiqueta: 'Lima' },
];

export const TEMAS: readonly { valor: Tema; etiqueta: string }[] = [
  { valor: 'sistema', etiqueta: 'Sistema' },
  { valor: 'claro', etiqueta: 'Claro' },
  { valor: 'oscuro', etiqueta: 'Oscuro' },
];

const CLAVE_TEMA = 'perfil-panel.tema';
const CLAVE_PALETA = 'perfil-panel.paleta';
const COLOR_SCHEME: Record<Tema, string> = { sistema: 'light dark', claro: 'light', oscuro: 'dark' };

/**
 * Tema (claro u oscuro) y paleta elegidos en este navegador. Es una comodidad local: si el almacenamiento
 * no está disponible (ventana privada, datos bloqueados), el panel sigue al sistema con la paleta verde.
 */
@Injectable({ providedIn: 'root' })
export class TemaStore {
  private readonly raiz = inject(DOCUMENT).documentElement;
  private readonly tema = signal<Tema>(leer(CLAVE_TEMA, TEMAS, 'sistema'));
  private readonly paletaElegida = signal<Paleta>(leer(CLAVE_PALETA, PALETAS, 'verde'));

  readonly actual = this.tema.asReadonly();
  readonly paleta = this.paletaElegida.asReadonly();

  constructor() {
    effect(() => {
      this.raiz.style.colorScheme = COLOR_SCHEME[this.tema()];
      this.raiz.dataset['paleta'] = this.paletaElegida();
    });
  }

  elegirTema(tema: Tema): void {
    this.tema.set(tema);
    guardar(CLAVE_TEMA, tema);
  }

  elegirPaleta(paleta: Paleta): void {
    this.paletaElegida.set(paleta);
    guardar(CLAVE_PALETA, paleta);
  }
}

function leer<T extends string>(clave: string, opciones: readonly { valor: T }[], porDefecto: T): T {
  try {
    const guardado = localStorage.getItem(clave);
    return opciones.find((o) => o.valor === guardado)?.valor ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave: string, valor: string): void {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    // Sin almacenamiento el cambio dura hasta recargar; no hay nada que avisar.
  }
}
