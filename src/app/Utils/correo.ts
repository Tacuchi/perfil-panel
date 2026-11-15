import { URL_CV_PUBLICO } from './const';

/**
 * Enlace que abre la aplicación de correo con el destinatario, el título como asunto y el enlace al CV.
 * El resto del mensaje lo escribe la persona.
 */
export function enlaceCorreo(destinatario: string, titulo: string): string {
  const asunto = encodeURIComponent(titulo);
  const cuerpo = encodeURIComponent(`\n\nMi CV: ${URL_CV_PUBLICO}\n`);
  return `mailto:${encodeURIComponent(destinatario)}?subject=${asunto}&body=${cuerpo}`;
}
