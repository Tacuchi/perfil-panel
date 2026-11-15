import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { appConfig } from './app.config';

describe('App', () => {
  let harness: RouterTestingHarness;
  let http: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      // La configuración real de la app, con el backend HTTP de pruebas.
      providers: [...appConfig.providers, provideHttpClientTesting()],
    });
    harness = await RouterTestingHarness.create();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.match(() => true));

  it('pasa de CV a Ofertas desde la navegación sin cambiar la pantalla del CV', async () => {
    const app = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    app.detectChanges();
    await app.whenStable();

    const enlaces = Array.from((app.nativeElement as HTMLElement).querySelectorAll('nav a'));
    expect(enlaces.map((a) => a.textContent?.trim())).toEqual(['CV', 'Ofertas']);
    expect(enlaces.map((a) => a.getAttribute('href'))).toEqual(['/cv', '/ofertas']);
    expect(TestBed.inject(Router).url).toBe('/cv');
    expect(app.nativeElement.textContent).toContain('Subir una versión');

    (enlaces[1] as HTMLAnchorElement).click();
    await app.whenStable();
    app.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/ofertas');
    expect(app.nativeElement.textContent).toContain('Filtros');
    expect(harness).toBeTruthy();
  });

  it('el enlace del correo diario abre el detalle de la oferta', async () => {
    await harness.navigateByUrl('/ofertas/7');
    expect(harness.routeNativeElement?.textContent).toContain('Volver a las ofertas');
    expect(http.match({ method: 'GET', url: '/api/ofertas/7' })).toHaveLength(1);
  });
});
