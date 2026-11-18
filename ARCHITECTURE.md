# Arquitectura de perfil-panel

Revisado el 2026-11-18 contra la versión 0.0.0 (commit `25702d9`).

Vista general del panel: qué partes existen, con quién habla y qué reglas no se rompen. Cubre la aplicación Angular de `src/`, su imagen y su despliegue; no la api, el lector local, el sitio público ni el proxy de acceso, que viven en otros repositorios o fuera de ellos. Todos los valores son los de por defecto.

En resumen:

- Es el panel privado del sistema perfil-profesional: una aplicación de una sola página en el navegador.
- Tiene cuatro pantallas de trabajo: CV, Ofertas, Conexiones y Ajustes.
- Sus peticiones van solo a la api, bajo `/api` en la misma dirección, detrás del proxy de acceso.
- Los datos viven en la api; el navegador guarda solo el tema y la paleta.
- La regla que importa: ningún error pasa en silencio.

## 1. Propósito y metas de calidad

perfil-panel deja a la persona subir y manejar las versiones de su CV, revisar las ofertas que recoge la api, operar las conexiones de donde salen y elegir el tema. El panel solo muestra el dato y manda los cambios.

Qué no es:

- No es un servidor de datos: la imagen es nginx sirviendo archivos estáticos.
- No guarda el CV, las ofertas ni las claves: todo eso vive en la api.
- No inicia sesión: el proxy de acceso protege la dirección antes de que el panel cargue.

Dos límites y dos metas más están en [la guía de funcionamiento](docs/funcionamiento.md#qué-no-es-y-otras-metas).

| Meta | Escenario |
|---|---|
| Ningún error pasa en silencio | Cada error de HTTP se muestra con su causa y se relanza a quien llamó. |
| Una sesión vencida tiene salida | Un 401 o una petición sin respuesta muestran un aviso con el botón Recargar, que vuelve a pasar por el proxy de acceso. |
| La clave de una conexión no se queda a la vista | El campo se vacía en cuanto la clave sale hacia la api, y la api solo devuelve si existe y desde cuándo. |

## 2. Contexto y alcance

![Diagrama de contexto de perfil-panel](docs/architecture/context.svg)

[Versión interactiva](https://tacuchi.github.io/perfil-panel/architecture/context.html).

| Interfaz externa | Dirección | Cuándo ocurre |
|---|---|---|
| Persona en el navegador | Entrante | Al abrir el panel; toda ruta sirve la misma aplicación. |
| Proxy de acceso | Entrante, delante del panel | En cada petición: pide la sesión antes de servir el panel o la api. |
| API, bajo `/api` | Saliente, HTTP a la misma dirección | Al abrir cada pantalla, en cada acción y cada segundo con una recolección en curso. |
| Lector local | Saliente, enlace `perfil-lector://` | Solo con el botón «Leer desde mi máquina» de Conexiones. |
| Aplicación de correo | Saliente, enlace `mailto:` | Cuando la persona elige escribir al contacto de una oferta. |
| Google Fonts | Saliente, desde el navegador | Al cargar la página: la tipografía y los íconos. |
| Orquestador | Entrante, despliegue | En cada push a `main` que no sea solo de documentación. |

Desde el detalle de una oferta, la persona también abre su publicación original en otra pestaña.

## 3. Bloques de construcción

![Diagrama de contenedores de perfil-panel](docs/architecture/containers.svg)

[Versión interactiva](https://tacuchi.github.io/perfil-panel/architecture/containers.html).

| Bloque | Responsabilidad | Código |
|---|---|---|
| Estructura y rutas | Arranca la aplicación, elige la navegación según el ancho y carga cada pantalla al entrar a su ruta. | `src/main.ts`, `src/app/app.ts`, `src/app/app.routes.ts`, `src/app/app.config.ts` |
| Pantallas | CV, Ofertas, Oferta, Conexiones y Ajustes; [la guía](docs/funcionamiento.md#pantallas) dice qué hace cada una. | `src/app/@presentation/pages/` |
| Servicios de datos | Uno por recurso de la api: versiones, ofertas, conexiones y recolección. | `src/app/@data/services/` |
| Cliente HTTP | Único punto de HTTP; traduce cada error a un aviso y lo vuelve a lanzar. | `src/app/@data/services/api-client.service.ts`, `src/app/@data/services/toast.service.ts` |
| Contratos | Las formas que entrega la api, escritas como interfaces. | `src/app/@data/interfaces/` |
| Imagen | Construye el sitio y lo sirve con nginx en el puerto 80. | `Dockerfile`, `nginx.conf` |
| Entrega | Prueba, construye la imagen y pide el despliegue al orquestador. | `.github/workflows/deploy.yml` |

Reglas que no se rompen:

- Toda llamada HTTP pasa por el cliente único; ningún servicio usa el cliente de Angular directamente.
- Ningún error se silencia: se muestra y se vuelve a lanzar.
- El panel solo hace peticiones a la api, siempre bajo `/api` en la misma dirección.
- La clave de una conexión sale una vez hacia la api y no vuelve: la api solo dice si existe y desde cuándo.
- El código de una corrida desde la máquina solo viaja en el enlace del lector local; no se guarda.
- Ninguna consulta de avance queda viva al salir de Conexiones.
- El panel nunca postula ni escribe a un contacto: solo abre la aplicación de correo de la persona.

## 4. Vista de ejecución

Recolección a demanda desde Conexiones:

1. Al abrir Conexiones, el panel pide a la api la recolección en curso o el resultado de la última.
2. La persona pulsa Leer, para todas las fuentes o para una. La api responde al instante y sigue leyendo por su cuenta.
3. Mientras la recolección está en curso, el panel consulta su avance cada segundo.
4. Cada vez que una fuente termina, vuelve a cargar las conexiones para mostrar sus lecturas restantes.
5. Al terminar la recolección deja de consultar y recarga las conexiones una última vez.
6. Si una consulta falla, se detiene: el aviso ya salió y seguir preguntando con la sesión vencida no sirve.
7. Al salir de la pantalla se cancela la consulta pendiente.

La lectura desde la máquina de la persona abre el lector local y sigue el avance igual; [la guía](docs/funcionamiento.md#leer-desde-la-máquina) da sus pasos.

## 5. Vista de despliegue

| Qué | Por defecto | Cuándo aplica | Cómo cambiarlo |
|---|---|---|---|
| Imagen | nginx con el sitio de `dist/perfil-panel/browser`, puerto 80 | Siempre | `Dockerfile` y `nginx.conf` |
| Registro | `ghcr.io/<owner>/perfil-panel`, etiquetada con el commit | En cada push a `main` | Variable `IMAGE` del workflow |
| Redespliegue | Fija la etiqueta del commit en el orquestador y pide el despliegue | En `main`, con los secretos `COOLIFY_TOKEN` y `COOLIFY_APP_UUID` | Sin esos secretos el paso se salta y la ejecución queda en verde |
| Cambios solo de documentación | No corren pruebas ni despliegue | Push que solo toca `docs/**`, `README.md` o `ARCHITECTURE.md` | `paths-ignore` del workflow |
| Dirección de la api | `/api`, en la misma dirección que el panel | Siempre | `src/environments/environment.ts` |
| Caché | `index.html` sin caché; JS y CSS con huella, un año | Siempre | `nginx.conf` |
| Servidor de desarrollo | `npm start`, con `/api` hacia `http://localhost:8080` | Solo en desarrollo | `proxy.conf.mjs` |

La imagen, la concurrencia, la sesión de desarrollo y los valores iniciales de la interfaz siguen en [la guía de configuración](docs/configuracion.md).

Requisitos: Node 24, desde la 24.15, y npm.

Despliegue opcional: en local, `npm start` sirve el panel con recarga.

## 6. Conceptos transversales

Datos y privacidad:

| Pregunta | Respuesta |
|---|---|
| ¿Qué sale del navegador y a dónde va? | A la api, lo que la persona sube o cambia; a Google Fonts, la petición de fuentes; al lector local y al correo, un enlace ([detalle](docs/funcionamiento.md#qué-sale-del-navegador)). |
| ¿Qué nunca sale? | La elección de tema y paleta, que se queda en el navegador. La clave de una conexión no vuelve de la api ni queda en la pantalla. |
| ¿Cuándo ocurre? | Al abrir una pantalla, en cada acción de la persona y cada segundo con una recolección en curso; las fuentes, al cargar la página. |
| ¿Dónde se guarda y por cuánto tiempo? | Solo el tema y la paleta, en el `localStorage` del navegador y sin caducidad; el panel no tiene base de datos. |
| ¿Cómo se ve exactamente lo que se envió? | No hay un registro propio. Las herramientas de desarrollo del navegador muestran cada petición. |
| ¿Cómo se apaga? | No hay interruptor: borrar los datos del sitio quita el tema, y las fuentes se cargan siempre desde `index.html`. |

Seguridad:

- El panel no maneja credenciales: el proxy de acceso pide la sesión antes de servir el panel y la api.
- El error se decide por el estado HTTP, no por el cuerpo, porque un proxy puede responder con HTML.
- Cada valor que va en una dirección se codifica, y la publicación original se abre con `noopener` y `noreferrer`.
- La cabecera de sesión de desarrollo solo existe en `proxy.conf.mjs`; producción no usa ese archivo.

Persistencia:

- Cada pantalla vuelve a pedir sus datos a la api al abrirse.
- El estado de cada pantalla vive en memoria, en stores con signals de Angular.
- Si el `localStorage` no está disponible, el panel sigue al sistema con la paleta verde y no avisa.

## 7. Decisiones

Los siete registros están en [docs/decisions/](docs/decisions/). Los que más pesan:

| Decisión | Registro |
|---|---|
| El panel llama a la api bajo la misma dirección, en `/api` | [0001](docs/decisions/0001-la-api-bajo-la-misma-direccion.md) |
| Los errores se deciden por el estado HTTP y una sesión vencida se resuelve recargando | [0002](docs/decisions/0002-errores-por-estado-http.md) |
| El tema se guarda solo en el navegador | [0005](docs/decisions/0005-el-tema-se-guarda-en-el-navegador.md) |
| El avance de una recolección se consulta cada segundo, sin flujo de eventos | [0006](docs/decisions/0006-avance-cada-segundo-sin-eventos.md) |
| El panel usa Angular 22 | [0007](docs/decisions/0007-angular-22.md) |

No registrado aún:

- Por qué el panel usa Angular Material.
- Por qué las bases de la imagen se fijan por digest y la imagen se etiqueta con el commit.
- Por qué el panel no envía el correo ni postula, y solo arma el enlace.
- Por qué la tipografía y los íconos se cargan desde Google Fonts en vez de servirse con el panel.

## Anexo: evidencia

Los números de línea refieren al commit `25702d9`. El texto de arriba no enlaza al código a propósito.

| Sección | Evidencia |
|---|---|
| 1. Propósito y metas | `package.json:2`, `src/app/app.routes.ts:4-48`, `src/app/@data/services/api-client.service.ts:13-37`, `src/app/@data/services/api-client.service.ts:41-50`, `src/app/@presentation/shared/components/conexion-pago/conexion-pago.component.ts:61-64` |
| 1. Qué no es | `Dockerfile:9-13`, `nginx.conf:7-11`, `src/app/@data/interfaces/conexion.ts:36-38`, `src/app/@data/services/toast.service.ts:18-24` |
| 2. Contexto | `src/environments/environment.ts:1-4`, `src/app/Utils/const.ts:118-119`, `src/app/Utils/correo.ts:3-11`, `src/index.html:10-18`, `.github/workflows/deploy.yml:65-78` |
| 3. Bloques | `src/app/app.ts:18-47`, `src/app/app.routes.ts:4-48`, `src/app/@data/services/api-client.service.ts:13-37`, `Dockerfile:2-13`, `.github/workflows/deploy.yml:23-78` |
| 3. Reglas | `src/app/@data/services/api-client.service.ts:13-37`, `src/environments/environment.ts:1-4`, `src/app/@data/interfaces/conexion.ts:36-38`, `src/app/@data/interfaces/recoleccion.ts:45-49`, `src/app/@presentation/pages/conexiones/conexiones-page.component.ts:95-101`. Una búsqueda de `HttpClient` en `src/app/` solo lo encontró en la configuración, en el cliente único y en las pruebas |
| 4. Ejecución | `src/app/@presentation/pages/conexiones/recoleccion.store.ts:44-70`, `src/app/@data/services/recoleccion.service.ts:18-21`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:95-131`, `src/app/Utils/const.ts:53-54`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:72-93` |
| 5. Despliegue | `Dockerfile:1-13`, `nginx.conf:1-21`, `.github/workflows/deploy.yml:6-21`, `.github/workflows/deploy.yml:38-78`, `proxy.conf.mjs:1-14` |
| 5. Requisitos y opcionales | `package.json:4-10`, `package.json:34-36`, `.nvmrc:1`, `.github/workflows/deploy.yml:45-47`, `.github/workflows/deploy.yml:60` |
| 6. Privacidad | `src/app/@data/services/versiones.service.ts:16-27`, `src/app/@data/services/conexiones.service.ts:32-39`, `src/index.html:10-18`, `src/app/Utils/const.ts:14`, `src/app/@presentation/shared/tema.store.ts:22-23` |
| 6. Seguridad | `src/app/@data/services/api-client.service.ts:40-61`, `src/app/@presentation/pages/oferta/oferta-page.component.html:59`, `src/app/Utils/query.ts:3-19`, `src/app/Utils/correo.ts:7-11`, `proxy.conf.mjs:1-2` |
| 6. Persistencia | `src/app/@presentation/pages/conexiones/conexiones.store.ts:14-27`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:35-42`, `src/app/@presentation/shared/tema.store.ts:26-29`, `src/app/@presentation/shared/tema.store.ts:66-72` |
| 7. Decisiones | `src/environments/environment.ts:1`, `src/app/@data/services/api-client.service.ts:40`, `src/app/@presentation/shared/tema.store.ts:26-29`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:95-103`, `package.json:14-21`. Una búsqueda de `EventSource` y `WebSocket` en `src/` no encontró nada |
