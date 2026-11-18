# Arquitectura de perfil-panel

Revisado el 2026-11-18 contra la versión 0.0.0 (commit `25702d9`).

Este documento da la vista general del panel: qué partes existen, con quién habla y qué reglas no se rompen. Describe la aplicación Angular de `src/`, su imagen y su despliegue. No describe la api, el lector local, el sitio público ni el proxy de acceso, que viven en otros repositorios o fuera de ellos. Todos los valores son los de por defecto; nada aquí se midió en una máquina concreta.

## 1. Propósito y metas de calidad

perfil-panel es el panel privado del sistema perfil-profesional. Es una aplicación de una sola página que corre en el navegador de la persona y le deja hacer cuatro cosas: subir y manejar las versiones de su CV, revisar las ofertas que recoge la api, operar las conexiones de donde salen esas ofertas y elegir el tema de la interfaz. Todo el dato vive en la api; el panel solo lo muestra y manda los cambios.

Qué no es:

- No es un servidor de datos: la imagen es nginx sirviendo archivos estáticos.
- No guarda el CV, las ofertas ni las claves: todo eso vive en la api.
- No inicia sesión: el proxy de acceso protege la dirección antes de que el panel cargue.
- No postula ni envía correos: abre la aplicación de correo de la persona con el mensaje a medio armar.
- No lee las fuentes de ofertas: pide a la api que lo haga, o abre el lector local.

| Meta | Escenario |
|---|---|
| Ningún error pasa en silencio | Toda llamada HTTP sale por un único cliente. Cada error se muestra con su causa y se vuelve a lanzar a quien llamó. |
| Una sesión vencida tiene salida | Un 401 o una petición sin respuesta muestran un aviso con el botón Recargar, que vuelve a pasar por el proxy de acceso. |
| La clave de una conexión no se queda a la vista | El campo se vacía en cuanto la clave sale hacia la api, y la api solo devuelve si existe y desde cuándo. |
| El avance de una lectura se ve sin recargar | Mientras una recolección corre, el panel consulta su avance cada segundo y se detiene al terminar, al salir o ante un error. |
| Se usa igual en teléfono y en escritorio | La navegación cambia entre barra inferior, riel y menú lateral según el ancho de la ventana. |

## 2. Contexto y alcance

![Diagrama de contexto de perfil-panel](docs/architecture/context.svg)

[Versión interactiva](docs/architecture/context.html): descarga el archivo y ábrelo en un navegador.

| Interfaz externa | Dirección | Cuándo ocurre |
|---|---|---|
| Persona en el navegador | Entrante | Al abrir el panel; cada ruta sirve la misma aplicación. |
| Proxy de acceso | Entrante, delante del panel | En cada petición: pide la sesión antes de servir el panel o la api. |
| API, bajo `/api` | Saliente, HTTP a la misma dirección | Al abrir cada pantalla, en cada acción y, con una recolección en curso, cada segundo. |
| Lector local | Saliente, enlace `perfil-lector://` | Solo con el botón «Leer desde mi máquina» de Conexiones. |
| Publicación original de la oferta | Saliente, otra pestaña | Cuando la persona abre la oferta original desde su detalle. |
| Aplicación de correo | Saliente, enlace `mailto:` | Cuando la persona elige escribir al contacto de una oferta. |
| Google Fonts | Saliente, desde el navegador | Al cargar la página: la tipografía y los íconos. |
| Orquestador | Entrante, despliegue | En cada push a `main` que no sea solo de documentación. |

## 3. Bloques de construcción

![Diagrama de contenedores de perfil-panel](docs/architecture/containers.svg)

[Versión interactiva](docs/architecture/containers.html): descarga el archivo y ábrelo en un navegador.

| Bloque | Responsabilidad | Código |
|---|---|---|
| Estructura y rutas | Arranca la aplicación, elige la navegación según el ancho y carga cada pantalla al entrar a su ruta. | `src/main.ts`, `src/app/app.ts`, `src/app/app.routes.ts`, `src/app/app.config.ts` |
| Pantalla CV | Sube un PDF con su Word opcional, lista el historial, descarga versiones y deja una como vigente. | `src/app/@presentation/pages/cv/` |
| Pantallas Ofertas y Oferta | Lista con filtros, detalle, marcas de estado, enlace a la publicación y correo al contacto. | `src/app/@presentation/pages/ofertas/`, `src/app/@presentation/pages/oferta/`, `src/app/Utils/correo.ts` |
| Pantalla Conexiones | Estado, pausa, clave y tope de cada conexión; historial de lecturas; lanzar la recolección y seguir su avance. | `src/app/@presentation/pages/conexiones/` |
| Pantalla Ajustes | Tema y paleta, guardados en el navegador. | `src/app/@presentation/pages/ajustes/`, `src/app/@presentation/shared/tema.store.ts` |
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
2. La persona pulsa Leer, para todas las fuentes o para una. El panel lo pide a la api, que responde al instante y sigue leyendo por su cuenta.
3. Mientras la recolección está en curso, el panel consulta su avance cada segundo.
4. Cada vez que una fuente termina, vuelve a cargar las conexiones para mostrar sus lecturas restantes.
5. Al terminar la recolección deja de consultar y recarga las conexiones una última vez.
6. Si una consulta falla, se detiene: el aviso ya salió y seguir preguntando con la sesión vencida no sirve.
7. Al salir de la pantalla se cancela la consulta pendiente.

Leer desde la máquina de la persona:

1. La persona pulsa «Leer desde mi máquina» en Conexiones.
2. El panel pide a la api que abra una corrida; la api devuelve un código de un solo uso y el avance inicial.
3. El panel abre `perfil-lector://leer?corrida=<código>`, que lanza el lector local instalado.
4. Sigue el avance igual que en una recolección a demanda.
5. Si el lector no responde o no termina a tiempo, la api cierra la corrida con ese motivo y la barra lo muestra.

## 5. Vista de despliegue

| Qué | Por defecto | Cuándo aplica | Cómo cambiarlo |
|---|---|---|---|
| Imagen | nginx con el sitio de `dist/perfil-panel/browser`, puerto 80 | Siempre | `Dockerfile` y `nginx.conf` |
| Bases de la imagen | Node 24 alpine para construir y nginx alpine para servir, fijadas por digest | Al construir la imagen | `Dockerfile` |
| Registro | `ghcr.io/<owner>/perfil-panel`, etiquetada con el commit | En cada push a `main` | Variable `IMAGE` del workflow |
| Plataforma de la imagen | `linux/amd64` | Al construir la imagen | Workflow |
| Redespliegue | Fija la etiqueta del commit en el orquestador y pide el despliegue | En `main`, con los secretos `COOLIFY_TOKEN` y `COOLIFY_APP_UUID` | Sin esos secretos el paso se salta y la ejecución queda en verde |
| Cambios solo de documentación | No corren pruebas ni despliegue | Push que solo toca `docs/**`, `README.md` o `ARCHITECTURE.md` | `paths-ignore` del workflow |
| Despliegues simultáneos | Uno por rama a la vez, sin cancelar el que corre | Siempre | `concurrency` del workflow |
| Dirección de la api | `/api`, en la misma dirección que el panel | Siempre | `src/environments/environment.ts` |
| Caché | `index.html` sin caché; JS y CSS con huella, un año | Siempre | `nginx.conf` |
| Servidor de desarrollo | `npm start`, con `/api` hacia `http://localhost:8080` | Solo en desarrollo | `proxy.conf.mjs` |
| Sesión en desarrollo | Cabecera `Cf-Access-Jwt-Assertion` con el valor de `PERFIL_CODIGO_LOCAL` | Solo con `npm start` | Variable `PERFIL_CODIGO_LOCAL`; vacía, la api responde 401 |
| Avance de una recolección | Una consulta por segundo | Solo mientras corre | No se puede |
| Filtro inicial de Ofertas | Nuevas, de encaje alto y medio, de los últimos 7 días | Al abrir Ofertas | Los filtros de la pantalla |
| Tema y paleta | Los del sistema, paleta verde | Sin elección guardada | Pantalla Ajustes |

Requisitos: Node 24, desde la 24.15, y npm. La imagen se construye para `linux/amd64`.

Despliegues opcionales:

- **Sin orquestador.** Sin los dos secretos, el workflow prueba, construye y publica la imagen, pero no la despliega.
- **Local.** `npm start` sirve el panel con recarga y manda `/api` a una api local.

## 6. Conceptos transversales

Datos y privacidad:

| Pregunta | Respuesta |
|---|---|
| ¿Qué sale del navegador y a dónde va? | A la api: el PDF y el Word del CV, la versión que queda vigente, el estado de cada oferta, la clave y el tope de una conexión, y los pedidos de lectura. A Google Fonts: la petición de la tipografía y los íconos. Al lector local: el código de un solo uso, dentro del enlace. A la aplicación de correo: el destinatario, el título de la oferta y el enlace al CV público. |
| ¿Qué nunca sale? | La elección de tema y paleta, que se queda en el navegador. La clave de una conexión no vuelve de la api ni queda en la pantalla. |
| ¿Cuándo ocurre? | Al abrir una pantalla, en cada acción de la persona y, con una recolección en curso, cada segundo. Las fuentes se piden al cargar la página. |
| ¿Dónde se guarda y por cuánto tiempo? | En el `localStorage` del navegador, con las claves `perfil-panel.tema` y `perfil-panel.paleta`, sin caducidad. Nada más: el panel no tiene base de datos. |
| ¿Cómo se ve exactamente lo que se envió? | No hay un registro propio. Las herramientas de desarrollo del navegador muestran cada petición. |
| ¿Cómo se apaga? | No hay un interruptor. Borrar los datos del sitio en el navegador quita el tema guardado. Las fuentes se cargan siempre desde `index.html`. |

Seguridad:

- El panel no maneja credenciales: el proxy de acceso pide la sesión antes de servir el panel y la api.
- Un 401 o una petición sin respuesta muestran el aviso de sesión vencida con el botón Recargar. Un 403 dice que el servidor rechazó la petición.
- El error se decide por el estado HTTP, no por el cuerpo, porque un proxy puede responder con HTML.
- El enlace a la publicación original se abre con `noopener` y `noreferrer`.
- Cada valor que va en una dirección se codifica: la consulta de ofertas, el enlace del correo y el del lector local.
- La cabecera de sesión de desarrollo solo existe en `proxy.conf.mjs`; producción no usa ese archivo.

Persistencia:

- El panel no guarda datos de negocio. Cada pantalla los vuelve a pedir a la api al abrirse.
- El estado de cada pantalla vive en memoria, en stores con signals de Angular.
- Si el `localStorage` no está disponible, el panel sigue al sistema con la paleta verde y no avisa.

## 7. Decisiones

| Decisión | Registro |
|---|---|
| El panel llama a la api bajo la misma dirección, en `/api` | [0001](docs/decisions/0001-la-api-bajo-la-misma-direccion.md) |
| Los errores se deciden por el estado HTTP y una sesión vencida se resuelve recargando | [0002](docs/decisions/0002-errores-por-estado-http.md) |
| La consulta del avance se detiene ante un error | [0003](docs/decisions/0003-el-avance-se-detiene-ante-un-error.md) |
| Los archivos con huella se guardan un año en caché | [0004](docs/decisions/0004-cache-de-archivos-con-huella.md) |
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
| 1. Propósito | `package.json:2-3`, `src/app/app.ts:42-47`, `src/app/app.routes.ts:4-48`, `src/environments/environment.ts:1-4` |
| 1. Qué no es | `Dockerfile:9-13`, `nginx.conf:7-11`, `src/app/@data/interfaces/conexion.ts:36-38`, `src/app/@data/services/toast.service.ts:18-24`, `src/app/Utils/correo.ts:3-11`, `src/app/@data/services/recoleccion.service.ts:18-26` |
| 1. Metas | `src/app/@data/services/api-client.service.ts:13-37`, `src/app/@data/services/api-client.service.ts:41-50`, `src/app/@presentation/shared/components/conexion-pago/conexion-pago.component.ts:11-12`, `src/app/@presentation/shared/components/conexion-pago/conexion-pago.component.ts:61-64`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:24-28`, `src/app/Utils/const.ts:53-54`, `src/app/app.ts:14-18` |
| 2. Contexto | `nginx.conf:7-11`, `src/app/@data/services/toast.service.ts:18-24`, `src/environments/environment.ts:1-4`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:95-103`, `src/app/Utils/const.ts:118-119`, `src/app/@presentation/pages/oferta/oferta-page.component.html:59-63`, `src/app/Utils/correo.ts:3-11`, `src/index.html:10-18`, `.github/workflows/deploy.yml:6-13`, `.github/workflows/deploy.yml:65-78` |
| 3. Bloques | `src/main.ts:1-5`, `src/app/app.ts:18-47`, `src/app/app.routes.ts:4-48`, `src/app/app.config.ts:8-22`, `src/app/@presentation/pages/cv/cv-page.component.ts:11`, `src/app/@data/services/versiones.service.ts:12-36`, `src/app/@data/services/ofertas.service.ts:19-42`, `src/app/@presentation/pages/oferta/oferta-page.component.ts:12-36`, `src/app/@data/services/conexiones.service.ts:9-39`, `src/app/@data/services/recoleccion.service.ts:8-26`, `src/app/@presentation/shared/tema.store.ts:26-55`, `src/app/@data/services/api-client.service.ts:13-37`, `src/app/@data/interfaces/recoleccion.ts:3`, `Dockerfile:2-13`, `.github/workflows/deploy.yml:23-78` |
| 3. Reglas | `src/app/@data/services/api-client.service.ts:13-37`, `src/environments/environment.ts:1-4`, `src/app/@data/interfaces/conexion.ts:36-38`, `src/app/@presentation/shared/components/conexion-pago/conexion-pago.component.ts:61-64`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:72-76`, `src/app/@data/interfaces/recoleccion.ts:45-49`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:49-52`, `src/app/@presentation/pages/conexiones/conexiones-page.component.ts:95-101`, `src/app/Utils/correo.ts:3-11`. Una búsqueda de `HttpClient` en `src/app/` solo lo encontró en la configuración, en el cliente único y en las pruebas |
| 4. Recolección | `src/app/@presentation/pages/conexiones/recoleccion.store.ts:44-70`, `src/app/@data/services/recoleccion.service.ts:18-21`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:95-131`, `src/app/Utils/const.ts:53-54` |
| 4. Desde la máquina | `src/app/@presentation/pages/conexiones/recoleccion.store.ts:72-93`, `src/app/@data/services/recoleccion.service.ts:23-26`, `src/app/Utils/const.ts:118-119`, `src/app/@data/interfaces/recoleccion.ts:8-9`, `src/app/@data/interfaces/recoleccion.ts:41-49`, `src/app/Utils/const.ts:113-116` |
| 5. Despliegue | `Dockerfile:1-13`, `nginx.conf:1-21`, `.github/workflows/deploy.yml:6-21`, `.github/workflows/deploy.yml:38-78`, `src/environments/environment.ts:1-4`, `proxy.conf.mjs:1-14`, `angular.json:60-74`, `src/app/Utils/const.ts:53-54`, `src/app/Utils/const.ts:132-153`, `src/app/@presentation/shared/tema.store.ts:22-34` |
| 5. Requisitos y opcionales | `package.json:4-10`, `package.json:12`, `package.json:34-36`, `.nvmrc:1`, `.github/workflows/deploy.yml:45-47`, `.github/workflows/deploy.yml:60` |
| 6. Privacidad | `src/app/@data/services/versiones.service.ts:16-27`, `src/app/@data/services/ofertas.service.ts:36-38`, `src/app/@data/services/conexiones.service.ts:32-39`, `src/app/@data/services/recoleccion.service.ts:18-26`, `src/index.html:10-18`, `src/app/Utils/const.ts:118-119`, `src/app/Utils/correo.ts:3-11`, `src/app/Utils/const.ts:14`, `src/app/@presentation/shared/tema.store.ts:22-23`, `src/app/@presentation/shared/tema.store.ts:57-72`, `src/app/@data/interfaces/conexion.ts:36-38` |
| 6. Seguridad | `src/app/@data/services/api-client.service.ts:40-61`, `src/app/@data/services/toast.service.ts:18-24`, `src/app/@presentation/pages/oferta/oferta-page.component.html:59`, `src/app/Utils/query.ts:3-19`, `src/app/Utils/correo.ts:7-11`, `src/app/Utils/const.ts:119`, `proxy.conf.mjs:1-2` |
| 6. Persistencia | `src/app/@presentation/pages/conexiones/conexiones.store.ts:14-27`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:35-42`, `src/app/@presentation/shared/tema.store.ts:26-29`, `src/app/@presentation/shared/tema.store.ts:66-72` |
| 7. Decisiones | `src/environments/environment.ts:1`, `nginx.conf:7`, `src/app/@data/services/api-client.service.ts:40`, `src/app/@data/services/api-client.service.ts:46`, `src/app/@data/services/toast.service.ts:18`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:24-28`, `nginx.conf:13-17`, `src/app/@presentation/shared/tema.store.ts:26-29`, `Dockerfile:1`, `.github/workflows/deploy.yml:1-2`, `src/app/@data/services/toast.service.ts:18-24`, `src/app/Utils/const.ts:53-54`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:44-47`, `src/app/@presentation/pages/conexiones/recoleccion.store.ts:95-103`, `package.json:14-21`, `package.json:26-32`, `package.json:34-36`, `.nvmrc:1`, `Dockerfile:2`, `angular.json:75-77`. Una búsqueda de `EventSource` y `WebSocket` en `src/` no encontró nada |
