import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IVersion } from '../interfaces/version';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class VersionesService {
  private readonly apiClient = inject(ApiClientService);
  private readonly base = environment.apiBaseUrl;

  listar(): Observable<IVersion[]> {
    return this.apiClient.get<IVersion[]>(`${this.base}/versiones`);
  }

  subir(pdf: File, word: File | null): Observable<IVersion> {
    const cuerpo = new FormData();
    cuerpo.append('pdf', pdf);
    if (word) {
      cuerpo.append('word', word);
    }
    return this.apiClient.post<IVersion>(`${this.base}/versiones`, cuerpo);
  }

  dejarVigente(id: string): Observable<IVersion> {
    return this.apiClient.put<IVersion>(`${this.base}/vigente`, { version: id });
  }

  /** Las descargas son enlaces: el navegador guarda el archivo con el nombre que manda la API. */
  urlPdf(id: string): string {
    return `${this.base}/versiones/${encodeURIComponent(id)}/pdf`;
  }

  urlWord(id: string): string {
    return `${this.base}/versiones/${encodeURIComponent(id)}/word`;
  }
}
