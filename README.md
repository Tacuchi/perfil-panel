# perfil-panel

Panel privado de perfil.tacuchi.net: el CV y el monitor de ofertas.

Angular 22 con Angular Material, con dos módulos en la barra de navegación:

- **CV** (`/cv`): subir un PDF con su Word opcional, ver el historial con la vigente marcada, descargar cualquier versión y dejar una anterior como vigente.
- **Ofertas** (`/ofertas`): la lista de ofertas con su encaje y motivo, filtros por encaje, estado, fuente, modalidad, tecnología y fecha, y el estado de cada fuente. Cada oferta (`/ofertas/<id>`, el enlace del correo diario) se marca como guardada, descartada o postulada, abre su publicación original y, si trae correo de contacto, arma el correo con el enlace al CV. El panel nunca postula ni escribe por la persona.

Habla solo con `perfil-api`, bajo la misma dirección (`/api`).

## Desarrollo

Requiere Node 24.15 o superior (`.nvmrc`).

- `npm ci` instala las versiones fijadas.
- `npm test` corre las pruebas (Vitest).
- `npm start` sirve el panel en `http://localhost:4200` y manda `/api` a la API local (`proxy.conf.mjs`). Con `perfil-api` levantado por `./mvnw spring-boot:test-run`, arranca con `PERFIL_CODIGO_LOCAL="$(cat ../perfil-api/target/codigo-local.jwt)" npm start`.
- `npm run build` genera el sitio estático en `dist/perfil-panel/browser`.

## Despliegue

`.github/workflows/deploy.yml` prueba, construye la imagen (nginx con el sitio estático) con la etiqueta del commit y redespliega en Coolify. Cloudflare Access protege la dirección; las rutas del proxy viven en `perfil-api/deploy/traefik-dynamic.yml`.
