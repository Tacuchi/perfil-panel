# Funcionamiento del panel

Detalle que no cabe en la vista general de [ARCHITECTURE.md](../ARCHITECTURE.md).

## Qué no es y otras metas

- No envía correos: abre la aplicación de correo de la persona con el mensaje a medio armar.
- No lee las fuentes de ofertas: pide a la api que lo haga, o abre el lector local.

| Meta | Escenario |
|---|---|
| El avance de una lectura se ve sin recargar | Mientras una recolección corre, el panel muestra su avance sin que la persona recargue la página. |
| Se usa igual en teléfono y en escritorio | La navegación cambia entre barra inferior, riel y menú lateral según el ancho de la ventana. |

## Pantallas

| Pantalla | Qué hace | Código |
|---|---|---|
| CV | Sube un PDF con su Word opcional, lista el historial, descarga versiones y deja una como vigente. | `src/app/@presentation/pages/cv/` |
| Ofertas y Oferta | Lista con filtros, detalle, marcas de estado, enlace a la publicación y correo al contacto. | `src/app/@presentation/pages/ofertas/`, `src/app/@presentation/pages/oferta/`, `src/app/Utils/correo.ts` |
| Conexiones | Estado, pausa, clave y tope de cada conexión; historial de lecturas; lanzar la recolección y seguir su avance. | `src/app/@presentation/pages/conexiones/` |
| Ajustes | Tema y paleta, guardados en el navegador. | `src/app/@presentation/pages/ajustes/`, `src/app/@presentation/shared/tema.store.ts` |

## Leer desde la máquina

1. La persona pulsa «Leer desde mi máquina» en Conexiones.
2. El panel pide a la api que abra una corrida; la api devuelve un código de un solo uso y el avance inicial.
3. El panel abre `perfil-lector://leer?corrida=<código>`, que lanza el lector local instalado.
4. Sigue el avance igual que en una recolección a demanda.
5. Si el lector no responde o no termina a tiempo, la api cierra la corrida con ese motivo y la barra lo muestra.

## Qué sale del navegador

- A la api: el PDF y el Word del CV, la versión que queda vigente, el estado de cada oferta, la clave y el tope de una conexión, y los pedidos de lectura.
- A Google Fonts: la petición de la tipografía y los íconos.
- Al lector local: el código de un solo uso, dentro del enlace.
- A la aplicación de correo: el destinatario, el título de la oferta y el enlace al CV público.

El tema y la paleta se guardan con las claves `perfil-panel.tema` y `perfil-panel.paleta`.

## Seguridad

- Un 403 muestra que el servidor rechazó la petición.
- Los valores codificados son la consulta de ofertas, el enlace del correo y el del lector local.
