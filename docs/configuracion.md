# Configuración del panel

Valores por defecto que no caben en la sección 5 de [ARCHITECTURE.md](../ARCHITECTURE.md).

| Qué | Por defecto | Cuándo aplica | Cómo cambiarlo |
|---|---|---|---|
| Bases de la imagen | Node 24 alpine para construir y nginx alpine para servir, fijadas por digest | Al construir la imagen | `Dockerfile` |
| Plataforma de la imagen | `linux/amd64` | Al construir la imagen | Workflow |
| Despliegues simultáneos | Uno por rama a la vez, sin cancelar el que corre | Siempre | `concurrency` del workflow |
| Sesión en desarrollo | Cabecera `Cf-Access-Jwt-Assertion` con el valor de `PERFIL_CODIGO_LOCAL` | Solo con `npm start` | Variable `PERFIL_CODIGO_LOCAL`; vacía, la api responde 401 |
| Avance de una recolección | Una consulta por segundo | Solo mientras corre | No se puede |
| Filtro inicial de Ofertas | Nuevas, de encaje alto y medio, de los últimos 7 días | Al abrir Ofertas | Los filtros de la pantalla |
| Tema y paleta | Los del sistema, paleta verde | Sin elección guardada | Pantalla Ajustes |
