import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IConexion } from '../../../@data/interfaces/conexion';
import { IRecoleccion } from '../../../@data/interfaces/recoleccion';
import { Fuente } from '../../../@data/interfaces/oferta';
import { ConexionesPageComponent } from './conexiones-page.component';
import { ABRIR_ENLACE } from './recoleccion.store';
import { FUENTES_PAGO_SIN_CONFIGURAR } from './pago-de-prueba';
import { RECOLECCION_NINGUNA } from './recoleccion-de-prueba';

/** Contrato aditivo de las tres conexiones con clave compartida. */
describe('Lecturas de Apify desde el servidor', () => {
  let fixture: ComponentFixture<ConexionesPageComponent>;
  let http: HttpTestingController;
  let abiertos: string[];
  const pago = new Set(['LINKEDIN', 'BUMERAN', 'COMPUTRABAJO']);
  const conexiones = (configurada: boolean): IConexion[] => FUENTES_PAGO_SIN_CONFIGURAR.map((c) => pago.has(c.fuente) ? {
    ...c, via: 'PAGO', necesita: 'CLAVE', lecturasRestantes: 0, lecturasDia: 0, avisosPorCorrida: null,
    tieneLoQueNecesita: configurada, tieneClave: configurada, topeMensual: 1, consumoMes: 0,
    claveCargadaEn: configurada ? '2026-11-16T12:00:00Z' : null,
    estadoConexion: configurada ? 'LISTA' : 'FALTA_CONFIGURAR',
    queFalta: configurada ? null : 'falta la clave del servicio',
  } : c);
  const pantalla = (): HTMLElement => fixture.nativeElement;
  const tarjeta = (fuente: Fuente): HTMLElement => pantalla().querySelector(`app-fuentes-estado [data-fuente="${fuente}"]`)!;
  const texto = (): string => pantalla().textContent?.replace(/\s+/g, ' ') ?? '';

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
    abiertos = [];
    await TestBed.configureTestingModule({ imports: [ConexionesPageComponent], providers: [
      provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
      { provide: ABRIR_ENLACE, useValue: (url: string) => abiertos.push(url) },
    ] }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { fixture.destroy(); http.verify(); vi.useRealTimers(); });

  function abrir(configurada: boolean, avance: IRecoleccion = RECOLECCION_NINGUNA, fuentes = conexiones(configurada)): void {
    fixture = TestBed.createComponent(ConexionesPageComponent); fixture.detectChanges();
    http.expectOne('/api/fuentes').flush(fuentes);
    http.expectOne('/api/recoleccion').flush(avance); fixture.detectChanges();
  }

  it('sin clave muestra tres servicios de pago sin ofrecer sesión ni lector y no solicita lecturas', () => {
    abrir(false);
    for (const fuente of ['LINKEDIN','BUMERAN','COMPUTRABAJO'] as Fuente[]) {
      expect(tarjeta(fuente).textContent).toContain('Falta configurar');
      expect((tarjeta(fuente).querySelector('button.leer') as HTMLButtonElement).disabled).toBe(true);
    }
    expect(texto()).toContain('comparten una clave de Apify');
    expect(texto()).not.toMatch(/tu máquina|iniciar sesión|pendiente de leer/i);
    expect(pantalla().querySelector('button.leer-maquina')).toBeNull();
    http.expectNone((r) => r.method !== 'GET');
    expect(abiertos).toEqual([]);
  });

  for (const fuente of ['LINKEDIN','BUMERAN','COMPUTRABAJO'] as Fuente[]) {
    it(`guardar desde ${fuente} actualiza las tres tarjetas y limpia el campo`, () => {
      abrir(false);
      const campo = tarjeta(fuente).querySelector('input[type="password"]') as HTMLInputElement;
      campo.value = 'clave-ficticia'; campo.dispatchEvent(new Event('input')); fixture.detectChanges();
      (tarjeta(fuente).querySelector('button.guardar-clave') as HTMLButtonElement).click();
      const solicitud = http.expectOne({method:'PUT', url:`/api/fuentes/${fuente}/clave`});
      expect(solicitud.request.body).toEqual({clave:'clave-ficticia'});
      expect(campo.value).toBe('');
      solicitud.flush(conexiones(true).find((c) => c.fuente === fuente)!);
      http.expectOne('/api/fuentes').flush(conexiones(true)); fixture.detectChanges();
      expect(texto().match(/Tiene clave desde/g)).toHaveLength(3);
      expect(pantalla().innerHTML).not.toContain('clave-ficticia');
      expect(abiertos).toEqual([]);
    });
  }

  it('un resultado parcial conserva conteo y costo y muestra ámbito término y motivo', () => {
    abrir(true, { ...RECOLECCION_NINGUNA, estado:'TERMINADA', origen:'DEMANDA', total:1, terminadas:1,
      fuentes:[{fuente:'LINKEDIN',nombre:'LinkedIn',paso:'TERMINADA',resultado:'CORRECTA',ofertasLeidas:2,
        parcial:true,costoUsd:0.0054,detalle:'Remoto para Latinoamérica · programador: el servicio respondió HTTP 429'}],
    }, conexiones(true).map((c) => c.fuente === 'LINKEDIN' ? {
      ...c, estado:'CORRECTA', parcial:true,
      detalle:'Remoto para Latinoamérica: fallaron las 3 búsquedas: el servicio terminó con fallo',
    } : c));
    expect(texto()).toContain('Leída en parte: 2 ofertas');
    expect(tarjeta('LINKEDIN').querySelector('.estado')?.textContent?.trim()).toBe('Leída en parte');
    expect(tarjeta('LINKEDIN').querySelector('mat-icon.icono')?.getAttribute('fonticon')).toBe('warning');
    expect(pantalla().querySelector('app-recoleccion-avance mat-icon')?.getAttribute('fonticon')).toBe('warning');
    expect(texto()).toContain('0.0054');
    expect(texto()).toContain('Remoto para Latinoamérica · programador');
    expect(texto()).toContain('HTTP 429');
  });

  it('Leer todas conserva el rechazo por tope con ambos importes sin abrir el lector', () => {
    abrir(true);
    (pantalla().querySelector('button.leer-todas') as HTMLButtonElement).click();
    http.expectOne({method:'POST',url:'/api/recoleccion'}).flush({ ...RECOLECCION_NINGUNA, estado:'EN_CURSO', origen:'DEMANDA', total:5,
      omitidas:[{fuente:'LINKEDIN',nombre:'LinkedIn',motivo:'TOPE_MENSUAL',gastado:1,topeMensual:1}],
      fuentes:[{fuente:'BUMERAN',nombre:'Bumeran',paso:'PENDIENTE',resultado:null,ofertasLeidas:null}],
    }); fixture.detectChanges();
    expect(texto()).toContain('Gastado US$ 1.00 de US$ 1.00');
    expect(abiertos).toEqual([]);
  });
});
