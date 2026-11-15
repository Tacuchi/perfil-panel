import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IProblema } from '../interfaces/version';
import { ToastService } from './toast.service';
import {
  MSG_ERROR_SERVIDOR,
  MSG_PROHIBIDO,
  MSG_SESION_VENCIDA,
  MSG_SIN_CONEXION,
} from '../../Utils/const';

/** Único punto de HTTP: cada error se muestra con su causa y se vuelve a lanzar, nunca se silencia. */
@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(catchError((error) => this.formatErrors(error)));
  }

  post<T>(url: string, cuerpo: unknown): Observable<T> {
    return this.http.post<T>(url, cuerpo).pipe(catchError((error) => this.formatErrors(error)));
  }

  put<T>(url: string, cuerpo: unknown): Observable<T> {
    return this.http.put<T>(url, cuerpo).pipe(catchError((error) => this.formatErrors(error)));
  }

  private formatErrors(error: HttpErrorResponse): Observable<never> {
    this.mostrar(error);
    return throwError(() => error);
  }

  /** Se decide por el estado HTTP, no por el cuerpo: un proxy puede responder con HTML. */
  private mostrar(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.toast.sesionVencida(MSG_SESION_VENCIDA);
      return;
    }
    // Sin respuesta: red caída, o Cloudflare redirigiendo a su acceso porque la sesión venció. Recargar resuelve ambas.
    if (error.status === 0) {
      this.toast.sesionVencida(MSG_SIN_CONEXION);
      return;
    }
    if (error.status === 403) {
      this.toast.error(MSG_PROHIBIDO);
      return;
    }
    if (error.status >= 500) {
      this.toast.error(MSG_ERROR_SERVIDOR);
      return;
    }
    const problema = error.error as IProblema | null;
    this.toast.error(problema?.detail ?? MSG_ERROR_SERVIDOR);
  }
}
