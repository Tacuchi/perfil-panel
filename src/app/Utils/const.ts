import { Encaje, EstadoLectura, EstadoOferta, Fuente, IFiltroOfertas, Modalidad } from '../@data/interfaces/oferta';
import { EstadoConexion, Requisito, Via } from '../@data/interfaces/conexion';
import { MotivoCierre, MotivoOmision, OrigenRecoleccion } from '../@data/interfaces/recoleccion';

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
  { valor: 'LINKEDIN', etiqueta: 'LinkedIn' },
  { valor: 'BUMERAN', etiqueta: 'Bumeran' },
  { valor: 'COMPUTRABAJO', etiqueta: 'Computrabajo' },
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

/** Cada cuánto se consulta el avance de una recolección en curso. */
export const INTERVALO_AVANCE_MS = 1000;

export const MSG_RECOLECCION_EN_CURSO = 'Hay una recolección en curso. Espera a que termine para lanzar otra.';
export const MSG_TODAS_EN_TOPE = 'Todas las fuentes llegaron a su tope de lecturas de hoy.';
export const MSG_FUENTE_EN_TOPE = 'Llegó a su tope de lecturas de hoy.';
export const MSG_NINGUNA_LEIBLE = 'Ninguna conexión se puede leer ahora: están pausadas o llegaron a su tope de hoy.';

export const VIAS: Readonly<Record<Via, string>> = {
  SERVIDOR: 'Se lee desde el servidor',
  PAGO: 'Se lee por un servicio de pago',
  MAQUINA: 'Se lee desde tu máquina',
};

export const REQUISITOS: Readonly<Record<Requisito, string>> = {
  NADA: 'No necesita nada',
  CLAVE: 'Necesita una clave',
  SESION: 'Necesita tu sesión',
};

/** Si la conexión tiene lo que necesita; las que no necesitan nada no lo dicen. */
export const TIENE_LO_QUE_NECESITA: Readonly<Record<Exclude<Requisito, 'NADA'>, { si: string; no: string }>> = {
  CLAVE: { si: 'Configurada', no: 'Sin configurar' },
  SESION: { si: 'Tiene la sesión iniciada', no: 'Sin sesión iniciada' },
};

/** Solo se muestran las que impiden leer; LISTA no lleva aviso. */
export const ESTADOS_CONEXION: Readonly<Record<EstadoConexion, string>> = {
  LISTA: 'Lista',
  PAUSADA: 'Pausada',
  FALTA_CONFIGURAR: 'Falta configurar',
  FALTA_INICIAR_SESION: 'Falta iniciar sesión',
  PENDIENTE_MAQUINA: 'Pendiente de leer desde tu máquina',
  TOPE_MENSUAL: 'Llegó a su tope del mes',
};

export const ORIGENES_RECOLECCION: Readonly<Record<OrigenRecoleccion, string>> = {
  DEMANDA: 'a demanda',
  PROGRAMADA: 'programada',
  MAQUINA: 'desde tu máquina',
};

export const MOTIVOS_OMISION: Readonly<Record<MotivoOmision, string>> = {
  TOPE_DIARIO: 'No leída: llegó a su tope de lecturas de hoy',
  PAUSADA: 'No leída: está pausada',
  DESDE_MAQUINA: 'No leída: se lee desde tu máquina',
  FALTA_CONFIGURAR: 'No leída: falta configurarla',
  TOPE_MENSUAL: 'No leída: llegó a su tope del mes',
};

export const LECTURA_PARCIAL = 'Leída en parte';

export const MSG_CLAVE_GUARDADA = 'Clave guardada. Ya no se vuelve a mostrar.';
export const MSG_TOPE_GUARDADO = 'Tope mensual guardado.';

/** Montos en dólares como los cobra el servicio de pago: hasta cuatro decimales. */
export function dolares(monto: number): string {
  return `US$ ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}

export const MOTIVOS_CIERRE: Readonly<Record<MotivoCierre, string>> = {
  LECTOR_SIN_RESPUESTA: 'El lector no respondió en esta máquina.',
  PLAZO_VENCIDO: 'La lectura desde tu máquina no terminó a tiempo.',
};

/** Enlace que abre el lector instalado en la máquina de la persona. */
export const enlaceLector = (codigo: string): string => `perfil-lector://leer?corrida=${encodeURIComponent(codigo)}`;

export const MSG_SIN_CONEXIONES_MAQUINA =
  'Ninguna conexión de tu máquina se puede leer ahora: están pausadas o llegaron a su tope de hoy.';

/** Cómo terminó cada fuente de una recolección. */
export const RESULTADOS_LECTURA: Readonly<Record<EstadoLectura, string>> = {
  CORRECTA: 'Leída',
  FALLO: 'Falló',
  BLOQUEO: 'Bloqueada',
  SIN_LEER: 'Sin leer',
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
