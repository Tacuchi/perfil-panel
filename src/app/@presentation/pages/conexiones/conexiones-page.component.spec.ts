import { PantallaConexionesPrueba, conexionesDePrueba, prepararPantalla } from './pantalla-conexiones-prueba';
import { RECHAZO_EN_CURSO, RECOLECCION_GENERAL_ACEPTADA, RECOLECCION_GENERAL_A_MITAD, RECOLECCION_UNA_FUENTE_ACEPTADA, RECOLECCION_TERMINADA_FALLO_BLOQUEO, RECHAZO_PAUSADA } from './recoleccion-de-prueba';

describe('Lista y detalle de conexiones', () => {
  let p: PantallaConexionesPrueba;
  afterEach(() => p?.cerrar());

  it('muestra seis enlaces con resultado y marca de pausa o configuración pendiente', async () => {
    p = await prepararPantalla();
    const fuentes = conexionesDePrueba(false);
    fuentes[1] = { ...fuentes[1], pausada: true, estadoConexion: 'PAUSADA' };
    await p.abrir('/conexiones', fuentes);
    expect(p.elemento.querySelectorAll('nav a')).toHaveLength(6);
    expect(p.texto('nav')).toContain('Sin leer todavía');
    expect(p.texto('nav')).toContain('Pausada');
    expect(p.texto('nav')).toContain('Falta configurar');
    expect(p.elemento.querySelector('app-conexion-detalle')).toBeNull();
  });

  it('en escritorio elige la primera con problema y anuncia el enlace elegido', async () => {
    p = await prepararPantalla(false);
    const fuentes = conexionesDePrueba();
    fuentes[3] = { ...fuentes[3], estado: 'FALLO', detalle: 'La lectura no trajo respuestas' };
    await p.abrir('/conexiones', fuentes);
    expect(p.router.url).toBe('/conexiones/LINKEDIN');
    expect(p.texto('h3')).toBe('LinkedIn');
    expect(p.elemento.querySelector('nav a[aria-current="page"]')?.textContent).toContain('LinkedIn');
    expect(p.texto('.estado', p.detalle)).toContain('Falló');
    expect(p.texto('.motivo', p.detalle)).toContain('no trajo respuestas');
  });

  it('sin problemas elige la primera en escritorio', async () => {
    p = await prepararPantalla(false); await p.abrir('/conexiones');
    expect(p.router.url).toBe('/conexiones/GET_ON_BOARD');
  });

  it('la ruta conserva Bumeran al volver a entrar y en teléfono permite volver a la lista', async () => {
    p = await prepararPantalla(); await p.abrir('/conexiones/BUMERAN');
    expect(p.texto('h3')).toBe('Bumeran');
    expect(p.elemento.querySelector('.lista-detalle')?.classList).toContain('con-detalle');
    p.boton('.volver').click(); await p.harness.fixture.whenStable(); p.refrescar();
    expect(p.router.url).toBe('/conexiones');
    expect(p.elemento.querySelector('.lista-detalle')?.classList).not.toContain('con-detalle');
    await p.navegar('/conexiones/BUMERAN');
    expect(p.texto('h3')).toBe('Bumeran');
    expect(p.boton('.leer-todas')).toBeTruthy();
  });

  it('en escritorio un enlace directo conserva la conexión aunque otra tenga problema', async () => {
    p = await prepararPantalla(false);
    const fuentes = conexionesDePrueba();
    fuentes[0] = { ...fuentes[0], estado: 'FALLO' };
    await p.abrir('/conexiones/BUMERAN', fuentes);
    expect(p.router.url).toBe('/conexiones/BUMERAN');
    expect(p.texto('h3')).toBe('Bumeran');
  });

  it('detalle gratis conserva lecturas restantes, lectura individual y pausa/reanudación', async () => {
    p = await prepararPantalla(); await p.abrir();
    expect(p.texto('.restantes')).toBe('Le quedan 3 lecturas hoy');
    expect(p.elemento.querySelector('.configurar')).toBeNull();
    expect(p.texto('.via')).toBe('Se lee desde el servidor');
    expect(p.texto('.necesita')).toBe('No necesita nada');
    const pausada = { ...conexionesDePrueba()[1], pausada: true, estadoConexion: 'PAUSADA' };
    p.boton('.pausa', p.detalle).click(); p.http.expectOne('/api/fuentes/REMOTIVE/pausar').flush(pausada); p.refrescar();
    expect(p.boton('.leer', p.detalle).disabled).toBe(true);
    expect(p.texto('.conexion', p.detalle)).toBe('Pausada');
    p.boton('.pausa', p.detalle).click(); p.http.expectOne('/api/fuentes/REMOTIVE/reanudar').flush(conexionesDePrueba()[1]); p.refrescar();
    expect(p.boton('.leer', p.detalle).disabled).toBe(false);
    p.boton('.leer', p.detalle).click();
    const solicitud = p.http.expectOne({ method: 'POST', url: '/api/recoleccion/REMOTIVE' });
    expect(solicitud.request.body).toBeNull(); solicitud.flush(RECOLECCION_UNA_FUENTE_ACEPTADA); p.refrescar();
    expect(p.boton('.leer', p.detalle).disabled).toBe(true);
    expect(p.boton('.leer-todas').disabled).toBe(true);
    expect(p.texto('app-recoleccion-avance .titulo')).toContain('0 de 1 fuentes');
    expect(p.elemento.querySelectorAll('app-recoleccion-avance .paso')).toHaveLength(1);
    expect(p.texto('app-recoleccion-avance .texto')).toBe('Pendiente');
  });

  it('una bloqueada conserva fecha correcta y motivo sin teñir toda la fila', async () => {
    p = await prepararPantalla(); const fuentes = conexionesDePrueba();
    fuentes[2] = { ...fuentes[2], estado: 'BLOQUEO', ultimaCorrecta: '2026-11-14T12:00:00Z', detalle: 'HTTP 403' };
    await p.abrir('/conexiones/REMOTE_OK', fuentes);
    expect(p.texto('.estado', p.detalle)).toContain('Bloqueada');
    expect(p.texto('.fecha', p.detalle)).toContain('14/11/2026');
    expect(p.texto('.motivo', p.detalle)).toBe('HTTP 403');
  });

  it('en el tope diario bloquea Leer y si todas llegaron bloquea Leer todas', async () => {
    p = await prepararPantalla(); const fuentes = conexionesDePrueba(false).map((c) => ({ ...c, lecturasRestantes: 0 }));
    await p.abrir('/conexiones/REMOTIVE', fuentes);
    expect(p.boton('.leer', p.detalle).disabled).toBe(true);
    expect(p.boton('.leer-todas').disabled).toBe(true);
    expect(p.texto('.restantes')).toContain('Llegó a su tope');
    expect(p.texto('.motivo')).toContain('Todas las fuentes llegaron');
  });

  it('la recolección general y su avance quedan sobre lista y detalle y muestran las omitidas', async () => {
    p = await prepararPantalla(); await p.abrir();
    p.boton('.leer-todas').click();
    const solicitud = p.http.expectOne({method: 'POST', url: '/api/recoleccion'});
    expect(solicitud.request.body).toBeNull();
    solicitud.flush({ ...RECOLECCION_GENERAL_ACEPTADA, omitidas: [{ fuente: 'LINKEDIN', nombre: 'LinkedIn', motivo: 'TOPE_MENSUAL', gastado: 1, topeMensual: 1 }] });
    p.refrescar(); expect(p.texto('app-recoleccion-avance')).toContain('Gastado US$ 1.00 de US$ 1.00');
    expect(p.elemento.querySelector('app-recoleccion-avance mat-progress-bar')?.getAttribute('aria-valuenow')).toBe('0');
    expect(p.texto('app-recoleccion-avance .titulo')).toContain('0 de 3 fuentes');
    expect(p.elemento.querySelectorAll('app-recoleccion-avance [data-paso="PENDIENTE"]')).toHaveLength(3);
    await p.navegar('/conexiones'); expect(p.elemento.querySelector('app-recoleccion-avance')).toBeTruthy();
  });

  it('rechazo de lectura muestra el motivo y recupera el avance sin lanzar el lector', async () => {
    p = await prepararPantalla(); await p.abrir();
    p.boton('.leer', p.detalle).click();
    p.http.expectOne('/api/recoleccion/REMOTIVE').flush(RECHAZO_EN_CURSO, { status: 409, statusText: 'Conflict' });
    p.http.expectOne('/api/recoleccion').flush(RECOLECCION_GENERAL_ACEPTADA); p.refrescar();
    expect(document.querySelector('.cdk-overlay-container')?.textContent).toContain(RECHAZO_EN_CURSO.detail);
    expect(p.texto('.motivo')).toContain('Hay una recolección en curso');
  });

  it('muestra Leyendo en fila y detalle y detiene consultas al salir', async () => {
    p = await prepararPantalla(); await p.abrir('/conexiones/REMOTIVE', conexionesDePrueba(), RECOLECCION_GENERAL_A_MITAD);
    expect(p.texto('.estado', p.detalle)).toContain('Leyendo');
    expect(p.texto('nav a[data-fuente="REMOTIVE"]')).toContain('Leyendo');
    expect(p.boton('.leer', p.detalle).disabled).toBe(true);
    expect(p.boton('.leer-todas').disabled).toBe(true);
    expect(p.texto('.conexiones > .motivo')).toBe('Hay una recolección en curso. Espera a que termine para lanzar otra.');
    p.harness.fixture.destroy();
    await new Promise((resolve) => setTimeout(resolve, 1100));
    p.http.expectNone('/api/recoleccion');
  });

  it('el avance sigue cada fuente, termina con sus resultados y recarga los saldos del detalle', async () => {
    p = await prepararPantalla(); await p.abrir('/conexiones/REMOTIVE', conexionesDePrueba(), RECOLECCION_GENERAL_A_MITAD);
    expect(p.texto('app-recoleccion-avance .titulo')).toContain('1 de 3 fuentes');
    expect(p.elemento.querySelector('app-recoleccion-avance mat-progress-bar')?.getAttribute('aria-valuenow')).toBe('33');
    expect(p.texto('app-recoleccion-avance [data-fuente="GET_ON_BOARD"] .texto')).toBe('Leída: 6 ofertas');
    expect(p.texto('app-recoleccion-avance [data-fuente="REMOTIVE"] .texto')).toBe('Leyendo…');
    expect(p.texto('app-recoleccion-avance [data-fuente="REMOTE_OK"] .texto')).toBe('Pendiente');
    await new Promise((resolve) => setTimeout(resolve, 1050));
    p.http.expectOne('/api/recoleccion').flush({ ...RECOLECCION_TERMINADA_FALLO_BLOQUEO, inicio: RECOLECCION_GENERAL_A_MITAD.inicio });
    p.http.expectOne('/api/fuentes').flush(conexionesDePrueba().map((c) => ({...c, lecturasRestantes: 0})));
    p.refrescar(); p.responderHistorialVacio();
    expect(p.texto('app-recoleccion-avance .titulo')).toContain('Última recolección a demanda, terminada el');
    expect(p.elemento.querySelector('app-recoleccion-avance mat-progress-bar')?.getAttribute('aria-valuenow')).toBe('100');
    expect(p.texto('app-recoleccion-avance [data-fuente="REMOTIVE"] .texto')).toBe('Falló');
    expect(p.texto('app-recoleccion-avance [data-fuente="REMOTE_OK"] .texto')).toBe('Bloqueada');
    expect(p.texto('.restantes', p.detalle)).toBe('Llegó a su tope de lecturas de hoy.');
    expect(p.elemento.querySelector('app-recoleccion-avance')?.classList).not.toContain('solo-lista');
  });

  it('el tope de una fuente no bloquea a otra que aún tiene lecturas', async () => {
    p = await prepararPantalla(); const fuentes = conexionesDePrueba(); fuentes[1] = {...fuentes[1], lecturasRestantes: 0};
    await p.abrir('/conexiones/REMOTIVE', fuentes);
    expect(p.boton('.leer', p.detalle).disabled).toBe(true);
    expect(p.boton('.leer-todas').disabled).toBe(false);
    await p.navegar('/conexiones/REMOTE_OK');
    expect(p.texto('.restantes', p.detalle)).toBe('Le quedan 3 lecturas hoy');
    expect(p.boton('.leer', p.detalle).disabled).toBe(false);
  });

  for (const [motivo, texto] of [['TOPE_DIARIO', 'No leída: llegó a su tope de lecturas de hoy'], ['PAUSADA', 'No leída: está pausada']] as const) {
    it(`Leer todas conserva la omitida por ${motivo} y su motivo`, async () => {
      p = await prepararPantalla(); await p.abrir(); p.boton('.leer-todas').click();
      p.http.expectOne('/api/recoleccion').flush({...RECOLECCION_GENERAL_ACEPTADA, total: 2,
        fuentes: RECOLECCION_GENERAL_ACEPTADA.fuentes.filter((f) => f.fuente !== 'REMOTIVE'),
        omitidas: [{fuente: 'REMOTIVE', nombre: 'Remotive', motivo}]}); p.refrescar();
      expect(p.texto('app-recoleccion-avance .titulo')).toContain('0 de 2 fuentes');
      expect(p.texto('app-recoleccion-avance [data-paso="OMITIDA"] .nombre')).toBe('Remotive');
      expect(p.texto('app-recoleccion-avance [data-paso="OMITIDA"] .texto')).toBe(texto);
    });
  }

  it('si la API rechaza leer una pausada recupera el avance y muestra el motivo', async () => {
    p = await prepararPantalla(); await p.abrir(); p.boton('.leer', p.detalle).click();
    p.http.expectOne('/api/recoleccion/REMOTIVE').flush(RECHAZO_PAUSADA, {status: 409, statusText: 'Conflict'});
    p.http.expectOne('/api/recoleccion').flush({ ...RECOLECCION_GENERAL_ACEPTADA, estado: 'NINGUNA', fuentes: [], total: 0 }); p.refrescar();
    expect(document.querySelector('.cdk-overlay-container')?.textContent).toContain(RECHAZO_PAUSADA.detail);
  });

  it('sin ninguna conexión leíble desactiva Leer todas y explica por qué', async () => {
    p = await prepararPantalla(); await p.abrir('/conexiones', conexionesDePrueba().map((c) => ({...c, pausada: true, estadoConexion: 'PAUSADA'})));
    expect(p.boton('.leer-todas').disabled).toBe(true);
    expect(p.texto('.conexiones > .motivo')).toBe('Ninguna conexión se puede leer ahora: están pausadas o llegaron a su tope de hoy.');
  });

  it('en teléfono un avance histórico queda reservado para la lista', async () => {
    p = await prepararPantalla(); await p.abrir('/conexiones/REMOTIVE', conexionesDePrueba(), RECOLECCION_TERMINADA_FALLO_BLOQUEO);
    expect(p.elemento.querySelector('app-recoleccion-avance')?.classList).toContain('solo-lista');
    expect(p.elemento.querySelector('section.conexiones')?.classList).toContain('con-detalle');
    expect(p.elemento.querySelector('section.conexiones')?.firstElementChild).toBe(p.boton('.volver'));
  });
});
