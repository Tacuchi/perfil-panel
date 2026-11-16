import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IConexion } from '../../../@data/interfaces/conexion';
import { IRecoleccion } from '../../../@data/interfaces/recoleccion';
import { ConexionesPageComponent } from './conexiones-page.component';
import { ABRIR_ENLACE } from './recoleccion.store';
import {
  CORRIDA_MAQUINA_ABIERTA,
  FUENTES_CON_BUMERAN,
  FUENTES_CON_MAQUINA,
  FUENTES_PAUSADA_VERIFICACION,
  FUENTES_PENDIENTE_MAQUINA,
  FUENTES_TRAS_LECTURA_MAQUINA,
  FUENTES_TRAS_SIN_RESPUESTA,
  RECHAZO_SIN_MAQUINA,
  RECOLECCION_MAQUINA_EN_CURSO,
  RECOLECCION_MAQUINA_SIN_RESPUESTA,
  RECOLECCION_MAQUINA_TERMINADA,
  RECOLECCION_NINGUNA,
  RECOLECCION_PROGRAMADA_OMITE_MAQUINA,
} from './recoleccion-de-prueba';

/** Conexiones que se leen desde la máquina de la persona, con respuestas copiadas de la API local. */
describe('Conexiones de la máquina', () => {
  let fixture: ComponentFixture<ConexionesPageComponent>;
  let http: HttpTestingController;
  let abiertos: string[];

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
    abiertos = [];
    await TestBed.configureTestingModule({
      imports: [ConexionesPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ABRIR_ENLACE, useValue: (direccion: string) => abiertos.push(direccion) },
      ],
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
  const texto = (selector: string) => pantalla().querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim();
  const boton = (selector: string) => pantalla().querySelector(selector) as HTMLButtonElement | null;
  const tarjeta = (fuente: string) => `app-fuentes-estado [data-fuente="${fuente}"]`;

  function abrir(recoleccion: IRecoleccion, fuentes: IConexion[]): void {
    fixture = TestBed.createComponent(ConexionesPageComponent);
    fixture.detectChanges();
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(fuentes);
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(recoleccion);
    fixture.detectChanges();
  }

  function siguienteAvance(recoleccion: IRecoleccion): void {
    vi.advanceTimersByTime(1000);
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(recoleccion);
    fixture.detectChanges();
  }

  it('«Leer desde mi máquina» abre la corrida en la API, lanza el lector con su enlace y sigue el avance', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_CON_MAQUINA);

    boton('.leer-maquina')!.click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion/maquina' }).flush(CORRIDA_MAQUINA_ABIERTA, { status: 202, statusText: 'Accepted' });
    fixture.detectChanges();

    expect(abiertos).toEqual([`perfil-lector://leer?corrida=${CORRIDA_MAQUINA_ABIERTA.codigo}`]);
    expect(texto('app-recoleccion-avance .titulo')).toContain('Recolección desde tu máquina en curso: 0 de 1 fuentes');
    expect(boton('.leer-maquina')!.disabled).toBe(true);

    siguienteAvance(RECOLECCION_MAQUINA_TERMINADA);
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(FUENTES_TRAS_LECTURA_MAQUINA);
    fixture.detectChanges();
    expect(texto('app-recoleccion-avance [data-fuente="LINKEDIN"] .texto')).toBe('Leída: 5 ofertas');
    expect(boton('.leer-maquina')!.disabled).toBe(true);
    expect(texto('.motivo.maquina')).toBe('Ninguna conexión de tu máquina se puede leer ahora: están pausadas o llegaron a su tope de hoy.');
  });

  it('el código de la corrida no se guarda en la pantalla: solo viaja en el enlace', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_CON_MAQUINA);
    boton('.leer-maquina')!.click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion/maquina' }).flush(CORRIDA_MAQUINA_ABIERTA, { status: 202, statusText: 'Accepted' });
    fixture.detectChanges();
    siguienteAvance(RECOLECCION_MAQUINA_EN_CURSO);
    expect(pantalla().innerHTML).not.toContain(CORRIDA_MAQUINA_ABIERTA.codigo);
    siguienteAvance(RECOLECCION_MAQUINA_SIN_RESPUESTA);
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(FUENTES_TRAS_SIN_RESPUESTA);
  });

  it('si el lector no responde, dice que no respondió en esta máquina y LinkedIn conserva su lectura del día', () => {
    abrir(RECOLECCION_MAQUINA_EN_CURSO, FUENTES_CON_MAQUINA);
    siguienteAvance(RECOLECCION_MAQUINA_SIN_RESPUESTA);
    http.expectOne({ method: 'GET', url: '/api/fuentes' }).flush(FUENTES_TRAS_SIN_RESPUESTA);
    fixture.detectChanges();

    expect(texto('app-recoleccion-avance .cierre')).toBe('El lector no respondió en esta máquina.');
    expect(texto(`${tarjeta('LINKEDIN')} .restantes`)).toContain('Le queda 1 lectura hoy');
    expect(boton('.leer-maquina')!.disabled).toBe(false);
  });

  it('si la API rechaza abrir la corrida, no lanza el lector', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_CON_MAQUINA);
    boton('.leer-maquina')!.click();
    http.expectOne({ method: 'POST', url: '/api/recoleccion/maquina' }).flush(RECHAZO_SIN_MAQUINA, { status: 409, statusText: 'Conflict' });
    http.expectOne({ method: 'GET', url: '/api/recoleccion' }).flush(RECOLECCION_NINGUNA);
    fixture.detectChanges();
    expect(abiertos).toEqual([]);
  });

  it('LinkedIn dice que se lee desde tu máquina, su tope diario y por corrida, y no tiene botón Leer del servidor', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_CON_MAQUINA);
    expect(texto(`${tarjeta('LINKEDIN')} .via`)).toBe('Se lee desde tu máquina · Necesita tu sesión');
    expect(texto(`${tarjeta('LINKEDIN')} .conexion`)).toBe('Falta iniciar sesión');
    expect(texto(`${tarjeta('LINKEDIN')} .restantes`)).toContain('1 lectura al día · hasta 25 avisos por corrida');
    expect(pantalla().querySelector(`${tarjeta('LINKEDIN')} .leer`)).toBeNull();
    expect(pantalla().querySelector(`${tarjeta('REMOTIVE')} .leer`)).not.toBeNull();
  });

  it('pendiente de leer desde tu máquina, con la fecha de su última lectura', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_PENDIENTE_MAQUINA);
    expect(texto(`${tarjeta('LINKEDIN')} .conexion`)).toBe('Pendiente de leer desde tu máquina');
    expect(texto(`${tarjeta('LINKEDIN')} .fecha`)).toMatch(/^Última lectura: \d+\/\d+\/2026 \d{2}:\d{2}$/);
  });

  it('pausada por verificación, con su motivo y su botón para reanudar', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_PAUSADA_VERIFICACION);
    expect(texto(`${tarjeta('LINKEDIN')} .conexion`)).toBe('Pausada: el sitio pidió una verificación');
    expect(texto(`${tarjeta('LINKEDIN')} .pausa`)).toContain('Reanudar');
    expect(boton('.leer-maquina')!.disabled).toBe(true);
  });

  it('Bumeran se lee desde tu máquina sin necesitar nada, con 3 lecturas al día y sin botón Leer del servidor', () => {
    abrir(RECOLECCION_NINGUNA, FUENTES_CON_BUMERAN);
    expect(texto(`${tarjeta('BUMERAN')} .via`)).toBe('Se lee desde tu máquina · No necesita nada');
    expect(texto(`${tarjeta('BUMERAN')} .restantes`)).toContain('3 lecturas al día · hasta 25 avisos por corrida');
    expect(pantalla().querySelector(`${tarjeta('BUMERAN')} .leer`)).toBeNull();
    expect(boton('.leer-maquina')!.disabled).toBe(false);
  });

  it('la programada omite LinkedIn y lo dice', () => {
    abrir(RECOLECCION_PROGRAMADA_OMITE_MAQUINA, FUENTES_CON_MAQUINA);
    expect(texto('app-recoleccion-avance [data-fuente="LINKEDIN"][data-paso="OMITIDA"] .texto')).toBe('No leída: se lee desde tu máquina');
  });
});
