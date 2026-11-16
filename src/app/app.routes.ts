import { Routes } from '@angular/router';

/** `seccion` es el título que muestra la barra superior del panel. */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cv' },
  {
    path: 'cv',
    title: 'Perfil · CV',
    data: { seccion: 'CV' },
    loadComponent: () => import('./@presentation/pages/cv/cv-page.component').then((m) => m.CvPageComponent),
  },
  {
    path: 'ofertas',
    title: 'Perfil · Ofertas',
    data: { seccion: 'Ofertas' },
    loadComponent: () =>
      import('./@presentation/pages/ofertas/ofertas-page.component').then((m) => m.OfertasPageComponent),
    children: [
      {
        // El enlace del correo diario: abre la oferta junto a la lista (o sola, en pantallas angostas).
        path: ':id',
        title: 'Perfil · Oferta',
        loadComponent: () =>
          import('./@presentation/pages/oferta/oferta-page.component').then((m) => m.OfertaPageComponent),
      },
    ],
  },
  {
    path: 'conexiones',
    title: 'Perfil · Conexiones',
    data: { seccion: 'Conexiones' },
    loadComponent: () =>
      import('./@presentation/pages/conexiones/conexiones-page.component').then((m) => m.ConexionesPageComponent),
    children: [{
      path: ':fuente',
      title: 'Perfil · Conexión',
      loadComponent: () => import('./@presentation/pages/conexiones/conexion-detalle.component').then((m) => m.ConexionDetalleComponent),
    }],
  },
  {
    path: 'ajustes',
    title: 'Perfil · Ajustes',
    data: { seccion: 'Ajustes' },
    loadComponent: () =>
      import('./@presentation/pages/ajustes/ajustes-page.component').then((m) => m.AjustesPageComponent),
  },
  { path: '**', redirectTo: 'cv' },
];
