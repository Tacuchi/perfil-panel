import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConexionesHistorialComponent } from './conexiones-historial.component';
import { RecoleccionStore } from './recoleccion.store';
import { RECOLECCION_GENERAL_A_MITAD, RECOLECCION_GENERAL_ACEPTADA, RECOLECCION_TERMINADA_FALLO_BLOQUEO } from './recoleccion-de-prueba';
import { ILecturaHistorial } from '../../../@data/interfaces/historial-lecturas';

const lectura = (id: number, parcial = false): ILecturaHistorial => ({id, inicio: `2026-11-16T10:00:00Z`, estado: parcial ? 'CORRECTA' : 'FALLO', parcial, leidas: parcial ? 12 : 0, nuevas: parcial ? 3 : 0, costoUsd: 0.0015, duracionMs: 8000, motivo: parcial ? 'Una búsqueda no respondió' : 'La lectura no trajo respuestas'});

describe('Historial en el detalle', () => {
  let fixture: ComponentFixture<ConexionesHistorialComponent>;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [ConexionesHistorialComponent], providers: [provideHttpClient(), provideHttpClientTesting()]}).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ConexionesHistorialComponent);
    fixture.componentRef.setInput('fuente', 'LINKEDIN');
    fixture.componentRef.setInput('dePago', true);
    fixture.detectChanges();
  });
  afterEach(() => { fixture.destroy(); http.verify(); });
  const elemento = (): HTMLElement => fixture.nativeElement;
  const responder = (lecturas: ILecturaHistorial[], hayMas = false) => { http.expectOne('/api/fuentes/LINKEDIN/historial').flush({lecturas, hayMas}); fixture.detectChanges(); };

  it('muestra tabla y lista con datos, motivo debajo, y costo solo en las de pago', () => {
    responder([lectura(2), lectura(1, true)]);
    expect(elemento().querySelectorAll('table tr.mat-mdc-row')).toHaveLength(4);
    expect(elemento().querySelectorAll('.apilada li')).toHaveLength(2);
    const texto = elemento().textContent ?? '';
    for (const dato of ['Falló', 'Leída en parte', 'La lectura no trajo respuestas', 'Una búsqueda no respondió', '0.0015', '8 s', 'Leídas', 'Nuevas']) expect(texto).toContain(dato);
    fixture.componentRef.setInput('dePago', false); fixture.detectChanges();
    expect(elemento().textContent).not.toContain('US$');
    expect(elemento().textContent).not.toContain('0.0015');
  });

  it('Ver más usa el cursor, agrega anteriores sin duplicar y desaparece al terminar', () => {
    responder([lectura(3), lectura(2)], true);
    (elemento().querySelector('.ver-mas') as HTMLButtonElement).click();
    http.expectOne('/api/fuentes/LINKEDIN/historial?antesDe=2').flush({lecturas: [lectura(2), lectura(1)], hayMas: false}); fixture.detectChanges();
    expect(elemento().querySelectorAll('.apilada li')).toHaveLength(3);
    expect(elemento().querySelector('.ver-mas')).toBeNull();
  });

  it('sin lecturas dice que aún no hay y no muestra tabla', () => {
    responder([]); expect(elemento().textContent).toContain('Todavía no hay lecturas');
    expect(elemento().querySelector('table')).toBeNull();
    expect(elemento().querySelector('.resumen')).toBeNull();
  });

  it('un error no se muestra como historial vacío', () => {
    http.expectOne('/api/fuentes/LINKEDIN/historial').flush({}, {status: 500, statusText: 'Error'}); fixture.detectChanges();
    expect(elemento().textContent).toContain('No se pudo cargar el historial');
    expect(elemento().textContent).not.toContain('Todavía no hay lecturas');
  });

  it('cambiar de conexión cancela la respuesta anterior y limpia las lecturas', () => {
    const anterior = http.expectOne('/api/fuentes/LINKEDIN/historial');
    fixture.componentRef.setInput('fuente', 'BUMERAN'); fixture.detectChanges();
    expect(anterior.cancelled).toBe(true);
    http.expectOne('/api/fuentes/BUMERAN/historial').flush({lecturas: [], hayMas: false}); fixture.detectChanges();
    expect(elemento().textContent).toContain('Todavía no hay lecturas');
  });

  it('al terminar una conexión dentro de Leer todas recarga desde el avance sin recargar la página', () => {
    vi.useFakeTimers();
    try {
      responder([lectura(1)]);
      fixture.componentRef.setInput('fuente', 'GET_ON_BOARD'); fixture.detectChanges();
      http.expectOne('/api/fuentes/GET_ON_BOARD/historial').flush({lecturas: [], hayMas: false}); fixture.detectChanges();
      const recoleccion = TestBed.inject(RecoleccionStore);
      recoleccion.entrar(); http.expectOne('/api/recoleccion').flush(RECOLECCION_GENERAL_ACEPTADA);
      vi.advanceTimersByTime(1000);
      http.expectOne('/api/recoleccion').flush(RECOLECCION_GENERAL_A_MITAD);
      http.expectOne('/api/fuentes').flush([]); fixture.detectChanges();
      http.expectOne('/api/fuentes/GET_ON_BOARD/historial').flush({lecturas: [lectura(2, true)], hayMas: false}); fixture.detectChanges();
      expect(elemento().querySelectorAll('.apilada li')).toHaveLength(1);
      vi.advanceTimersByTime(1000);
      http.expectOne('/api/recoleccion').flush({ ...RECOLECCION_TERMINADA_FALLO_BLOQUEO, inicio: RECOLECCION_GENERAL_ACEPTADA.inicio });
      http.expectOne('/api/fuentes').flush([]); fixture.detectChanges();
      http.expectNone('/api/fuentes/GET_ON_BOARD/historial');
      recoleccion.salir();
    } finally { vi.useRealTimers(); }
  });

  it('cada resultado lleva icono y la separación queda después del motivo', () => {
    responder([lectura(2), lectura(1, true)]);
    expect(elemento().querySelector('table .resultado mat-icon')?.getAttribute('fonticon')).toBe('error');
    expect(elemento().querySelectorAll('tr.con-motivo')).toHaveLength(2);
    expect(elemento().querySelectorAll('.fila-motivo')).toHaveLength(2);
    expect(elemento().querySelector('.apilada .resultado mat-icon')?.getAttribute('fonticon')).toBe('error');
    expect(elemento().querySelector('th.mat-column-costo')?.textContent).toBe('Costo US$');
    expect(elemento().querySelector('.resumen')?.textContent).toContain('2 lecturas · última correcta');
  });

  for (const [duracionMs, texto] of [[0, '<1 s'], [200, '<1 s'], [999, '<1 s'], [1000, '1 s'], [59000, '59 s'], [65000, '1 min 5 s']] as const) {
    it(`presenta una duración de ${duracionMs} ms como ${texto}`, () => {
      responder([{...lectura(1), duracionMs}]);
      expect(elemento().querySelector('td.mat-column-duracion')?.textContent?.trim()).toBe(texto);
      expect(elemento().querySelector('.apilada li')?.textContent).toContain(texto);
    });
  }
});
