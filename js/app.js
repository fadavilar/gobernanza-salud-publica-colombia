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
    const node = tag === "svg"
      ? document.createElementNS("http://www.w3.org/2000/svg", tag)
      : document.createElement(tag);
    if(attrs){
      Object.keys(attrs).forEach(k=>{
        if(k === "class") node.setAttribute("class", attrs[k]);
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
    const span = el("span", {class:"refs"});
    span.innerHTML = inlineCitations(nums);
    return span;
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
      `<strong>${DATA.meta.author}</strong>${DATA.meta.credentials ? ", "+DATA.meta.credentials : ""} · ${DATA.meta.affiliation}`;

    const grid = document.getElementById("stat-grid");
    DATA.stats.forEach(s=>{
      grid.appendChild(el("div",{class:"stat-card"},[
        el("div",{class:"value"},[s.value]),
        el("div",{class:"label"},[s.label]),
        el("div",{class:"detail"},[s.detail]),
      ]));
    });

    document.getElementById("footer-disclaimer").textContent = DATA.meta.disclaimer;
    document.getElementById("footer-author").textContent =
      DATA.meta.author + (DATA.meta.credentials ? ", "+DATA.meta.credentials : "") + " · " + DATA.meta.affiliation;
    document.getElementById("year").textContent = new Date().getFullYear();

    if(DATA.meta.license){
      const lic = DATA.meta.license;
      const badge = document.getElementById("cc-badge");
      badge.href = lic.url;
      badge.title = lic.name;
      badge.innerHTML = `
        <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
          <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="11.2" cy="16" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="20.8" cy="16" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
          <path d="M13 13.1c-.7-.5-1.4-.7-2.2-.7-1.9 0-3.3 1.5-3.3 3.6s1.4 3.6 3.3 3.6c.9 0 1.6-.2 2.3-.8l-.6-1.1c-.5.4-1 .6-1.6.6-1.1 0-1.9-.9-1.9-2.3s.8-2.3 1.9-2.3c.5 0 1 .2 1.5.5z" fill="currentColor" stroke="none"/>
          <path d="M22.6 13.1c-.7-.5-1.4-.7-2.2-.7-1.9 0-3.3 1.5-3.3 3.6s1.4 3.6 3.3 3.6c.9 0 1.6-.2 2.3-.8l-.6-1.1c-.5.4-1 .6-1.6.6-1.1 0-1.9-.9-1.9-2.3s.8-2.3 1.9-2.3c.5 0 1 .2 1.5.5z" fill="currentColor" stroke="none"/>
        </svg>
        <span>${lic.name}</span>`;
      document.getElementById("footer-license-text").textContent = lic.text;
    }
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
      "Diagrama de bucles causales que sintetiza el diagnóstico emergente. Toca o pasa el cursor sobre un nodo para ver los actores y estudios que lo respaldan, o sobre las etiquetas R1 / B1 para leer la explicación completa de cada bucle."
    ]));

    const wrap = el("div",{class:"diagram-wrap"});
    wrap.appendChild(buildCausalSVG());
    wrap.appendChild(el("div",{class:"diagram-tooltip",id:"diagram-tooltip",hidden:"hidden"}));
    body.appendChild(wrap);

    body.appendChild(el("div",{class:"loop-legend"},[
      el("span",{class:"swatch"},[el("span",{class:"sw sw-r"}), "R1 · bucle de refuerzo (erosión acumulativa)"]),
      el("span",{class:"swatch"},[el("span",{class:"sw sw-b"}), "B1 · bucle de balance, con demora (fortalecimiento)"]),
      el("span",{class:"swatch"},[el("span",{style:"color:var(--danger);font-weight:800"},["−"]), " las variables cambian en sentido opuesto"]),
      el("span",{class:"swatch"},[el("span",{style:"color:var(--success);font-weight:800"},["+"]), " las variables cambian en el mismo sentido"]),
    ]));

    body.appendChild(el("p",{class:"diagram-hint"},["Consejo: los nodos y las etiquetas R1/B1 son interactivos — pasa el cursor o tócalos para ver el detalle sin perder de vista el resto del diagrama."]));
    body.appendChild(el("p",{class:"indicator-source", style:"margin-top:8px"},[DATA.causalLoop.citation]));
  }

  function buildCausalSVG(){
    const svgNS = "http://www.w3.org/2000/svg";
    const W = 780, H = 720;
    const cx = W/2, cy = 440, R = 190;
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

    // R1 loop tag (center) — hoverable group with full loop explanation
    const r1Loop = DATA.causalLoop.loops.find(l=>l.id==="R1");
    const r1Group = document.createElementNS(svgNS,"g");
    r1Group.setAttribute("class","loop-tag-group r");
    r1Group.innerHTML = `
      <rect x="${cx-70}" y="${cy-26}" width="140" height="46" rx="10"></rect>
      <text x="${cx}" y="${cy-6}" text-anchor="middle" class="loop-tag r">R1</text>
      <text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="10" style="fill:var(--text-muted)">erosión acumulativa</text>`;
    if(r1Loop) attachLoopTooltip(r1Group, r1Loop);
    svg.appendChild(r1Group);

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
    const bx = n1.x, by = n1.y - 150;
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

    // B1 tag sits at the vertical midpoint of the two dashed arcs, inside the small loop
    const b1Loop = DATA.causalLoop.loops.find(l=>l.id==="B1");
    const bTagY = (by + n1.y) / 2 + 6;
    const b1Group = document.createElementNS(svgNS,"g");
    b1Group.setAttribute("class","loop-tag-group b");
    b1Group.innerHTML = `
      <rect x="${bx-24}" y="${bTagY-16}" width="48" height="26" rx="8"></rect>
      <text x="${bx}" y="${bTagY}" text-anchor="middle" class="loop-tag b">B1</text>`;
    if(b1Loop) attachLoopTooltip(b1Group, b1Loop);
    svg.appendChild(b1Group);

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
      attachNodeTooltip(g, node);
      svg.appendChild(g);
    });

    svg.addEventListener("mouseleave", hideDiagramTooltip);
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
  function buildPrismaSVG(p){
    const svgNS = "http://www.w3.org/2000/svg";
    const mainX = 88, boxW = 300, gapX = 30;
    const sideX = mainX + boxW + gapX, sideW = 250;
    const stageX = 8, stageW = 42;
    const lineH = 14.5, padTop = 24, padBottom = 12;

    const svg = document.createElementNS(svgNS,"svg");
    svg.setAttribute("role","img");
    svg.setAttribute("aria-label","Diagrama de flujo PRISMA de selección de estudios");

    const defs = document.createElementNS(svgNS,"defs");
    defs.innerHTML = `
      <marker id="parrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="context-stroke"></path>
      </marker>`;
    svg.appendChild(defs);

    // box(): title bold line(s) + detail lines; returns the box's total height
    function box(x, y, w, title, detailLines, extraClass){
      const titleLines = wrapLabel(title, Math.floor(w/6.1));
      const detailY0 = 16 + titleLines.length*13 + 6;
      const h = detailY0 + detailLines.length*lineH + padBottom - 4;
      const g = document.createElementNS(svgNS,"g");
      g.setAttribute("class","prisma-box"+(extraClass?" "+extraClass:""));
      let html = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"></rect>`;
      html += titleLines.map((l,i)=>
        `<text x="${x+12}" y="${y+16+i*13}" class="prisma-title">${escapeXML(l)}</text>`
      ).join("");
      detailLines.forEach((l,i)=>{
        html += `<text x="${x+12}" y="${y+detailY0+i*lineH}" class="prisma-label">${escapeXML(l)}</text>`;
      });
      g.innerHTML = html;
      svg.appendChild(g);
      return h;
    }
    function arrowV(x,y1,y2){
      const el2 = document.createElementNS(svgNS,"path");
      el2.setAttribute("d", `M ${x} ${y1} L ${x} ${y2}`);
      el2.setAttribute("class","edge-path prisma-arrow");
      el2.setAttribute("marker-end","url(#parrow)");
      svg.appendChild(el2);
    }
    function arrowH(x1,x2,y){
      const el2 = document.createElementNS(svgNS,"path");
      el2.setAttribute("d", `M ${x1} ${y} L ${x2} ${y}`);
      el2.setAttribute("class","edge-path prisma-arrow");
      el2.setAttribute("marker-end","url(#parrow)");
      svg.appendChild(el2);
    }
    function stagePill(y1,y2,text){
      const cy = (y1+y2)/2;
      const g = document.createElementNS(svgNS,"g");
      g.setAttribute("class","prisma-stage-pill");
      g.innerHTML = `
        <rect x="${stageX}" y="${y1}" width="${stageW}" height="${Math.max(y2-y1,60)}" rx="14"></rect>
        <text x="0" y="0" class="prisma-stage" text-anchor="middle" transform="translate(${stageX+stageW/2} ${cy}) rotate(-90)">${escapeXML(text)}</text>`;
      svg.appendChild(g);
    }
    function headerPill(x,y,w,text){
      const g = document.createElementNS(svgNS,"g");
      g.setAttribute("class","prisma-header-pill");
      g.innerHTML = `
        <rect x="${x}" y="${y}" width="${w}" height="28" rx="14"></rect>
        <text x="${x+w/2}" y="${y+18}" class="prisma-header-text" text-anchor="middle">${escapeXML(text)}</text>`;
      svg.appendChild(g);
    }

    let y = 40;
    headerPill(mainX, 4, (sideX+sideW)-mainX, "Identificación de estudios mediante bases de datos");

    // Row 1: identified -> removed (side branch)
    const dbLines = p.identifiedByDb.map(d=>`${d.label}: ${d.n}`);
    const hA = box(mainX, y, boxW, `Estudios identificados de bases de datos (n = ${p.identifiedTotal})`, dbLines);
    const removedLines = p.removedBreakdown.map(d=>`${d.label}: ${d.n}`);
    const hB = box(sideX, y, sideW, `Registros eliminados antes del cribado (n = ${p.removedTotal})`, removedLines, "prisma-removed");
    arrowH(mainX+boxW, sideX-2, y + hA/2);
    const row1Bottom = y + hA;
    y = row1Bottom + 26;

    // Row 2: screened -> excluded (side branch)
    const hC = box(mainX, y, boxW, `Registros únicos cribados por título y resumen (n = ${p.screenedTotal})`, []);
    const excludedLines = [];
    p.excludedReasons.forEach(r=> wrapLabel(r, 40).forEach((l,i)=> excludedLines.push((i===0?"– ":"   ")+l)));
    const hD = box(sideX, y, sideW, `Registros excluidos (n = ${p.excludedTotal})`, excludedLines, "prisma-removed");
    arrowH(mainX+boxW, sideX-2, y + hC/2);
    const row2Bottom = y + Math.max(hC, hD);
    y = row2Bottom + 26;

    // Row 3: included
    const includedLines = p.includedByDb.map(d=>`${d.label}: ${d.n}`);
    const hE = box(mainX, y, boxW, `Estudios incluidos a texto completo (n = ${p.includedTotal})`, includedLines, "prisma-included");

    arrowV(mainX+boxW/2, 4+28, 40);
    arrowV(mainX+boxW/2, row1Bottom, row1Bottom+26);
    arrowV(mainX+boxW/2, row2Bottom, row2Bottom+26);

    stagePill(40, row1Bottom, "Identificación");
    stagePill(row1Bottom+26, row2Bottom, "Selección");
    stagePill(y, y+hE, "Incluidos");

    const totalH = y + hE + 16;
    const totalW = sideX + sideW + 16;
    svg.setAttribute("viewBox", `0 0 ${totalW} ${totalH}`);
    svg.setAttribute("width","100%");
    return svg;
  }
  function escapeXML(s){
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
  /* ---------------- APA 7: in-text citation vs. full reference ---------------- */
  function splitAuthorYear(study){
    // study.author looks like "Apellido et al., 2026" or "Name & Name, 2023 (nota)"
    const m = study.author.match(/^(.*),\s*(\d{4})\s*(.*)$/);
    return {
      name: m ? m[1].trim() : study.author,
      year: m ? m[2] : "",
      extra: m && m[3] ? m[3].trim() : "",
    };
  }
  // Short in-text citation, e.g. "Arias-Monsalve & Restrepo-Zea, 2023" — for
  // use inline wherever a study is referenced (diagram callouts, category codes).
  function apaInText(study){
    const { name, year, extra } = splitAuthorYear(study);
    const text = `${name}, ${year}${extra ? " "+extra : ""}`;
    return { text, url: study.url || null };
  }
  // Full APA 7 reference entry (author, year, title, journal, URL spelled out)
  // — for use in the References / Estudios incluidos list.
  function apaCitationPlain(study){
    const { name, year, extra } = splitAuthorYear(study);
    let text = `${name} (${year})${extra ? " "+extra : ""}. ${study.title}. ${study.journal}.`;
    if(study.url) text += ` ${study.url}`;
    return text;
  }
  function apaCitation(study){
    const { name, year, extra } = splitAuthorYear(study);
    let html = `${escapeXML(name)} (${escapeXML(year)})${extra ? " "+escapeXML(extra) : ""}. ${escapeXML(study.title)}. ${escapeXML(study.journal)}.`;
    if(study.url) html += ` <a href="${study.url}" target="_blank" rel="noopener">${escapeXML(study.url)}</a>`;
    return { html };
  }
  // Combined inline citation list, e.g. "(Autor, Año; Autor2, Año2)" with each
  // segment individually hyperlinked — used for multi-study backing.
  function inlineCitations(nums){
    const parts = nums.map(n=>{
      const study = DATA.studies.find(s=>s.n===n);
      if(!study) return "";
      const cite = apaInText(study);
      const t = escapeXML(cite.text);
      return cite.url ? `<a href="${cite.url}" target="_blank" rel="noopener">${t}</a>` : t;
    }).filter(Boolean);
    return parts.length ? "(" + parts.join("; ") + ")" : "";
  }
  /* ---------------- Diagram floating tooltip (nodes + R1/B1 loop tags) ---------------- */
  function nodeTooltipHTML(node){
    let html = `<h5>${escapeXML(node.label)}</h5>`;
    if(node.actors) html += `<p style="color:var(--text-muted)">Actores: ${escapeXML(node.actors)}</p>`;
    if(node.studies && node.studies.length){
      html += `<p>Respaldado por: ${inlineCitations(node.studies)}</p>`;
    } else {
      html += `<p style="color:var(--text-muted)">Nodo de enlace en la narrativa causal (síntesis del autor); no corresponde a un hallazgo numerado individual.</p>`;
    }
    return html;
  }
  function loopTooltipHTML(loop){
    let html = `<h5>${escapeXML(loop.title)}</h5><p>${escapeXML(loop.text)}</p>`;
    if(loop.relatedInitiatives){
      html += `<div class="initiatives">` +
        loop.relatedInitiatives.map(t=>`<span class="tag-pill">${escapeXML(t)}</span>`).join("") + `</div>`;
    }
    return html;
  }
  function attachNodeTooltip(gEl, node){
    const show = ()=>{
      document.querySelectorAll(".node-box, .loop-tag-group").forEach(n=>n.classList.remove("active"));
      gEl.classList.add("active");
      showDiagramTooltip(gEl, nodeTooltipHTML(node));
    };
    gEl.addEventListener("mouseenter", show);
    gEl.addEventListener("click", (e)=>{ e.stopPropagation(); show(); });
  }
  function attachLoopTooltip(gEl, loop){
    const show = ()=>{
      document.querySelectorAll(".node-box, .loop-tag-group").forEach(n=>n.classList.remove("active"));
      gEl.classList.add("active");
      showDiagramTooltip(gEl, loopTooltipHTML(loop));
    };
    gEl.addEventListener("mouseenter", show);
    gEl.addEventListener("click", (e)=>{ e.stopPropagation(); show(); });
  }
  function showDiagramTooltip(targetEl, html){
    const tooltip = document.getElementById("diagram-tooltip");
    const wrap = targetEl.closest(".diagram-wrap");
    if(!tooltip || !wrap) return;
    tooltip.innerHTML = html;
    tooltip.hidden = false;
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = targetEl.getBoundingClientRect();
    const cx = elRect.left - wrapRect.left + wrap.scrollLeft + elRect.width/2;
    const topOfEl = elRect.top - wrapRect.top + wrap.scrollTop;
    const bottomOfEl = elRect.bottom - wrapRect.top + wrap.scrollTop;
    requestAnimationFrame(()=>{
      const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
      let left = cx - tw/2;
      let top = topOfEl - th - 10;
      if(top < wrap.scrollTop + 4) top = bottomOfEl + 10;
      left = Math.max(wrap.scrollLeft + 6, Math.min(left, wrap.scrollLeft + wrapRect.width - tw - 6));
      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    });
  }
  function hideDiagramTooltip(){
    const tooltip = document.getElementById("diagram-tooltip");
    if(tooltip) tooltip.hidden = true;
    document.querySelectorAll(".node-box, .loop-tag-group").forEach(n=>n.classList.remove("active"));
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
  function renderSources(ind){
    const wrap = el("div",{class:"indicator-source"});
    const list = ind.sources && ind.sources.length ? ind.sources : [{ label: ind.source, url: ind.sourceUrl }];
    list.forEach((s, i)=>{
      const line = el("div",{class:"source-line"});
      line.appendChild(el("span",{class:"source-tag"},["Fuente"+(list.length>1?" "+(i+1):"")+": "]));
      if(s.url){
        line.appendChild(el("a",{href:s.url, target:"_blank", rel:"noopener"},[s.label]));
      } else {
        line.appendChild(el("span",{},[s.label]));
        line.appendChild(el("span",{class:"chip-muted chip", style:"margin-left:6px"},["sin URL pública"]));
      }
      wrap.appendChild(line);
    });
    return wrap;
  }
  function fmtNum(n){
    return typeof n === "number" ? n.toLocaleString("es-CO") : n;
  }
  /* ---------------- CSV export ---------------- */
  function toCSV(columns, rows){
    const esc = v => `"${String(v).replace(/"/g,'""')}"`;
    return [columns.map(esc).join(","), ...rows.map(r=>r.map(esc).join(","))].join("\r\n");
  }
  function makeDownloadLink(filename, columns, rows){
    const csv = toCSV(columns, rows);
    const blob = new Blob(["﻿"+csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    return el("a",{href:url, download:filename, class:"csv-download"},[
      el("svg",{viewBox:"0 0 24 24",fill:"none",width:"14",height:"14",html:'<path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'}),
      "Descargar CSV",
    ]);
  }
  function renderExpandableTable(columns, rows, note, filename){
    const wrap = el("div",{class:"data-table-toggle-wrap"});
    const btn = el("button",{class:"data-table-toggle", type:"button","aria-expanded":"false"},[
      el("span",{},["Ver datos"]),
      el("svg",{class:"chev",viewBox:"0 0 24 24",fill:"none",html:'<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'}),
    ]);
    const panel = el("div",{class:"data-table-panel"});
    panel.hidden = true;
    if(note) panel.appendChild(el("p",{class:"data-table-note"},[note]));
    panel.appendChild(el("div",{class:"data-table-actions"},[
      makeDownloadLink(filename||"datos.csv", columns, rows)
    ]));
    const tableWrap = el("div",{class:"table-wrap"});
    const table = el("table",{class:"data-table"},[
      el("thead",{},[ el("tr",{},columns.map(c=>el("th",{},[c]))) ]),
      el("tbody",{},rows.map(r=> el("tr",{}, r.map((cell,ci)=> el("td",{}, [cell]))))),
    ]);
    tableWrap.appendChild(table);
    panel.appendChild(tableWrap);
    btn.addEventListener("click", ()=>{
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      btn.setAttribute("aria-expanded", willOpen ? "true":"false");
      btn.classList.toggle("open", willOpen);
    });
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    return wrap;
  }
  function buildStandardTable(ind){
    if(Array.isArray(ind.series) && ind.series.length){
      const columns = ["Periodo", ...ind.series.map(s=>s.name)];
      const rows = ind.labels.map((label,i)=> [String(label), ...ind.series.map(s=>fmtNum(s.data[i]))]);
      return { columns, rows, note: "Unidad: "+ind.unit+" — cada columna es una dimensión/política FURAG independiente, ya calculada en la fuente." };
    }
    const hasNumDen = ind.numerators && ind.denominators;
    const columns = hasNumDen
      ? ["Periodo", ind.numeratorLabel||"Numerador", ind.denominatorLabel||"Denominador", "Valor"]
      : ["Periodo", "Valor"];
    const rows = ind.labels.map((label,i)=>{
      if(hasNumDen) return [String(label), fmtNum(ind.numerators[i]), fmtNum(ind.denominators[i]), fmtNum(ind.values[i])];
      return [String(label), fmtNum(ind.values[i])];
    });
    const note = hasNumDen
      ? "Unidad de la columna Valor: "+ind.unit
      : "Indicador ya calculado en la fuente citada (unidad: "+ind.unit+") — no se dispone de numerador y denominador desagregados para reconstruirlo.";
    return { columns, rows, note };
  }
  function buildComparisonTable(ind){
    return {
      columns: ["Periodo", "Valor"],
      rows: [ [ind.before.label, ind.before.value], [ind.after.label, ind.after.value] ],
      note: "Indicador ya calculado en la fuente citada — no se dispone de numerador y denominador desagregados para reconstruirlo.",
    };
  }
  function buildEpsRatioTable(ind){
    const columns = ["EPS", "Meses con dato", "Giro bruto del periodo (COP)", "Giro núcleo UPC/LMA (COP)", "% núcleo", "Afiliados (dic-2025, BDUA)", ind.epsRatioLabel];
    const computed = ind.epsRatioTable.map(r=>{
      const anualizado = (r.giroCore / r.meses) * 12;
      const ratio = Math.round(anualizado / r.afiliados2025);
      return { ...r, ratio };
    }).sort((a,b)=> b.ratio - a.ratio);
    const rows = computed.map(r=>[
      r.eps + (r.intervenida ? " ⚠" : "") + (r.especial ? " ✱" : ""),
      String(r.meses),
      fmtNum(r.giroBruto),
      fmtNum(r.giroCore),
      (100*r.giroCore/r.giroBruto).toFixed(1)+"%",
      fmtNum(r.afiliados2025),
      fmtNum(r.ratio),
    ]);
    return { columns, rows, note: (ind.epsRatioNote||"") + " (⚠ bajo intervención/vigilancia especial en 2023-2025 · ✱ régimen especial o fondo de pequeño tamaño, denominador atípico)" };
  }
  function buildEpsBreakdownTable(bk){
    const rows = [...bk.rows].sort((a,b)=> b.afiliados - a.afiliados).map(r=>[
      r.eps + (r.intervenida?" ⚠":"") + (r.especial?" ✱":""),
      fmtNum(r.afiliados),
    ]);
    return { columns: ["EPS", bk.columnLabel], rows, note: bk.note + " (⚠ intervenida/vigilancia especial · ✱ régimen especial o fondo pequeño)" };
  }
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
      if(Array.isArray(ind.series) && ind.series.length) chartBox.style.height = "300px";
      block.appendChild(chartBox);
      const callBox = el("div",{class:"indicator-callouts"});
      (ind.callouts||[]).forEach(c=> callBox.appendChild(el("div",{class:"callout"},[c.text])));
      block.appendChild(callBox);
      if(ind.scope || (ind.limitations && ind.limitations.length)){
        const sl = el("div",{class:"scope-limits"});
        if(ind.scope) sl.appendChild(el("p",{class:"scope-text"},[el("strong",{},["Alcance: "]), ind.scope]));
        if(ind.limitations && ind.limitations.length){
          sl.appendChild(el("p",{class:"scope-text", style:"margin:8px 0 4px"},[el("strong",{},["Limitaciones:"])]));
          const ul = el("ul",{class:"limit-list-compact"});
          ind.limitations.forEach(l=> ul.appendChild(el("li",{},[l])));
          sl.appendChild(ul);
        }
        block.appendChild(sl);
      }
      block.appendChild(renderSources(ind));
      const t = buildStandardTable(ind);
      block.appendChild(renderExpandableTable(t.columns, t.rows, t.note, ind.id+"_datos.csv"));
      if(ind.detailItems){
        block.appendChild(renderExpandableTable(ind.detailItems.columns, ind.detailItems.rows, ind.detailItems.note, ind.id+"_detalle.csv"));
      }
      if(ind.epsRatioTable && ind.epsRatioTable.length){
        const rt = buildEpsRatioTable(ind);
        block.appendChild(renderExpandableTable(rt.columns, rt.rows, rt.note, ind.id+"_por_eps.csv"));
        if(ind.epsAfiliadosSource){
          const src = renderSources({ sources: [ind.epsAfiliadosSource] });
          src.style.marginTop = "6px";
          block.appendChild(src);
        }
      }
      if(ind.epsBreakdown){
        const bt = buildEpsBreakdownTable(ind.epsBreakdown);
        block.appendChild(renderExpandableTable(bt.columns, bt.rows, bt.note, ind.id+"_por_eps.csv"));
        if(ind.epsBreakdown.source){
          const src = renderSources({ sources: [ind.epsBreakdown.source] });
          src.style.marginTop = "6px";
          block.appendChild(src);
        }
      }
      body.appendChild(block);
    });

    if(DATA.comparisonIndicators && DATA.comparisonIndicators.length){
      body.appendChild(el("h4",{style:"font-size:.86rem;margin:22px 0 4px"},["Indicadores complementarios (dos puntos verificados, no series densas)"]));
      DATA.comparisonIndicators.forEach(ind=>{
        const block = el("div",{class:"indicator-block"});
        block.appendChild(el("div",{class:"indicator-head"},[
          el("h4",{},[ind.title]),
          ind.unit ? el("span",{class:"unit"},[ind.unit]) : null,
        ]));
        block.appendChild(el("div",{class:"indicator-linklet"},[ind.loopLink]));
        block.appendChild(el("div",{class:"comparison-row"},[
          el("div",{class:"comparison-point"},[
            el("div",{class:"cp-label"},[ind.before.label]),
            el("div",{class:"cp-value"},[ind.before.value]),
          ]),
          el("svg",{class:"comparison-arrow",viewBox:"0 0 24 24",fill:"none",html:'<path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'}),
          el("div",{class:"comparison-point after"},[
            el("div",{class:"cp-label"},[ind.after.label]),
            el("div",{class:"cp-value"},[ind.after.value]),
          ]),
        ]));
        block.appendChild(el("div",{class:"callout"},[ind.deltaNote]));
        block.appendChild(renderSources(ind));
        const t = buildComparisonTable(ind);
        block.appendChild(renderExpandableTable(t.columns, t.rows, t.note, ind.id+"_datos.csv"));
        body.appendChild(block);
      });
    }
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
      const isMulti = !!(Array.isArray(ind.series) && ind.series.length);
      const palette = [primary, cssVar("--accent")||"#c4711f", cssVar("--danger")||"#b3241c", cssVar("--chip-e")||"#3a5a9c", cssVar("--success")||"#226b4a"];
      const datasets = isMulti
        ? ind.series.map((s,i)=>({
            label: s.name,
            data: s.data,
            borderColor: palette[i%palette.length],
            backgroundColor: palette[i%palette.length]+"22",
            pointBackgroundColor: palette[i%palette.length],
            pointRadius: 4, pointHoverRadius: 6, fill: false, tension: .25,
          }))
        : [{
            data: ind.values,
            borderColor: primary,
            backgroundColor: primary+"33",
            pointBackgroundColor: primary,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: .3,
          }];
      chartInstances[ind.id] = new Chart(canvas.getContext("2d"), {
        type: "line",
        data: { labels: ind.labels, datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: isMulti, position: "bottom", labels: { color: textColor, font:{size:10.5}, boxWidth:12 } },
            tooltip: {
              callbacks: {
                label: (ctx)=> isMulti
                  ? (ctx.dataset.label + ": " + ctx.parsed.y.toLocaleString("es-CO"))
                  : (ind.unit + ": " + ctx.parsed.y.toLocaleString("es-CO")),
                afterLabel: (ctx)=>{
                  if(isMulti || !ind.numerators || !ind.denominators) return null;
                  const num = ind.numerators[ctx.dataIndex], den = ind.denominators[ctx.dataIndex];
                  if(num == null || den == null) return null;
                  return [
                    (ind.numeratorLabel||"Numerador") + ": " + num.toLocaleString("es-CO"),
                    (ind.denominatorLabel||"Denominador") + ": " + den.toLocaleString("es-CO"),
                  ];
                }
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
    body.appendChild(el("p",{},["Filtra por base de datos de origen. Cada referencia está completa en formato APA 7, con hipervínculo al DOI/URL cuando está disponible."]));

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
    const actions = el("div",{class:"data-table-actions", style:"flex:1"});
    actions.appendChild(makeDownloadLink("estudios_incluidos.csv",
      ["#","Referencia (APA 7)","Tipo","Resultado principal","Base"],
      DATA.studies.map(s=>[String(s.n), apaCitationPlain(s), s.type, s.result, s.db])
    ));
    body.appendChild(el("div",{style:"display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px"},[filterRow, actions]));

    const tableWrap = el("div",{class:"table-wrap"});
    const table = el("table",{class:"studies", id:"studies-table"},[
      el("thead",{},[ el("tr",{},[
        el("th",{},["#"]), el("th",{},["Referencia (APA 7)"]),
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
      const refCell = el("td",{style:"max-width:360px"});
      refCell.innerHTML = apaCitation(s).html;
      tbody.appendChild(el("tr",{},[
        el("td",{},[el("span",{class:"study-ref"},[String(s.n)])]),
        refCell,
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

    body.appendChild(el("h4",{style:"font-size:.86rem;margin-top:20px"},["Diagrama de flujo PRISMA"]));
    const prismaWrap = el("div",{class:"diagram-wrap"});
    prismaWrap.appendChild(buildPrismaSVG(m.prisma));
    body.appendChild(prismaWrap);
    body.appendChild(el("p",{class:"indicator-source", style:"margin-top:8px"},[m.prisma.citation]));

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

    document.addEventListener("click", (e)=>{
      if(!e.target.closest || !e.target.closest(".node-box, .loop-tag-group")) hideDiagramTooltip();
    });

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
