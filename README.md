# Gobernanza y Rectoría en Salud Pública en Colombia

Explorador interactivo del diagnóstico causal, la evidencia y las recomendaciones de una revisión de alcance (marco PCC) sobre gestión pública, gobernanza y rectoría en instituciones públicas del sector salud colombiano (2021–2026).

**Vista en vivo:** se publica con GitHub Pages desde la rama `main` (carpeta raíz). Actívalo en *Settings → Pages* si aún no está activo.

## Contenido de la app

1. **Resumen ejecutivo** — cifras clave de la revisión (329 registros → 281 únicos → 17 estudios incluidos).
2. **Diagnóstico causal** — diagrama interactivo de bucles causales (siguiendo a Homer & Hirsch, 2006): un bucle de refuerzo (R1, erosión acumulativa de la rectoría) y un bucle de balance (B1, iniciativas de fortalecimiento).
3. **Hallazgos por categoría** — teoría fundamentada: 5 categorías axiales y 11 códigos abiertos, con referencia a los estudios que los respaldan.
4. **Indicadores en el tiempo** — series públicas (tutelas en salud, cartera hospitalaria, Índice de Desempeño Institucional FURAG) que contextualizan el diagnóstico cualitativo. No forman parte del corpus revisado; cada gráfico cita su fuente oficial/gremial.
5. **Recomendaciones e investigación de implementación** — síntesis propia del autor: cada recomendación se ancla en un punto de apalancamiento del modelo causal y se caracteriza con resultados de investigación de implementación (adaptado de Proctor et al., 2011).
6. **Estudios incluidos** — tabla filtrable de los 17 estudios a texto completo, con enlace a DOI/URL cuando está disponible.
7. **Lagunas de evidencia**.
8. **Metodología en breve** — marco PCC, bases consultadas, herramientas de calidad y limitaciones.

## Nota sobre el alcance de esta app

Esta aplicación es una síntesis infográfica, **no el manuscrito completo** de la revisión, que se encuentra en preparación para publicación en una revista científica. Por esa razón el repositorio no incluye los archivos fuente de la revisión (exportaciones de Embase/LILACS, RIS, el informe en `.docx`) — quedan excluidos vía `.gitignore` y permanecen solo en el entorno local del autor.

## Stack técnico

HTML/CSS/JS sin build step (fácil de servir con GitHub Pages), [Chart.js](https://www.chartjs.org/) vía CDN para las series de tiempo, y un diagrama de bucles causales renderizado en SVG a partir de los datos en [`js/data.js`](js/data.js).

- `index.html` — estructura y metadatos.
- `css/style.css` — sistema de diseño (tokens de color claro/oscuro, acordeones, responsive).
- `js/data.js` — todo el contenido editorial (estadísticas, categorías, modelo causal, indicadores, recomendaciones, estudios, metodología).
- `js/app.js` — renderizado, tema claro/oscuro persistente, acordeones (expandir/colapsar todo) y gráficos.

Para editar contenido, generalmente basta con modificar `js/data.js`; el resto se renderiza automáticamente.

## Fuentes de los indicadores públicos

- Defensoría del Pueblo de Colombia — informes anuales *"La tutela y los derechos a la salud y la seguridad social"* (2020–2025).
- Asociación Colombiana de Hospitales y Clínicas (ACHC) — Estudios de cartera hospitalaria (informes semestrales).
- Departamento Administrativo de la Función Pública (DAFP) — resultados FURAG del Modelo Integrado de Planeación y Gestión (MIPG).

## Autor

Fabián Dávila Ramírez — Universidad del Rosario · Universidad de Navarra · Adium Colombia S.A.S.
