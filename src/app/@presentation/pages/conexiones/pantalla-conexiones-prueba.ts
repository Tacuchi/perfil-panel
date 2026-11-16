import { vi } from 'vitest';
import { BreakpointObserver } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialog } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { IConexion } from '../../../@data/interfaces/conexion';
import { IRecoleccion } from '../../../@data/interfaces/recoleccion';
import { ConexionesPageComponent } from './conexiones-page.component';
import { ConexionDetalleComponent } from './conexion-detalle.component';
import { RECOLECCION_NINGUNA } from './recoleccion-de-prueba';
import { ABRIR_ENLACE } from './recoleccion.store';
import { FUENTES_PAGO_SIN_CONFIGURAR } from './pago-de-prueba';

export function conexionesDePrueba(configurada = true): IConexion[] {
  return FUENTES_PAGO_SIN_CONFIGURAR.map((c): IConexion => ['LINKEDIN', 'BUMERAN', 'COMPUTRABAJO'].includes(c.fuente) ? {
    ...c, via: 'PAGO', necesita: 'CLAVE', lecturasRestantes: 0, lecturasDia: 0, avisosPorCorrida: null,
    tieneLoQueNecesita: configurada, tieneClave: configurada, topeMensual: 1, consumoMes: 0,
    claveCargadaEn: configurada ? '2026-11-16T12:00:00Z' : null,
    estadoConexion: configurada ? 'LISTA' : 'FALTA_CONFIGURAR',
    queFalta: configurada ? null : 'falta la clave del servicio',
  } : c);
}

export class PantallaConexionesPrueba {
  readonly http = TestBed.inject(HttpTestingController);
  readonly abrirEnlace = TestBed.inject(ABRIR_ENLACE);
  readonly router = TestBed.inject(Router);
  harness!: RouterTestingHarness;
  get elemento(): HTMLElement { return this.harness.routeNativeElement as HTMLElement; }
  get detalle(): HTMLElement { return this.elemento.querySelector('app-conexion-detalle') as HTMLElement; }
  get dialogo(): HTMLElement { return document.querySelector('mat-dialog-container') as HTMLElement; }
  texto(selector = '', raiz: HTMLElement = this.elemento): string {
    return (selector ? raiz.querySelector(selector) : raiz)?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }
  boton(selector: string, raiz: HTMLElement = this.elemento): HTMLButtonElement { return raiz.querySelector(selector) as HTMLButtonElement; }
  refrescar(): void { this.harness.detectChanges(); TestBed.tick(); this.harness.detectChanges(); }
  responderHistorialVacio(): void {
    this.http.match((r) => r.url.includes('/historial')).forEach((r) => r.flush({ lecturas: [], hayMas: false }));
    this.refrescar();
  }
  async abrir(ruta = '/conexiones/REMOTIVE', fuentes = conexionesDePrueba(), avance: IRecoleccion = RECOLECCION_NINGUNA): Promise<void> {
    this.harness = await RouterTestingHarness.create();
    await this.harness.navigateByUrl(ruta);
    this.http.expectOne('/api/fuentes').flush(fuentes);
    this.http.expectOne('/api/recoleccion').flush(avance);
    if (avance.estado === 'EN_CURSO' && avance.fuentes.some((f) => f.paso === 'TERMINADA')) this.http.expectOne('/api/fuentes').flush(fuentes);
    this.refrescar();
    await this.harness.fixture.whenStable();
    this.refrescar();
    this.responderHistorialVacio();
  }
  async navegar(ruta: string): Promise<void> {
    await this.harness.navigateByUrl(ruta); this.refrescar(); this.responderHistorialVacio();
  }
  configurar(): void { this.boton('.configurar', this.detalle).click(); this.refrescar(); }
  escribir(selector: string, valor: string): HTMLInputElement {
    const campo = this.dialogo.querySelector(selector) as HTMLInputElement;
    campo.value = valor; campo.dispatchEvent(new Event('input')); this.refrescar(); return campo;
  }
  async cerrar(): Promise<void> {
    const dialogos = TestBed.inject(MatDialog);
    const cierres = dialogos.openDialogs.map((dialogo) => firstValueFrom(dialogo.afterClosed()));
    dialogos.closeAll();
    await Promise.all(cierres);
    if (this.harness && !this.harness.fixture.componentRef.hostView.destroyed) await this.harness.fixture.whenStable();
    this.harness?.fixture.destroy();
    this.http.verify();
  }
}

export async function prepararPantalla(telefono = true): Promise<PantallaConexionesPrueba> {
  await TestBed.configureTestingModule({
    providers: [
      { provide: ABRIR_ENLACE, useValue: vi.fn() },
      { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { enterAnimationDuration: 0, exitAnimationDuration: 0 } },
      provideHttpClient(), provideHttpClientTesting(), provideRouter([
      { path: 'conexiones', component: ConexionesPageComponent, children: [{path: ':fuente', component: ConexionDetalleComponent}] },
    ]), { provide: BreakpointObserver, useValue: { observe: () => new BehaviorSubject({ matches: telefono, breakpoints: {} }) } }],
  }).compileComponents();
  return new PantallaConexionesPrueba();
}
