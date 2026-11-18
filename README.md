# perfil-panel

> Panel privado de `<tu-dominio>`: el CV y el monitor de ofertas.

Angular 22 con Angular Material, con cuatro módulos en la barra de navegación: CV, Ofertas, Conexiones y Ajustes.

Sus llamadas HTTP van solo a la api, bajo la misma dirección (`/api`); el navegador carga además la tipografía y los íconos desde Google Fonts.

## Instalación

### Requisitos

Requiere Node 24, desde la 24.15 (`package.json` y `.nvmrc`).

### Instalar

- `npm ci` instala las versiones fijadas.
- `npm test` corre las pruebas (Vitest).
- `npm run build` genera el sitio estático en `dist/perfil-panel/browser`.

### Desarrollo local

- `npm start` sirve el panel en `http://localhost:4200` y manda `/api` a la api local (`proxy.conf.mjs`). Con la api levantada por `./mvnw spring-boot:test-run`, arranca con `PERFIL_CODIGO_LOCAL="$(cat ../perfil-api/target/codigo-local.jwt)" npm start`.

### Despliegue

`.github/workflows/deploy.yml` prueba y construye en cada push que no sea solo de documentación. En `main`, además, construye la imagen (nginx con el sitio estático) con la etiqueta del commit y pide el redespliegue al orquestador. El proxy de acceso protege la dirección; el enrutador reparte `/api` y el panel, y sus rutas viven en el repositorio de la api, en `deploy/traefik-dynamic.yml`.

## Uso

- **CV** (`/cv`): subir un PDF con su Word opcional, ver el historial con la vigente marcada, descargar cualquier versión y dejar una anterior como vigente.
- **Ofertas** (`/ofertas`): la lista de ofertas con su encaje y motivo, y filtros por encaje, estado, fuente, modalidad, tecnología y fecha. Cada oferta (`/ofertas/<id>`, el enlace del correo diario) se marca como guardada, descartada o postulada, abre su publicación original y, si trae correo de contacto, arma el correo con el enlace al CV. El panel nunca postula ni escribe por la persona.
- **Conexiones** (`/conexiones`): el estado de cada fuente de ofertas, su historial de lecturas, la pausa, y la clave y el tope mensual de las de pago. Desde aquí se lanza la lectura, para todas las fuentes o para una, o desde la máquina de la persona con el lector local, y se sigue su avance.
- **Ajustes** (`/ajustes`): el tema claro u oscuro y la paleta de colores, guardados en este navegador.

## Cómo funciona

El panel es un sitio estático que nginx sirve detrás del proxy de acceso. En el navegador, cada pantalla pide sus datos a la api por `/api`; el panel no guarda nada propio salvo el tema elegido. La lectura desde la máquina se delega al lector local con un enlace `perfil-lector://`.

![Diagrama de contexto de perfil-panel](docs/architecture/context.svg)

El cuadro completo está en [ARCHITECTURE.md](ARCHITECTURE.md).

## Contribuir

Es un proyecto personal: no se aceptan contribuciones externas.

## Licencia

[MIT](LICENSE). El paquete está marcado como privado en `package.json`: no se publica en npm.
