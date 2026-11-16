import { IConexion } from '../../../@data/interfaces/conexion';
import { ICorridaAbierta, IRecoleccion } from '../../../@data/interfaces/recoleccion';

/** Cuerpo de un lanzamiento rechazado (RFC 9457 con su motivo). */
interface IRechazo {
  detail: string;
  instance: string;
  status: number;
  title: string;
  motivo: string;
}

// Copiadas tal cual de las respuestas de perfil-api, levantada en local con sus fuentes de prueba.

/** Sin recolecciones desde que arrancó la API. */
export const RECOLECCION_NINGUNA: IRecoleccion = {
  "estado": "NINGUNA",
  "origen": null,
  "inicio": null,
  "fin": null,
  "terminadas": 0,
  "total": 0,
  "fuentes": [],
  "omitidas": [],
  "cierre": null
};

/** Respuesta del lanzamiento general. */
export const RECOLECCION_GENERAL_ACEPTADA: IRecoleccion = {
  "estado": "EN_CURSO",
  "origen": "DEMANDA",
  "inicio": "2026-11-15T20:10:39.910071Z",
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
  "omitidas": [],
  "cierre": null
};

/** Avance con Remotive en pausa: Get on Board leída, Remotive leyendo, Remote OK pendiente. */
export const RECOLECCION_GENERAL_A_MITAD: IRecoleccion = {
  "estado": "EN_CURSO",
  "origen": "DEMANDA",
  "inicio": "2026-11-15T20:10:39.910071Z",
  "fin": null,
  "terminadas": 1,
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
      "paso": "LEYENDO",
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
  "omitidas": [],
  "cierre": null
};

/** Las tres leídas. */
export const RECOLECCION_GENERAL_TERMINADA: IRecoleccion = {
  "estado": "TERMINADA",
  "origen": "DEMANDA",
  "inicio": "2026-11-15T20:10:39.910071Z",
  "fin": "2026-11-15T20:10:41.617880Z",
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
  "omitidas": [],
  "cierre": null
};

/** Remotive falló y Remote OK bloqueó. */
export const RECOLECCION_TERMINADA_FALLO_BLOQUEO: IRecoleccion = {
  "estado": "TERMINADA",
  "origen": "DEMANDA",
  "inicio": "2026-11-15T20:10:43.061312Z",
  "fin": "2026-11-15T20:10:43.091759Z",
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
      "resultado": "FALLO",
      "ofertasLeidas": 0
    },
    {
      "fuente": "REMOTE_OK",
      "nombre": "Remote OK",
      "paso": "TERMINADA",
      "resultado": "BLOQUEO",
      "ofertasLeidas": 0
    }
  ],
  "omitidas": [],
  "cierre": null
};

/** Respuesta del lanzamiento de Remotive. */
export const RECOLECCION_UNA_FUENTE_ACEPTADA: IRecoleccion = {
  "estado": "EN_CURSO",
  "origen": "DEMANDA",
  "inicio": "2026-11-15T20:10:45.163214Z",
  "fin": null,
  "terminadas": 0,
  "total": 1,
  "fuentes": [
    {
      "fuente": "REMOTIVE",
      "nombre": "Remotive",
      "paso": "PENDIENTE",
      "resultado": null,
      "ofertasLeidas": null
    }
  ],
  "omitidas": [],
  "cierre": null
};

/** Remotive leída. */
export const RECOLECCION_UNA_FUENTE_TERMINADA: IRecoleccion = {
  "estado": "TERMINADA",
  "origen": "DEMANDA",
  "inicio": "2026-11-15T20:10:45.163214Z",
  "fin": "2026-11-15T20:10:45.201584Z",
  "terminadas": 1,
  "total": 1,
  "fuentes": [
    {
      "fuente": "REMOTIVE",
      "nombre": "Remotive",
      "paso": "TERMINADA",
      "resultado": "CORRECTA",
      "ofertasLeidas": 4
    }
  ],
  "omitidas": [],
  "cierre": null
};

/** General con Remotive en su tope. */
export const RECOLECCION_GENERAL_CON_OMITIDA: IRecoleccion = {
  "estado": "EN_CURSO",
  "origen": "DEMANDA",
  "inicio": "2026-11-15T20:10:46.749263Z",
  "fin": null,
  "terminadas": 0,
  "total": 2,
  "fuentes": [
    {
      "fuente": "GET_ON_BOARD",
      "nombre": "Get on Board",
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
      "fuente": "REMOTIVE",
      "nombre": "Remotive",
      "motivo": "TOPE_DIARIO"
    }
  ],
  "cierre": null
};

/** La anterior, terminada. */
export const RECOLECCION_GENERAL_CON_OMITIDA_TERMINADA: IRecoleccion = {
  "estado": "TERMINADA",
  "origen": "DEMANDA",
  "inicio": "2026-11-15T20:10:46.749263Z",
  "fin": "2026-11-15T20:10:46.804147Z",
  "terminadas": 2,
  "total": 2,
  "fuentes": [
    {
      "fuente": "GET_ON_BOARD",
      "nombre": "Get on Board",
      "paso": "TERMINADA",
      "resultado": "CORRECTA",
      "ofertasLeidas": 6
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
      "fuente": "REMOTIVE",
      "nombre": "Remotive",
      "motivo": "TOPE_DIARIO"
    }
  ],
  "cierre": null
};

/** Lanzamiento con otra en curso (409). */
export const RECHAZO_EN_CURSO: IRechazo = {
  "detail": "Ya hay una recolección en curso. Espera a que termine para lanzar otra.",
  "instance": "/api/recoleccion/REMOTE_OK",
  "status": 409,
  "title": "Conflict",
  "motivo": "EN_CURSO"
};

/** Fuente en su tope (409). */
export const RECHAZO_TOPE: IRechazo = {
  "detail": "Remotive ya recibió sus 3 lecturas de hoy. Vuelve a intentarlo mañana.",
  "instance": "/api/recoleccion/REMOTIVE",
  "status": 409,
  "title": "Conflict",
  "motivo": "TOPE_DIARIO"
};

/** Fuentes nunca leídas, con sus tres lecturas. */
export const FUENTES_SIN_LEER: IConexion[] = [
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
  }
];

/** Fuentes sin lecturas restantes. */
export const FUENTES_EN_TOPE: IConexion[] = [
  {
    "fuente": "GET_ON_BOARD",
    "nombre": "Get on Board",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-15T20:10:46.749263Z",
    "ultimaCorrecta": "2026-11-15T20:10:46.749263Z",
    "ofertasLeidas": 6,
    "lecturasRestantes": 0,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "REMOTIVE",
    "nombre": "Remotive",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-15T20:10:45.163214Z",
    "ultimaCorrecta": "2026-11-15T20:10:45.163214Z",
    "ofertasLeidas": 4,
    "lecturasRestantes": 0,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "REMOTE_OK",
    "nombre": "Remote OK",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-15T20:10:46.749263Z",
    "ultimaCorrecta": "2026-11-15T20:10:46.749263Z",
    "ofertasLeidas": 4,
    "lecturasRestantes": 0,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  }
];

/** Remotive pausada por la persona; las otras dos, listas. */
export const FUENTES_CON_PAUSADA: IConexion[] = [
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
    "avisosPorCorrida": null
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
    "pausada": true,
    "motivoPausa": null,
    "estadoConexion": "PAUSADA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
  }
];

/** Respuesta de pausar Remotive. */
export const CONEXION_PAUSADA: IConexion = {
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
  "pausada": true,
  "motivoPausa": null,
  "estadoConexion": "PAUSADA",
  "lecturasDia": 3,
  "avisosPorCorrida": null
};

/** Respuesta de reanudar Remotive. */
export const CONEXION_REANUDADA: IConexion = {
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
  "avisosPorCorrida": null
};

/** Lanzamiento general con Remotive pausada: la omite con su motivo. */
export const RECOLECCION_GENERAL_CON_PAUSADA: IRecoleccion = {
  "estado": "EN_CURSO",
  "origen": "DEMANDA",
  "inicio": "2026-11-16T00:56:21.682973Z",
  "fin": null,
  "terminadas": 0,
  "total": 2,
  "fuentes": [
    {
      "fuente": "GET_ON_BOARD",
      "nombre": "Get on Board",
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
      "fuente": "REMOTIVE",
      "nombre": "Remotive",
      "motivo": "PAUSADA"
    }
  ],
  "cierre": null
};

/** Lanzar una conexión pausada. */
export const RECHAZO_PAUSADA: IRechazo = {
  "detail": "Remotive está pausada. Reanúdala en Conexiones para leerla.",
  "instance": "/api/recoleccion/REMOTIVE",
  "status": 409,
  "title": "Conflict",
  "motivo": "PAUSADA"
};

/** Una conexión correcta, una sin leer y una bloqueada con su última lectura correcta del día anterior. */
export const FUENTES_DE_PRUEBA: IConexion[] = [
  {
    fuente: 'GET_ON_BOARD', nombre: 'Get on Board', estado: 'CORRECTA', detalle: null,
    ultimaLectura: '2026-11-15T12:00:00Z', ultimaCorrecta: '2026-11-15T12:00:00Z', ofertasLeidas: 40, lecturasRestantes: 2,
    via: 'SERVIDOR', necesita: 'NADA', tieneLoQueNecesita: true, pausada: false, motivoPausa: null, estadoConexion: 'LISTA',
    lecturasDia: 3, avisosPorCorrida: null,
  },
  {
    fuente: 'REMOTIVE', nombre: 'Remotive', estado: 'SIN_LEER', detalle: null,
    ultimaLectura: null, ultimaCorrecta: null, ofertasLeidas: 0, lecturasRestantes: 3,
    via: 'SERVIDOR', necesita: 'NADA', tieneLoQueNecesita: true, pausada: false, motivoPausa: null, estadoConexion: 'LISTA',
    lecturasDia: 3, avisosPorCorrida: null,
  },
  {
    fuente: 'REMOTE_OK', nombre: 'Remote OK', estado: 'BLOQUEO', detalle: 'el sitio rechazó la lectura (HTTP 403)',
    ultimaLectura: '2026-11-15T12:00:00Z', ultimaCorrecta: '2026-11-14T12:00:00Z', ofertasLeidas: 0, lecturasRestantes: 1,
    via: 'SERVIDOR', necesita: 'NADA', tieneLoQueNecesita: true, pausada: false, motivoPausa: null, estadoConexion: 'LISTA',
    lecturasDia: 3, avisosPorCorrida: null,
  },
];

/** Las tres conexiones pausadas (con lecturas de una recolección anterior). */
export const FUENTES_TODAS_PAUSADAS: IConexion[] = [
  {
    "fuente": "GET_ON_BOARD",
    "nombre": "Get on Board",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-16T00:56:21.682973Z",
    "ultimaCorrecta": "2026-11-16T00:56:21.682973Z",
    "ofertasLeidas": 6,
    "lecturasRestantes": 2,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": true,
    "motivoPausa": null,
    "estadoConexion": "PAUSADA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "REMOTIVE",
    "nombre": "Remotive",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-16T00:56:24.877020Z",
    "ultimaCorrecta": "2026-11-16T00:56:24.877020Z",
    "ofertasLeidas": 4,
    "lecturasRestantes": 2,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": true,
    "motivoPausa": null,
    "estadoConexion": "PAUSADA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "REMOTE_OK",
    "nombre": "Remote OK",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-16T00:56:21.682973Z",
    "ultimaCorrecta": "2026-11-16T00:56:21.682973Z",
    "ofertasLeidas": 4,
    "lecturasRestantes": 2,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": true,
    "motivoPausa": null,
    "estadoConexion": "PAUSADA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  }
];

// Conexiones de la máquina, copiadas de perfil-api local: corridas recorridas con el lector real y con los mandos locales.

/** Las tres del servidor listas y LinkedIn, de la máquina, sin sesión iniciada todavía. */
export const FUENTES_CON_MAQUINA: IConexion[] = [
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": 25
  }
];

/** Corrida de la máquina recién abierta (el código es ficticio, con el formato de la API). */
export const CORRIDA_MAQUINA_ABIERTA: ICorridaAbierta = {
  "codigo": "CodigoDePruebaCodigoDePruebaCodigoDePrueba0",
  "avance": {
    "estado": "EN_CURSO",
    "origen": "MAQUINA",
    "inicio": "2026-11-16T01:55:15.329406Z",
    "fin": null,
    "terminadas": 0,
    "total": 1,
    "fuentes": [
      {
        "fuente": "LINKEDIN",
        "nombre": "LinkedIn",
        "paso": "PENDIENTE",
        "resultado": null,
        "ofertasLeidas": null
      }
    ],
    "omitidas": [],
    "cierre": null
  }
};

/** Corrida de la máquina esperando al lector. */
export const RECOLECCION_MAQUINA_EN_CURSO: IRecoleccion = {
  "estado": "EN_CURSO",
  "origen": "MAQUINA",
  "inicio": "2026-11-16T01:55:15.329406Z",
  "fin": null,
  "terminadas": 0,
  "total": 1,
  "fuentes": [
    {
      "fuente": "LINKEDIN",
      "nombre": "LinkedIn",
      "paso": "PENDIENTE",
      "resultado": null,
      "ofertasLeidas": null
    }
  ],
  "omitidas": [],
  "cierre": null
};

/** El lector no se reportó: la API cerró la corrida con ese motivo. */
export const RECOLECCION_MAQUINA_SIN_RESPUESTA: IRecoleccion = {
  "estado": "TERMINADA",
  "origen": "MAQUINA",
  "inicio": "2026-11-16T01:55:15.329406Z",
  "fin": "2026-11-16T01:57:20.013221Z",
  "terminadas": 1,
  "total": 1,
  "fuentes": [
    {
      "fuente": "LINKEDIN",
      "nombre": "LinkedIn",
      "paso": "TERMINADA",
      "resultado": "FALLO",
      "ofertasLeidas": 0
    }
  ],
  "omitidas": [],
  "cierre": "LECTOR_SIN_RESPUESTA"
};

/** Tras el cierre por lector sin respuesta: LinkedIn conserva su lectura del día. */
export const FUENTES_TRAS_SIN_RESPUESTA: IConexion[] = [
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": 25
  }
];

/** El lector entregó LinkedIn. */
export const RECOLECCION_MAQUINA_TERMINADA: IRecoleccion = {
  "estado": "TERMINADA",
  "origen": "MAQUINA",
  "inicio": "2026-11-16T01:57:34.212573Z",
  "fin": "2026-11-16T01:57:34.267394Z",
  "terminadas": 1,
  "total": 1,
  "fuentes": [
    {
      "fuente": "LINKEDIN",
      "nombre": "LinkedIn",
      "paso": "TERMINADA",
      "resultado": "CORRECTA",
      "ofertasLeidas": 5
    }
  ],
  "omitidas": [],
  "cierre": null
};

/** LinkedIn leída hoy: sin lecturas restantes. */
export const FUENTES_TRAS_LECTURA_MAQUINA: IConexion[] = [
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
  },
  {
    "fuente": "LINKEDIN",
    "nombre": "LinkedIn",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-16T01:57:34.212573Z",
    "ultimaCorrecta": "2026-11-16T01:57:34.212573Z",
    "ofertasLeidas": 5,
    "lecturasRestantes": 0,
    "via": "MAQUINA",
    "necesita": "SESION",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 1,
    "avisosPorCorrida": 25
  }
];

/** Abrir otra corrida sin conexiones de la máquina disponibles (409). */
export const RECHAZO_SIN_MAQUINA: IRechazo = {
  "detail": "Ninguna conexión de tu máquina se puede leer ahora: están pausadas o ya recibieron sus lecturas de hoy.",
  "instance": "/api/recoleccion/maquina",
  "status": 409,
  "title": "Conflict",
  "motivo": "SIN_FUENTES"
};

/** La programada no lee LinkedIn y lo dice. */
export const RECOLECCION_PROGRAMADA_OMITE_MAQUINA: IRecoleccion = {
  "estado": "TERMINADA",
  "origen": "PROGRAMADA",
  "inicio": "2026-11-17T01:57:50.639882Z",
  "fin": "2026-11-17T01:57:50.809867Z",
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
      "fuente": "LINKEDIN",
      "nombre": "LinkedIn",
      "motivo": "DESDE_MAQUINA"
    }
  ],
  "cierre": null
};

/** LinkedIn pidió una verificación: queda pausada con ese motivo. */
export const FUENTES_PAUSADA_VERIFICACION: IConexion[] = [
  {
    "fuente": "GET_ON_BOARD",
    "nombre": "Get on Board",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-17T01:57:50.639882Z",
    "ultimaCorrecta": "2026-11-17T01:57:50.639882Z",
    "ofertasLeidas": 6,
    "lecturasRestantes": 2,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "REMOTIVE",
    "nombre": "Remotive",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-17T01:57:50.639882Z",
    "ultimaCorrecta": "2026-11-17T01:57:50.639882Z",
    "ofertasLeidas": 4,
    "lecturasRestantes": 2,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "REMOTE_OK",
    "nombre": "Remote OK",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-17T01:57:50.639882Z",
    "ultimaCorrecta": "2026-11-17T01:57:50.639882Z",
    "ofertasLeidas": 4,
    "lecturasRestantes": 2,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "LINKEDIN",
    "nombre": "LinkedIn",
    "estado": "BLOQUEO",
    "detalle": "el sitio pidió una verificación",
    "ultimaLectura": "2026-11-17T01:57:52.763298Z",
    "ultimaCorrecta": "2026-11-16T01:57:34.212573Z",
    "ofertasLeidas": 0,
    "lecturasRestantes": 0,
    "via": "MAQUINA",
    "necesita": "SESION",
    "tieneLoQueNecesita": true,
    "pausada": true,
    "motivoPausa": "el sitio pidió una verificación",
    "estadoConexion": "PAUSADA",
    "lecturasDia": 1,
    "avisosPorCorrida": 25
  }
];

/** Otro día, LinkedIn reanudada y pendiente de leer desde la máquina. */
export const FUENTES_PENDIENTE_MAQUINA: IConexion[] = [
  {
    "fuente": "GET_ON_BOARD",
    "nombre": "Get on Board",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-18T01:58:01.045488Z",
    "ultimaCorrecta": "2026-11-18T01:58:01.045488Z",
    "ofertasLeidas": 6,
    "lecturasRestantes": 2,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "REMOTIVE",
    "nombre": "Remotive",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-18T01:58:01.045488Z",
    "ultimaCorrecta": "2026-11-18T01:58:01.045488Z",
    "ofertasLeidas": 4,
    "lecturasRestantes": 2,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "REMOTE_OK",
    "nombre": "Remote OK",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-18T01:58:01.045488Z",
    "ultimaCorrecta": "2026-11-18T01:58:01.045488Z",
    "ofertasLeidas": 4,
    "lecturasRestantes": 2,
    "via": "SERVIDOR",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": null
  },
  {
    "fuente": "LINKEDIN",
    "nombre": "LinkedIn",
    "estado": "BLOQUEO",
    "detalle": "el sitio pidió una verificación",
    "ultimaLectura": "2026-11-17T01:57:52.763298Z",
    "ultimaCorrecta": "2026-11-16T01:57:34.212573Z",
    "ofertasLeidas": 0,
    "lecturasRestantes": 1,
    "via": "MAQUINA",
    "necesita": "SESION",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "PENDIENTE_MAQUINA",
    "lecturasDia": 1,
    "avisosPorCorrida": 25
  }
];

/** LinkedIn y Bumeran leídas hoy desde la máquina: a Bumeran le quedan 2 de sus 3 lecturas. */
export const FUENTES_CON_BUMERAN: IConexion[] = [
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
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
    "avisosPorCorrida": null
  },
  {
    "fuente": "LINKEDIN",
    "nombre": "LinkedIn",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-16T03:15:05.996825Z",
    "ultimaCorrecta": "2026-11-16T03:15:05.996825Z",
    "ofertasLeidas": 5,
    "lecturasRestantes": 0,
    "via": "MAQUINA",
    "necesita": "SESION",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 1,
    "avisosPorCorrida": 25
  },
  {
    "fuente": "BUMERAN",
    "nombre": "Bumeran",
    "estado": "CORRECTA",
    "detalle": null,
    "ultimaLectura": "2026-11-16T03:14:59.903730Z",
    "ultimaCorrecta": "2026-11-16T03:14:59.903730Z",
    "ofertasLeidas": 5,
    "lecturasRestantes": 2,
    "via": "MAQUINA",
    "necesita": "NADA",
    "tieneLoQueNecesita": true,
    "pausada": false,
    "motivoPausa": null,
    "estadoConexion": "LISTA",
    "lecturasDia": 3,
    "avisosPorCorrida": 25
  }
];
