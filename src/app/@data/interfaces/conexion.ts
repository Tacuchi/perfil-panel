import { EstadoLectura, Fuente } from './oferta';

/** Conexiones del monitor como las entrega perfil-api en /fuentes. */
export type Via = 'SERVIDOR' | 'PAGO' | 'MAQUINA';
export type Requisito = 'NADA' | 'CLAVE' | 'SESION';
/** Si se puede leer: distinto del resultado de la última lectura. */
export type EstadoConexion =
  | 'LISTA'
  | 'PAUSADA'
  | 'FALTA_CONFIGURAR'
  | 'FALTA_INICIAR_SESION'
  | 'PENDIENTE_MAQUINA'
  | 'TOPE_MENSUAL';

export interface IConexion {
  fuente: Fuente;
  nombre: string;
  estado: EstadoLectura;
  detalle: string | null;
  parcial?: boolean;
  ultimaLectura: string | null;
  ultimaCorrecta: string | null;
  ofertasLeidas: number;
  /** Lecturas que le quedan hoy (día de Lima), contando programadas y a demanda. En 0 en las de pago: no tienen tope diario. */
  lecturasRestantes: number;
  via: Via;
  necesita: Requisito;
  tieneLoQueNecesita: boolean;
  pausada: boolean;
  motivoPausa: string | null;
  estadoConexion: EstadoConexion;
  /** Lecturas que admite en un día de Lima. */
  lecturasDia: number;
  /** Avisos que admite cada corrida; solo en las que se leen desde la máquina. */
  avisosPorCorrida: number | null;
  /** Si tiene clave cargada: la clave nunca vuelve de la API, solo cuándo se cargó. */
  tieneClave: boolean;
  claveCargadaEn: string | null;
  /** Tope de gasto del mes y consumo del mes de Lima, en dólares; solo en las de pago. */
  topeMensual: number | null;
  consumoMes: number | null;
  /** Qué le falta a una de pago para leerse; null si no le falta nada. */
  queFalta: string | null;
}
