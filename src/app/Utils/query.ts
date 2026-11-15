type ValorConsulta = string | number | null | undefined | readonly (string | number)[];

/**
 * Query string a partir de un objeto: recorta, descarta vacíos y nulos (conserva el 0) y une listas con coma,
 * que es como la API las lee. Devuelve '' o '?a=1&b=x,y'.
 */
export function buildQuery(parametros: Record<string, ValorConsulta>): string {
  const partes: string[] = [];
  for (const [clave, valor] of Object.entries(parametros)) {
    const valores = (Array.isArray(valor) ? valor : [valor])
      .filter((v): v is string | number => v !== null && v !== undefined)
      .map((v) => String(v).trim())
      .filter((v) => v !== '');
    if (valores.length > 0) {
      partes.push(`${encodeURIComponent(clave)}=${valores.map(encodeURIComponent).join(',')}`);
    }
  }
  return partes.length > 0 ? `?${partes.join('&')}` : '';
}
