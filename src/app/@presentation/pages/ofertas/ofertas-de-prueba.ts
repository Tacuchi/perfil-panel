import { IOferta, IOfertaDetalle } from '../../../@data/interfaces/oferta';

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
