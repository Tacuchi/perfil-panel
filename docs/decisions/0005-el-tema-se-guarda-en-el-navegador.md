---
status: accepted
date: 2026-11-18
---

# El tema se guarda solo en el navegador

Motivo tomado del comentario de `TemaStore`, en `src/app/@presentation/shared/tema.store.ts`.

## Contexto y problema

La persona elige en Ajustes el tema claro u oscuro y una paleta. Había que decidir dónde se guarda esa elección.

## Opciones consideradas

- Guardarla en la api, ligada a la persona.
- Guardarla en el `localStorage` del navegador.

## Resultado de la decisión

Opción elegida: el `localStorage`. El comentario dice que es una comodidad local: si el almacenamiento no está disponible, por una ventana privada o datos bloqueados, el panel sigue al sistema con la paleta verde.

### Consecuencias

- Cada navegador tiene su propia elección.
- Un fallo al guardar no se avisa: el cambio dura hasta recargar.
- La api no recibe nada sobre el tema.
