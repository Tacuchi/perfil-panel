import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjustesPageComponent } from './ajustes-page.component';

describe('AjustesPageComponent', () => {
  let fixture: ComponentFixture<AjustesPageComponent>;
  const pantalla = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [AjustesPageComponent] }).compileComponents();
    fixture = TestBed.createComponent(AjustesPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-paleta');
    document.documentElement.style.colorScheme = '';
  });

  it('elegir una paleta la aplica al panel y la recuerda en este navegador', async () => {
    (pantalla().querySelector('input[value="azul"]') as HTMLInputElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.documentElement.dataset['paleta']).toBe('azul');
    expect(localStorage.getItem('perfil-panel.paleta')).toBe('azul');
    expect((pantalla().querySelector('input[value="azul"]') as HTMLInputElement).checked).toBe(true);
  });

  it('elegir el tema oscuro fija el esquema de color del documento', async () => {
    const oscuro = [...pantalla().querySelectorAll('mat-button-toggle button')].find((b) =>
      b.textContent?.includes('Oscuro'),
    ) as HTMLButtonElement;
    oscuro.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(localStorage.getItem('perfil-panel.tema')).toBe('oscuro');
  });
});
