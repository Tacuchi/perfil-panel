import { IFuente, IOferta, IOfertaDetalle } from '../../../@data/interfaces/oferta';

/** Respuestas con la forma exacta que entrega perfil-api. */
export function ofertaDePrueba(cambios: Partial<IOferta> = {}): IOferta {
  return {
    id: 1,
    fuente: 'GET_ON_BOARD',
    fuenteNombre: 'Get on Board',
    titulo: 'Desarrollador Angular Senior',
    empresa: 'Acme',
    fecha: '2026-11-10T15:00:00Z',
    ubicacion: 'Latinoamérica',
    modalidad: 'REMOTO',
    url: 'https://www.getonbrd.com/jobs/desarrollador-angular-senior-acme',
    encaje: 'ALTO',
    motivos: ['Menciona tecnologías principales: Angular.', 'Remota, admite candidatos desde Perú.'],
    tecnologias: ['Angular'],
    estado: 'NUEVA',
    postuladaEn: null,
    publicada: true,
    conCorreo: false,
    posiblesRepetidas: [],
    ...cambios,
  };
}

export function detalleDePrueba(cambios: Partial<IOferta> = {}, correo: string | null = null): IOfertaDetalle {
  return {
    oferta: ofertaDePrueba({ ...cambios, conCorreo: correo !== null }),
    descripcion: 'Buscamos experiencia con Angular.\nInglés técnico.',
    correoContacto: correo,
  };
}

export const FUENTES_DE_PRUEBA: IFuente[] = [
  {
    fuente: 'GET_ON_BOARD', nombre: 'Get on Board', estado: 'CORRECTA', detalle: null,
    ultimaLectura: '2026-11-15T12:00:00Z', ultimaCorrecta: '2026-11-15T12:00:00Z', ofertasLeidas: 40,
  },
  {
    fuente: 'REMOTIVE', nombre: 'Remotive', estado: 'SIN_LEER', detalle: null,
    ultimaLectura: null, ultimaCorrecta: null, ofertasLeidas: 0,
  },
  {
    fuente: 'REMOTE_OK', nombre: 'Remote OK', estado: 'BLOQUEO', detalle: 'el sitio rechazó la lectura (HTTP 403)',
    ultimaLectura: '2026-11-15T12:00:00Z', ultimaCorrecta: '2026-11-14T12:00:00Z', ofertasLeidas: 0,
  },
];
