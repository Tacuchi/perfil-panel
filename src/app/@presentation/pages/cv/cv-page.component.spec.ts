import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IProblema, IVersion } from '../../../@data/interfaces/version';
import {
  MSG_CARGA_ACEPTADA,
  MSG_ERROR_SERVIDOR,
  MSG_SESION_VENCIDA,
  MSG_VIGENTE_CAMBIADA,
} from '../../../Utils/const';
import { CvPageComponent } from './cv-page.component';

const VIGENTE: IVersion = { id: 'v2', fecha: '2026-11-15T10:00:00Z', conWord: true, vigente: true };
const ANTERIOR: IVersion = { id: 'v1', fecha: '2026-11-01T10:00:00Z', conWord: false, vigente: false };

/** Rechazos con el cuerpo exacto que devuelve perfil-api. */
const RECHAZOS: { caso: string; estado: number; problema: IProblema }[] = [
  { caso: 'PDF de otro tipo', estado: 415, problema: { status: 415, detail: 'El archivo principal no es un PDF.', campo: 'pdf', motivo: 'TIPO' } },
  { caso: 'PDF muy grande', estado: 413, problema: { status: 413, detail: 'El PDF supera el tamaño máximo de 10 MB.', campo: 'pdf', motivo: 'TAMANO' } },
  { caso: 'Word de otro tipo', estado: 415, problema: { status: 415, detail: 'El adjunto no es un documento de Word (.docx).', campo: 'word', motivo: 'TIPO' } },
  { caso: 'Word muy grande', estado: 413, problema: { status: 413, detail: 'El Word supera el tamaño máximo de 10 MB.', campo: 'word', motivo: 'TAMANO' } },
];

describe('CvPageComponent', () => {
  let fixture: ComponentFixture<CvPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CvPageComponent);
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

  async function responderHistorial(versiones: IVersion[]): Promise<void> {
    http.expectOne({ method: 'GET', url: '/api/versiones' }).flush(versiones);
    await estable();
  }

  function elegirArchivos(pdf: File | null, word: File | null = null): void {
    const formulario = fixture.componentInstance['formulario'];
    formulario.setValue({ pdf, word });
  }

  async function pulsarSubir(): Promise<void> {
    await estable();
    (pantalla().querySelector('button[type=submit]') as HTMLButtonElement).click();
  }

  it('muestra el historial con la vigente marcada y las descargas', async () => {
    await responderHistorial([VIGENTE, ANTERIOR]);

    const filas = pantalla().querySelectorAll('tr.mat-mdc-row');
    expect(filas).toHaveLength(2);
    expect(filas[0].classList).toContain('vigente');
    expect(filas[0].textContent).toContain('Vigente');
    expect(filas[0].querySelector('a[href="/api/versiones/v2/word"]')).not.toBeNull();
    expect(filas[1].querySelector('a[href="/api/versiones/v1/pdf"]')).not.toBeNull();
    expect(filas[1].querySelector('a[href="/api/versiones/v1/word"]')).toBeNull();
  });

  it('sin versiones lo dice en lugar de mostrar una tabla vacía', async () => {
    await responderHistorial([]);
    expect(pantalla().textContent).toContain('Todavía no hay versiones');
  });

  it('sin PDF elegido no deja subir', async () => {
    await responderHistorial([]);
    const boton = pantalla().querySelector('button[type=submit]') as HTMLButtonElement;
    expect(boton.disabled).toBe(true);
  });

  it('una carga aceptada envía PDF y Word, avisa y recarga el historial', async () => {
    await responderHistorial([]);
    elegirArchivos(new File(['%PDF-1.7'], 'cv.pdf'), new File(['PK'], 'cv.docx'));
    await pulsarSubir();

    const carga = http.expectOne({ method: 'POST', url: '/api/versiones' });
    const cuerpo = carga.request.body as FormData;
    expect((cuerpo.get('pdf') as File).name).toBe('cv.pdf');
    expect((cuerpo.get('word') as File).name).toBe('cv.docx');
    carga.flush(VIGENTE, { status: 201, statusText: 'Created' });
    await responderHistorial([VIGENTE]);

    expect(aviso()).toContain(MSG_CARGA_ACEPTADA);
    expect(fixture.componentInstance['formulario'].value.pdf).toBeNull();
  });

  it('una carga sin Word no manda la parte word', async () => {
    await responderHistorial([]);
    elegirArchivos(new File(['%PDF-1.7'], 'cv.pdf'));
    await pulsarSubir();

    const carga = http.expectOne({ method: 'POST', url: '/api/versiones' });
    expect((carga.request.body as FormData).has('word')).toBe(false);
    carga.flush(VIGENTE, { status: 201, statusText: 'Created' });
    await responderHistorial([VIGENTE]);
  });

  for (const { caso, estado, problema } of RECHAZOS) {
    it(`un rechazo por ${caso} muestra su causa y conserva lo elegido`, async () => {
      await responderHistorial([]);
      elegirArchivos(new File(['x'], 'cv.pdf'), new File(['x'], 'cv.docx'));
      await pulsarSubir();

      http.expectOne({ method: 'POST', url: '/api/versiones' })
        .flush(problema, { status: estado, statusText: 'Rechazado' });
      await estable();

      expect(aviso()).toContain(problema.detail);
      expect(fixture.componentInstance['formulario'].value.pdf?.name).toBe('cv.pdf');
    });
  }

  it('con la sesión vencida pide recargar', async () => {
    await responderHistorial([]);
    elegirArchivos(new File(['%PDF-1.7'], 'cv.pdf'));
    await pulsarSubir();

    http.expectOne({ method: 'POST', url: '/api/versiones' }).flush(null, { status: 401, statusText: 'Unauthorized' });
    await estable();

    expect(aviso()).toContain(MSG_SESION_VENCIDA);
    expect(aviso()).toContain('Recargar');
  });

  it('un fallo del servidor muestra un mensaje genérico, sin el detalle interno', async () => {
    http.expectOne({ method: 'GET', url: '/api/versiones' })
      .flush({ status: 500, detail: 'Ocurrió un error inesperado. Inténtalo de nuevo.' }, { status: 500, statusText: 'Error' });
    await estable();

    expect(aviso()).toContain(MSG_ERROR_SERVIDOR);
  });

  it('dejar vigente una anterior la manda a la API, avisa y recarga', async () => {
    await responderHistorial([VIGENTE, ANTERIOR]);
    (pantalla().querySelectorAll('tr.mat-mdc-row')[1].querySelector('button') as HTMLButtonElement).click();

    const peticion = http.expectOne({ method: 'PUT', url: '/api/vigente' });
    expect(peticion.request.body).toEqual({ version: 'v1' });
    peticion.flush({ ...ANTERIOR, vigente: true });
    await responderHistorial([{ ...ANTERIOR, vigente: true }, { ...VIGENTE, vigente: false }]);

    expect(aviso()).toContain(MSG_VIGENTE_CAMBIADA);
  });
});
