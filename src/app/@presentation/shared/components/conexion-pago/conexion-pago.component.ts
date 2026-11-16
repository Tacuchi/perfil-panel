import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IConexion } from '../../../../@data/interfaces/conexion';
import { dolares } from '../../../../Utils/const';

/**
 * Lo que la persona configura de una conexión de pago: la clave del servicio, que nunca se vuelve a mostrar (solo
 * desde cuándo existe), y el tope de gasto del mes junto a lo consumido. El campo de la clave se vacía al guardar.
 */
@Component({
  selector: 'app-conexion-pago',
  imports: [DatePipe, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './conexion-pago.component.html',
  styleUrl: './conexion-pago.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConexionPagoComponent {
  private readonly fb = inject(FormBuilder);

  readonly conexion = input.required<IConexion>();
  /** Se está guardando un cambio de una conexión: los botones esperan. */
  readonly guardando = input(false);
  readonly guardarClave = output<string>();
  readonly guardarTope = output<number>();

  protected readonly dolares = dolares;

  protected readonly formClave = this.fb.nonNullable.group({
    clave: ['', [Validators.required, Validators.maxLength(500), Validators.pattern(/\S/)]],
  });

  protected readonly formTope = this.fb.group({
    tope: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
      Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/),
    ]),
  });

  constructor() {
    // El tope guardado llena el campo mientras la persona no lo esté editando.
    effect(() => {
      const tope = this.conexion().topeMensual;
      if (!this.formTope.controls.tope.dirty) {
        this.formTope.controls.tope.setValue(tope);
      }
    });
  }

  protected enviarClave(): void {
    if (this.formClave.invalid) {
      return;
    }
    const clave = this.formClave.controls.clave.value.trim();
    // La clave no se queda en la pantalla: se vacía en cuanto sale hacia la API.
    this.formClave.reset();
    this.guardarClave.emit(clave);
  }

  protected enviarTope(): void {
    const tope = this.formTope.controls.tope.value;
    if (this.formTope.invalid || tope === null) {
      return;
    }
    this.formTope.markAsPristine();
    this.guardarTope.emit(Number(tope));
  }
}
