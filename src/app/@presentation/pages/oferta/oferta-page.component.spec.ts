import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IOfertaDetalle } from '../../../@data/interfaces/oferta';
import { detalleDePrueba } from '../ofertas/ofertas-de-prueba';
import { OfertaPageComponent } from './oferta-page.component';

describe('OfertaPageComponent', () => {
  let fixture: ComponentFixture<OfertaPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OfertaPageComponent);
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    document.querySelectorAll('.cdk-overlay-container').forEach((nodo) => (nodo.innerHTML = ''));
  });

  const pantalla = () => fixture.nativeElement as HTMLElement;
  const aviso = () => document.querySelector('.mat-mdc-snack-bar-container')?.textContent ?? '';

  async function estable(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function responder(detalle: IOfertaDetalle): Promise<void> {
    await estable();
    http.expectOne({ method: 'GET', url: '/api/ofertas/1' }).flush(detalle);
    await estable();
  }

  it('abre la publicación original en otra pestaña', async () => {
    await responder(detalleDePrueba());

    const original = pantalla().querySelector('a.original') as HTMLAnchorElement;
    expect(original.href).toBe('https://www.getonbrd.com/jobs/desarrollador-angular-senior-acme');
    expect(original.target).toBe('_blank');
    expect(original.rel).toContain('noopener');
    expect(pantalla().textContent).toContain('Buscamos experiencia con Angular.');
  });

  it('con correo de contacto lo muestra y arma el correo con destinatario, asunto y enlace al CV', async () => {
    await responder(detalleDePrueba({}, 'postula@empresa-inventada.test'));

    expect(pantalla().querySelector('.correo')?.textContent).toBe('postula@empresa-inventada.test');
    const escribir = pantalla().querySelector('a.escribir') as HTMLAnchorElement;
    const enlace = new URL(escribir.href);
    expect(enlace.protocol).toBe('mailto:');
    expect(decodeURIComponent(enlace.pathname)).toBe('postula@empresa-inventada.test');
    expect(enlace.searchParams.get('subject')).toBe('Desarrollador Angular Senior');
    expect(enlace.searchParams.get('body')).toContain('https://tacuchi.dev/cv');
  });

  it('sin correo de contacto no ofrece escribir', async () => {
    await responder(detalleDePrueba());

    expect(pantalla().querySelector('a.escribir')).toBeNull();
    expect(pantalla().textContent).toContain('postula desde la publicación');
  });

  it('marca la oferta como descartada y lo confirma', async () => {
    await responder(detalleDePrueba());

    (pantalla().querySelector('button[data-estado="DESCARTADA"]') as HTMLButtonElement).click();
    const pedido = http.expectOne({ method: 'PATCH', url: '/api/ofertas/1' });
    expect(pedido.request.body).toEqual({ estado: 'DESCARTADA' });
    pedido.flush(detalleDePrueba({ estado: 'DESCARTADA' }));
    await estable();

    expect(pantalla().querySelector('.estado')?.textContent).toContain('Descartada');
    expect((pantalla().querySelector('button[data-estado="DESCARTADA"]') as HTMLButtonElement).disabled).toBe(true);
    expect(aviso()).toContain('Oferta marcada como descartada.');
  });

  it('la postulada muestra la fecha en que se marcó', async () => {
    await responder(detalleDePrueba());

    (pantalla().querySelector('button[data-estado="POSTULADA"]') as HTMLButtonElement).click();
    http.expectOne({ method: 'PATCH', url: '/api/ofertas/1' })
      .flush(detalleDePrueba({ estado: 'POSTULADA', postuladaEn: '2026-11-15T14:00:00Z' }));
    await estable();

    expect(pantalla().textContent).toContain('Postulada el 15/11/2026');
  });

  it('si la API rechaza el cambio, lo avisa y la oferta sigue como estaba', async () => {
    await responder(detalleDePrueba());

    (pantalla().querySelector('button[data-estado="GUARDADA"]') as HTMLButtonElement).click();
    http.expectOne({ method: 'PATCH', url: '/api/ofertas/1' })
      .flush({ status: 404, detail: 'No existe la oferta 1.' }, { status: 404, statusText: 'Not Found' });
    await estable();

    expect(aviso()).toContain('No existe la oferta 1.');
    expect(pantalla().querySelector('.estado')?.textContent).toContain('Nueva');
  });
});
