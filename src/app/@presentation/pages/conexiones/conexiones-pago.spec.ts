import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IConexion } from '../../../@data/interfaces/conexion';
import { IRecoleccion } from '../../../@data/interfaces/recoleccion';
import { FUENTES, dolares, etiqueta } from '../../../Utils/const';
import { ConexionesPageComponent } from './conexiones-page.component';
import {
  CONEXION_PAGO_CON_CLAVE,
  CONEXION_PAGO_LISTA,
  FUENTES_PAGO_EN_TOPE,
  FUENTES_PAGO_LEIDA,
  FUENTES_PAGO_SIN_CONFIGURAR,
  RECHAZO_TOPE_MENSUAL,
  RECOLECCION_GENERAL_CON_TOPE_MENSUAL,
  RECOLECCION_GENERAL_CON_TOPE_MENSUAL_TERMINADA,
  RECOLECCION_PAGO_ACEPTADA,
  RECOLECCION_PAGO_TERMINADA,
} from './pago-de-prueba';
import { RECOLECCION_NINGUNA } from './recoleccion-de-prueba';

/** Conexiones de pago (Computrabajo): clave, tope mensual y consumo, con respuestas copiadas de la API local. */
describe('Conexiones de pago', () => {
  let fixture: ComponentFixture<ConexionesPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(new Date(2026, 10, 16, 9, 0));
    await TestBed.configureTestingModule({
      imports: [ConexionesPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.advanceTimersByTime(10_000);
    http.verify();
    vi.useRealTimers();
    document.querySelectorAll('.cdk-overlay-container').forEach((nodo) => (nodo.innerHTML = ''));
  });

  const pantalla = () => fixture.nativeElement as HTMLElement;
  const tarjeta = () => pantalla().querySelector('app-fuentes-estado [data-fuente="COMPUTRABAJO"]') as HTMLElement;
  const textoDe = (nodo: Element | null) => nodo?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const enTarjeta = (selector: string) => tarjeta().querySelector(selector) as HTMLElement;
  const campoClave = () => enTarjeta('input[type="password"]') as HTMLInputElement;
  const campoTope = () => enTarjeta('input[type="number"]') as HTMLInputElement;

  function abrir(fuentes: IConexion[], recoleccion: IRecoleccion = RECOLECCION_NINGUNA): void {
    fixture = TestBed.createComponent(ConexionesPageComponent);
    fixture.detectChanges();
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(fuentes);
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(recoleccion);
    fixture.detectChanges();
  }

  function escribir(campo: HTMLInputElement, valor: string): void {
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('sin clave ni tope dice qué le falta, no se puede leer y no habla de lectura programada', () => {
    abrir(FUENTES_PAGO_SIN_CONFIGURAR);

    expect(textoDe(enTarjeta('.via'))).toBe('Se lee por un servicio de pago · Necesita una clave');
    expect(textoDe(enTarjeta('.conexion'))).toBe('Falta configurar: falta la clave del servicio');
    expect(textoDe(enTarjeta('.clave'))).toBe('Sin clave');
    expect(textoDe(enTarjeta('.consumo'))).toBe(`Consumo del mes: ${dolares(0)} · sin tope mensual`);
    expect(textoDe(enTarjeta('.restantes'))).toBe('Sin tope diario: la acota su tope mensual');
    expect((enTarjeta('button.leer') as HTMLButtonElement).disabled).toBe(true);
    expect(campoClave().type).toBe('password');
    const ayuda = textoDe(pantalla().querySelector('.titulo'));
    expect(ayuda).toContain('Nada se lee solo');
    expect(ayuda).not.toContain('programada');
    expect(ayuda).toContain('tope mensual');
  });

  it('la clave se envía, el campo se vacía al guardar y después solo se ve desde cuándo existe', () => {
    abrir(FUENTES_PAGO_SIN_CONFIGURAR);

    escribir(campoClave(), 'clave-de-prueba');
    (enTarjeta('button.guardar-clave') as HTMLButtonElement).click();
    fixture.detectChanges();

    const carga = http.expectOne({ method: 'PUT', url: '/api/fuentes/COMPUTRABAJO/clave' });
    expect(carga.request.body).toEqual({ clave: 'clave-de-prueba' });
    expect(campoClave().value).toBe('');
    carga.flush(CONEXION_PAGO_CON_CLAVE);
    fixture.detectChanges();

    expect(textoDe(enTarjeta('.clave'))).toContain('Tiene clave desde 16/11/2026');
    expect(textoDe(enTarjeta('.conexion'))).toBe('Falta configurar: falta el tope mensual');
    expect(textoDe(enTarjeta('mat-label'))).toBe('Reemplazar la clave');
    // Vacío tras guardar bien: el campo espera otra clave, no marca un error.
    expect(enTarjeta('mat-form-field').classList).not.toContain('mat-form-field-invalid');
    expect(campoClave().getAttribute('aria-invalid')).not.toBe('true');
    expect(pantalla().innerHTML).not.toContain('clave-de-prueba');
    expect(textoDe(document.querySelector('.cdk-overlay-container'))).toContain('Clave guardada');
  });

  it('dice si Computrabajo tiene lo que necesita: sin configurar hasta tener clave y tope', () => {
    abrir(FUENTES_PAGO_SIN_CONFIGURAR);
    expect(textoDe(enTarjeta('.tiene'))).toBe('Sin configurar');
    fixture.destroy();

    abrir(FUENTES_PAGO_LEIDA);
    expect(textoDe(enTarjeta('.tiene'))).toBe('Configurada');
  });

  it('una clave en blanco no se envía', () => {
    abrir(FUENTES_PAGO_SIN_CONFIGURAR);

    escribir(campoClave(), '   ');

    expect((enTarjeta('button.guardar-clave') as HTMLButtonElement).disabled).toBe(true);
  });

  it('el tope mensual se fija y con clave y tope Computrabajo se puede leer', () => {
    abrir(FUENTES_PAGO_SIN_CONFIGURAR.map((c) => (c.fuente === 'COMPUTRABAJO' ? CONEXION_PAGO_CON_CLAVE : c)));

    escribir(campoTope(), '0.02');
    (enTarjeta('button.guardar-tope') as HTMLButtonElement).click();
    fixture.detectChanges();

    const tope = http.expectOne({ method: 'PUT', url: '/api/fuentes/COMPUTRABAJO/tope' });
    expect(tope.request.body).toEqual({ topeMensual: 0.02 });
    tope.flush(CONEXION_PAGO_LISTA);
    fixture.detectChanges();

    expect(enTarjeta('.conexion')).toBeNull();
    expect(textoDe(enTarjeta('.consumo'))).toBe(`Consumo del mes: ${dolares(0)} de ${dolares(0.02)}`);
    expect((enTarjeta('button.leer') as HTMLButtonElement).disabled).toBe(false);
  });

  it('un tope de cero o con más de dos decimales no se envía', () => {
    abrir(FUENTES_PAGO_SIN_CONFIGURAR);

    escribir(campoTope(), '0');
    expect((enTarjeta('button.guardar-tope') as HTMLButtonElement).disabled).toBe(true);
    escribir(campoTope(), '1.234');
    expect((enTarjeta('button.guardar-tope') as HTMLButtonElement).disabled).toBe(true);
  });

  it('leer Computrabajo suma su consumo del mes', () => {
    abrir(FUENTES_PAGO_SIN_CONFIGURAR.map((c) => (c.fuente === 'COMPUTRABAJO' ? CONEXION_PAGO_LISTA : c)));

    (enTarjeta('button.leer') as HTMLButtonElement).click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion/COMPUTRABAJO' }).flush(RECOLECCION_PAGO_ACEPTADA);
    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(RECOLECCION_PAGO_TERMINADA);
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(FUENTES_PAGO_LEIDA);
    fixture.detectChanges();

    expect(textoDe(pantalla().querySelector('app-recoleccion-avance [data-fuente="COMPUTRABAJO"]'))).toContain('5');
    expect(textoDe(enTarjeta('.consumo'))).toBe(`Consumo del mes: ${dolares(0.016)} de ${dolares(0.02)}`);
  });

  it('en su tope del mes lo dice, muestra el consumo y no se puede leer', () => {
    abrir(FUENTES_PAGO_EN_TOPE);

    expect(textoDe(enTarjeta('.conexion'))).toBe('Llegó a su tope del mes');
    expect(textoDe(enTarjeta('.consumo'))).toBe(`Consumo del mes: ${dolares(0.02)} de ${dolares(0.02)}`);
    expect((enTarjeta('button.leer') as HTMLButtonElement).disabled).toBe(true);
    expect(RECHAZO_TOPE_MENSUAL.detail).toContain('tope del mes');
  });

  it('la recolección general dice que omitió Computrabajo por su tope del mes', () => {
    abrir(FUENTES_PAGO_EN_TOPE, RECOLECCION_GENERAL_CON_TOPE_MENSUAL);

    expect(textoDe(pantalla().querySelector('app-recoleccion-avance [data-fuente="COMPUTRABAJO"] .texto'))).toBe(
      'No leída: llegó a su tope del mes',
    );
    vi.advanceTimersByTime(1000);
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(RECOLECCION_GENERAL_CON_TOPE_MENSUAL_TERMINADA);
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(FUENTES_PAGO_EN_TOPE);
    fixture.detectChanges();

    expect(textoDe(pantalla().querySelector('app-recoleccion-avance [data-fuente="COMPUTRABAJO"] .texto'))).toBe(
      'No leída: llegó a su tope del mes',
    );
  });

  it('Computrabajo está en el filtro por fuente', () => {
    expect(etiqueta(FUENTES, 'COMPUTRABAJO')).toBe('Computrabajo');
  });
});
