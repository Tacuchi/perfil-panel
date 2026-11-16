import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IOferta } from '../../../@data/interfaces/oferta';
import { ofertaDePrueba } from './ofertas-de-prueba';
import { OfertasPageComponent } from './ofertas-page.component';

describe('OfertasPageComponent', () => {
  let fixture: ComponentFixture<OfertasPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    // El rango por defecto son los últimos 7 días: se fija «hoy» para que la URL esperada no dependa del reloj.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 15, 10, 0));
    await TestBed.configureTestingModule({
      imports: [OfertasPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OfertasPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    http.verify();
    document.querySelectorAll('.cdk-overlay-container').forEach((nodo) => (nodo.innerHTML = ''));
  });

  const pantalla = () => fixture.nativeElement as HTMLElement;

  async function estable(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function pedidoDeLista(): TestRequest {
    return http.expectOne((r) => r.method === 'GET' && r.url.startsWith('/api/ofertas'));
  }

  async function responderInicio(ofertas: IOferta[]): Promise<string> {
    http.expectOne({ method: 'GET', url: '/api/tecnologias' })
      .flush({ principales: ['Flutter', 'Angular'], secundarias: ['Java'] });
    const pedido = pedidoDeLista();
    pedido.flush(ofertas);
    await estable();
    return pedido.request.url;
  }

  async function filtrarYAplicar(cambios: Record<string, unknown>): Promise<string> {
    fixture.componentInstance['filtros'].patchValue(cambios);
    await estable();
    (pantalla().querySelector('button[type=submit]') as HTMLButtonElement).click();
    const pedido = pedidoDeLista();
    pedido.flush([]);
    await estable();
    return pedido.request.url;
  }

  it('pide por defecto las nuevas de encaje alto y medio de los últimos 7 días', async () => {
    const url = await responderInicio([]);
    expect(url).toBe('/api/ofertas?encaje=ALTO,MEDIO&estado=NUEVA&desde=2026-11-08&hasta=2026-11-15');
    expect(pantalla().textContent).toContain('No hay ofertas con estos filtros.');
  });

  it('cada oferta muestra título, empresa, fuente, fecha, modalidad, encaje, motivo y enlace original', async () => {
    await responderInicio([ofertaDePrueba()]);

    const tarjeta = pantalla().querySelector('app-oferta-tarjeta') as HTMLElement;
    const texto = tarjeta.textContent ?? '';
    expect(texto).toContain('Desarrollador Angular Senior');
    expect(texto).toContain('Acme');
    expect(texto).toContain('Get on Board');
    expect(texto).toContain('10/11/2026');
    expect(texto).toContain('Remoto, Latinoamérica');
    expect(texto).toContain('Encaje: Alto');
    expect(texto).toContain('Menciona tecnologías principales: Angular.');
    const original = tarjeta.querySelector('a.original') as HTMLAnchorElement;
    expect(original.href).toBe('https://www.getonbrd.com/jobs/desarrollador-angular-senior-acme');
    expect(original.target).toBe('_blank');
    expect(tarjeta.querySelector('a[href="/ofertas/1"]')).not.toBeNull();
  });

  it('marca la posible repetida con enlace a la otra y la que ya no está publicada', async () => {
    await responderInicio([
      ofertaDePrueba({
        posiblesRepetidas: [{ id: 9, fuente: 'REMOTE_OK', fuenteNombre: 'Remote OK' }],
        publicada: false,
      }),
    ]);

    const tarjeta = pantalla().querySelector('app-oferta-tarjeta') as HTMLElement;
    expect(tarjeta.textContent).toContain('Posible repetida, también en:');
    expect(tarjeta.querySelector('a[href="/ofertas/9"]')?.textContent).toContain('Remote OK');
    expect(tarjeta.textContent).toContain('Ya no publicada');
  });

  it('las que no encajan se ven al cambiar el filtro de encaje', async () => {
    await responderInicio([]);
    const url = await filtrarYAplicar({ encaje: ['NO_ENCAJA'] });
    expect(url).toBe('/api/ofertas?encaje=NO_ENCAJA&estado=NUEVA&desde=2026-11-08&hasta=2026-11-15');
  });

  it('filtra por estado, fuente, modalidad, tecnología y fechas', async () => {
    await responderInicio([]);
    const url = await filtrarYAplicar({
      encaje: ['ALTO'],
      estado: ['GUARDADA', 'POSTULADA'],
      fuente: ['REMOTIVE'],
      modalidad: ['HIBRIDO', 'REMOTO'],
      tecnologia: 'Angular',
      desde: '2026-11-01',
      hasta: '2026-11-15',
    });
    expect(url).toBe(
      '/api/ofertas?encaje=ALTO&estado=GUARDADA,POSTULADA&fuente=REMOTIVE&modalidad=HIBRIDO,REMOTO'
        + '&tecnologia=Angular&desde=2026-11-01&hasta=2026-11-15',
    );
  });

  it('restablecer vuelve a la lista por defecto', async () => {
    await responderInicio([]);
    await filtrarYAplicar({ encaje: ['NO_ENCAJA'], fuente: ['REMOTIVE'] });

    (pantalla().querySelector('.acciones button[type=button]') as HTMLButtonElement).click();
    const pedido = pedidoDeLista();
    pedido.flush([]);
    expect(pedido.request.url).toBe('/api/ofertas?encaje=ALTO,MEDIO&estado=NUEVA&desde=2026-11-08&hasta=2026-11-15');
  });

  it('muestra lo aplicado como chips y cada chip quita su filtro', async () => {
    await responderInicio([]);
    const chips = () => [...pantalla().querySelectorAll('.aplicados mat-chip')].map((c) => c.textContent?.trim());
    expect(chips()).toEqual(['Encaje: Alto', 'Encaje: Medio', 'Estado: Nueva', '8/11/2026 – 15/11/2026']);

    (pantalla().querySelector('button[aria-label="Quitar 8/11/2026 – 15/11/2026"]') as HTMLButtonElement).click();
    const pedido = pedidoDeLista();
    pedido.flush([]);
    await estable();
    expect(pedido.request.url).toBe('/api/ofertas?encaje=ALTO,MEDIO&estado=NUEVA');
    expect(chips()).toEqual(['Encaje: Alto', 'Encaje: Medio', 'Estado: Nueva']);
    expect(fixture.componentInstance['filtros'].getRawValue().desde).toBeNull();
  });

  it('quitar todos deja la lista sin filtros', async () => {
    await responderInicio([]);
    (pantalla().querySelector('.quitar-todos') as HTMLButtonElement).click();
    const pedido = pedidoDeLista();
    pedido.flush([]);
    await estable();
    expect(pedido.request.url).toBe('/api/ofertas');
    expect(pantalla().querySelector('.aplicados')).toBeNull();
  });

  it('la pantalla de ofertas ya no muestra las fuentes ni lanza recolecciones', async () => {
    await responderInicio([]);

    expect(pantalla().querySelector('app-fuentes-estado')).toBeNull();
    expect(pantalla().querySelector('.leer-todas')).toBeNull();
    expect(pantalla().querySelector('app-recoleccion-avance')).toBeNull();
    http.expectNone({ method: 'GET', url: '/api/fuentes' });
    http.expectNone({ method: 'GET', url: '/api/recoleccion' });
  });
});
