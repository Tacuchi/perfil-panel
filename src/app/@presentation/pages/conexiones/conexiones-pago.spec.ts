import { FUENTES, dolares, etiqueta } from '../../../Utils/const';
import { RECOLECCION_PAGO_ACEPTADA, RECOLECCION_PAGO_TERMINADA } from './pago-de-prueba';
import { PantallaConexionesPrueba, conexionesDePrueba, prepararPantalla } from './pantalla-conexiones-prueba';

describe('Configuración de pago en diálogo', () => {
  let p: PantallaConexionesPrueba;
  afterEach(() => p?.cerrar());

  it('sin clave explica qué falta, bloquea Leer y abre una clave vacía de tipo password', async () => {
    p = await prepararPantalla(); await p.abrir('/conexiones/COMPUTRABAJO', conexionesDePrueba(false).map((c) => c.fuente === 'COMPUTRABAJO' ? {...c, topeMensual: null} : c));
    expect(p.boton('.leer', p.detalle).disabled).toBe(true);
    expect(p.texto('.conexion', p.detalle)).toContain('falta la clave');
    expect(p.texto('.via', p.detalle)).toBe('Se lee por un servicio de pago');
    expect(p.texto('.necesita', p.detalle)).toBe('Necesita una clave');
    expect(p.texto('.consumo', p.detalle)).toBe('US$ 0.00 · sin tope mensual');
    expect(p.texto('', p.detalle)).not.toContain('Sin configurar');
    expect(p.texto('.titulo')).toContain('Nada se lee solo');
    expect(p.texto('.titulo')).not.toMatch(/programad[ao]/i);
    expect(p.texto('', p.detalle)).not.toMatch(/programad[ao]/i);
    p.configurar();
    expect(p.texto('.clave', p.dialogo)).toBe('Sin clave');
    expect((p.dialogo.querySelector('input[type="password"]') as HTMLInputElement).value).toBe('');
  });

  it('clave en blanco y topes de cero o con más de dos decimales no se envían', async () => {
    p = await prepararPantalla(); await p.abrir('/conexiones/COMPUTRABAJO'); p.configurar();
    p.escribir('input[type="password"]', '   ');
    expect(p.boton('.guardar-clave', p.dialogo).disabled).toBe(true);
    for (const valor of ['0', '1.234']) {
      p.escribir('input[type="number"]', valor);
      expect(p.boton('.guardar-tope', p.dialogo).disabled).toBe(true);
    }
    p.http.expectNone((r) => r.method === 'PUT');
  });

  it('guardar tope cambia solo esa conexión y actualiza el detalle', async () => {
    p = await prepararPantalla();
    const fuentes = conexionesDePrueba();
    fuentes[5] = {...fuentes[5], topeMensual: null, estadoConexion: 'FALTA_CONFIGURAR', tieneLoQueNecesita: false, queFalta: 'falta el tope mensual'};
    await p.abrir('/conexiones/COMPUTRABAJO', fuentes);
    expect(p.boton('.leer', p.detalle).disabled).toBe(true);
    expect(p.texto('.conexion.aviso', p.detalle)).toContain('falta el tope mensual');
    p.configurar();
    p.escribir('input[type="number"]', '0.02'); p.boton('.guardar-tope', p.dialogo).click();
    const solicitud = p.http.expectOne({method: 'PUT', url: '/api/fuentes/COMPUTRABAJO/tope'});
    expect(solicitud.request.body).toEqual({topeMensual: 0.02});
    solicitud.flush({ ...conexionesDePrueba()[5], topeMensual: 0.02 }); p.refrescar();
    expect(p.texto('.consumo', p.detalle)).toBe(`${dolares(0)} de ${dolares(0.02)}`);
    expect(p.boton('.leer', p.detalle).disabled).toBe(false);
    expect(p.detalle.querySelector('.conexion.aviso')).toBeNull();
    p.http.expectNone('/api/fuentes');
  });

  it('en el tope del mes muestra consumo y deshabilita Leer', async () => {
    p = await prepararPantalla(); const fuentes = conexionesDePrueba();
    fuentes[5] = { ...fuentes[5], estadoConexion: 'TOPE_MENSUAL', consumoMes: 1 };
    await p.abrir('/conexiones/COMPUTRABAJO', fuentes);
    expect(p.texto('.conexion', p.detalle)).toBe('Llegó a su tope del mes');
    expect(p.texto('.consumo', p.detalle)).toBe(`${dolares(1)} de ${dolares(1)}`);
    expect(p.boton('.leer', p.detalle).disabled).toBe(true);
    expect(etiqueta(FUENTES, 'COMPUTRABAJO')).toBe('Computrabajo');
    expect(p.detalle.querySelector('.consumo-mes')?.classList).toContain('tope-alcanzado');
    expect(p.detalle.querySelector('mat-progress-bar')?.getAttribute('aria-valuenow')).toBe('100');
  });

  it('leer una conexión de pago recarga el consumo del mes y el historial en el detalle', async () => {
    p = await prepararPantalla(); await p.abrir('/conexiones/COMPUTRABAJO');
    p.boton('.leer', p.detalle).click();
    p.http.expectOne({method: 'POST', url: '/api/recoleccion/COMPUTRABAJO'}).flush(RECOLECCION_PAGO_ACEPTADA); p.refrescar();
    await new Promise((resolve) => setTimeout(resolve, 1050));
    p.http.expectOne('/api/recoleccion').flush(RECOLECCION_PAGO_TERMINADA);
    p.http.expectOne('/api/fuentes').flush(conexionesDePrueba().map((c) => c.fuente === 'COMPUTRABAJO' ? {...c, consumoMes: 0.0108, topeMensual: 2.5} : c));
    p.refrescar(); p.responderHistorialVacio();
    expect(p.texto('app-recoleccion-avance [data-fuente="COMPUTRABAJO"] .texto')).toBe('Leída: 5 ofertas');
    expect(p.texto('.consumo', p.detalle)).toBe('US$ 0.01 de US$ 2.50');
    expect(p.detalle.querySelector('mat-progress-bar')?.getAttribute('aria-valuenow')).toBe('0.432');
  });

  it('importes menores de un centavo conservan hasta cuatro decimales y el tope tiene barra de error', async () => {
    p = await prepararPantalla();
    const fuentes = conexionesDePrueba(); fuentes[5] = {...fuentes[5], consumoMes: 0.0015, topeMensual: 1};
    await p.abrir('/conexiones/COMPUTRABAJO', fuentes);
    expect(p.texto('.consumo', p.detalle)).toBe('US$ 0.0015 de US$ 1.00');
    p.boton('.configurar', p.detalle).click(); p.refrescar();
    expect(p.texto('', p.dialogo)).toContain('Configurar Computrabajo');
    expect(p.detalle.querySelector('header .acciones .configurar')).toBeTruthy();
    expect(p.detalle.querySelector('header .acciones .pausa')).toBeTruthy();
    expect(p.detalle.querySelector('header .acciones .leer')).toBeTruthy();
    expect(p.detalle.querySelectorAll('.datos dt')).toHaveLength(4);
  });
});
