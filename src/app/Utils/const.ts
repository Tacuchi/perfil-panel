import { Encaje, EstadoLectura, EstadoOferta, Fuente, IFiltroOfertas, Modalidad } from '../@data/interfaces/oferta';

export const MSG_CARGA_ACEPTADA = 'CV subido. Ya es el vigente.';
export const MSG_VIGENTE_CAMBIADA = 'Versión restaurada. Ya es la vigente.';
export const MSG_SESION_VENCIDA = 'La sesión venció. Recarga la página para entrar de nuevo.';
export const MSG_SIN_CONEXION = 'No se pudo contactar al servidor o la sesión venció. Recarga la página.';
export const MSG_ERROR_SERVIDOR = 'El servidor falló al procesar la petición. Inténtalo de nuevo.';
export const MSG_PROHIBIDO = 'El servidor rechazó la petición.';
export const ACCION_RECARGAR = 'Recargar';
export const ACCION_CERRAR = 'Cerrar';

export const URL_CV_PUBLICO = 'https://tacuchi.dev/cv';
export const MSG_ESTADO_CAMBIADO = 'Oferta marcada como';

export const ENCAJES: readonly { valor: Encaje; etiqueta: string }[] = [
  { valor: 'ALTO', etiqueta: 'Alto' },
  { valor: 'MEDIO', etiqueta: 'Medio' },
  { valor: 'NO_ENCAJA', etiqueta: 'No encaja' },
];

export const ESTADOS_OFERTA: readonly { valor: EstadoOferta; etiqueta: string }[] = [
  { valor: 'NUEVA', etiqueta: 'Nueva' },
  { valor: 'GUARDADA', etiqueta: 'Guardada' },
  { valor: 'DESCARTADA', etiqueta: 'Descartada' },
  { valor: 'POSTULADA', etiqueta: 'Postulada' },
];

export const FUENTES: readonly { valor: Fuente; etiqueta: string }[] = [
  { valor: 'GET_ON_BOARD', etiqueta: 'Get on Board' },
  { valor: 'REMOTIVE', etiqueta: 'Remotive' },
  { valor: 'REMOTE_OK', etiqueta: 'Remote OK' },
];

export const MODALIDADES: readonly { valor: Modalidad; etiqueta: string }[] = [
  { valor: 'REMOTO', etiqueta: 'Remoto' },
  { valor: 'HIBRIDO', etiqueta: 'Híbrido' },
  { valor: 'PRESENCIAL', etiqueta: 'Presencial' },
  { valor: 'NO_INFORMA', etiqueta: 'No informa' },
];

export const ESTADOS_LECTURA: Readonly<Record<EstadoLectura, string>> = {
  CORRECTA: 'Correcta',
  FALLO: 'Falló',
  BLOQUEO: 'Bloqueada',
  SIN_LEER: 'Sin leer todavía',
};

/** Días hacia atrás que cubre el rango de fechas por defecto. */
export const DIAS_POR_DEFECTO = 7;

/** Fecha local en el formato del campo de fecha y de la API (yyyy-MM-dd). */
export function fechaIso(fecha: Date): string {
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

/** Lista por defecto: nuevas de encaje alto y medio de los últimos 7 días. */
export function filtroPorDefecto(hoy = new Date()): IFiltroOfertas {
  const desde = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - DIAS_POR_DEFECTO);
  return {
    encaje: ['ALTO', 'MEDIO'],
    estado: ['NUEVA'],
    fuente: [],
    modalidad: [],
    tecnologia: null,
    desde: fechaIso(desde),
    hasta: fechaIso(hoy),
  };
}

/** Etiqueta visible de un valor de catálogo. */
export function etiqueta(catalogo: readonly { valor: string; etiqueta: string }[], valor: string): string {
  return catalogo.find((c) => c.valor === valor)?.etiqueta ?? valor;
}
