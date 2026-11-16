import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IHistorialLecturas } from '../interfaces/historial-lecturas';
import { IConexion } from '../interfaces/conexion';
import { Fuente } from '../interfaces/oferta';
import { ApiClientService } from './api-client.service';

/** Estado de cada conexión del monitor: pausarla o reanudarla, y la clave y el tope mensual de las de pago. */
@Injectable({ providedIn: 'root' })
export class ConexionesService {
  private readonly apiClient = inject(ApiClientService);
  private readonly base = `${environment.apiBaseUrl}/fuentes`;

  listar(): Observable<IConexion[]> {
    return this.apiClient.get<IConexion[]>(this.base);
  }

  historial(fuente: Fuente, antesDe?: number): Observable<IHistorialLecturas> {
    const consulta = antesDe === undefined ? '' : `?antesDe=${antesDe}`;
    return this.apiClient.get<IHistorialLecturas>(`${this.base}/${fuente}/historial${consulta}`);
  }

  pausar(fuente: Fuente): Observable<IConexion> {
    return this.apiClient.post<IConexion>(`${this.base}/${fuente}/pausar`, null);
  }

  reanudar(fuente: Fuente): Observable<IConexion> {
    return this.apiClient.post<IConexion>(`${this.base}/${fuente}/reanudar`, null);
  }

  /** Carga o reemplaza la clave; la respuesta solo dice que existe y cuándo se cargó. */
  cargarClave(fuente: Fuente, clave: string): Observable<IConexion> {
    return this.apiClient.put<IConexion>(`${this.base}/${fuente}/clave`, { clave });
  }

  fijarTope(fuente: Fuente, topeMensual: number): Observable<IConexion> {
    return this.apiClient.put<IConexion>(`${this.base}/${fuente}/tope`, { topeMensual });
  }
}
