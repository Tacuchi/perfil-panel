---
status: accepted
date: 2026-11-18
---

# El panel llama a la api bajo la misma dirección, en `/api`

Motivo tomado de dos comentarios: el de `src/environments/environment.ts` y el de `nginx.conf`. El motivo del acceso único lo dio la persona el 2026-11-18, al confirmar el que consta en el plan 002 del proyecto, «cv en el sitio».

## Contexto y problema

El panel corre en el navegador y necesita hablar con la api. Había que decidir en qué dirección la busca.

## Opciones consideradas

- La api en una dirección propia, distinta de la del panel.
- La api bajo la misma dirección que el panel, en la ruta `/api`.

## Resultado de la decisión

Opción elegida: la misma dirección, con la api en `/api`. El comentario dice que así no hay peticiones entre dominios. El de `nginx.conf` añade que `/api` lo manda a la api el enrutador, antes de llegar al panel; sus rutas viven en el repositorio de la api. El plan 002 añade que un solo acceso cubre las dos.

### Consecuencias

- El panel no necesita configurar CORS ni conocer la dirección de la api: usa una ruta relativa.
- nginx sirve la aplicación para cualquier ruta; `/api` nunca le llega.
- El panel no maneja credenciales: un 401 o una petición sin respuesta se resuelven recargando, que vuelve a pasar por el mismo acceso.
- En desarrollo, `proxy.conf.mjs` reproduce lo mismo y manda `/api` a una api local.
