import { IConexion } from '../../../@data/interfaces/conexion';
import { ESTADOS_LECTURA, LECTURA_PARCIAL } from '../../../Utils/const';

export function estadoConexion(conexion: Pick<IConexion, 'estado' | 'parcial'>): string {
  return conexion.parcial ? LECTURA_PARCIAL : ESTADOS_LECTURA[conexion.estado];
}

export function iconoConexion(conexion: Pick<IConexion, 'estado' | 'parcial'>): string {
  if (conexion.parcial) return 'warning';
  return { CORRECTA: 'check_circle', FALLO: 'error', BLOQUEO: 'block', SIN_LEER: 'schedule' }[conexion.estado];
}

export function dolaresResumen(monto: number): string {
  return `US$ ${monto.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.abs(monto) >= 0.01 ? 2 : 4,
  })}`;
}

export function duracionLectura(milisegundos: number): string {
  if (milisegundos < 1000) return '<1 s';
  const segundos = Math.floor(milisegundos / 1000);
  if (segundos < 60) return `${segundos} s`;
  return `${Math.floor(segundos / 60)} min ${segundos % 60} s`;
}
