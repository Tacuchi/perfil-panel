import { EstadoLectura, Fuente } from './oferta';

/** Recolección de ofertas como la entrega perfil-api en /recoleccion. */
export type EstadoRecoleccion = 'NINGUNA' | 'EN_CURSO' | 'TERMINADA';
export type OrigenRecoleccion = 'PROGRAMADA' | 'DEMANDA' | 'MAQUINA';
export type PasoFuente = 'PENDIENTE' | 'LEYENDO' | 'TERMINADA';
export type MotivoOmision = 'TOPE_DIARIO' | 'PAUSADA' | 'DESDE_MAQUINA';
/** Por qué una corrida de la máquina se cerró sin que el lector la terminara. */
export type MotivoCierre = 'LECTOR_SIN_RESPUESTA' | 'PLAZO_VENCIDO';

/** Una fuente lanzada. Resultado y ofertas leídas solo llegan cuando su paso es TERMINADA. */
export interface IFuenteEnRecoleccion {
  fuente: Fuente;
  nombre: string;
  paso: PasoFuente;
  resultado: EstadoLectura | null;
  ofertasLeidas: number | null;
}

export interface IFuenteOmitida {
  fuente: Fuente;
  nombre: string;
  motivo: MotivoOmision;
}

/** Avance de la recolección en curso o resultado de la última; terminadas y total cuentan solo las lanzadas. */
export interface IRecoleccion {
  estado: EstadoRecoleccion;
  origen: OrigenRecoleccion | null;
  inicio: string | null;
  fin: string | null;
  terminadas: number;
  total: number;
  fuentes: IFuenteEnRecoleccion[];
  omitidas: IFuenteOmitida[];
  /** Solo en una corrida de la máquina que se cerró sin que el lector la terminara. */
  cierre: MotivoCierre | null;
}

/** La corrida de la máquina recién abierta: el código de un solo uso viaja solo al enlace del lector. */
export interface ICorridaAbierta {
  codigo: string;
  avance: IRecoleccion;
}
