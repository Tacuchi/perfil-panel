---
status: accepted
date: 2026-11-18
---

# El avance de una recolección se consulta cada segundo, sin flujo de eventos

Motivo dado por la persona el 2026-11-18, al confirmar el que consta en el plan 004 del proyecto, «recolección a demanda».

## Contexto y problema

Una recolección a demanda sigue corriendo en la api después de que el panel la pide. Había que decidir cómo se entera el panel de su avance.

## Opciones consideradas

- Consultar el avance cada segundo mientras corre.
- Recibir el avance como un flujo de eventos del servidor (SSE).

## Resultado de la decisión

Opción elegida: consultar cada segundo, sin flujo de eventos. Es la vía más simple a través del proxy de acceso y sirve igual para recargar u otra pestaña: la primera consulta trae el estado. La lectura más larga dura cerca de medio minuto. SSE se descartó por las conexiones abiertas, los reintentos y el buffer del proxy.

### Consecuencias

- El intervalo es fijo, de un segundo, y no se puede cambiar.
- Al abrir Conexiones, la primera consulta sale en el acto y recupera la recolección en curso o el resultado de la última.
- La consulta solo vive mientras la recolección corre y la pantalla está abierta; un error la detiene.
- El panel no abre ninguna conexión persistente con la api.
