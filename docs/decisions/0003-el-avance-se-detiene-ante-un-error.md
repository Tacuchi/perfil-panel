---
status: accepted
date: 2026-11-18
---

# La consulta del avance se detiene ante un error

Motivo tomado del comentario de `RecoleccionStore`, en `src/app/@presentation/pages/conexiones/recoleccion.store.ts`.

## Contexto y problema

Mientras una recolección corre, el panel consulta su avance cada segundo. Había que decidir qué hace esa consulta cuando una petición falla.

## Opciones consideradas

- Seguir consultando hasta que la recolección termine.
- Detener la consulta en el primer error.

## Resultado de la decisión

Opción elegida: detenerla. El comentario dice que el cliente HTTP ya mostró el error, y que seguir preguntando con la sesión vencida no sirve.

### Consecuencias

- Tras un error, la barra de avance deja de moverse hasta que la persona vuelve a abrir Conexiones o recarga.
- La consulta también se cancela al salir de la pantalla.
