import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fuente } from '../interfaces/oferta';
import { ICorridaAbierta, IRecoleccion } from '../interfaces/recoleccion';
import { ApiClientService } from './api-client.service';

/** Lanza la recolección de ofertas a demanda y consulta su avance. */
@Injectable({ providedIn: 'root' })
export class RecoleccionService {
  private readonly apiClient = inject(ApiClientService);
  private readonly base = `${environment.apiBaseUrl}/recoleccion`;

  avance(): Observable<IRecoleccion> {
    return this.apiClient.get<IRecoleccion>(this.base);
  }

  /** Sin fuente: todas las que tienen lecturas disponibles hoy. Responde al instante; la lectura sigue en la API. */
  lanzar(fuente: Fuente | null): Observable<IRecoleccion> {
    return this.apiClient.post<IRecoleccion>(fuente ? `${this.base}/${fuente}` : this.base, null);
  }

  /** Abre una corrida para el lector de la máquina de la persona y devuelve su código de un solo uso. */
  abrirCorridaLocal(): Observable<ICorridaAbierta> {
    return this.apiClient.post<ICorridaAbierta>(`${this.base}/maquina`, null);
  }
}
