---
status: accepted
date: 2026-11-18
---

# El panel usa Angular 22

Motivo dado por la persona el 2026-11-18, al confirmar el que consta en el plan 002 del proyecto, «cv en el sitio».

## Contexto y problema

El panel se construyó desde cero junto con la api. Había que elegir la versión del framework con que se escribe.

## Opciones consideradas

- Angular 22.
- Otra versión o línea del framework. El plan no nombra alternativas.

## Resultado de la decisión

Opción elegida: Angular 22, elegida por la persona: soporte activo hasta junio de 2027 y de seguridad hasta junio de 2028. Node 24.15 o superior, que Angular 22 exige.

### Consecuencias

- Las dependencias de Angular y Angular Material están fijadas en versiones exactas de la línea 22.
- El paquete exige Node 24 desde la 24.15, y la imagen y el workflow construyen con Node 24.
- Las pruebas corren con el constructor de pruebas de Angular sobre Vitest.
