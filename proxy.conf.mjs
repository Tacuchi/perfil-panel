// Solo para `npm start`: manda /api a la API local con el código firmado por su Access de prueba.
// Producción no usa este archivo: allí la cabecera la pone Cloudflare Access.
const codigo = process.env.PERFIL_CODIGO_LOCAL ?? '';
if (!codigo) {
  console.warn('PERFIL_CODIGO_LOCAL vacío: la API responderá 401 y el panel pedirá recargar.');
}

export default {
  '/api': {
    target: 'http://localhost:8080',
    secure: false,
    headers: { 'Cf-Access-Jwt-Assertion': codigo },
  },
};
