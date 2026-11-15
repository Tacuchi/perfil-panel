import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cv' },
  {
    path: 'cv',
    title: 'Perfil · CV',
    loadComponent: () => import('./@presentation/pages/cv/cv-page.component').then((m) => m.CvPageComponent),
  },
  {
    path: 'ofertas',
    title: 'Perfil · Ofertas',
    loadComponent: () =>
      import('./@presentation/pages/ofertas/ofertas-page.component').then((m) => m.OfertasPageComponent),
  },
  {
    path: 'ofertas/:id',
    title: 'Perfil · Oferta',
    loadComponent: () =>
      import('./@presentation/pages/oferta/oferta-page.component').then((m) => m.OfertaPageComponent),
  },
  { path: '**', redirectTo: 'cv' },
];
