/* ============================================================
   Datos de la aplicación — Gobernanza en Salud Pública Colombia
   Contenido derivado de la revisión de alcance (PCC) del autor.
   Indicadores cuantitativos: fuentes públicas oficiales/gremiales
   citadas explícitamente (no forman parte del corpus revisado).
   ============================================================ */

const DATA = {

  meta: {
    title: "Gobernanza y Rectoría en Salud Pública en Colombia",
    subtitle: "Explorador interactivo del diagnóstico causal, la evidencia y las recomendaciones",
    author: "Fabian Dávila Ramírez",
    credentials: "MD, MBA, PhD",
    affiliation: "Universidad de Navarra",
    period: "Evidencia académica 2021–2026",
    framework: "Revisión de alcance · marco PCC (Población–Concepto–Contexto)",
    disclaimer: "Esta aplicación resume el diagnóstico y los hallazgos centrales de una revisión de alcance más extensa, actualmente en preparación para publicación. Por esa razón se presenta aquí una síntesis infográfica y no el manuscrito completo. Las recomendaciones y la lectura desde investigación de implementación son una elaboración propia del autor a partir del diagnóstico causal, no hallazgos textuales de los estudios incluidos.",
    license: {
      name: "Creative Commons Atribución 4.0 Internacional (CC BY 4.0)",
      url: "https://creativecommons.org/licenses/by/4.0/deed.es",
      text: "Este contenido puede compartirse y adaptarse libremente, incluso con fines comerciales, siempre citando al autor."
    }
  },

  stats: [
    { value: "329", label: "Registros identificados", detail: "PubMed 16 · Embase 240 · LILACS/BVS 65 · Google Scholar 8" },
    { value: "281", label: "Registros únicos", detail: "Tras eliminar 48 duplicados (11 internos + 37 cruzados)" },
    { value: "17", label: "Estudios incluidos", detail: "PubMed 6 · Embase 5 · LILACS 3 · Google Scholar 3" },
    { value: "2.6/5.0", label: "Gobernanza percibida", detail: "Calificación promedio entre 107 líderes del sistema (Arias-Monsalve & Restrepo-Zea, 2023)" },
  ],

  // ------------------------------------------------------------------
  // Teoría fundamentada: categorías axiales y códigos abiertos
  // ------------------------------------------------------------------
  categories: [
    {
      id: "A",
      title: "Debilidad de la rectoría central",
      color: "cat-a",
      codes: [
        { text: "Débil desempeño percibido de la gobernanza por actores internos del sistema", studies: [1, 3, 6] },
        { text: "Respuesta programática reciente de fortalecimiento institucional, aún sin evaluación de impacto", studies: [10, 12, 13] },
      ]
    },
    {
      id: "B",
      title: "Fragmentación institucional y financiera",
      color: "cat-b",
      codes: [
        { text: "Subfinanciación crónica de la atención primaria", studies: [3, 5] },
        { text: "Integración vertical de aseguradoras públicas", studies: [5, 11] },
        { text: "Arquitectura de datos y de financiamiento dispersa entre entidades", studies: [5, 7] },
      ]
    },
    {
      id: "C",
      title: "Déficit de capacidad de gestión territorial",
      color: "cat-c",
      codes: [
        { text: "Baja autonomía decisoria de los funcionarios territoriales", studies: [4] },
        { text: "Integración deficiente de los sistemas de información territoriales", studies: [4, 7] },
      ]
    },
    {
      id: "D",
      title: "Mecanismos reactivos de legitimidad",
      color: "cat-d",
      codes: [
        { text: "Transparencia y rendición de cuentas insuficientes", studies: [2] },
        { text: "Judicialización (tutela) como válvula de escape ante decisiones de cobertura", studies: [11] },
      ]
    },
    {
      id: "E",
      title: "Persistencia histórica del patrón institucional",
      color: "cat-e",
      codes: [
        { text: "Persistencia de los mismos nudos críticos treinta años después de la Ley 100 de 1993", studies: [14, 15, 16] },
      ]
    },
  ],

  selectiveCategory: {
    title: "Erosión acumulativa de la rectoría sanitaria pública",
    text: "La categoría selectiva que integra las cinco categorías axiales: la debilidad de la rectoría central (A) se traduce en fragmentación institucional y financiera (B), que limita la autonomía de gestión territorial (C); esto activa mecanismos reactivos de legitimidad (D) que no sustituyen la rectoría, sino que evidencian su ausencia — un patrón que se repite treinta años después de la Ley 100 de 1993 (E)."
  },

  // ------------------------------------------------------------------
  // Modelo causal de dinámica de sistemas (Homer & Hirsch, 2006)
  // ------------------------------------------------------------------
  causalLoop: {
    citation: "Diagramación siguiendo a Homer, J. B., & Hirsch, G. B. (2006). System dynamics modeling for public health. American Journal of Public Health, 96(3), 452–458.",
    nodes: [
      { id: 1, label: "Capacidad de rectoría central", actors: "MinSalud · Supersalud", category: "A", studies: [1, 3, 6] },
      { id: 2, label: "Fragmentación institucional y financiera", actors: "ADRES · EPS/IPS públicas", category: "B", studies: [3, 5, 7, 11] },
      { id: 3, label: "Autonomía y capacidad de gestión territorial", actors: "Entes territoriales · ESE", category: "C", studies: [4, 7] },
      { id: 4, label: "Calidad y continuidad de la prestación percibida", actors: "Ciudadanía usuaria", category: null, studies: [] },
      { id: 5, label: "Judicialización y desgaste institucional", actors: "Tutela en salud", category: "D", studies: [11] },
      { id: 6, label: "Transparencia y rendición de cuentas", actors: "Sitios y reportes institucionales", category: "D", studies: [2] },
      { id: 7, label: "Confianza institucional", actors: "Percepción ciudadana e institucional", category: null, studies: [] },
    ],
    // polarity: "-" = las variables cambian en sentido opuesto; "+" = cambian en el mismo sentido
    edges: [
      { from: 1, to: 2, polarity: "-" },
      { from: 2, to: 3, polarity: "-" },
      { from: 3, to: 4, polarity: "+" },
      { from: 4, to: 5, polarity: "-" },
      { from: 5, to: 6, polarity: "-" },
      { from: 6, to: 7, polarity: "+" },
      { from: 7, to: 1, polarity: "+" },
    ],
    loops: [
      {
        id: "R1",
        type: "reforzamiento",
        title: "R1 — Erosión acumulativa de la rectoría (bucle de refuerzo)",
        text: "Una disminución de la capacidad de rectoría central se asocia con más fragmentación institucional y financiera, que reduce la autonomía territorial, deteriora la calidad de la prestación percibida, incrementa la judicialización y el desgaste institucional, erosiona la transparencia y reduce la confianza institucional — lo que vuelve a debilitar la rectoría central, cerrando el ciclo. Con cuatro relaciones de polaridad negativa (número par), el bucle es de refuerzo: cada vuelta profundiza la debilidad inicial en vez de corregirla.",
      },
      {
        id: "B1",
        type: "balance",
        title: "B1 — Iniciativas de fortalecimiento (bucle de balance, con demora)",
        text: "La evidencia académica y la presión de política pública que emergen de una rectoría debilitada impulsan iniciativas de fortalecimiento institucional — la Estrategia de Fortalecimiento de la Gobernanza en Salud (2024), el MIPG (Decreto 1499 de 2017) y el proceso de centralización analítica de ADRES (FEV-RIPS, 2024–2025) — que, con una demora significativa, buscan restablecer la capacidad de rectoría central. Ninguno de los estudios incluidos evalúa todavía su efectividad empírica: la fuerza relativa de B1 frente a R1 permanece como pregunta abierta.",
        delayNodes: [1],
        strengthenNode: "Iniciativas de fortalecimiento institucional",
        relatedInitiatives: ["Estrategia de Fortalecimiento de la Gobernanza en Salud (2024)", "MIPG — Decreto 1499 de 2017", "Centralización analítica ADRES (FEV-RIPS, 2024–2025)"]
      }
    ]
  },

  // ------------------------------------------------------------------
  // Indicadores públicos en el tiempo (fuentes oficiales/gremiales)
  // No forman parte del corpus de la revisión; se muestran como
  // contexto cuantitativo del diagnóstico cualitativo.
  // ------------------------------------------------------------------
  indicators: [
    {
      id: "tutelas",
      title: "Tutelas por vulneración del derecho a la salud",
      unit: "N.º de tutelas / año",
      loopLink: "Variable proxy del nodo 5 (Judicialización y desgaste institucional) del bucle R1.",
      source: "Defensoría del Pueblo de Colombia, serie de informes anuales «La tutela y los derechos a la salud y la seguridad social» (2020–2025).",
      sourceUrl: "https://www.defensoria.gov.co/-/con-197.765-registros-cifra-de-tutelas-por-salud-en-2023-fue-la-tercera-m%C3%A1s-alta-en-32-a%C3%B1os-defensor%C3%ADa",
      labels: [2020, 2021, 2022, 2023, 2024, 2025],
      values: [81899, 92499, 156413, 197765, 265173, 312500],
      callouts: [
        { index: 2, text: "2022: +69% frente a 2021 — fin de restricciones pandémicas y reactivación de la demanda judicial." },
        { index: 5, text: "2025 (reportado): la cifra prácticamente cuadriplica la de 2020, consistente con el nodo de judicialización del bucle R1." },
      ]
    },
    {
      id: "cartera",
      title: "Cartera hospitalaria (deuda con hospitales y clínicas)",
      unit: "Billones de pesos COP",
      loopLink: "Variable proxy del nodo 2 (Fragmentación institucional y financiera) del bucle R1.",
      source: "Asociación Colombiana de Hospitales y Clínicas (ACHC), Estudios de cartera hospitalaria (informes semestrales).",
      sourceUrl: "https://achc.org.co/actualidad/deuda-con-hospitales-y-clinicas-de-la-achc-llego-a-24-billones-de-pesos-a-junio-de-2025/",
      labels: ["Dic-2021", "Jun-2023", "Dic-2023", "Jun-2024", "Dic-2024", "Jun-2025", "Dic-2025"],
      values: [12.7, 16.09, 16.8, 18.9, 20.3, 24.0, 25.7],
      callouts: [
        { index: 4, text: "Dic-2024: +6,9% frente a jun-2024 — la deuda hospitalaria se acelera justo cuando arrancan las iniciativas de fortalecimiento (bucle B1)." },
        { index: 6, text: "Dic-2025: 58% de la cartera está en mora; las EPS intervenidas o en vigilancia especial concentran cerca del 80% de la deuda en operación." },
      ]
    },
    {
      id: "furag",
      title: "Índice de Desempeño Institucional (FURAG/MIPG) — MinSalud",
      unit: "Puesto entre entidades nacionales",
      loopLink: "Indicador de cumplimiento administrativo formal — contrapunto al nodo 1 (Capacidad de rectoría) y a la gobernanza percibida (2.6/5.0).",
      source: "Departamento Administrativo de la Función Pública (DAFP), resultados FURAG del Modelo Integrado de Planeación y Gestión (MIPG).",
      sourceUrl: "https://consultorsalud.com/ministerio-de-salud-primer-lugar-ministerios/",
      labels: [2022, 2023, 2024, 2025],
      values: [34, 3, 2, 1],
      invertAxis: true,
      callouts: [
        { index: 3, text: "2025: MinSalud ocupa el puesto 1 (99,14%) — la paradoja de implementación central de este diagnóstico: cumplimiento administrativo formal en ascenso mientras la gobernanza percibida y los indicadores de tensión del sistema (tutelas, cartera) empeoran en el mismo periodo." },
      ]
    },
    {
      id: "cobertura-bdua",
      title: "Cobertura real de aseguramiento al SGSSS",
      unit: "% (afiliados activos BDUA ÷ población proyectada DANE)",
      loopLink: "Serie primaria del contexto del nodo 1: confirma, con datos propios y su verdadero denominador poblacional, que la cobertura es alta y estable — la erosión de rectoría no se explica por caída de afiliación.",
      labels: [2018,2019,2020,2021,2022,2023,2024,2025],
      values: [96.7,96.5,94.8,94.7,98.4,98.5,98.3,98.2],
      numerators:   [46647228,47550369,47773868,48405872,50811451,51340341,51728458,52094265],
      denominators: [48258494,49266526,50390790,51115637,51643565,52117067,52613753,53057212],
      numeratorLabel: "Afiliados activos (BDUA)",
      denominatorLabel: "Población proyectada (DANE)",
      sources: [
        { label: "SISPRO — Cubo de Afiliados (BDUA), Ministerio de Salud y Protección Social. Numerador: afiliados en estado \"Activo\", corte de diciembre de cada año. Acceso institucional del autor mediante credenciales del aplicativo misional; sin URL pública de consulta directa.", url: null },
        { label: "DANE — Proyecciones de Población Departamental por Área Geográfica, 2018-2050 (base Censo 2018, actualización julio de 2025). Denominador: total nacional por año.", url: "https://www.dane.gov.co/index.php/estadisticas-por-tema/demografia-y-poblacion/proyecciones-de-poblacion" },
      ],
      callouts: [
        { index: 2, text: "2020: 47.773.868 afiliados activos ÷ 50.390.790 habitantes proyectados = 94,8% — la cobertura cede ~2 puntos frente a 2018-2019, coincidiendo con la pandemia y con procesos de depuración de bases de afiliados." },
        { index: 7, text: "2025: 52.094.265 afiliados activos ÷ 53.057.212 habitantes proyectados = 98,2% — prácticamente universal y estable desde 2022, lo que refuerza que la crisis documentada en esta revisión es de gobernanza y calidad, no de acceso formal al aseguramiento." },
      ],
      // Desagregación del numerador (afiliados activos) por EPS, corte dic-2025.
      // Es un subconjunto curado (las mismas 17 EPS analizadas en giros-adres),
      // no el listado completo de las ~74 entidades activas ese año — la suma
      // de esta tabla NO reproduce el numerador nacional de la fila 2025.
      epsBreakdown: {
        note: "Desagregación del numerador (afiliados activos, no de la cobertura %) para las 17 EPS analizadas en esta revisión — no es el listado completo de las ~74 entidades con afiliados activos en 2025, así que estas cifras no deben sumarse para reconstruir el total nacional de la fila 2025.",
        columnLabel: "Afiliados activos (dic-2025, BDUA)",
        rows: [
          { eps: "Nueva EPS", afiliados: 11589441, intervenida: true },
          { eps: "EPS SURA", afiliados: 5474957 },
          { eps: "Sanitas", afiliados: 5915452 },
          { eps: "Salud Total", afiliados: 5260560 },
          { eps: "Coosalud", afiliados: 3353615, intervenida: true },
          { eps: "Famisanar", afiliados: 2607546 },
          { eps: "Mutual Ser", afiliados: 2686208, intervenida: true },
          { eps: "Compensar", afiliados: 1759636 },
          { eps: "Asmet Salud", afiliados: 1585947, intervenida: true },
          { eps: "SaviaSalud (Alianza Medellín Antioquia)", afiliados: 1673859, intervenida: true },
          { eps: "Emssanar", afiliados: 1671574, intervenida: true },
          { eps: "Capital Salud", afiliados: 1125097 },
          { eps: "SOS (Servicio Occidental de Salud)", afiliados: 741843 },
          { eps: "Asociación Indígena del Cauca (AIC)", afiliados: 257361, especial: true },
          { eps: "Aliansalud EPS", afiliados: 248679 },
          { eps: "Capresoca", afiliados: 167371, intervenida: true },
          { eps: "Fondo de Pasivo Social Ferrocarriles", afiliados: 27923, especial: true },
        ],
        source: { label: "SISPRO — Cubo de Afiliados (BDUA). Afiliados en estado \"Activo\", corte de diciembre de 2025. Acceso institucional del autor; sin URL pública de consulta directa.", url: null },
      }
    },
    {
      id: "eps-activas-bdua",
      title: "Entidades administradoras con afiliados activos en BDUA",
      unit: "N.º de códigos de entidad (EPS/EPS-S) con afiliados > 0",
      loopLink: "Variable proxy directa del nodo 2 (Fragmentación institucional y financiera): cuenta cuántas entidades administran la afiliación del sistema cada año.",
      source: "Elaboración propia a partir del Cubo de Afiliados (BDUA), SISPRO — Ministerio de Salud y Protección Social (extracción directa del autor; solo afiliados en estado \"Activo\"; corte diciembre de cada año, 2025 preliminar).",
      sourceUrl: "https://www.sispro.gov.co/",
      labels: [2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],
      values: [79,73,73,70,66,94,103,103,99,102,99,98,86,76,75,75,74],
      callouts: [
        { index: 6, text: "2013-2015: el número de administradoras con afiliados activos sube de 66 a 103 — mayor fragmentación del sistema en el periodo previo a esta revisión." },
        { index: 16, text: "2025: 74 entidades activas, la cifra más baja de toda la serie — una fuerte consolidación desde el pico de 2015-2016 (103), consistente con la ola de intervenciones y liquidaciones de EPS documentada entre 2023 y 2025 (Asmet, Emssanar, SaviaSalud, Nueva EPS, Capresoca)." },
      ]
    },
    {
      id: "giros-adres",
      title: "Giros directos de ADRES a 17 EPS consultadas",
      unit: "Billones de pesos COP / mes",
      loopLink: "Evidencia reciente y directa del bucle B1 (iniciativas de fortalecimiento): mide la intensidad del mecanismo de giro directo de ADRES, la pieza operativa de la centralización analítica (FEV-RIPS, 2024-2025) documentada en la revisión.",
      source: "Elaboración propia del autor: extracción directa, entidad por entidad, de la herramienta \"Lupa al Giro\" de ADRES sobre 17 EPS (7 bajo intervención/vigilancia especial, 7 grandes no intervenidas, 3 públicas o de régimen especial). Extracción corregida y homogénea: las 17 EPS cuentan con los mismos 9 meses de datos (abr-dic 2025); una primera extracción previa tenía cobertura desigual por EPS y fue descartada.",
      sourceUrl: "https://www.adres.gov.co/lupa-al-giro/identifica-tu-giro",
      labels: ["Abr-2025","May-2025","Jun-2025","Jul-2025","Ago-2025","Sep-2025","Oct-2025","Nov-2025","Dic-2025"],
      values: [1.711,1.972,1.748,1.527,1.741,1.687,1.606,1.399,1.398],
      callouts: [
        { index: 1, text: "May-2025 es el pico de la serie (1,97 billones); aún no hay datos anteriores a abril-2025 porque la herramienta de ADRES solo expone una ventana reciente." },
        { index: 8, text: "Dic-2025: 1,40 billones, un 29% por debajo del pico de mayo — una tendencia a la baja sostenida en el segundo semestre que esta app no puede explicar por sí sola (podría reflejar estacionalidad de la compensación, ciclos de recálculo de UPC u otro factor); se reporta el dato sin sobre-interpretar su causa." },
      ],
      // Cotejo giro ÷ afiliados por EPS: estimación gruesa de intensidad de
      // giro directo por afiliado, anualizada sobre los mismos 9 meses (abr-dic
      // 2025) para las 17 EPS.
      epsRatioNote: "Estimación gruesa, no una medición oficial de eficiencia de la UPC: mezcla EPS de régimen contributivo y subsidiado (con UPC estructuralmente distintas) y algunas tienen denominadores pequeños (miles de afiliados) que hacen el cociente más ruidoso. Útil para comparar orden de magnitud entre EPS intervenidas y no intervenidas, no como cifra definitiva por EPS. Periodo uniforme: las 17 EPS tienen los mismos 9 meses de datos (abr-dic 2025).",
      epsRatioLabel: "Giro anualizado por afiliado (COP/año)",
      epsRatioTable: [
        { eps: "Fondo de Pasivo Social Ferrocarriles", nit: "800112806", meses: 9, giroTotal: 112536409240, afiliados2025: 27923, intervenida: false, especial: true },
        { eps: "Aliansalud EPS", nit: "830113831", meses: 9, giroTotal: 518654209967, afiliados2025: 248679, intervenida: false },
        { eps: "Asociación Indígena del Cauca (AIC)", nit: "817001773", meses: 9, giroTotal: 189029773375, afiliados2025: 257361, intervenida: false, especial: true },
        { eps: "Compensar", nit: "860066942", meses: 9, giroTotal: 1235746065025, afiliados2025: 1759636, intervenida: false },
        { eps: "EPS SURA", nit: "800088702", meses: 9, giroTotal: 2437597568809, afiliados2025: 5474957, intervenida: false },
        { eps: "Sanitas", nit: "800251440", meses: 9, giroTotal: 2327087101964, afiliados2025: 5915452, intervenida: false },
        { eps: "Capital Salud", nit: "900298372", meses: 9, giroTotal: 404459339405, afiliados2025: 1125097, intervenida: false },
        { eps: "SOS (Servicio Occidental de Salud)", nit: "805001157", meses: 9, giroTotal: 249428798656, afiliados2025: 741843, intervenida: false },
        { eps: "Salud Total", nit: "800130907", meses: 9, giroTotal: 1747484040626, afiliados2025: 5260560, intervenida: false },
        { eps: "Mutual Ser", nit: "806008394", meses: 9, giroTotal: 691726134733, afiliados2025: 2686208, intervenida: true },
        { eps: "Nueva EPS", nit: "900156264", meses: 9, giroTotal: 2938412567699, afiliados2025: 11589441, intervenida: true },
        { eps: "Famisanar", nit: "830003564", meses: 9, giroTotal: 650449606403, afiliados2025: 2607546, intervenida: false },
        { eps: "Coosalud", nit: "900226715", meses: 9, giroTotal: 698751022092, afiliados2025: 3353615, intervenida: true },
        { eps: "Capresoca", nit: "891856000", meses: 9, giroTotal: 32067398221, afiliados2025: 167371, intervenida: true },
        { eps: "SaviaSalud (Alianza Medellín Antioquia)", nit: "900604350", meses: 9, giroTotal: 224842771824, afiliados2025: 1673859, intervenida: true },
        { eps: "Asmet Salud", nit: "900935126", meses: 9, giroTotal: 175215811281, afiliados2025: 1585947, intervenida: true },
        { eps: "Emssanar", nit: "901021565", meses: 9, giroTotal: 154398371096, afiliados2025: 1671574, intervenida: true },
      ],
      epsAfiliadosSource: { label: "SISPRO — Cubo de Afiliados (BDUA). Afiliados en estado \"Activo\", corte de diciembre de 2025. Acceso institucional del autor; sin URL pública de consulta directa.", url: null },
    },
    {
      id: "furag-dimensiones",
      title: "Desempeño MIPG/FURAG de MinSalud por dimensión y política",
      unit: "Índice 0-100 (autorreportado)",
      loopLink: "Profundiza el nodo 1 (Capacidad de rectoría central): desagrega el índice general por las dimensiones y políticas más directamente ligadas a la formulación e implementación de política pública en salud.",
      sources: [
        { label: "DAFP — Medición del Desempeño Institucional (MDI), resultados FURAG por entidad nacional, vigencias 2023, 2024 y 2025.", url: "https://www1.funcionpublica.gov.co/web/mipg/resultados-medicion" },
        { label: "DAFP — Ficha metodológica, operación estadística Medición del Desempeño Institucional, v7 (enero de 2026).", url: "https://www1.funcionpublica.gov.co/documents/28587410/57410531/2026-01-28_Ficha_metodologica_v7.pdf" },
      ],
      series: [
        { name: "D2 Direccionamiento Estratégico y Planeación", data: [96.44, 97.51, 99.31] },
        { name: "POL04 Gestión Presupuestal y Eficiencia del Gasto", data: [88.00, 77.27, 93.65] },
        { name: "POL06 Fortalecimiento Organizacional", data: [94.53, 98.36, 98.25] },
        { name: "POL19 Índice de Control Interno", data: [98.62, 98.23, 99.66] },
      ],
      labels: [2023, 2024, 2025],
      callouts: [
        { index: 1, text: "2024: POL04 (Gestión Presupuestal y Eficiencia del Gasto Público) cae a 77,27 — el punto más bajo de las cuatro series y el único retroceso interanual marcado, justo el año en que la literatura y los indicadores financieros (cartera hospitalaria, intervenciones de EPS) documentan la crisis más aguda." },
        { index: 2, text: "2025: las cuatro dimensiones repuntan y se acercan al techo de 100 — de nuevo la paradoja de implementación: el formulario autorreportado marca casi perfección en el mismo año en que la cartera hospitalaria alcanza su máximo histórico." },
      ],
      scope: "Mide el cumplimiento formal reportado por la propia entidad (MinSalud) en el Formulario Único de Reporte de Avance a la Gestión (FURAG), no una auditoría externa independiente. Cobertura: entidades del orden nacional y territorial sujetas al Decreto 1499 de 2017 (MIPG/MECI); periodicidad anual, con acopio en el primer trimestre del año siguiente a la vigencia evaluada.",
      limitations: [
        "Es un registro administrativo autodiligenciado por cada entidad — no hay verificación externa independiente de las respuestas, solo reglas de validación lógica y de consistencia.",
        "Los resultados se comparan dentro de \"grupos par\" (entidades con características homogéneas) y se organizan en quintiles dentro de cada grupo — el puntaje 0-100 es nominalmente comparable entre entidades, pero su interpretación relativa (posición, quintil) no lo es fuera del grupo par de la entidad.",
        "La comparabilidad interanual tiene límites metodológicos: 2018-2021 son comparables entre sí bajo un esquema, y 2022-2025 bajo otro; además, la definición exacta de algunos ítems cambia entre versiones del formulario (por ejemplo, el ítem i28 midió \"gestión de la acción de repetición\" en 2023-2024 y fue redefinido a \"gestión de los mecanismos para la protección y recuperación del patrimonio público\" en 2025) — por eso esta serie se limita a las 4 dimensiones/políticas de más alto nivel, más estables conceptualmente entre versiones.",
        "No incluye a las Empresas Sociales del Estado (ESE): estas reportan FURAG en el archivo territorial, no en el nacional, y no están cubiertas en esta serie específica de MinSalud.",
      ],
      detailItems: {
        note: "Detalle de los índices puntuales que el usuario identificó como más ligados a política pública en salud (POL03, i23, i24, POL09, i28, i64-i67). Todos rondan 93-100 en las tres vigencias, por lo que se muestran en tabla en vez de gráfico — la variación relevante está en las 4 series graficadas arriba.",
        columns: ["Índice", "2023", "2024", "2025"],
        rows: [
          ["POL03 Índice de Planeación Institucional", "99.42", "100", "100"],
          ["i23 Implementación Lineamientos de Política", "93.75", "100", "100"],
          ["i24 Despliegue de Controles", "100", "100", "100"],
          ["POL09 Índice Defensa Jurídica", "100", "100", "100"],
          ["i28 (definición cambia en 2025 — ver limitaciones)", "100", "100", "100"],
          ["i64 Evaluación estratégica del riesgo", "97.59", "100", "100"],
          ["i65 Actividades de control efectivas", "100", "100", "100"],
          ["i66 Información y comunicación para el control", "96.78", "99.69", "99.87"],
          ["i67 Actividades de monitoreo sistemáticas", "98.68", "97.83", "99.07"],
        ],
      },
    }
  ],

  // ------------------------------------------------------------------
  // Indicadores de comparación (dos puntos temporales verificados,
  // no series densas) — se muestran como tarjetas antes/después.
  // ------------------------------------------------------------------
  comparisonIndicators: [
    {
      id: "bolsillo",
      title: "Gasto de bolsillo en salud",
      unit: "% del gasto corriente en salud",
      loopLink: "Variable proxy adicional del nodo 2 (Fragmentación institucional y financiera): a mayor fragmentación del aseguramiento, mayor carga trasladada directamente a los hogares.",
      before: { label: "2019", value: "15,8%" },
      after: { label: "2024", value: "17,2%" },
      deltaNote: "Colombia se acerca al umbral de riesgo financiero catastrófico para los hogares definido por la OMS (20%).",
      source: "DANE, Cuentas de Salud — citado en informe de la Defensoría del Pueblo sobre la crisis del sistema de salud.",
      sourceUrl: "https://www.eltiempo.com/amp/justicia/investigacion/informe-de-la-defensoria-revela-cifras-criticas-de-la-salud-disparada-de-tutelas-e-incremento-del-gasto-de-bolsillo-3546107"
    },
    {
      id: "pqrd",
      title: "PQRD ante la Superintendencia Nacional de Salud",
      unit: "Tasa por 10.000 afiliados",
      loopLink: "Variable proxy adicional del nodo 5 (Judicialización y desgaste institucional): un canal administrativo, no judicial, que se mueve en la misma dirección que la tutela.",
      before: { label: "Nov-2024", value: "322,0" },
      after: { label: "Nov-2025", value: "420,8" },
      deltaNote: "+30,7% en 12 meses; Supersalud atribuye el alza a fallas estructurales del modelo, no a EPS puntuales — el incremento se concentra incluso en EPS no intervenidas.",
      source: "Superintendencia Nacional de Salud, análisis de PQRD (peticiones, quejas, reclamos y denuncias).",
      sourceUrl: "https://consultorsalud.com/pqrds-en-colombia-supersalud-fallas-mode-salud/"
    },
  ],

  // ------------------------------------------------------------------
  // Recomendaciones + lectura desde investigación de implementación
  // Síntesis propia del autor, no hallazgos textuales de la revisión.
  // Fases IR: (I) definición del problema y contexto, (II) diseño de
  // estrategias de implementación, (III) prueba de resultados de
  // implementación. Resultados adaptados de Proctor et al. (2011).
  // ------------------------------------------------------------------
  recommendations: [
    {
      category: "A",
      title: "Evaluar empíricamente el MIPG aplicado al sector salud",
      leverage: "Nodo 1 → Nodo 2 (fortalecer la rectoría antes de que la fragmentación se profundice)",
      text: "Ninguno de los 17 estudios evalúa directamente el Modelo Integrado de Planeación y Gestión en entidades de salud. Diseñar una evaluación de implementación (no solo de cumplimiento documental como el FURAG) que compare el desempeño formal reportado con desenlaces reales de gobernanza territorial.",
      irPhase: "I — Definición del problema e investigación exploratoria",
      outcomes: [
        { name: "Factibilidad", level: "alta", note: "El MIPG ya recolecta datos por entidad (FURAG); se requiere análisis, no un sistema nuevo." },
        { name: "Fidelidad", level: "baja", note: "El puntaje FURAG mide cumplimiento formal, no necesariamente la calidad real de la rectoría — riesgo de brecha entre forma y sustancia." },
        { name: "Sostenibilidad", level: "media", note: "Depende de que la evaluación se institucionalice y no sea un ejercicio puntual." },
      ]
    },
    {
      category: "B",
      title: "Consolidar la arquitectura única de datos y financiamiento",
      leverage: "Nodo 2 → Nodo 3 (reducir la fragmentación para liberar autonomía territorial)",
      text: "Dar continuidad y evaluar el proceso de centralización analítica de ADRES (FEV-RIPS, 2024–2025) como estrategia de implementación para reducir la dispersión de datos y financiamiento entre EPS/IPS públicas, con métricas explícitas de reducción de cartera hospitalaria.",
      irPhase: "II — Diseño y prueba de la estrategia de implementación (ya en curso)",
      outcomes: [
        { name: "Adopción", level: "media", note: "El proceso ya inició, pero su cobertura y uso efectivo por las EPS/IPS públicas aún no está evaluado en la literatura." },
        { name: "Costo de implementación", level: "media-alta", note: "Requiere interoperabilidad entre sistemas heterogéneos de decenas de aseguradoras y prestadoras." },
        { name: "Penetración", level: "por evaluar", note: "Es la principal laguna: no hay estudios sobre alcance real de FEV-RIPS en el corpus revisado." },
      ]
    },
    {
      category: "C",
      title: "Fortalecer la autonomía decisoria y los sistemas de información territoriales",
      leverage: "Nodo 3 → Nodo 4 (proteger la calidad percibida de la prestación en el territorio)",
      text: "Focalizar el fortalecimiento territorial (como el que ya adelantan MinSalud y OPS/OMS en Nariño, Amazonas, Vichada y Caquetá) en dos frentes simultáneos: capacidad decisoria presupuestal de las ESE y la interoperabilidad de sus sistemas de información con el nivel central.",
      irPhase: "I/II — Adaptación de estrategia a contexto territorial heterogéneo",
      outcomes: [
        { name: "Apropiación (contexto)", level: "variable", note: "La heterogeneidad territorial (Nariño, Amazonas, Vichada, Caquetá vs. territorios centrales) exige estrategias adaptadas, no un modelo único." },
        { name: "Escalabilidad", level: "incierta", note: "Lo que funcione en territorios dispersos no necesariamente es transferible a zonas urbanas con otra dinámica institucional." },
        { name: "Sostenibilidad", level: "por evaluar", note: "Ningún estudio incluido evalúa la continuidad de estas iniciativas más allá del ciclo de gobierno que las impulsa." },
      ]
    },
    {
      category: "D",
      title: "Convertir la judicialización en un sistema de alerta temprana de gobernanza",
      leverage: "Nodo 5 → Nodo 6 (usar la tutela como señal, no solo como síntoma)",
      text: "Usar los datos de tutela en salud (Defensoría del Pueblo) como panel de monitoreo territorial de fallas de gobernanza en tiempo casi real, en vez de tratarlos únicamente como litigio individual — y publicarlos junto con los indicadores de transparencia institucional que hoy son insuficientes.",
      irPhase: "II — Diseño de estrategia de implementación (bajo costo, alta disponibilidad de datos)",
      outcomes: [
        { name: "Factibilidad", level: "alta", note: "Los datos de tutela ya se recolectan y publican anualmente; el costo marginal de un tablero territorial es bajo." },
        { name: "Aceptabilidad institucional", level: "incierta", note: "Requiere que las entidades acepten exponer públicamente sus propias fallas de cobertura, lo que puede generar resistencia." },
        { name: "Oportunidad", level: "alta", note: "Convertiría un indicador reactivo (tutela) en un mecanismo preventivo, coherente con cerrar el bucle R1 antes de que se refuerce." },
      ]
    },
    {
      category: "E",
      title: "Investigación longitudinal sobre gobernanza de ESE y sistemas indígenas de salud (SISPI)",
      leverage: "Cierra la laguna de evidencia más citada — sin datos micro-institucionales no se puede romper el patrón de 30 años",
      text: "Financiar investigación longitudinal específica sobre gobernanza a nivel de Empresas Sociales del Estado (ESE) y sobre la articulación de los sistemas de salud propios e interculturales indígenas (SISPI) con el SGSSS — ambos ausentes del corpus de evidencia disponible pese a ser actores centrales.",
      irPhase: "I — Investigación exploratoria (fase previa indispensable, hoy ausente)",
      outcomes: [
        { name: "Relevancia", level: "alta", note: "Sin evidencia a nivel micro-institucional, cualquier estrategia de fortalecimiento se diseña a ciegas sobre el eslabón más cercano al ciudadano." },
        { name: "Factibilidad de investigación", level: "media", note: "Requiere financiamiento dedicado y acceso a más de 900 ESE en el país; no es un ejercicio de escritorio." },
        { name: "Impacto potencial", level: "alto, no verificado", note: "Es una hipótesis de investigación, no un hallazgo — la propia revisión señala esta ausencia como su principal laguna." },
      ]
    },
  ],

  gaps: [
    "Ningún estudio evalúa directa y específicamente la implementación o los resultados del MIPG (Decreto 1499 de 2017) en entidades del sector salud.",
    "La evidencia sobre gobernanza local se basa en muestras pequeñas y no probabilísticas (n=28 a n=107), sin estudios longitudinales.",
    "No se encontraron estudios centrados específicamente en la gobernanza de las Empresas Sociales del Estado (ESE) a nivel micro-institucional.",
    "La gobernanza de los sistemas de salud propios e interculturales indígenas (SISPI) está prácticamente ausente del corpus.",
    "No se identificaron evaluaciones de impacto ni estudios comparativos pre-post de las reformas de gobernanza recientes (2024).",
  ],

  // ------------------------------------------------------------------
  // Estudios incluidos (tabla de síntesis)
  // ------------------------------------------------------------------
  studies: [
    { n: 1, title: "Health system governance challenges and lessons from COVID-19 for Colombia", author: "Arias-Monsalve & Restrepo-Zea, 2023", journal: "Revista de Salud Pública", type: "Descriptivo-exploratorio (encuesta)", result: "Gobernanza del sistema calificada en 2.6/5.0 (baja calidad); mejoras percibidas en visión estratégica y gestión de riesgo durante la pandemia.", db: "PubMed", url: "https://doi.org/10.15446/rsap.V25n5.111796" },
    { n: 2, title: "Health Transparency and Communication on the Government Websites of Ibero-American Countries: The Cases of Chile, Colombia, Ecuador, and Spain", author: "Barredo Ibáñez et al., 2021", journal: "Int. J. Environ. Res. Public Health", type: "Análisis de contenido (transversal)", result: "Transparencia insuficiente en general; el déficit fue menor en países con sistema de salud público.", db: "PubMed", url: "https://doi.org/10.3390/ijerph18126222" },
    { n: 3, title: "Primary health care policy investments in the Latin America context: Health systems experiences from Brazil, Chile, and Colombia", author: "Massuda et al., 2025", journal: "Health Policy OPEN", type: "Cualitativo (revisión histórico-institucional + entrevistas)", result: "Colombia carece de políticas de inversión focalizadas en APS, aunque marcos emergentes (Planes Maestros) son prometedores.", db: "PubMed", url: "https://doi.org/10.1016/j.hpopen.2025.100147" },
    { n: 4, title: "Local governance dynamics in the Colombian health system: an exploratory cross-sectional study among public health sector officials", author: "Losada-Trujillo et al., 2026", journal: "Journal of Public Health Policy", type: "Transversal exploratorio (encuesta autoadministrada)", result: "Gobernanza local débil: baja autonomía decisoria, presiones externas en planeación/presupuesto, integración deficiente de sistemas de información.", db: "PubMed", url: "https://doi.org/10.1057/s41271-026-00635-8" },
    { n: 5, title: "Political and institutional determinants of the Colombian health system financing fragmentation", author: "Losada-Trujillo et al., 2026", journal: "BMC Health Services Research", type: "Cualitativo exploratorio (entrevistas semiestructuradas)", result: "Determinantes políticos (corrupción, conflicto armado, polarización) e institucionales (subfinanciación, integración vertical) de la fragmentación del financiamiento.", db: "PubMed", url: "https://doi.org/10.1186/s12913-026-14755-0" },
    { n: 6, title: "Principles and essential elements of the fundamental right to health in Colombia: an integrative review", author: "Millán-Hernández et al., 2026", journal: "Frontiers in Health Services", type: "Revisión integrativa", result: "La realización del derecho fundamental a la salud está limitada por determinantes estructurales, debilidades de gobernanza y fragmentación sistémica.", db: "PubMed", url: "https://doi.org/10.3389/frhs.2026.1838181" },
    { n: 7, title: "Analytical Centralization of Health Expenditure at ADRES: Architecture, Data Quality, and Operational Performance", author: "Garavito Jiménez et al., 2026 (preprint, sin revisión por pares)", journal: "medRxiv", type: "Descripción técnica de plataforma / estudio operacional", result: "Colombia partió de una arquitectura fragmentada sin infraestructura analítica centralizada en ADRES; se describe el proceso de centralización FEV-RIPS 2024-2025.", db: "Embase", url: "https://doi.org/10.64898/2026.06.08.26355159" },
    { n: 8, title: "The Digital Transformation and the Right to Health of Young Adults in Bangladesh and Colombia: A Community-Engaged Study", author: "Digital Health and Rights Project Consortium, 2024", journal: "Health and Human Rights", type: "Cualitativo (grupos focales y entrevistas)", result: "Se documentan daños por desinformación y estigma; se plantea la necesidad de una gobernanza digital de la salud basada en derechos.", db: "Embase", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11683582/" },
    { n: 9, title: "Raising the Visibility of NTDs in the Discussion of Domestic Health Resource Allocation: Lessons from Colombia, Guatemala, and the Philippines", author: "Gonzalez, Killian & Francisco, 2023 (resumen de congreso)", journal: "American Journal of Tropical Medicine and Hygiene (suplemento ASTMH)", type: "Revisión documental + datos secundarios", result: "Identifica factores habilitantes para el financiamiento doméstico y la priorización de enfermedades desatendidas.", db: "Embase", url: "" },
    { n: 10, title: "Developing technical support and strategic dialogue at the country level to achieve PHC-based health systems beyond the COVID-19 era", author: "Cheong Chi Mo et al., 2023", journal: "Frontiers in Public Health", type: "Artículo programático / descripción de intervención OMS", result: "El acompañamiento técnico de la OMS (UHC Partnership) fortalece la gobernanza y la resiliencia de los sistemas de salud basados en APS.", db: "Embase", url: "https://doi.org/10.3389/fpubh.2023.1102325" },
    { n: 11, title: "Towards a taxonomy of judicialisation for access to medicines in Latin America", author: "Freiberg & Espín, 2022", journal: "Global Public Health", type: "Análisis documental comparado", result: "La judicialización refleja un sistema de baja gobernanza e ineficiente para decidir coberturas; se propone una taxonomía de tipos A/B/C.", db: "Embase", url: "https://doi.org/10.1080/17441692.2021.1892794" },
    { n: 12, title: "Aportes y desafíos en el proceso de reforma del sector salud con énfasis en territorios prioritarios: Colombia 2022", author: "Organización Panamericana de la Salud, 2024", journal: "OPS (libro institucional)", type: "Informe/libro institucional", result: "Propone fortalecer la autoridad sanitaria y la gobernanza de la salud pública en territorios con mayores desigualdades.", db: "LILACS", url: "https://iris.paho.org/handle/10665.2/60489" },
    { n: 13, title: "Primary health care policies and organization in South American countries", author: "Pan American Health Organization, 2025", journal: "OPS (informe regional)", type: "Informe regional (revisión de caso por país)", result: "Documenta lecciones sobre transformación de sistemas de salud e implementación de APS por país.", db: "LILACS", url: "https://iris.paho.org/handle/10665.2/69261" },
    { n: 14, title: "Evolución del sistema de salud colombiano: ¿qué queda de la Ley 100 de 1993?", author: "Restrepo-Zea, 2022", journal: "Revista de Salud Pública", type: "Revisión narrativa/documental", result: "Analiza los cambios institucionales y financieros de la Ley 100 y su vigencia treinta años después.", db: "LILACS", url: "http://www.scielo.org.co/scielo.php?script=sci_arttext&pid=S0124-00642022000100301" },
    { n: 15, title: "La salud pública en Colombia (1991-2021). Promoción de la salud y prevención: una revisión", author: "Franco-Giraldo, 2022", journal: "Revista de Salud Pública", type: "Revisión narrativa", result: "Critica la gobernanza de la APS en Colombia en 30 años del SGSSS.", db: "Google Scholar", url: "https://doi.org/10.15446/rsap.v24n1.103378" },
    { n: 16, title: "Gobernanza y crisis del sistema de salud colombiano: una revisión crítica", author: "Villadiego Lora, 2026", journal: "Opinión y Salud (plataforma de divulgación, no confirmada como arbitrada)", type: "Revisión crítica", result: "Analiza la crisis del sistema desde fallas estructurales de gobernanza, más allá de la escasez de recursos.", db: "Google Scholar", url: "https://opinionysalud.co/gobernanza-y-crisis-del-sistema-de-salud-colombiano-una-revision-critica/" },
    { n: 17, title: "Comprensión de políticas públicas de salud en Colombia: alineación con los ODS", author: "Cifuentes Marín, 2024", journal: "Revista Médica de Risaralda", type: "Análisis conceptual/documental", result: "Examina la alineación de las políticas públicas de salud colombianas con los ODS.", db: "Google Scholar", url: "https://doi.org/10.22517/25395203.25619" },
  ],

  methodology: {
    pcc: {
      population: "Instituciones públicas del sector salud en Colombia (entes territoriales de salud, EPS/IPS públicas, Ministerio de Salud y Protección Social, Superintendencia Nacional de Salud).",
      concept: "Modelos de gestión pública, gobernanza y rectoría (stewardship) en salud.",
      context: "Sistema General de Seguridad Social en Salud (SGSSS) de Colombia."
    },
    databases: ["PubMed/MEDLINE", "Embase", "LILACS/BVS", "Google Scholar", "Literatura gris institucional (MinSalud, DNP, Supersalud, OPS/OMS, Banco Mundial, CEPAL)"],
    qualityTools: ["STROBE (transversales)", "SRQR y COREQ (cualitativos)", "PRISMA 2020 (revisión integrativa)", "SANRA (revisiones narrativas)", "AACODS (literatura gris)"],
    limitations: [
      "Cribado por título y resumen realizado por un único revisor, sin verificación independiente por un segundo evaluador.",
      "Volumen inicial elevado de falsos positivos en Embase por la explosión del término Emtree «stewardship» hacia programas clínicos.",
      "Discrepancia menor no resuelta en LILACS/BVS entre el conteo en pantalla (64) y el archivo exportado (65 filas).",
      "Se incluyó un preprint sin revisión por pares y un documento de plataforma de arbitraje no confirmado, señalados explícitamente en la tabla de calidad.",
      "El diseño de la revisión no permite establecer relaciones causales en sentido epidemiológico/estadístico entre modelos de gestión y desenlaces del sistema.",
    ]
  }
};
