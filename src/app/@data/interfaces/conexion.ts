import { EstadoLectura, Fuente } from './oferta';

/** Conexiones del monitor como las entrega perfil-api en /fuentes. */
export type Via = 'SERVIDOR' | 'PAGO' | 'MAQUINA';
export type Requisito = 'NADA' | 'CLAVE' | 'SESION';
/** Si se puede leer: distinto del resultado de la última lectura. */
export type EstadoConexion = 'LISTA' | 'PAUSADA' | 'FALTA_CONFIGURAR';

export interface IConexion {
  fuente: Fuente;
  nombre: string;
  estado: EstadoLectura;
  detalle: string | null;
  ultimaLectura: string | null;
  ultimaCorrecta: string | null;
  ofertasLeidas: number;
  /** Lecturas que le quedan hoy (día de Lima), contando programadas y a demanda. */
  lecturasRestantes: number;
  via: Via;
  necesita: Requisito;
  tieneLoQueNecesita: boolean;
  pausada: boolean;
  motivoPausa: string | null;
  estadoConexion: EstadoConexion;
}
