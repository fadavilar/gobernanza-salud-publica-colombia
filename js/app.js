/* ============================================================
   App — theming, accordion, rendering, diagram, charts
   ============================================================ */
(function(){
  "use strict";

  /* ---------------- Theme ---------------- */
  const THEME_KEY = "sp_theme";
  function applyTheme(mode){
    if(mode === "light" || mode === "dark"){
      document.documentElement.setAttribute("data-theme", mode);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
  function currentEffectiveTheme(){
    const attr = document.documentElement.getAttribute("data-theme");
    if(attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function initTheme(){
    let saved = null;
    try{ saved = localStorage.getItem(THEME_KEY); }catch(e){}
    applyTheme(saved);
  }
  function toggleTheme(){
    const eff = currentEffectiveTheme();
    const next = eff === "dark" ? "light" : "dark";
    applyTheme(next);
    try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
    // re-theme charts
    renderAllCharts();
  }
  initTheme();

  /* ---------------- Utility ---------------- */
  function el(tag, attrs, children){
    const node = document.createElement(tag);
    if(attrs){
      Object.keys(attrs).forEach(k=>{
        if(k === "class") node.className = attrs[k];
        else if(k === "html") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children||[]).forEach(c=>{ if(c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }
  function cssVar(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function studyRefs(nums){
    return el("span", {class:"refs"}, nums.map(n => el("span", {class:"study-ref", title:"Estudio #"+n}, [String(n)])));
  }
  function levelClass(level){
    const l = (level||"").toLowerCase();
    if(l.indexOf("alta")>=0 || l.indexOf("alto")>=0) return "level-alta";
    if(l.indexOf("media-alta")>=0) return "level-media-alta";
    if(l.indexOf("media")>=0) return "level-media";
    if(l.indexOf("baja")>=0) return "level-baja";
    if(l.indexOf("incierta")>=0) return "level-incierta";
    if(l.indexOf("variable")>=0) return "level-variable";
    return "level-por";
  }

  /* ============================================================
     ACCORDION
     ============================================================ */
  const SECTIONS = [
    { id:"resumen", num:"01", title:"Resumen ejecutivo", sub:"Lo esencial en 60 segundos", open:true },
    { id:"diagnostico", num:"02", title:"Diagnóstico causal", sub:"Modelo de dinámica de sistemas (Homer & Hirsch, 2006)", open:false },
    { id:"categorias", num:"03", title:"Hallazgos por categoría", sub:"Teoría fundamentada: 5 categorías axiales, 11 códigos", open:false },
    { id:"indicadores", num:"04", title:"Indicadores en el tiempo", sub:"Datos públicos que contextualizan el diagnóstico", open:false },
    { id:"recomendaciones", num:"05", title:"Recomendaciones e investigación de implementación", sub:"Síntesis propia — leverage points y resultados esperados", open:false },
    { id:"estudios", num:"06", title:"Estudios incluidos", sub:"17 estudios a texto completo, con enlace y base de origen", open:false },
    { id:"lagunas", num:"07", title:"Lagunas de evidencia", sub:"Qué no sabemos todavía", open:false },
    { id:"metodologia", num:"08", title:"Metodología en breve", sub:"PCC, bases consultadas y limitaciones", open:false },
  ];

  function buildAccordionShell(){
    const wrap = document.getElementById("accordion");
    SECTIONS.forEach(s=>{
      const item = el("div", {class:"acc-item"+(s.open?" open":""), id:"sec-"+s.id});
      const header = el("button", {class:"acc-header","aria-expanded": s.open?"true":"false"}, [
        el("span",{class:"num"},[s.num]),
        el("span",{class:"titles"},[ el("h3",{},[s.title]), el("span",{class:"sub"},[s.sub]) ]),
        el("svg",{class:"chev",viewBox:"0 0 24 24",fill:"none",html:'<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'}),
      ]);
      const panel = el("div",{class:"acc-panel"});
      const inner = el("div",{},[ el("div",{class:"acc-body", id:"body-"+s.id}) ]);
      panel.appendChild(inner);
      header.addEventListener("click", ()=> toggleSection(item, header));
      item.appendChild(header);
      item.appendChild(panel);
      wrap.appendChild(item);
    });
  }
  function toggleSection(item, header, forceOpen){
    const willOpen = typeof forceOpen === "boolean" ? forceOpen : !item.classList.contains("open");
    item.classList.toggle("open", willOpen);
    header.setAttribute("aria-expanded", willOpen ? "true":"false");
    if(willOpen) requestChartRenderFor(item.id.replace("sec-",""));
  }
  function setAllSections(open){
    document.querySelectorAll(".acc-item").forEach(item=>{
      const header = item.querySelector(".acc-header");
      toggleSection(item, header, open);
    });
  }

  /* ============================================================
     RENDER: Header / Hero
     ============================================================ */
  function renderHero(){
    document.getElementById("brand-title").textContent = DATA.meta.title;
    document.getElementById("hero-title").textContent = DATA.meta.title;
    document.getElementById("hero-lede").textContent = DATA.meta.subtitle;
    document.getElementById("hero-framework").textContent = DATA.meta.framework;
    document.getElementById("hero-period").textContent = DATA.meta.period;
    document.getElementById("byline").innerHTML =
      `<strong>${DATA.meta.author}</strong> · ${DATA.meta.affiliation}`;

    const grid = document.getElementById("stat-grid");
    DATA.stats.forEach(s=>{
      grid.appendChild(el("div",{class:"stat-card"},[
        el("div",{class:"value"},[s.value]),
        el("div",{class:"label"},[s.label]),
        el("div",{class:"detail"},[s.detail]),
      ]));
    });

    document.getElementById("footer-disclaimer").textContent = DATA.meta.disclaimer;
    document.getElementById("footer-author").textContent = DATA.meta.author + " · " + DATA.meta.affiliation;
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  /* ============================================================
     RENDER: 01 Resumen
     ============================================================ */
  function renderResumen(){
    const body = document.getElementById("body-resumen");
    body.appendChild(el("p",{},[
      "Esta revisión de alcance mapeó la evidencia académica (2021–2026) sobre gestión pública, gobernanza y rectoría en el sector salud colombiano, en el marco del Sistema General de Seguridad Social en Salud (SGSSS). Tras cribar 281 registros únicos, se incluyeron 17 estudios a texto completo, sintetizados aquí mediante teoría fundamentada y un modelo causal de dinámica de sistemas."
    ]));
    body.appendChild(el("div",{class:"selective-box"},[
      el("h4",{},["Categoría selectiva"]),
      el("h3",{},[DATA.selectiveCategory.title]),
      el("p",{},[DATA.selectiveCategory.text]),
    ]));
    body.appendChild(el("p",{style:"margin-top:14px;font-size:.85rem;color:var(--text-muted)"},[
      "Explora las secciones siguientes: primero el diagnóstico causal (el porqué), luego los hallazgos por categoría (la evidencia), los indicadores públicos (el contexto cuantitativo), y finalmente las recomendaciones leídas desde investigación de implementación (el qué hacer)."
    ]));
  }

  /* ============================================================
     RENDER: 02 Diagnóstico causal (SVG diagram)
     ============================================================ */
  function renderDiagnostico(){
    const body = document.getElementById("body-diagnostico");
    body.appendChild(el("p",{},[
      "Diagrama de bucles causales que sintetiza el diagnóstico emergente. Toca o pasa el cursor sobre cada nodo para ver los actores institucionales y los estudios que lo respaldan."
    ]));

    const wrap = el("div",{class:"diagram-wrap"});
    wrap.appendChild(buildCausalSVG());
    body.appendChild(wrap);

    body.appendChild(el("div",{class:"loop-legend"},[
      el("span",{class:"swatch"},[el("span",{class:"sw sw-r"}), "R1 · bucle de refuerzo (erosión acumulativa)"]),
      el("span",{class:"swatch"},[el("span",{class:"sw sw-b"}), "B1 · bucle de balance, con demora (fortalecimiento)"]),
      el("span",{class:"swatch"},[el("span",{style:"color:var(--danger);font-weight:800"},["−"]), " las variables cambian en sentido opuesto"]),
      el("span",{class:"swatch"},[el("span",{style:"color:var(--success);font-weight:800"},["+"]), " las variables cambian en el mismo sentido"]),
    ]));

    const detail = el("div",{class:"node-detail",id:"node-detail"});
    body.appendChild(detail);

    DATA.causalLoop.loops.forEach(loop=>{
      const card = el("div",{class:"loop-card "+(loop.type==="reforzamiento"?"r":"b")},[
        el("h4",{},[loop.title]),
        el("p",{style:"margin:0;font-size:.88rem"},[loop.text]),
      ]);
      if(loop.relatedInitiatives){
        const tags = el("div",{class:"initiatives"});
        loop.relatedInitiatives.forEach(t=> tags.appendChild(el("span",{class:"tag-pill"},[t])));
        card.appendChild(tags);
      }
      body.appendChild(card);
    });

    body.appendChild(el("p",{class:"indicator-source", style:"margin-top:12px"},[DATA.causalLoop.citation]));
  }

  function buildCausalSVG(){
    const svgNS = "http://www.w3.org/2000/svg";
    const W = 760, H = 560;
    const cx = W/2, cy = 268, R = 200;
    const nodes = DATA.causalLoop.nodes;
    const n = nodes.length;
    const pos = {};
    nodes.forEach((node,i)=>{
      const angle = -Math.PI/2 + (i * (2*Math.PI/n));
      pos[node.id] = { x: cx + R*Math.cos(angle), y: cy + R*Math.sin(angle) };
    });

    const svg = document.createElementNS(svgNS,"svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("width","100%");
    svg.setAttribute("role","img");
    svg.setAttribute("aria-label","Diagrama de bucles causales del diagnóstico de gobernanza en salud");

    const defs = document.createElementNS(svgNS,"defs");
    defs.innerHTML = `
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="context-stroke"></path>
      </marker>`;
    svg.appendChild(defs);

    // R1 loop tag (center)
    const centerLabel = document.createElementNS(svgNS,"text");
    centerLabel.setAttribute("x", cx); centerLabel.setAttribute("y", cy-6);
    centerLabel.setAttribute("text-anchor","middle");
    centerLabel.setAttribute("class","loop-tag r");
    centerLabel.textContent = "R1";
    svg.appendChild(centerLabel);
    const centerSub = document.createElementNS(svgNS,"text");
    centerSub.setAttribute("x", cx); centerSub.setAttribute("y", cy+14);
    centerSub.setAttribute("text-anchor","middle");
    centerSub.setAttribute("font-size","10");
    centerSub.setAttribute("fill","currentColor");
    centerSub.setAttribute("style","fill:var(--text-muted)");
    centerSub.textContent = "erosión acumulativa";
    svg.appendChild(centerSub);

    // Edges (R1 loop, curved along circle)
    DATA.causalLoop.edges.forEach(edge=>{
      const a = pos[edge.from], b = pos[edge.to];
      const mx = (a.x+b.x)/2, my=(a.y+b.y)/2;
      // bow the curve slightly toward center for a nicer loop feel
      const dx = mx-cx, dy = my-cy;
      const dist = Math.sqrt(dx*dx+dy*dy) || 1;
      const bow = 18;
      const cxp = mx - (dx/dist)*bow, cyp = my - (dy/dist)*bow;

      const path = document.createElementNS(svgNS,"path");
      path.setAttribute("d", `M ${a.x} ${a.y} Q ${cxp} ${cyp} ${b.x} ${b.y}`);
      path.setAttribute("class","edge-path");
      svg.appendChild(path);

      const label = document.createElementNS(svgNS,"text");
      label.setAttribute("x", cxp); label.setAttribute("y", cyp);
      label.setAttribute("text-anchor","middle");
      label.setAttribute("class","edge-label "+(edge.polarity==="-"?"neg":"pos"));
      label.textContent = edge.polarity;
      svg.appendChild(label);
    });

    // B1 loop: node 1 <-> external node "Iniciativas de fortalecimiento"
    const n1 = pos[1];
    const bx = n1.x, by = n1.y - 130;
    const bnode = document.createElementNS(svgNS,"g");
    bnode.setAttribute("class","node-box");
    bnode.innerHTML = `
      <rect x="${bx-95}" y="${by-24}" width="190" height="48" rx="10"></rect>
      <text x="${bx}" y="${by-2}" text-anchor="middle">Iniciativas de fortalecimiento</text>
      <text x="${bx}" y="${by+14}" text-anchor="middle" class="actors">MIPG · Estrategia Gobernanza · FEV-RIPS</text>`;
    svg.appendChild(bnode);

    const pathToB = document.createElementNS(svgNS,"path");
    pathToB.setAttribute("d", `M ${n1.x-40} ${n1.y-20} Q ${n1.x-90} ${by+40} ${bx-20} ${by+22}`);
    pathToB.setAttribute("class","edge-path b1-edge");
    svg.appendChild(pathToB);
    const lblToB = document.createElementNS(svgNS,"text");
    lblToB.setAttribute("x", n1.x-95); lblToB.setAttribute("y", by+60);
    lblToB.setAttribute("class","edge-label neg"); lblToB.textContent="−";
    svg.appendChild(lblToB);

    const pathFromB = document.createElementNS(svgNS,"path");
    pathFromB.setAttribute("d", `M ${bx+20} ${by+22} Q ${n1.x+90} ${by+40} ${n1.x+40} ${n1.y-20}`);
    pathFromB.setAttribute("class","edge-path b1-edge");
    svg.appendChild(pathFromB);
    const lblFromB = document.createElementNS(svgNS,"text");
    lblFromB.setAttribute("x", n1.x+95); lblFromB.setAttribute("y", by+60);
    lblFromB.setAttribute("class","edge-label pos"); lblFromB.textContent="+ (demora)";
    svg.appendChild(lblFromB);

    const bTag = document.createElementNS(svgNS,"text");
    bTag.setAttribute("x", bx); bTag.setAttribute("y", by-40);
    bTag.setAttribute("text-anchor","middle"); bTag.setAttribute("class","loop-tag b");
    bTag.textContent = "B1"; svg.appendChild(bTag);

    // Main nodes
    nodes.forEach(node=>{
      const p = pos[node.id];
      const g = document.createElementNS(svgNS,"g");
      g.setAttribute("class","node-box");
      g.setAttribute("data-node", node.id);
      const words = wrapLabel(node.label, 20);
      const boxW = 168, lineH = 13;
      const boxH = 30 + words.length*lineH + (node.actors ? 14: 0);
      let html = `<rect x="${p.x-boxW/2}" y="${p.y-boxH/2}" width="${boxW}" height="${boxH}" rx="10"></rect>`;
      words.forEach((w,i)=>{
        html += `<text x="${p.x}" y="${p.y - boxH/2 + 16 + i*lineH}" text-anchor="middle">${escapeXML(w)}</text>`;
      });
      if(node.actors){
        html += `<text x="${p.x}" y="${p.y + boxH/2 - 8}" text-anchor="middle" class="actors">${escapeXML(node.actors)}</text>`;
      }
      g.innerHTML = html;
      g.addEventListener("click", ()=> showNodeDetail(node, g));
      g.addEventListener("mouseenter", ()=> showNodeDetail(node, g));
      svg.appendChild(g);
    });

    return svg;
  }
  function wrapLabel(text, maxChars){
    const words = text.split(" ");
    const lines = []; let cur = "";
    words.forEach(w=>{
      if((cur+" "+w).trim().length > maxChars){ lines.push(cur.trim()); cur = w; }
      else cur = (cur+" "+w).trim();
    });
    if(cur) lines.push(cur);
    return lines;
  }
  function escapeXML(s){
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
  function showNodeDetail(node, gEl){
    document.querySelectorAll(".node-box").forEach(n=>n.classList.remove("active"));
    gEl.classList.add("active");
    const box = document.getElementById("node-detail");
    let html = `<h5>${escapeXML(node.label)}</h5>`;
    if(node.actors) html += `<p style="margin:0 0 6px;color:var(--text-muted)">Actores: ${escapeXML(node.actors)}</p>`;
    if(node.studies && node.studies.length){
      html += `<p style="margin:0">Respaldado por los estudios: ` +
        node.studies.map(s=>`<span class="study-ref" style="margin-right:4px">${s}</span>`).join("") + `</p>`;
    } else {
      html += `<p style="margin:0;color:var(--text-muted)">Nodo de enlace en la narrativa causal (síntesis del autor); no corresponde a un hallazgo numerado individual.</p>`;
    }
    box.innerHTML = html;
    box.classList.add("show");
  }

  /* ============================================================
     RENDER: 03 Categorías
     ============================================================ */
  function renderCategorias(){
    const body = document.getElementById("body-categorias");
    body.appendChild(el("p",{},[
      "Codificación abierta, axial y selectiva (Strauss & Corbin) sobre los estudios cualitativos y descriptivos incluidos. Cada código muestra los estudios de la tabla de síntesis que lo respaldan."
    ]));
    DATA.categories.forEach(cat=>{
      const block = el("div",{class:"category-block "+cat.color});
      block.appendChild(el("h4",{},[
        el("span",{class:"chip "+cat.color, style:"margin-right:8px"},["Categoría "+cat.id]),
        cat.title
      ]));
      const list = el("ul",{class:"code-list"});
      cat.codes.forEach(code=>{
        list.appendChild(el("li",{},[
          el("span",{},[code.text]),
          studyRefs(code.studies),
        ]));
      });
      block.appendChild(list);
      body.appendChild(block);
    });
  }

  /* ============================================================
     RENDER: 04 Indicadores (Chart.js)
     ============================================================ */
  const chartInstances = {};
  function renderIndicadores(){
    const body = document.getElementById("body-indicadores");
    body.appendChild(el("p",{},[
      "Estos indicadores provienen de fuentes públicas oficiales y gremiales — no forman parte del corpus de la revisión — y se presentan como contexto cuantitativo de las variables del modelo causal."
    ]));
    DATA.indicators.forEach(ind=>{
      const block = el("div",{class:"indicator-block"});
      block.appendChild(el("div",{class:"indicator-head"},[
        el("h4",{},[ind.title]),
        el("span",{class:"unit"},[ind.unit]),
      ]));
      block.appendChild(el("div",{class:"indicator-linklet"},[ind.loopLink]));
      const chartBox = el("div",{class:"chart-box"},[ el("canvas",{id:"chart-"+ind.id}) ]);
      block.appendChild(chartBox);
      const callBox = el("div",{class:"indicator-callouts"});
      (ind.callouts||[]).forEach(c=> callBox.appendChild(el("div",{class:"callout"},[c.text])));
      block.appendChild(callBox);
      block.appendChild(el("div",{class:"indicator-source"},[
        "Fuente: ", el("a",{href:ind.sourceUrl, target:"_blank", rel:"noopener"},[ind.source])
      ]));
      body.appendChild(block);
    });
  }
  function renderAllCharts(){
    if(typeof Chart === "undefined") return;
    DATA.indicators.forEach(ind=>{
      const canvas = document.getElementById("chart-"+ind.id);
      if(!canvas) return;
      if(chartInstances[ind.id]) chartInstances[ind.id].destroy();
      const gridColor = cssVar("--border") || "#e1e6ee";
      const textColor = cssVar("--text-muted") || "#57667a";
      const primary = cssVar("--primary-2") || "#147a86";
      chartInstances[ind.id] = new Chart(canvas.getContext("2d"), {
        type: "line",
        data: {
          labels: ind.labels,
          datasets: [{
            data: ind.values,
            borderColor: primary,
            backgroundColor: primary+"33",
            pointBackgroundColor: primary,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: .3,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display:false },
            tooltip: {
              callbacks: {
                label: (ctx)=> ind.unit + ": " + ctx.parsed.y.toLocaleString("es-CO")
              }
            }
          },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor, font:{size:11} } },
            y: {
              reverse: !!ind.invertAxis,
              grid: { color: gridColor },
              ticks: { color: textColor, font:{size:11} }
            }
          }
        }
      });
    });
  }
  function requestChartRenderFor(sectionId){
    if(sectionId === "indicadores") renderAllCharts();
  }

  /* ============================================================
     RENDER: 05 Recomendaciones
     ============================================================ */
  function renderRecomendaciones(){
    const body = document.getElementById("body-recomendaciones");
    body.appendChild(el("p",{},[
      "Cada recomendación se ancla en un punto de apalancamiento (leverage point) del modelo causal y se lee con el marco de resultados de investigación de implementación (adaptado de Proctor et al., 2011): no basta con que una estrategia sea correcta en el papel, debe ser factible, adoptada, fiel a su diseño y sostenible en el tiempo."
    ]));
    DATA.recommendations.forEach(rec=>{
      const card = el("div",{class:"rec-card"});
      card.appendChild(el("div",{class:"rec-top"},[
        el("span",{class:"chip cat-"+rec.category.toLowerCase()},["Categoría "+rec.category]),
        el("h4",{},[rec.title]),
      ]));
      card.appendChild(el("div",{class:"rec-leverage"},["Punto de apalancamiento: "+rec.leverage]));
      card.appendChild(el("p",{style:"margin:0 0 6px"},[rec.text]));
      card.appendChild(el("div",{class:"rec-phase"},["Fase de investigación de implementación: "+rec.irPhase]));
      const outWrap = el("div",{class:"outcomes"});
      rec.outcomes.forEach(o=>{
        outWrap.appendChild(el("div",{class:"outcome"},[
          el("div",{class:"name"},[o.name, el("span",{class:"level-pill "+levelClass(o.level)},[o.level])]),
          el("div",{class:"note"},[o.note]),
        ]));
      });
      card.appendChild(outWrap);
      body.appendChild(card);
    });
  }

  /* ============================================================
     RENDER: 06 Estudios
     ============================================================ */
  function renderEstudios(){
    const body = document.getElementById("body-estudios");
    body.appendChild(el("p",{},["Filtra por base de datos de origen. Toca el título para ver el DOI/URL cuando esté disponible."]));

    const dbs = ["Todas", ...Array.from(new Set(DATA.studies.map(s=>s.db)))];
    const filterRow = el("div",{class:"filter-row"});
    dbs.forEach((db,i)=>{
      const chip = el("button",{class:"filter-chip"+(i===0?" active":""), "data-db":db},[db]);
      chip.addEventListener("click", ()=>{
        filterRow.querySelectorAll(".filter-chip").forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
        renderStudyRows(db);
      });
      filterRow.appendChild(chip);
    });
    body.appendChild(filterRow);

    const tableWrap = el("div",{class:"table-wrap"});
    const table = el("table",{class:"studies", id:"studies-table"},[
      el("thead",{},[ el("tr",{},[
        el("th",{},["#"]), el("th",{},["Estudio"]), el("th",{},["Autor / año"]),
        el("th",{},["Tipo"]), el("th",{},["Resultado principal"]), el("th",{},["Base"]),
      ])]),
      el("tbody",{id:"studies-tbody"}),
    ]);
    tableWrap.appendChild(table);
    body.appendChild(tableWrap);
    renderStudyRows("Todas");
  }
  function renderStudyRows(filterDb){
    const tbody = document.getElementById("studies-tbody");
    tbody.innerHTML = "";
    DATA.studies.filter(s=> filterDb==="Todas" || s.db===filterDb).forEach(s=>{
      const titleCell = s.url
        ? el("a",{href:s.url, target:"_blank", rel:"noopener"},[s.title])
        : el("span",{},[s.title]);
      tbody.appendChild(el("tr",{},[
        el("td",{},[el("span",{class:"study-ref"},[String(s.n)])]),
        el("td",{style:"max-width:260px"},[titleCell]),
        el("td",{style:"white-space:nowrap"},[s.author]),
        el("td",{},[s.type]),
        el("td",{style:"min-width:220px"},[s.result]),
        el("td",{},[el("span",{class:"db-badge"},[s.db])]),
      ]));
    });
  }

  /* ============================================================
     RENDER: 07 Lagunas
     ============================================================ */
  function renderLagunas(){
    const body = document.getElementById("body-lagunas");
    const list = el("ul",{class:"gap-list"});
    DATA.gaps.forEach(g=> list.appendChild(el("li",{},[g])));
    body.appendChild(list);
  }

  /* ============================================================
     RENDER: 08 Metodología
     ============================================================ */
  function renderMetodologia(){
    const body = document.getElementById("body-metodologia");
    const m = DATA.methodology;
    const pccGrid = el("div",{class:"pcc-grid"},[
      el("div",{class:"pcc-card"},[el("div",{class:"k"},["Población"]), el("p",{},[m.pcc.population])]),
      el("div",{class:"pcc-card"},[el("div",{class:"k"},["Concepto"]), el("p",{},[m.pcc.concept])]),
      el("div",{class:"pcc-card"},[el("div",{class:"k"},["Contexto"]), el("p",{},[m.pcc.context])]),
    ]);
    body.appendChild(pccGrid);

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:6px"},["Bases consultadas"]));
    const dbRow = el("div",{class:"tag-row"});
    m.databases.forEach(d=> dbRow.appendChild(el("span",{class:"tag-pill"},[d])));
    body.appendChild(dbRow);

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:16px"},["Herramientas de calidad aplicadas"]));
    const qRow = el("div",{class:"tag-row"});
    m.qualityTools.forEach(q=> qRow.appendChild(el("span",{class:"tag-pill"},[q])));
    body.appendChild(qRow);

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:16px"},["Limitaciones metodológicas declaradas"]));
    const limitList = el("ul",{class:"limit-list"});
    m.limitations.forEach(l=> limitList.appendChild(el("li",{},[l])));
    body.appendChild(limitList);
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot(){
    renderHero();
    buildAccordionShell();
    renderResumen();
    renderDiagnostico();
    renderCategorias();
    renderIndicadores();
    renderRecomendaciones();
    renderEstudios();
    renderLagunas();
    renderMetodologia();

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("expand-all").addEventListener("click", ()=> setAllSections(true));
    document.getElementById("collapse-all").addEventListener("click", ()=> setAllSections(false));

    // render charts for the sections that start open / once Chart.js is ready
    if(document.getElementById("sec-indicadores").classList.contains("open")) renderAllCharts();

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ()=>{
      let saved = null;
      try{ saved = localStorage.getItem(THEME_KEY); }catch(e){}
      if(!saved) renderAllCharts();
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
