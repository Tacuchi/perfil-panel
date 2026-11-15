/** Una versión del historial, como la entrega la API. */
export interface IVersion {
  id: string;
  fecha: string;
  conWord: boolean;
  vigente: boolean;
}

/** Cuerpo de error de la API (RFC 9457). `campo` y `motivo` vienen en los rechazos de una carga. */
export interface IProblema {
  status?: number;
  detail?: string;
  campo?: 'pdf' | 'word' | null;
  motivo?: 'FALTA' | 'TIPO' | 'TAMANO';
}
