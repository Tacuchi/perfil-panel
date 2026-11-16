import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildQuery } from '../../Utils/query';
import {
  EstadoOferta,
  IFiltroOfertas,
  IOferta,
  IOfertaDetalle,
  ITecnologias,
} from '../interfaces/oferta';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class OfertasService {
  private readonly apiClient = inject(ApiClientService);
  private readonly base = environment.apiBaseUrl;

  listar(filtro: IFiltroOfertas): Observable<IOferta[]> {
    const consulta = buildQuery({
      encaje: filtro.encaje,
      estado: filtro.estado,
      fuente: filtro.fuente,
      modalidad: filtro.modalidad,
      tecnologia: filtro.tecnologia,
      desde: filtro.desde,
      hasta: filtro.hasta,
    });
    return this.apiClient.get<IOferta[]>(`${this.base}/ofertas${consulta}`);
  }

  detalle(id: number): Observable<IOfertaDetalle> {
    return this.apiClient.get<IOfertaDetalle>(`${this.base}/ofertas/${id}`);
  }

  marcar(id: number, estado: EstadoOferta): Observable<IOfertaDetalle> {
    return this.apiClient.patch<IOfertaDetalle>(`${this.base}/ofertas/${id}`, { estado });
  }

  tecnologias(): Observable<ITecnologias> {
    return this.apiClient.get<ITecnologias>(`${this.base}/tecnologias`);
  }
}
