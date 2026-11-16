import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IConexion } from '../../../@data/interfaces/conexion';
import { IRecoleccion } from '../../../@data/interfaces/recoleccion';
import { ConexionesPageComponent } from './conexiones-page.component';
import {
  CONEXION_PAUSADA,
  CONEXION_REANUDADA,
  FUENTES_CON_PAUSADA,
  FUENTES_DE_PRUEBA,
  FUENTES_EN_TOPE,
  FUENTES_SIN_LEER,
  FUENTES_TODAS_PAUSADAS,
  RECHAZO_EN_CURSO,
  RECHAZO_PAUSADA,
  RECOLECCION_GENERAL_ACEPTADA,
  RECOLECCION_GENERAL_A_MITAD,
  RECOLECCION_GENERAL_CON_OMITIDA,
  RECOLECCION_GENERAL_CON_PAUSADA,
  RECOLECCION_NINGUNA,
  RECOLECCION_TERMINADA_FALLO_BLOQUEO,
  RECOLECCION_UNA_FUENTE_ACEPTADA,
} from './recoleccion-de-prueba';

/** Conexiones y recolección a demanda, con respuestas copiadas de la API y temporizadores simulados. */
describe('ConexionesPageComponent', () => {
  let fixture: ComponentFixture<ConexionesPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(new Date(2026, 10, 15, 10, 0));
    await TestBed.configureTestingModule({
      imports: [ConexionesPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ninguna consulta queda pendiente ni programada.
    vi.advanceTimersByTime(10_000);
    http.verify();
    vi.useRealTimers();
    document.querySelectorAll('.cdk-overlay-container').forEach((nodo) => (nodo.innerHTML = ''));
  });

  const pantalla = () => fixture.nativeElement as HTMLElement;
  const texto = (selector: string) => pantalla().querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim();
  const boton = (selector: string) => pantalla().querySelector(selector) as HTMLButtonElement;

  function refrescar(): void {
    fixture.detectChanges();
  }

  /** Monta la pantalla y responde la carga inicial: conexiones y recolección actual. */
  function abrir(recoleccion: IRecoleccion, fuentes: IConexion[] = FUENTES_SIN_LEER): void {
    fixture = TestBed.createComponent(ConexionesPageComponent);
    fixture.detectChanges();
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(fuentes);
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(recoleccion);
    refrescar();
  }

  /** Pasa un segundo y responde la consulta de avance que sale. */
  function siguienteAvance(recoleccion: IRecoleccion): void {
    vi.advanceTimersByTime(1000);
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(recoleccion);
    refrescar();
  }

  const pasoDe = (fuente: string) => texto(`app-recoleccion-avance [data-fuente="${fuente}"] .texto`);
  const barra = () => pantalla().querySelector('app-recoleccion-avance mat-progress-bar') as HTMLElement;

  it('el botón general lanza todas las fuentes y la barra aparece sobre las lanzadas', () => {
    abrir(RECOLECCION_NINGUNA);
    expect(pantalla().querySelector('app-recoleccion-avance')).toBeNull();

    boton('.leer-todas').click();
    const pedido = http.expectOne({ method: 'POST', url: '/api/recoleccion' });
    expect(pedido.request.body).toBeNull();
    pedido.flush(RECOLECCION_GENERAL_ACEPTADA, { status: 202, statusText: 'Accepted' });
    refrescar();

    expect(texto('app-recoleccion-avance .titulo')).toBe('Recolección a demanda en curso: 0 de 3 fuentes');
    expect(pasoDe('GET_ON_BOARD')).toBe('Pendiente');
    expect(pasoDe('REMOTIVE')).toBe('Pendiente');
    expect(pasoDe('REMOTE_OK')).toBe('Pendiente');
    expect(barra().getAttribute('aria-valuenow')).toBe('0');

    siguienteAvance(RECOLECCION_TERMINADA_FALLO_BLOQUEO);
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(FUENTES_SIN_LEER);
  });

  it('el botón de una fuente lanza solo esa', () => {
    abrir(RECOLECCION_NINGUNA);

    boton('button[aria-label="Leer Remotive ahora"]').click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion/REMOTIVE' })
      .flush(RECOLECCION_UNA_FUENTE_ACEPTADA, { status: 202, statusText: 'Accepted' });
    refrescar();

    expect(texto('app-recoleccion-avance .titulo')).toBe('Recolección a demanda en curso: 0 de 1 fuentes');
    expect(pantalla().querySelectorAll('app-recoleccion-avance .paso')).toHaveLength(1);
    expect(pasoDe('REMOTIVE')).toBe('Pendiente');

    fixture.destroy();
  });

  it('mientras corre, la barra avanza con cada fuente terminada y al terminar muestra el resultado y recarga', () => {
    abrir(RECOLECCION_NINGUNA);
    boton('.leer-todas').click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion' }).flush(RECOLECCION_GENERAL_ACEPTADA);
    refrescar();

    siguienteAvance(RECOLECCION_GENERAL_A_MITAD);

    expect(texto('app-recoleccion-avance .titulo')).toBe('Recolección a demanda en curso: 1 de 3 fuentes');
    expect(barra().getAttribute('aria-valuenow')).toBe('33');
    expect(pasoDe('GET_ON_BOARD')).toBe('Leída: 6 ofertas');
    expect(pasoDe('REMOTIVE')).toBe('Leyendo…');
    expect(pasoDe('REMOTE_OK')).toBe('Pendiente');

    siguienteAvance(RECOLECCION_TERMINADA_FALLO_BLOQUEO);

    expect(texto('app-recoleccion-avance .titulo')).toContain('Última recolección a demanda, terminada el 15/11/2026');
    expect(barra().getAttribute('aria-valuenow')).toBe('100');
    expect(pasoDe('GET_ON_BOARD')).toBe('Leída: 6 ofertas');
    expect(pasoDe('REMOTIVE')).toBe('Falló');
    expect(pasoDe('REMOTE_OK')).toBe('Bloqueada');
    // Las conexiones vuelven a cargarse solas, sin recargar la página.
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(FUENTES_EN_TOPE);
    refrescar();
    expect(texto('[data-fuente="REMOTIVE"] .restantes')).toBe('Llegó a su tope de lecturas de hoy.');
  });

  it('con una recolección en curso los botones no lanzan otra y el panel lo dice', () => {
    abrir(RECOLECCION_GENERAL_A_MITAD);

    expect(boton('.leer-todas').disabled).toBe(true);
    pantalla().querySelectorAll<HTMLButtonElement>('app-fuentes-estado button.leer')
      .forEach((b) => expect(b.disabled).toBe(true));
    expect(texto('.motivo')).toBe('Hay una recolección en curso. Espera a que termine para lanzar otra.');

    fixture.destroy();
  });

  it('si la API rechaza el lanzamiento porque ya corre otra, lo dice y muestra la que corre', () => {
    abrir(RECOLECCION_NINGUNA);

    boton('.leer-todas').click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion' })
      .flush(RECHAZO_EN_CURSO, { status: 409, statusText: 'Conflict' });
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(RECOLECCION_GENERAL_A_MITAD);
    refrescar();

    expect(document.querySelector('.cdk-overlay-container')?.textContent).toContain(RECHAZO_EN_CURSO.detail);
    expect(texto('.motivo')).toBe('Hay una recolección en curso. Espera a que termine para lanzar otra.');
    expect(texto('app-recoleccion-avance .titulo')).toBe('Recolección a demanda en curso: 1 de 3 fuentes');

    fixture.destroy();
  });

  it('cada fuente muestra sus lecturas restantes y la que llegó a su tope no se puede lanzar', () => {
    abrir(RECOLECCION_NINGUNA, [FUENTES_SIN_LEER[0], FUENTES_EN_TOPE[1], FUENTES_SIN_LEER[2]]);

    expect(texto('[data-fuente="GET_ON_BOARD"] .restantes')).toBe('Le quedan 3 lecturas hoy');
    expect(texto('[data-fuente="REMOTIVE"] .restantes')).toBe('Llegó a su tope de lecturas de hoy.');
    expect(boton('button[aria-label="Leer Remotive ahora"]').disabled).toBe(true);
    expect(boton('button[aria-label="Leer Remote OK ahora"]').disabled).toBe(false);
    expect(boton('.leer-todas').disabled).toBe(false);
  });

  it('el botón general omite la fuente en su tope y la muestra como no leída con el motivo', () => {
    abrir(RECOLECCION_NINGUNA);
    boton('.leer-todas').click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion' }).flush(RECOLECCION_GENERAL_CON_OMITIDA);
    refrescar();

    expect(texto('app-recoleccion-avance .titulo')).toBe('Recolección a demanda en curso: 0 de 2 fuentes');
    expect(texto('app-recoleccion-avance [data-paso="OMITIDA"] .nombre')).toBe('Remotive');
    expect(pasoDe('REMOTIVE')).toBe('No leída: llegó a su tope de lecturas de hoy');

    fixture.destroy();
  });

  it('con todas las fuentes en su tope el botón general está desactivado y dice por qué', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_EN_TOPE);

    expect(boton('.leer-todas').disabled).toBe(true);
    expect(texto('.motivo')).toBe('Todas las fuentes llegaron a su tope de lecturas de hoy.');
  });

  it('al abrir la pantalla con una recolección ya en curso la muestra y sigue su avance', () => {
    abrir(RECOLECCION_GENERAL_A_MITAD);

    expect(texto('app-recoleccion-avance .titulo')).toBe('Recolección a demanda en curso: 1 de 3 fuentes');
    expect(pasoDe('REMOTIVE')).toBe('Leyendo…');

    siguienteAvance(RECOLECCION_GENERAL_A_MITAD);
    siguienteAvance(RECOLECCION_TERMINADA_FALLO_BLOQUEO);
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(FUENTES_SIN_LEER);
    expect(pasoDe('REMOTIVE')).toBe('Falló');
  });

  it('al salir de la pantalla deja de consultar el avance', () => {
    abrir(RECOLECCION_GENERAL_A_MITAD);

    fixture.destroy();
    vi.advanceTimersByTime(5000);

    http.expectNone({ method: 'GET', url: '/api/recoleccion' });
  });

  it('una fuente bloqueada se ve como bloqueada con su última lectura correcta, no como día sin ofertas', async () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_DE_PRUEBA);

    const remoteOk = pantalla().querySelector('[data-fuente="REMOTE_OK"]') as HTMLElement;
    expect(remoteOk.textContent).toContain('Bloqueada');
    expect(remoteOk.textContent).toContain('Última lectura correcta: 14/11/2026');
    expect(remoteOk.textContent).toContain('HTTP 403');
    expect(remoteOk.classList).toContain('problema');
    expect(pantalla().querySelector('[data-fuente="REMOTIVE"]')?.textContent).toContain('Sin leer todavía');
    expect(pantalla().querySelector('[data-fuente="GET_ON_BOARD"]')?.textContent).toContain('Correcta');
  });

  it('cada conexión dice desde dónde se lee y lo que necesita', () => {
    abrir(RECOLECCION_NINGUNA);

    expect(pantalla().querySelectorAll('app-fuentes-estado .fuente')).toHaveLength(3);
    for (const fuente of ['GET_ON_BOARD', 'REMOTIVE', 'REMOTE_OK']) {
      expect(texto(`[data-fuente="${fuente}"] .via`)).toBe('Se lee desde el servidor · No necesita nada');
      expect(pantalla().querySelector(`[data-fuente="${fuente}"] .conexion`)).toBeNull();
    }
  });

  it('pausar una conexión la marca pausada, desactiva su botón Leer y reanudarla lo devuelve', () => {
    abrir(RECOLECCION_NINGUNA);

    boton('button[aria-label="Pausar Remotive"]').click();
    http.expectOne({ method: 'POST', url: '/api/fuentes/REMOTIVE/pausar' }).flush(CONEXION_PAUSADA);
    refrescar();

    expect(texto('[data-fuente="REMOTIVE"] .conexion')).toBe('Pausada');
    expect(boton('button[aria-label="Leer Remotive ahora"]').disabled).toBe(true);
    expect(boton('button[aria-label="Leer Remote OK ahora"]').disabled).toBe(false);
    expect(boton('.leer-todas').disabled).toBe(false);

    boton('button[aria-label="Reanudar Remotive"]').click();
    http.expectOne({ method: 'POST', url: '/api/fuentes/REMOTIVE/reanudar' }).flush(CONEXION_REANUDADA);
    refrescar();

    expect(pantalla().querySelector('[data-fuente="REMOTIVE"] .conexion')).toBeNull();
    expect(boton('button[aria-label="Leer Remotive ahora"]').disabled).toBe(false);
    expect(boton('button[aria-label="Pausar Remotive"]')).not.toBeNull();
  });

  it('el botón general omite la pausada y la muestra como no leída con su motivo', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_CON_PAUSADA);
    boton('.leer-todas').click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion' }).flush(RECOLECCION_GENERAL_CON_PAUSADA);
    refrescar();

    expect(texto('app-recoleccion-avance .titulo')).toBe('Recolección a demanda en curso: 0 de 2 fuentes');
    expect(pasoDe('REMOTIVE')).toBe('No leída: está pausada');

    fixture.destroy();
  });

  it('si la API rechaza leer una pausada, muestra su motivo', () => {
    abrir(RECOLECCION_NINGUNA);

    boton('button[aria-label="Leer Remotive ahora"]').click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion/REMOTIVE' })
      .flush(RECHAZO_PAUSADA, { status: 409, statusText: 'Conflict' });
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(RECOLECCION_NINGUNA);
    refrescar();

    expect(document.querySelector('.cdk-overlay-container')?.textContent).toContain(RECHAZO_PAUSADA.detail);
  });

  it('sin ninguna conexión que se pueda leer el botón general está desactivado y dice por qué', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_TODAS_PAUSADAS);

    expect(boton('.leer-todas').disabled).toBe(true);
    expect(texto('.motivo')).toBe('Ninguna conexión se puede leer ahora: están pausadas o llegaron a su tope de hoy.');
  });
});
