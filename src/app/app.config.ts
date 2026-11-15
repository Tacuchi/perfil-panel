import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { TemaStore } from './@presentation/shared/tema.store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
    // Los íconos salen de la fuente Material Symbols (index.html), no de la antigua Material Icons.
    provideAppInitializer(() => {
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined', 'mat-ligature-font');
    }),
    // El tema y la paleta elegidos en Ajustes se aplican desde el arranque, en cualquier pantalla.
    provideAppInitializer(() => {
      inject(TemaStore);
    }),
  ],
};
