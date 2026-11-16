import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IConexion } from '../interfaces/conexion';
import { Fuente } from '../interfaces/oferta';
import { ApiClientService } from './api-client.service';

/** Estado de cada conexión del monitor, y pausarla o reanudarla. */
@Injectable({ providedIn: 'root' })
export class ConexionesService {
  private readonly apiClient = inject(ApiClientService);
  private readonly base = `${environment.apiBaseUrl}/fuentes`;

  listar(): Observable<IConexion[]> {
    return this.apiClient.get<IConexion[]>(this.base);
  }

  pausar(fuente: Fuente): Observable<IConexion> {
    return this.apiClient.post<IConexion>(`${this.base}/${fuente}/pausar`, null);
  }

  reanudar(fuente: Fuente): Observable<IConexion> {
    return this.apiClient.post<IConexion>(`${this.base}/${fuente}/reanudar`, null);
  }
}
