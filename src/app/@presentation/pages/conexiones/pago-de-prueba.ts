import { IConexion } from '../../../@data/interfaces/conexion';
import { IRecoleccion } from '../../../@data/interfaces/recoleccion';

/** Cuerpo de un lanzamiento rechazado (RFC 9457 con su motivo). */
interface IRechazo {
  detail: string;
  instance: string;
  status: number;
  title: string;
  motivo: string;
}

// Copiadas tal cual de las respuestas de perfil-api, levantada en local con el doble de Apify.

/** Las seis conexiones; Computrabajo sin clave ni tope. */
export const FUENTES_PAGO_SIN_CONFIGURAR: IConexion[] = [
  {
    "fuente": "GET_ON_BOARD",
    "nombre": "Get on Board",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "REMOTIVE",
    "nombre": "Remotive",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "REMOTE_OK",
    "nombre": "Remote OK",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "LINKEDIN",
    "nombre": "LinkedIn",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 1,
    "via": "MAQUINA",
    "necesita": "SESION",
    "tieneLoQueNecesita": false,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "FALTA_INICIAR_SESION",
    "lecturasDia": 1,
    "avisosPorCorrida": 25,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "BUMERAN",
    "nombre": "Bumeran",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "MAQUINA",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "PENDIENTE_MAQUINA",
    "lecturasDia": 3,
    "avisosPorCorrida": 25,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "COMPUTRABAJO",
    "nombre": "Computrabajo",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 0,
    "via": "PAGO",
    "necesita": "CLAVE",
    "tieneLoQueNecesita": false,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "FALTA_CONFIGURAR",
    "lecturasDia": 0,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": 0,
    "queFalta": "falta la clave del servicio"
  }
];

/** Lanzar Computrabajo sin configurar (409). */
export const RECHAZO_FALTA_CONFIGURAR: IRechazo = {
  "detail": "Computrabajo no está configurada. Completa lo que le falta en Conexiones para leerla.",
  "instance": "/api/recoleccion/COMPUTRABAJO",
  "status": 409,
  "title": "Conflict",
  "motivo": "FALTA_CONFIGURAR"
};

/** Respuesta de cargar la clave de Computrabajo: aún sin tope. */
export const CONEXION_PAGO_CON_CLAVE: IConexion = {
  "fuente": "COMPUTRABAJO",
  "nombre": "Computrabajo",
  "estado": "SIN_LEER",
  "detalle": null,
  "ultimaLectura": null,
  "ultimaCorrecta": null,
  "ofertasLeidas": 0,
  "lecturasRestantes": 0,
  "via": "PAGO",
  "necesita": "CLAVE",
  "tieneLoQueNecesita": false,
  "pausada": false,
  "motivoPausa": null,
  "estadoConexion": "FALTA_CONFIGURAR",
  "lecturasDia": 0,
  "avisosPorCorrida": null,
  "tieneClave": true,
  "claveCargadaEn": "2026-11-16T13:52:47.626279Z",
  "topeMensual": null,
  "consumoMes": 0,
  "queFalta": "falta el tope mensual"
};

/** Respuesta de fijar el tope mensual en 0,02: lista para leer. */
export const CONEXION_PAGO_LISTA: IConexion = {
  "fuente": "COMPUTRABAJO",
  "nombre": "Computrabajo",
  "estado": "SIN_LEER",
  "detalle": null,
  "ultimaLectura": null,
  "ultimaCorrecta": null,
  "ofertasLeidas": 0,
  "lecturasRestantes": 0,
  "via": "PAGO",
  "necesita": "CLAVE",
  "tieneLoQueNecesita": true,
  "pausada": false,
  "motivoPausa": null,
  "estadoConexion": "LISTA",
  "lecturasDia": 0,
  "avisosPorCorrida": null,
  "tieneClave": true,
  "claveCargadaEn": "2026-11-16T13:52:47.626279Z",
  "topeMensual": 0.02,
  "consumoMes": 0,
  "queFalta": null
};

/** Respuesta del lanzamiento de Computrabajo. */
export const RECOLECCION_PAGO_ACEPTADA: IRecoleccion = {
  "estado": "EN_CURSO",
  "origen": "DEMANDA",
  "inicio": "2026-11-16T13:52:47.659039Z",
  "fin": null,
  "terminadas": 0,
  "total": 1,
  "fuentes": [
    {
      "fuente": "COMPUTRABAJO",
      "nombre": "Computrabajo",
      "paso": "PENDIENTE",
      "resultado": null,
      "ofertasLeidas": null
    }
  ],
  "omitidas": [],
  "cierre": null
};

/** Computrabajo leída: cinco avisos. */
export const RECOLECCION_PAGO_TERMINADA: IRecoleccion = {
  "estado": "TERMINADA",
  "origen": "DEMANDA",
  "inicio": "2026-11-16T13:52:47.659039Z",
  "fin": "2026-11-16T13:52:49.743544Z",
  "terminadas": 1,
  "total": 1,
  "fuentes": [
    {
      "fuente": "COMPUTRABAJO",
      "nombre": "Computrabajo",
      "paso": "TERMINADA",
      "resultado": "CORRECTA",
      "ofertasLeidas": 5
    }
  ],
  "omitidas": [],
  "cierre": null
};

/** Tras leer Computrabajo: consumo de 0,016 de un tope de 0,02. */
export const FUENTES_PAGO_LEIDA: IConexion[] = [
  {
    "fuente": "GET_ON_BOARD",
    "nombre": "Get on Board",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "REMOTIVE",
    "nombre": "Remotive",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "REMOTE_OK",
    "nombre": "Remote OK",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "LINKEDIN",
    "nombre": "LinkedIn",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 1,
    "via": "MAQUINA",
    "necesita": "SESION",
    "tieneLoQueNecesita": false,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "FALTA_INICIAR_SESION",
    "lecturasDia": 1,
    "avisosPorCorrida": 25,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "BUMERAN",
    "nombre": "Bumeran",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "MAQUINA",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "PENDIENTE_MAQUINA",
    "lecturasDia": 3,
    "avisosPorCorrida": 25,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "COMPUTRABAJO",
    "nombre": "Computrabajo",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-16T13:52:47.659039Z",
    "ultimaCorrecta": "2026-11-16T13:52:47.659039Z",
    "ofertasLeidas": 5,
    "lecturasRestantes": 0,
    "via": "PAGO",
    "necesita": "CLAVE",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 0,
    "avisosPorCorrida": null,
    "tieneClave": true,
    "claveCargadaEn": "2026-11-16T13:52:47.626279Z",
    "topeMensual": 0.02,
    "consumoMes": 0.016,
    "queFalta": null
  }
];

/** Tras una segunda lectura, Computrabajo llegó a su tope del mes. */
export const FUENTES_PAGO_EN_TOPE: IConexion[] = [
  {
    "fuente": "GET_ON_BOARD",
    "nombre": "Get on Board",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "REMOTIVE",
    "nombre": "Remotive",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "REMOTE_OK",
    "nombre": "Remote OK",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "LINKEDIN",
    "nombre": "LinkedIn",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 1,
    "via": "MAQUINA",
    "necesita": "SESION",
    "tieneLoQueNecesita": false,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "FALTA_INICIAR_SESION",
    "lecturasDia": 1,
    "avisosPorCorrida": 25,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "BUMERAN",
    "nombre": "Bumeran",
    "estado": "SIN_LEER",
    "detalle": null,
    "ultimaLectura": null,
    "ultimaCorrecta": null,
    "ofertasLeidas": 0,
    "lecturasRestantes": 3,
    "via": "MAQUINA",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "PENDIENTE_MAQUINA",
    "lecturasDia": 3,
    "avisosPorCorrida": 25,
    "tieneClave": false,
    "claveCargadaEn": null,
    "topeMensual": null,
    "consumoMes": null,
    "queFalta": null
  },
  {
    "fuente": "COMPUTRABAJO",
    "nombre": "Computrabajo",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-16T13:52:50.761911Z",
    "ultimaCorrecta": "2026-11-16T13:52:50.761911Z",
    "ofertasLeidas": 1,
    "lecturasRestantes": 0,
    "via": "PAGO",
    "necesita": "CLAVE",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "TOPE_MENSUAL",
    "lecturasDia": 0,
    "avisosPorCorrida": null,
    "tieneClave": true,
    "claveCargadaEn": "2026-11-16T13:52:47.626279Z",
    "topeMensual": 0.02,
    "consumoMes": 0.02,
    "queFalta": null
  }
];

/** Lanzar Computrabajo en su tope del mes (409). */
export const RECHAZO_TOPE_MENSUAL: IRechazo = {
  "detail": "Computrabajo llegó a su tope del mes. Súbelo en Conexiones o espera al mes siguiente.",
  "instance": "/api/recoleccion/COMPUTRABAJO",
  "status": 409,
  "title": "Conflict",
  "motivo": "TOPE_MENSUAL"
};

/** Lanzamiento general con Computrabajo en su tope del mes: la omite con su motivo. */
export const RECOLECCION_GENERAL_CON_TOPE_MENSUAL: IRecoleccion = {
  "estado": "EN_CURSO",
  "origen": "DEMANDA",
  "inicio": "2026-11-16T13:52:53.860122Z",
  "fin": null,
  "terminadas": 0,
  "total": 3,
  "fuentes": [
    {
      "fuente": "GET_ON_BOARD",
      "nombre": "Get on Board",
      "paso": "PENDIENTE",
      "resultado": null,
      "ofertasLeidas": null
    },
    {
      "fuente": "REMOTIVE",
      "nombre": "Remotive",
      "paso": "PENDIENTE",
      "resultado": null,
      "ofertasLeidas": null
    },
    {
      "fuente": "REMOTE_OK",
      "nombre": "Remote OK",
      "paso": "PENDIENTE",
      "resultado": null,
      "ofertasLeidas": null
    }
  ],
  "omitidas": [
    {
      "fuente": "COMPUTRABAJO",
      "nombre": "Computrabajo",
      "motivo": "TOPE_MENSUAL"
    },
    {
      "fuente": "LINKEDIN",
      "nombre": "LinkedIn",
      "motivo": "DESDE_MAQUINA"
    },
    {
      "fuente": "BUMERAN",
      "nombre": "Bumeran",
      "motivo": "DESDE_MAQUINA"
    }
  ],
  "cierre": null
};

/** La anterior, terminada: leyó las tres del servidor. */
export const RECOLECCION_GENERAL_CON_TOPE_MENSUAL_TERMINADA: IRecoleccion = {
  "estado": "TERMINADA",
  "origen": "DEMANDA",
  "inicio": "2026-11-16T13:57:14.826514Z",
  "fin": "2026-11-16T13:57:15.001399Z",
  "terminadas": 3,
  "total": 3,
  "fuentes": [
    {
      "fuente": "GET_ON_BOARD",
      "nombre": "Get on Board",
      "paso": "TERMINADA",
      "resultado": "CORRECTA",
      "ofertasLeidas": 6
    },
    {
      "fuente": "REMOTIVE",
      "nombre": "Remotive",
      "paso": "TERMINADA",
      "resultado": "CORRECTA",
      "ofertasLeidas": 4
    },
    {
      "fuente": "REMOTE_OK",
      "nombre": "Remote OK",
      "paso": "TERMINADA",
      "resultado": "CORRECTA",
      "ofertasLeidas": 4
    }
  ],
  "omitidas": [
    {
      "fuente": "COMPUTRABAJO",
      "nombre": "Computrabajo",
      "motivo": "TOPE_MENSUAL"
    },
    {
      "fuente": "LINKEDIN",
      "nombre": "LinkedIn",
      "motivo": "DESDE_MAQUINA"
    },
    {
      "fuente": "BUMERAN",
      "nombre": "Bumeran",
      "motivo": "DESDE_MAQUINA"
    }
  ],
  "cierre": null
};
