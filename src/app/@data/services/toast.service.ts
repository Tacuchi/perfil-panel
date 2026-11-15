import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ACCION_CERRAR, ACCION_RECARGAR } from '../../Utils/const';

/** Avisos al usuario sobre el snack bar de Material. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  exito(mensaje: string): void {
    this.snackBar.open(mensaje, ACCION_CERRAR, { duration: 5000, panelClass: 'toast-exito' });
  }

  error(mensaje: string): void {
    this.snackBar.open(mensaje, ACCION_CERRAR, { panelClass: 'toast-error' });
  }

  /** Sesión vencida: la única salida es recargar para que Cloudflare pida el código de nuevo. */
  sesionVencida(mensaje: string): void {
    this.snackBar
      .open(mensaje, ACCION_RECARGAR, { panelClass: 'toast-error' })
      .onAction()
      .subscribe(() => window.location.reload());
  }
}
