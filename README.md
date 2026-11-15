# perfil-panel

Panel privado de perfil.tacuchi.net para subir el CV y manejar su historial.

Una sola pantalla en Angular 22 con Angular Material: subir un PDF con su Word opcional, ver el historial con la vigente marcada, descargar cualquier versión y dejar una anterior como vigente. Habla solo con `perfil-api`, bajo la misma dirección (`/api`).

## Desarrollo

Requiere Node 24.15 o superior (`.nvmrc`).

- `npm ci` instala las versiones fijadas.
- `npm test` corre las pruebas (Vitest).
- `npm run build` genera el sitio estático en `dist/perfil-panel/browser`.

## Despliegue

`.github/workflows/deploy.yml` prueba, construye la imagen (nginx con el sitio estático) con la etiqueta del commit y redespliega en Coolify. Cloudflare Access protege la dirección; las rutas del proxy viven en `perfil-api/deploy/traefik-dynamic.yml`.
