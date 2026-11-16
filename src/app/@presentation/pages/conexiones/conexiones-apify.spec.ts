import { Fuente } from '../../../@data/interfaces/oferta';
import { ConexionesStore } from './conexiones.store';
import { RECOLECCION_NINGUNA } from './recoleccion-de-prueba';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { PantallaConexionesPrueba, conexionesDePrueba, prepararPantalla } from './pantalla-conexiones-prueba';

describe('Clave compartida de Apify', () => {
  let p: PantallaConexionesPrueba;
  afterEach(() => p?.cerrar());

  for (const fuente of ['LINKEDIN', 'BUMERAN', 'COMPUTRABAJO'] as Fuente[]) {
    it(`guardar desde ${fuente} limpia la clave y recarga las tres conexiones`, async () => {
      p = await prepararPantalla(); await p.abrir(`/conexiones/${fuente}`, conexionesDePrueba(false));
      if (fuente === 'LINKEDIN') {
        p.boton('.completar-configuracion', p.detalle).click(); p.refrescar();
      } else { p.configurar(); }
      expect(p.texto('', p.dialogo)).toContain('Clave compartida de Apify para Computrabajo, LinkedIn y Bumeran');
      const campo = p.escribir('input[type="password"]', 'clave-ficticia');
      p.boton('.guardar-clave', p.dialogo).click(); p.refrescar();
      expect(campo.value).toBe('');
      const solicitud = p.http.expectOne({method: 'PUT', url: `/api/fuentes/${fuente}/clave`});
      expect(solicitud.request.body).toEqual({clave: 'clave-ficticia'});
      solicitud.flush(conexionesDePrueba().find((c) => c.fuente === fuente) ?? null);
      p.http.expectOne('/api/fuentes').flush(conexionesDePrueba()); p.refrescar();
      expect(TestBed.inject(ConexionesStore).conexiones().filter((c) => c.via === 'PAGO').every((c) => c.tieneClave)).toBe(true);
      expect(p.texto('.clave', p.dialogo)).toContain('Tiene clave desde 16/11/2026');
      expect(p.dialogo.innerHTML).not.toContain('clave-ficticia');
      expect(campo.getAttribute('aria-invalid')).not.toBe('true');
      expect(p.detalle.querySelector('.conexion.aviso')).toBeNull();
      expect(p.texto('mat-label', p.dialogo)).toBe('Reemplazar la clave');
      expect(p.dialogo.querySelector('mat-form-field')?.classList).not.toContain('mat-form-field-invalid');
      if (fuente === 'LINKEDIN') {
        const dialogo = TestBed.inject(MatDialog).openDialogs[0];
        const cerrado = firstValueFrom(dialogo.afterClosed());
        dialogo.close(); await cerrado; p.refrescar();
        expect(document.activeElement).toBe(p.boton('.configurar', p.detalle));
      }
    });
  }

  it('un resultado parcial mantiene el texto y el icono de advertencia', async () => {
    p = await prepararPantalla(); const fuentes = conexionesDePrueba();
    fuentes[3] = { ...fuentes[3], estado: 'CORRECTA', parcial: true, detalle: 'Remoto para Latinoamérica: HTTP 429' };
    await p.abrir('/conexiones/LINKEDIN', fuentes, {...RECOLECCION_NINGUNA, estado: 'TERMINADA', origen: 'DEMANDA', total: 1, terminadas: 1,
      fuentes: [{fuente: 'LINKEDIN', nombre: 'LinkedIn', paso: 'TERMINADA', resultado: 'CORRECTA', ofertasLeidas: 2, parcial: true, costoUsd: 0.0054, detalle: 'Remoto para Latinoamérica · programador: HTTP 429'}]});
    expect(p.texto('.estado', p.detalle)).toContain('Leída en parte');
    expect(p.detalle.querySelector('mat-icon.icono')?.getAttribute('fonticon')).toBe('warning');
    expect(p.texto('nav a[data-fuente="LINKEDIN"]')).toContain('Leída en parte');
    expect(p.texto('.motivo', p.detalle)).toContain('HTTP 429');
    expect(p.detalle.querySelector('.motivo')?.classList).toContain('advertencia');
    expect(p.texto('app-recoleccion-avance .texto')).toBe('Leída en parte: 2 ofertas');
    expect(p.texto('app-recoleccion-avance .costo')).toBe('Costo: US$ 0.0054');
    expect(p.texto('app-recoleccion-avance .detalle')).toContain('Remoto para Latinoamérica · programador: HTTP 429');
    expect(p.elemento.querySelector('button.leer-maquina')).toBeNull();
  });

  it('sin clave las tres de pago aparecen sin configurar y entrar no pide lecturas ni abre el lector', async () => {
    p = await prepararPantalla();
    await p.abrir('/conexiones', conexionesDePrueba(false));
    for (const fuente of ['LINKEDIN', 'BUMERAN', 'COMPUTRABAJO']) {
      expect(p.texto(`nav a[data-fuente="${fuente}"]`)).toContain('Falta configurar');
      await p.navegar(`/conexiones/${fuente}`);
      expect(p.boton('.leer', p.detalle).disabled).toBe(true);
      expect(p.texto('', p.detalle)).not.toMatch(/tu máquina|iniciar sesión|pendiente de leer/i);
      expect(p.texto('.conexion.aviso', p.detalle)).toContain('Falta configurar: falta la clave del servicio');
      expect(p.detalle.querySelectorAll('.conexion.aviso')).toHaveLength(1);
    }
    p.http.expectNone((r) => r.method !== 'GET');
    p.http.expectNone('/api/recoleccion/maquina');
    expect(p.abrirEnlace).not.toHaveBeenCalled();
  });

  it('Leer todas conserva el tope omitido con gastado y tope al terminar y no abre el lector', async () => {
    p = await prepararPantalla(); await p.abrir('/conexiones/COMPUTRABAJO');
    p.boton('.leer-todas').click();
    const omitidas = [{fuente: 'LINKEDIN', nombre: 'LinkedIn', motivo: 'TOPE_MENSUAL', gastado: 1, topeMensual: 1}];
    p.http.expectOne('/api/recoleccion').flush({...RECOLECCION_NINGUNA, estado: 'EN_CURSO', origen: 'DEMANDA', inicio: '2026-11-16T12:00:00Z', total: 1,
      omitidas, fuentes: [{fuente: 'COMPUTRABAJO', nombre: 'Computrabajo', paso: 'PENDIENTE', resultado: null, ofertasLeidas: null}]}); p.refrescar();
    expect(p.texto('app-recoleccion-avance [data-fuente="LINKEDIN"] .texto')).toBe('No leída: llegó a su tope del mes · Gastado US$ 1.00 de US$ 1.00');
    await new Promise((resolve) => setTimeout(resolve, 1050));
    p.http.expectOne('/api/recoleccion').flush({...RECOLECCION_NINGUNA, estado: 'TERMINADA', origen: 'DEMANDA', inicio: '2026-11-16T12:00:00Z', total: 1, terminadas: 1,
      omitidas, fuentes: [{fuente: 'COMPUTRABAJO', nombre: 'Computrabajo', paso: 'TERMINADA', resultado: 'CORRECTA', ofertasLeidas: 5, costoUsd: 0.016}]});
    p.http.expectOne('/api/fuentes').flush(conexionesDePrueba()); p.refrescar(); p.responderHistorialVacio();
    expect(p.texto('app-recoleccion-avance [data-fuente="LINKEDIN"] .texto')).toContain('Gastado US$ 1.00 de US$ 1.00');
    expect(p.texto('app-recoleccion-avance [data-fuente="COMPUTRABAJO"] .costo')).toBe('Costo: US$ 0.016');
    p.http.expectNone('/api/recoleccion/maquina');
    expect(p.abrirEnlace).not.toHaveBeenCalled();
  });
});
