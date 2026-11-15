import { Encaje, EstadoLectura, EstadoOferta, Fuente, Modalidad } from '../@data/interfaces/oferta';

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

/** Lista por defecto: nuevas de encaje alto y medio. */
export const FILTRO_POR_DEFECTO = {
  encaje: ['ALTO', 'MEDIO'] as Encaje[],
  estado: ['NUEVA'] as EstadoOferta[],
  fuente: [] as Fuente[],
  modalidad: [] as Modalidad[],
  tecnologia: null as string | null,
  desde: null as string | null,
  hasta: null as string | null,
};

/** Etiqueta visible de un valor de catálogo. */
export function etiqueta(catalogo: readonly { valor: string; etiqueta: string }[], valor: string): string {
  return catalogo.find((c) => c.valor === valor)?.etiqueta ?? valor;
}
