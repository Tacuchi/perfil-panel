---
status: accepted
date: 2026-11-18
---

# Los errores se deciden por el estado HTTP y una sesión vencida se resuelve recargando

Motivo tomado de tres comentarios: dos en `src/app/@data/services/api-client.service.ts` y uno en `src/app/@data/services/toast.service.ts`.

## Contexto y problema

Cada llamada a la api puede fallar, y la persona tiene que saber por qué. Había que decidir cómo se elige el aviso y qué se le ofrece cuando la sesión venció.

## Opciones consideradas

- Leer el cuerpo de la respuesta para elegir el aviso.
- Elegir el aviso por el estado HTTP y leer el cuerpo solo en los errores 4xx que no son 401 ni 403.

## Resultado de la decisión

Opción elegida: el estado HTTP. El comentario dice que un proxy puede responder con HTML, así que el cuerpo no es confiable. Una respuesta sin estado se trata como sesión vencida porque, según el comentario, puede ser la red caída o el acceso redirigiendo porque la sesión venció, y recargar resuelve las dos. El aviso ofrece Recargar porque es la única salida para que el acceso pida el código de nuevo.

### Consecuencias

- 401 y una petición sin respuesta muestran el mismo aviso con el botón Recargar.
- 403 y 5xx tienen su propio mensaje fijo.
- Los demás errores muestran el `detail` que manda la api, o el mensaje de error del servidor si falta.
