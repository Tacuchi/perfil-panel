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
  "omitidas": []
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
  "omitidas": []
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
  "omitidas": []
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
  "omitidas": []
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
  "omitidas": []
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
  "omitidas": []
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
  "omitidas": []
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
  ]
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
  ]
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
    "estadoConexion": "LISTA"
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
    "estadoConexion": "LISTA"
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
    "estadoConexion": "LISTA"
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
    "estadoConexion": "LISTA"
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
    "estadoConexion": "LISTA"
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
    "estadoConexion": "LISTA"
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
    "estadoConexion": "LISTA"
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
    "estadoConexion": "PAUSADA"
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
    "estadoConexion": "LISTA"
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
  "estadoConexion": "PAUSADA"
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
  "estadoConexion": "LISTA"
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
  ]
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
  },
  {
    fuente: 'REMOTIVE', nombre: 'Remotive', estado: 'SIN_LEER', detalle: null,
    ultimaLectura: null, ultimaCorrecta: null, ofertasLeidas: 0, lecturasRestantes: 3,
    via: 'SERVIDOR', necesita: 'NADA', tieneLoQueNecesita: true, pausada: false, motivoPausa: null, estadoConexion: 'LISTA',
  },
  {
    fuente: 'REMOTE_OK', nombre: 'Remote OK', estado: 'BLOQUEO', detalle: 'el sitio rechazó la lectura (HTTP 403)',
    ultimaLectura: '2026-11-15T12:00:00Z', ultimaCorrecta: '2026-11-14T12:00:00Z', ofertasLeidas: 0, lecturasRestantes: 1,
    via: 'SERVIDOR', necesita: 'NADA', tieneLoQueNecesita: true, pausada: false, motivoPausa: null, estadoConexion: 'LISTA',
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
    "estadoConexion": "PAUSADA"
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
    "estadoConexion": "PAUSADA"
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
    "estadoConexion": "PAUSADA"
  }
];
