import { EstadoLectura } from './oferta';

export interface ILecturaHistorial {
  id: number;
  inicio: string;
  duracionMs: number;
  estado: EstadoLectura;
  parcial: boolean;
  leidas: number;
  nuevas: number;
  costoUsd: number | null;
  motivo: string | null;
}

export interface IHistorialLecturas {
  lecturas: ILecturaHistorial[];
  hayMas: boolean;
}
