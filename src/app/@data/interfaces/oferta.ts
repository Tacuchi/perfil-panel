/** Ofertas como las entrega perfil-api. */
export type Encaje = 'ALTO' | 'MEDIO' | 'NO_ENCAJA';
export type EstadoOferta = 'NUEVA' | 'GUARDADA' | 'DESCARTADA' | 'POSTULADA';
export type Fuente = 'GET_ON_BOARD' | 'REMOTIVE' | 'REMOTE_OK';
export type Modalidad = 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL' | 'NO_INFORMA';
export type EstadoLectura = 'CORRECTA' | 'FALLO' | 'BLOQUEO' | 'SIN_LEER';

export interface IRepetida {
  id: number;
  fuente: Fuente;
  fuenteNombre: string;
}

export interface IOferta {
  id: number;
  fuente: Fuente;
  fuenteNombre: string;
  titulo: string;
  empresa: string | null;
  fecha: string;
  ubicacion: string | null;
  modalidad: Modalidad;
  url: string;
  encaje: Encaje;
  motivos: string[];
  tecnologias: string[];
  estado: EstadoOferta;
  postuladaEn: string | null;
  publicada: boolean;
  conCorreo: boolean;
  posiblesRepetidas: IRepetida[];
}

export interface IOfertaDetalle {
  oferta: IOferta;
  descripcion: string;
  correoContacto: string | null;
}

export interface ITecnologias {
  principales: string[];
  secundarias: string[];
}

/** Filtros de la lista. Un campo vacío no filtra; la API trata encaje y estado vacíos como la lista por defecto. */
export interface IFiltroOfertas {
  encaje: Encaje[];
  estado: EstadoOferta[];
  fuente: Fuente[];
  modalidad: Modalidad[];
  tecnologia: string | null;
  desde: string | null;
  hasta: string | null;
}
