---
status: accepted
date: 2026-11-18
---

# Los archivos con huella se guardan un año en caché

Motivo tomado del comentario de `nginx.conf`.

## Contexto y problema

nginx sirve la aplicación construida. Había que decidir cuánto tiempo puede el navegador reusar cada archivo.

## Opciones consideradas

- La misma regla de caché para todo.
- Sin caché para `index.html` y caché larga para los archivos JS y CSS.

## Resultado de la decisión

Opción elegida: caché de un año, marcada `immutable`, para JS y CSS; `no-cache` para el resto. El comentario dice que esos archivos llevan una huella en el nombre y su contenido no cambia nunca. La construcción de producción genera esa huella en todos los archivos.

### Consecuencias

- Un despliegue nuevo se ve al recargar: `index.html` se pide siempre y apunta a los archivos nuevos.
- Los archivos viejos siguen en la caché del navegador hasta que vencen, sin uso.
