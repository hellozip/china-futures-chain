/* ==========================================================================
   China Futures Fluid Chain Topology Engine (Organic Constellation + Force + 5 Ribbons)
   Replaces rigid 3-column boxes with living, draggable, zoomable commodity chains,
   ambient sector halos, animated energy flow particles, and multi-hop propagation!
   ========================================================================== */
window.FuturesChainGraph = (function () {
  const WORLD_W = 1580;
  const WORLD_H = 880;

  const SECTOR_META = {
    ferrous:    { label: "黑色系 · 煤焦矿钢脉络", color: "#f97316", halo: { cx: 335, cy: 245, rx: 300, ry: 195 } },
    precious:   { label: "贵金属 · 货币与工业锚", color: "#eab308", halo: { cx: 790, cy: 135, rx: 225, ry: 92 } },
    nonferrous: { label: "有色系 · 矿冶新能源链", color: "#38bdf8", halo: { cx: 1245, cy: 255, rx: 305, ry: 205 } },
    energy:     { label: "能源化工 · 油煤化建材链", color: "#a78bfa", halo: { cx: 455, cy: 650, rx: 410, ry: 195 } },
    agri:       { label: "农产品 · 粮油压榨养殖链", color: "#22c55e", halo: { cx: 1215, cy: 655, rx: 330, ry: 190 } }
  };

  /* Organic 2D Constellation Coordinates (1580 x 880) — guaranteed >= 210px horiz / 100px vert clearance */
  const CONSTELLATION_POS = {
    // 黑色系 (Top-Left: 炉料 -> 焦化/合金 -> 成材)
    jm: { x: 130, y: 125 },
    j:  { x: 345, y: 125 },
    i:  { x: 135, y: 250 },
    sm: { x: 135, y: 370 },
    rb: { x: 545, y: 200 },
    hc: { x: 545, y: 325 },

    // 贵金属系 (Top-Center Crown)
    au: { x: 685, y: 125 },
    ag: { x: 900, y: 125 },

    // 有色系 (Top-Right: 铝链 / 铜锌链 / 锂镍不锈钢链)
    ao: { x: 1110, y: 145 },
    al: { x: 1340, y: 145 },
    cu: { x: 1095, y: 270 },
    zn: { x: 810,  y: 280 },
    lc: { x: 1015, y: 390 },
    ni: { x: 1230, y: 390 },
    ss: { x: 1450, y: 390 },

    // 能源化工系 (Bottom-Left/Center: 原油核心放射 + 煤制甲醇/MTO + 碱玻链)
    sc: { x: 225, y: 585 },
    fu: { x: 135, y: 745 },
    ru: { x: 350, y: 755 },
    ta: { x: 460, y: 530 },
    ma: { x: 455, y: 650 },
    pp: { x: 680, y: 635 },
    sa: { x: 565, y: 775 },
    fg: { x: 785, y: 775 },

    // 农产品系 (Bottom-Right: 油脂替代 + 玉米豆粕生猪 + 软商品)
    p:  { x: 995,  y: 535 },
    y:  { x: 1215, y: 535 },
    m:  { x: 1215, y: 655 },
    c:  { x: 1215, y: 775 },
    lh: { x: 1445, y: 710 },
    cf: { x: 990,  y: 660 },
    sr: { x: 990,  y: 780 }
  };

  /* Dedicated Spacious Single-Sector Chain Layouts (auto-used when filtering 1 sector!) */
  const SINGLE_SECTOR_POS = {
    ferrous: {
      jm: { x: 200, y: 170 }, j: { x: 580, y: 170 },
      i:  { x: 200, y: 390 },
      sm: { x: 200, y: 590 },
      rb: { x: 1060, y: 260 }, hc: { x: 1060, y: 510 }
    },
    nonferrous: {
      ao: { x: 210, y: 180 }, al: { x: 660, y: 180 },
      cu: { x: 1120, y: 180 },
      zn: { x: 210, y: 400 },
      lc: { x: 210, y: 600 }, ni: { x: 660, y: 580 }, ss: { x: 1120, y: 580 }
    },
    precious: {
      au: { x: 420, y: 370 },
      ag: { x: 1020, y: 370 }
    },
    energy: {
      sc: { x: 190, y: 370 },
      fu: { x: 560, y: 140 },
      ta: { x: 600, y: 295 },
      ma: { x: 580, y: 460 },
      pp: { x: 1060, y: 390 },
      ru: { x: 580, y: 635 },
      sa: { x: 940, y: 635 },
      fg: { x: 1290, y: 635 }
    },
    agri: {
      p:  { x: 220, y: 190 }, y: { x: 670, y: 190 },
      m:  { x: 670, y: 400 },
      c:  { x: 670, y: 600 },
      lh: { x: 1160, y: 495 },
      cf: { x: 220, y: 430 },
      sr: { x: 220, y: 620 }
    }
  };

  /* Ribbon Order (Mode 3: Five Horizontal Chain Ribbons) */
  const RIBBON_CHAINS = [
    {
      sector: "ferrous",
      title: "黑色产业链 · 煤焦矿 → 冶炼合金 → 建筑与制造钢材",
      stages: [["jm", "i", "sm"], ["j"], ["rb", "hc"]]
    },
    {
      sector: "nonferrous",
      title: "有色产业链 · 氧化铝/锂矿源头 → 铜铝锌镍冶炼 → 不锈钢与新能源终端",
      stages: [["ao", "lc"], ["al", "cu", "zn", "ni"], ["ss"]]
    },
    {
      sector: "precious",
      title: "贵金属脉络 · 央行购金与实际利率锚 → 金银比传导 → 光伏/AI 工业白银",
      stages: [["au"], ["ag"]]
    },
    {
      sector: "energy",
      title: "能源化工链 · 原油/甲醇源头 → 燃料油/PTA/纯碱中间体 → 聚丙烯/玻璃/橡胶",
      stages: [["sc", "ma"], ["fu", "ta", "sa"], ["pp", "fg", "ru"]]
    },
    {
      sector: "agri",
      title: "农产品产业链 · 玉米/棕榈油源头 → 豆粕压榨蛋白 → 豆油/生猪/白糖/棉花",
      stages: [["p", "c"], ["m"], ["y", "lh", "sr", "cf"]]
    }
  ];

  let state = {
    layoutMode: "constellation", // constellation | force | ribbons
    selectedId: null,
    hoveredId: null,
    showCrossLinks: true,
    sectorFilter: "ALL",
    signalFilter: "ALL",
    tightnessFilter: "ALL",
    sortMetric: "score",
    searchQuery: ""
  };

  let callbacks = { onSelectContract: null };
  const els = {};

  // Node positions (user-draggable + force physics state)
  const posMap = {};
  const velMap = {};
  let userDragged = false;
  let forceRaf = null;
  let forceTicks = 0;

  // Pan & Zoom state
  const view = { scale: 1, tx: 0, ty: 0 };
  let isPanning = false;
  let panStart = { x: 0, y: 0, tx: 0, ty: 0 };
  let dragNode = null;

  function init(opts) {
    callbacks = { ...callbacks, ...opts };
    els.canvasShell = document.getElementById("chainCanvasShell");
    els.viewport = document.getElementById("chainViewport");
    els.world = document.getElementById("chainWorld");
    els.backdropSvg = document.getElementById("chainBackdropSvg");
    els.svg = document.getElementById("chainEdgesSvg");
    els.labelsSvg = document.getElementById("chainLabelsSvg");
    els.nodesLayer = document.getElementById("chainNodesLayer");
    els.ribbonsStage = document.getElementById("chainRibbonsStage");
    els.summary = document.getElementById("chainSummaryStrip");
    els.hintText = document.getElementById("chainHintText");
    els.clearBtn = document.getElementById("clearSelectionBtn");

    resetPositions("constellation");
    bindCanvasInteractions();
    window.addEventListener("resize", () => {
      if (state.layoutMode === "ribbons") requestAnimationFrame(drawRibbonEdges);
      else fitWorldToViewport();
    });
  }

  function resetPositions(mode) {
    userDragged = false;
    const singleMap = state.sectorFilter !== "ALL" ? SINGLE_SECTOR_POS[state.sectorFilter] : null;
    window.FuturesChainData.contracts.forEach((c, idx) => {
      const base = (singleMap && singleMap[c.id]) || CONSTELLATION_POS[c.id] || {
        x: 180 + (idx % 6) * 210,
        y: 140 + Math.floor(idx / 6) * 140
      };
      if (mode === "force") {
        // Seed force simulation near organic clusters with slight organic jitter
        posMap[c.id] = {
          x: base.x + (Math.sin(idx * 1.9) * 32),
          y: base.y + (Math.cos(idx * 2.3) * 28)
        };
        velMap[c.id] = { vx: 0, vy: 0 };
      } else {
        posMap[c.id] = { x: base.x, y: base.y };
        velMap[c.id] = { vx: 0, vy: 0 };
      }
    });
  }

  function setState(patch) {
    const prevSector = state.sectorFilter;
    const prevLayout = state.layoutMode;
    state = { ...state, ...patch };

    if (patch.sectorFilter !== undefined && patch.sectorFilter !== prevSector) {
      resetPositions(state.layoutMode);
    }
    if (patch.layoutMode !== undefined && patch.layoutMode !== prevLayout) {
      stopForce();
      if (state.layoutMode === "force") {
        resetPositions("force");
      } else if (state.layoutMode === "constellation") {
        resetPositions("constellation");
      }
    }
    render();
  }

  function getState() {
    return { ...state };
  }

  function getLiveQuote(c) {
    const q = window.FuturesLive && window.FuturesLive.quotes && window.FuturesLive.quotes[c.id];
    if (q && Number.isFinite(q.price) && q.price > 0) {
      return {
        price: q.price,
        changePct: q.changePercent,
        openInterest: q.openInterest || 0,
        volume: q.volume || 0,
        nearCode: q.nearCode,
        farCode: q.farCode,
        nearFarSpread: q.nearFarSpread,
        liveStructure: q.liveStructure,
        isLive: true
      };
    }
    return { price: c.price, changePct: c.changePct, isLive: false };
  }

  function formatPrice(val) {
    if (val >= 10000) return Math.round(val).toLocaleString();
    if (val >= 1000) return Number(val).toFixed(0);
    return Number(val).toFixed(1);
  }

  function getFilteredContracts() {
    const q = state.searchQuery.trim().toLowerCase();
    return window.FuturesChainData.contracts.filter((c) => {
      if (state.sectorFilter !== "ALL" && c.sector !== state.sectorFilter) return false;
      const ev = window.FuturesScoring.evaluate(c);
      if (state.signalFilter !== "ALL" && ev.signal.group !== state.signalFilter) return false;
      if (state.tightnessFilter === "tight" && ev.factors[5].score < 65) return false;
      if (state.tightnessFilter === "balance" && (ev.factors[5].score < 48 || ev.factors[5].score >= 65)) return false;
      if (state.tightnessFilter === "loose" && ev.factors[5].score >= 48) return false;
      if (!q) return true;
      const hay = [
        c.name, c.code, c.exchangeName, c.sectorLabel, c.subRole,
        c.deliveryTightness.label, c.basisCurve.structureLabel,
        ev.signal.label, ...c.tags
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  function renderSummary(visible) {
    let bullCnt = 0, neutralCnt = 0, bearCnt = 0, backCnt = 0, tightSum = 0;
    visible.forEach((c) => {
      const ev = window.FuturesScoring.evaluate(c);
      const lq = getLiveQuote(c);
      if (ev.signal.group === "bull") bullCnt++;
      else if (ev.signal.group === "bear") bearCnt++;
      else neutralCnt++;
      const st = lq.liveStructure || c.basisCurve.structure;
      if (st === "back") backCnt++;
      tightSum += ev.factors[5].score;
    });
    const avgTight = visible.length ? Math.round(tightSum / visible.length) : 0;
    const backRatio = visible.length ? Math.round((backCnt / visible.length) * 100) : 0;

    els.summary.innerHTML = `
      <div class="summary-card">
        <div class="summary-card-label"><span>当前链网覆盖品种</span><span>五大板块 · 30主力</span></div>
        <div class="summary-card-value">${visible.length} 个品种</div>
        <div class="summary-card-sub">覆盖上期所 / 大商所 / 郑商所 / 上期能源 / 广期所</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label"><span>今日基本面空多分布</span><span>红多 · 黄震 · 绿空</span></div>
        <div class="summary-card-value">
          <span class="val-bull">${bullCnt} 多</span>
          <span class="val-sep">/</span>
          <span class="val-warn">${neutralCnt} 震</span>
          <span class="val-sep">/</span>
          <span class="val-bear">${bearCnt} 空</span>
        </div>
        <div class="summary-card-sub">融合实盘行情、月差与全网资讯动态评分</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label"><span>平均交割月紧缺指数</span><span>0(过剩) - 100(极紧)</span></div>
        <div class="summary-card-value ${avgTight >= 60 ? "val-bull" : avgTight < 45 ? "val-bear" : "val-warn"}">${avgTight} / 100</div>
        <div class="summary-card-sub">脉冲警示环代表临近交割月货源高度偏紧</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label"><span>近强远弱 (Back) 占比</span><span>实盘期限结构</span></div>
        <div class="summary-card-value">${backRatio}% <span class="summary-mini">(${backCnt}/${visible.length})</span></div>
        <div class="summary-card-sub">贴水+低仓单品种临近交割具向上修复弹性</div>
      </div>`;
  }

  /* ==================== Multi-Hop Upstream & Downstream Propagation ==================== */
  function getMultiHopSets(focusId) {
    const upDirect = new Set(), upCascade = new Set();
    const downDirect = new Set(), downCascade = new Set();
    const activeEdges = new Map(); // edgeIdx -> 'up1'|'up2'|'down1'|'down2'
    if (!focusId) return { upDirect, upCascade, downDirect, downCascade, activeEdges };

    const links = window.FuturesChainData.links;
    // 1-hop
    links.forEach((lk, idx) => {
      if (lk.to === focusId) {
        upDirect.add(lk.from);
        activeEdges.set(idx, "up1");
      }
      if (lk.from === focusId) {
        downDirect.add(lk.to);
        activeEdges.set(idx, "down1");
      }
    });
    // 2-hop cascading transmission
    links.forEach((lk, idx) => {
      if (upDirect.has(lk.to) && lk.from !== focusId && !upDirect.has(lk.from)) {
        upCascade.add(lk.from);
        if (!activeEdges.has(idx)) activeEdges.set(idx, "up2");
      }
      if (downDirect.has(lk.from) && lk.to !== focusId && !downDirect.has(lk.to)) {
        downCascade.add(lk.to);
        if (!activeEdges.has(idx)) activeEdges.set(idx, "down2");
      }
    });
    return { upDirect, upCascade, downDirect, downCascade, activeEdges };
  }

  /* ==================== Pan / Zoom / Drag Interactions ==================== */
  function applyTransform() {
    if (!els.world) return;
    els.world.style.transform = `translate(${view.tx.toFixed(1)}px, ${view.ty.toFixed(1)}px) scale(${view.scale.toFixed(3)})`;
  }

  function fitWorldToViewport() {
    if (!els.viewport || !els.world) return;
    const vw = els.viewport.clientWidth || 1200;
    const vh = els.viewport.clientHeight || 680;
    const padX = 28;
    const padY = 44;
    const scaleX = (vw - padX * 2) / WORLD_W;
    const scaleY = (vh - padY * 2) / WORLD_H;
    view.scale = Math.max(0.38, Math.min(1.12, Math.min(scaleX, scaleY)));
    view.tx = (vw - WORLD_W * view.scale) / 2;
    view.ty = (vh - WORLD_H * view.scale) / 2 - 4;
    applyTransform();
  }

  function bindCanvasInteractions() {
    if (!els.viewport) return;

    // Background Pan
    els.viewport.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".chain-pill-node")) return;
      isPanning = true;
      panStart = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
      els.viewport.classList.add("panning");
    });

    window.addEventListener("pointermove", (e) => {
      if (dragNode) {
        const dx = (e.clientX - dragNode.startX) / view.scale;
        const dy = (e.clientY - dragNode.startY) / view.scale;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragNode.moved = true;
        posMap[dragNode.id].x = Math.max(92, Math.min(WORLD_W - 92, dragNode.origX + dx));
        posMap[dragNode.id].y = Math.max(46, Math.min(WORLD_H - 46, dragNode.origY + dy));
        userDragged = true;
        updateNodeElPosition(dragNode.id);
        drawCanvasEdges();
        return;
      }
      if (!isPanning) return;
      view.tx = panStart.tx + (e.clientX - panStart.x);
      view.ty = panStart.ty + (e.clientY - panStart.y);
      applyTransform();
    });

    window.addEventListener("pointerup", () => {
      if (dragNode) {
        const dn = dragNode;
        dragNode = null;
        if (dn.el) dn.el.classList.remove("dragging");
        if (state.layoutMode === "force" && dn.moved) {
          // Gentle settle after user drops node in force mode
          startForce(45);
        }
      }
      if (isPanning) {
        isPanning = false;
        els.viewport.classList.remove("panning");
      }
    });

    // Smooth Wheel Zoom (Ctrl+Wheel or direct wheel inside canvas)
    els.viewport.addEventListener("wheel", (e) => {
      if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      const rect = els.viewport.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const prevScale = view.scale;
      const factor = e.deltaY < 0 ? 1.1 : 0.91;
      const nextScale = Math.max(0.45, Math.min(1.85, prevScale * factor));
      view.tx = mx - ((mx - view.tx) / prevScale) * nextScale;
      view.ty = my - ((my - view.ty) / prevScale) * nextScale;
      view.scale = nextScale;
      applyTransform();
    }, { passive: false });

    // HUD Buttons
    const zIn = document.getElementById("canvasZoomIn");
    const zOut = document.getElementById("canvasZoomOut");
    const zReset = document.getElementById("canvasResetBtn");
    if (zIn) zIn.addEventListener("click", () => zoomCenter(1.18));
    if (zOut) zOut.addEventListener("click", () => zoomCenter(0.84));
    if (zReset) zReset.addEventListener("click", () => {
      resetPositions(state.layoutMode);
      render();
      fitWorldToViewport();
    });
  }

  function zoomCenter(factor) {
    const vw = els.viewport.clientWidth || 1200;
    const vh = els.viewport.clientHeight || 680;
    const cx = vw / 2, cy = vh / 2;
    const prev = view.scale;
    const next = Math.max(0.45, Math.min(1.85, prev * factor));
    view.tx = cx - ((cx - view.tx) / prev) * next;
    view.ty = cy - ((cy - view.ty) / prev) * next;
    view.scale = next;
    applyTransform();
  }

  function updateNodeElPosition(id) {
    const el = els.nodesLayer && els.nodesLayer.querySelector(`.chain-pill-node[data-id="${id}"]`);
    const p = posMap[id];
    if (el && p) {
      el.style.left = `${p.x.toFixed(1)}px`;
      el.style.top = `${p.y.toFixed(1)}px`;
    }
  }

  /* ==================== Mode 1 & 2: Organic Canvas Rendering ==================== */
  function renderBackdropHalos(visibleIds) {
    if (!els.backdropSvg) return;
    els.backdropSvg.setAttribute("width", WORLD_W);
    els.backdropSvg.setAttribute("height", WORLD_H);
    els.backdropSvg.setAttribute("viewBox", `0 0 ${WORLD_W} ${WORLD_H}`);

    if (state.sectorFilter !== "ALL") {
      const sm = SECTOR_META[state.sectorFilter];
      els.backdropSvg.innerHTML = `
        <defs>
          <radialGradient id="heroSectorHalo" cx="50%" cy="50%" r="52%">
            <stop offset="0%" stop-color="${sm.color}" stop-opacity="0.16" />
            <stop offset="100%" stop-color="${sm.color}" stop-opacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="${WORLD_W / 2}" cy="${WORLD_H / 2}" rx="640" ry="340" fill="url(#heroSectorHalo)" />
        <text x="64" y="54" fill="${sm.color}" font-size="17" font-weight="800" opacity="0.9">${sm.label} · 专属传导链全景</text>`;
      return;
    }

    let defs = "";
    let shapes = "";
    Object.entries(SECTOR_META).forEach(([secId, sm]) => {
      const hasAny = window.FuturesChainData.contracts.some((c) => c.sector === secId && visibleIds.has(c.id));
      if (!hasAny) return;
      const h = sm.halo;
      defs += `
        <radialGradient id="halo-${secId}" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stop-color="${sm.color}" stop-opacity="0.14" />
          <stop offset="70%" stop-color="${sm.color}" stop-opacity="0.04" />
          <stop offset="100%" stop-color="${sm.color}" stop-opacity="0" />
        </radialGradient>`;
      shapes += `
        <ellipse cx="${h.cx}" cy="${h.cy}" rx="${h.rx}" ry="${h.ry}" fill="url(#halo-${secId})" stroke="${sm.color}" stroke-opacity="0.18" stroke-dasharray="6 6" />
        <text x="${h.cx}" y="${h.cy - h.ry + 22}" text-anchor="middle" fill="${sm.color}" font-size="12.5" font-weight="800" letter-spacing="0.06em" opacity="0.86">${sm.label}</text>`;
    });

    els.backdropSvg.innerHTML = `<defs>${defs}</defs>${shapes}`;
  }

  function createPillNodeHtml(c, pos, isCompact) {
    const ev = window.FuturesScoring.evaluate(c);
    const lq = getLiveQuote(c);
    const chgCls = lq.changePct > 0 ? "bull" : lq.changePct < 0 ? "bear" : "flat";
    const chgSign = lq.changePct > 0 ? "+" : "";
    const isHit = state.searchQuery.trim().length > 0;
    const isVeryTight = ev.factors[5].score >= 72;
    const deltaBadge = ev.scoreDelta
      ? `<span class="daily-delta ${ev.scoreDelta > 0 ? "up" : "down"}">${ev.scoreDelta > 0 ? "+" : ""}${ev.scoreDelta}</span>`
      : "";

    // Dynamic highlight badge according to selected sortMetric
    let subTag = `${ev.tightness.label}`;
    if (state.sortMetric === "basisPct") {
      subTag = c.basisCurve.basis >= 0 ? `贴水 ${c.basisCurve.basis}` : `升水 ${Math.abs(c.basisCurve.basis)}`;
    } else if (state.sortMetric === "valuation") {
      subTag = `估值边际 ${ev.valuationScore}`;
    } else if (lq.isLive && lq.nearFarSpread != null) {
      subTag = `${lq.liveStructure === "back" ? "Back" : "Contango"} ${lq.nearFarSpread >= 0 ? "+" : ""}${lq.nearFarSpread}`;
    }

    const posStyle = pos ? `style="left:${pos.x.toFixed(1)}px;top:${pos.y.toFixed(1)}px;"` : "";

    return `
      <article class="chain-pill-node mood-${ev.signal.group} sec-ring-${c.sector} ${isHit ? "search-hit" : ""} ${isVeryTight ? "tight-alert" : ""} ${isCompact ? "ribbon-card" : ""}"
               data-id="${c.id}" data-sector="${c.sector}" ${posStyle} tabindex="0" role="button" aria-label="${c.name} ${c.code}">
        <div class="cpn-head">
          <div class="cpn-name-wrap">
            <span class="cpn-dot sec-bg-${c.sector}"></span>
            <strong class="cpn-name">${c.name}</strong>
            <span class="cpn-code">${lq.nearCode || c.code}</span>
          </div>
          <span class="verdict-pill ${ev.signal.badgeClass} cpn-verdict">
            <span>${ev.signal.short}</span>
            <strong>${ev.totalScore}</strong>
            ${deltaBadge}
          </span>
        </div>
        <div class="cpn-body">
          <span class="cpn-price">${formatPrice(lq.price)}</span>
          <span class="live-chg-badge ${chgCls}">${chgSign}${lq.changePct.toFixed(2)}%</span>
          <span class="cpn-sub ${ev.tightness.cls}" title="${c.deliveryTightness.label}">${subTag}</span>
        </div>
        ${isVeryTight ? `<span class="tight-beacon" title="交割月货源偏紧预警 (${ev.factors[5].score})"></span>` : ""}
      </article>`;
  }

  function renderCanvasMode(visible) {
    els.canvasShell.hidden = false;
    els.ribbonsStage.hidden = true;

    const visibleIds = new Set(visible.map((c) => c.id));
    renderBackdropHalos(visibleIds);

    els.nodesLayer.innerHTML = visible.map((c) => createPillNodeHtml(c, posMap[c.id], false)).join("");
    bindPillEvents(els.nodesLayer);
    applyCanvasHighlight();
    drawCanvasEdges();

    if (!userDragged) fitWorldToViewport();
    if (state.layoutMode === "force") startForce(110);
  }

  function bindPillEvents(container) {
    container.querySelectorAll(".chain-pill-node").forEach((node) => {
      const id = node.dataset.id;

      // Draggable inside Constellation / Force modes
      if (state.layoutMode !== "ribbons") {
        node.addEventListener("pointerdown", (e) => {
          e.stopPropagation();
          dragNode = {
            id,
            el: node,
            startX: e.clientX,
            startY: e.clientY,
            origX: posMap[id].x,
            origY: posMap[id].y,
            moved: false
          };
          node.classList.add("dragging");
        });
      }

      node.addEventListener("mouseenter", () => {
        if (!state.selectedId && !dragNode) {
          state.hoveredId = id;
          if (state.layoutMode === "ribbons") {
            applyRibbonHighlight();
            drawRibbonEdges();
          } else {
            applyCanvasHighlight();
            drawCanvasEdges();
          }
        }
      });

      node.addEventListener("mouseleave", () => {
        if (!state.selectedId && state.hoveredId === id) {
          state.hoveredId = null;
          if (state.layoutMode === "ribbons") {
            applyRibbonHighlight();
            drawRibbonEdges();
          } else {
            applyCanvasHighlight();
            drawCanvasEdges();
          }
        }
      });

      node.addEventListener("click", (e) => {
        if (dragNode && dragNode.moved) return;
        state.selectedId = id;
        state.hoveredId = null;
        if (state.layoutMode === "ribbons") {
          applyRibbonHighlight();
          drawRibbonEdges();
        } else {
          applyCanvasHighlight();
          drawCanvasEdges();
        }
        if (callbacks.onSelectContract) callbacks.onSelectContract(id);
      });

      node.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          node.click();
        }
      });
    });
  }

  function getActiveFocusId() {
    return state.selectedId || state.hoveredId;
  }

  function applyCanvasHighlight() {
    const focusId = getActiveFocusId();
    const { upDirect, upCascade, downDirect, downCascade } = getMultiHopSets(focusId);
    if (els.clearBtn) els.clearBtn.hidden = !state.selectedId;

    els.nodesLayer.querySelectorAll(".chain-pill-node").forEach((n) => {
      const id = n.dataset.id;
      n.classList.remove("selected", "hop-up", "hop-down", "hop-cascade", "dimmed");
      if (!focusId) return;
      if (id === focusId) n.classList.add("selected");
      else if (upDirect.has(id)) n.classList.add("hop-up");
      else if (downDirect.has(id)) n.classList.add("hop-down");
      else if (upCascade.has(id) || downCascade.has(id)) n.classList.add("hop-cascade");
      else n.classList.add("dimmed");
    });

    updateHintText(focusId, upDirect.size + upCascade.size, downDirect.size + downCascade.size);
  }

  function updateHintText(focusId, upCnt, downCnt) {
    if (!els.hintText) return;
    if (focusId) {
      const c = window.FuturesChainData.contracts.find((x) => x.id === focusId);
      if (c) {
        const ev = window.FuturesScoring.evaluate(c);
        els.hintText.innerHTML = `已聚焦 <strong>${c.name} (${c.code})</strong> · <strong>${ev.signal.label} (${ev.totalScore}分)</strong>：蓝脉为上游原料/成本传导链（${upCnt} 个节点），绿脉为下游需求/利润传导链（${downCnt} 个节点）。点击打开 6 维基本面深度拆解。`;
      }
    } else {
      els.hintText.textContent = "悬停节点可追踪多级上下游价格/利润传导链；任意节点支持鼠标自由拖拽，点击打开 6 维基本面深度研判与推演沙盘；选择单一板块可自动展开专属脉络大图。";
    }
  }

  function drawCanvasEdges() {
    if (!els.svg) return;
    els.svg.setAttribute("width", WORLD_W);
    els.svg.setAttribute("height", WORLD_H);
    els.svg.setAttribute("viewBox", `0 0 ${WORLD_W} ${WORLD_H}`);

    const visibleIds = new Set(Array.from(els.nodesLayer.querySelectorAll(".chain-pill-node")).map((n) => n.dataset.id));
    const contractById = {};
    window.FuturesChainData.contracts.forEach((c) => { contractById[c.id] = c; });

    const focusId = getActiveFocusId();
    const { activeEdges } = getMultiHopSets(focusId);
    const isSingleSector = state.sectorFilter !== "ALL";

    const defs = `
      <defs>
        <marker id="arr-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="var(--border-strong)" opacity="0.7" />
        </marker>
        <marker id="arr-up" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="var(--upstream)" />
        </marker>
        <marker id="arr-down" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="var(--downstream)" />
        </marker>
        <filter id="edgeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>`;

    const basePaths = [];
    const activePaths = [];
    const particles = [];
    const labels = [];

    window.FuturesChainData.links.forEach((lk, idx) => {
      if (!visibleIds.has(lk.from) || !visibleIds.has(lk.to)) return;
      const p1 = posMap[lk.from];
      const p2 = posMap[lk.to];
      if (!p1 || !p2) return;

      const c1 = contractById[lk.from];
      const c2 = contractById[lk.to];
      const isCross = c1 && c2 && c1.sector !== c2.sector;
      const actType = activeEdges.get(idx); // 'up1' | 'up2' | 'down1' | 'down2' | undefined

      if (isCross && !state.showCrossLinks && !actType) return;

      // Trim path endpoints to node pill perimeter (approx half-width 84, half-height 34)
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist, uy = dy / dist;
      const sx = p1.x + ux * 78;
      const sy = p1.y + uy * 30;
      const ex = p2.x - ux * 82;
      const ey = p2.y - uy * 32;

      // Smooth organic quadratic bend
      const mx = (sx + ex) / 2;
      const my = (sy + ey) / 2;
      const bend = isCross ? Math.min(58, dist * 0.16) : Math.min(28, dist * 0.1);
      const sign = (idx % 2 === 0 ? 1 : -1);
      const cx = mx - uy * bend * sign;
      const cy = my + ux * bend * sign;
      const d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      const pid = `epath-${idx}`;

      const secColor = (c1 && SECTOR_META[c1.sector]) ? SECTOR_META[c1.sector].color : "var(--accent)";

      if (actType) {
        const isUp = actType.startsWith("up");
        const isDirect = actType.endsWith("1");
        const strokeCol = isUp ? "var(--upstream)" : "var(--downstream)";
        const marker = isUp ? "url(#arr-up)" : "url(#arr-down)";
        activePaths.push(
          `<path id="${pid}" class="flow-edge active ${isDirect ? "direct" : "cascade"}" d="${d}" stroke="${strokeCol}" marker-end="${marker}" filter="url(#edgeGlow)" />`
        );
        // Flowing energy pulse dot along active pipe!
        particles.push(`
          <circle r="${isDirect ? 3.8 : 2.8}" fill="${strokeCol}">
            <animateMotion dur="${isDirect ? "1.6s" : "2.3s"}" repeatCount="indefinite">
              <mpath href="#${pid}" />
            </animateMotion>
          </circle>`);

        if (lk.label) {
          const lx = 0.25 * sx + 0.5 * cx + 0.25 * ex;
          const ly = 0.25 * sy + 0.5 * cy + 0.25 * ey;
          const w = lk.label.length * 10.2 + 18;
          labels.push(`
            <g transform="translate(${(lx - w / 2).toFixed(1)}, ${(ly - 11).toFixed(1)})">
              <rect class="edge-label-bg active" width="${w}" height="22" rx="7" stroke="${strokeCol}" />
              <text class="edge-label-text" x="${w / 2}" y="14.5" text-anchor="middle">${lk.label}</text>
            </g>`);
        }
      } else {
        const dimCls = focusId ? "dimmed" : "";
        const crossCls = isCross ? "cross-link" : "intra-link";
        basePaths.push(
          `<path id="${pid}" class="flow-edge ${crossCls} ${dimCls}" d="${d}" stroke="${isCross ? "var(--border-strong)" : secColor}" marker-end="url(#arr-muted)" />`
        );
        // Ambient gentle flowing pulses when unfocused (only on intra-sector pipes or single-sector mode)
        if (!focusId && (!isCross || isSingleSector)) {
          particles.push(`
            <circle r="2.3" fill="${secColor}" opacity="0.72">
              <animateMotion dur="${(2.6 + (idx % 4) * 0.45).toFixed(2)}s" repeatCount="indefinite">
                <mpath href="#${pid}" />
              </animateMotion>
            </circle>`);
        }
        // Always show edge conversion labels in dedicated Single-Sector Hero View!
        if (isSingleSector && !focusId && lk.label) {
          const lx = 0.25 * sx + 0.5 * cx + 0.25 * ex;
          const ly = 0.25 * sy + 0.5 * cy + 0.25 * ey;
          const w = lk.label.length * 10 + 16;
          labels.push(`
            <g transform="translate(${(lx - w / 2).toFixed(1)}, ${(ly - 10).toFixed(1)})">
              <rect class="edge-label-bg" width="${w}" height="20" rx="6" />
              <text class="edge-label-text" x="${w / 2}" y="13.5" text-anchor="middle">${lk.label}</text>
            </g>`);
        }
      }
    });

    els.svg.innerHTML = defs + basePaths.join("") + activePaths.join("") + particles.join("");
    if (els.labelsSvg) {
      els.labelsSvg.setAttribute("width", WORLD_W);
      els.labelsSvg.setAttribute("height", WORLD_H);
      els.labelsSvg.setAttribute("viewBox", `0 0 ${WORLD_W} ${WORLD_H}`);
      els.labelsSvg.innerHTML = labels.join("");
    }
  }

  /* ==================== Mode 2: Lightweight Living Force-Directed Physics ==================== */
  function stopForce() {
    if (forceRaf) {
      cancelAnimationFrame(forceRaf);
      forceRaf = null;
    }
  }

  function startForce(maxSteps = 100) {
    stopForce();
    forceTicks = maxSteps;
    const visibleIds = new Set(Array.from(els.nodesLayer.querySelectorAll(".chain-pill-node")).map((n) => n.dataset.id));
    const ids = Array.from(visibleIds);
    const activeLinks = window.FuturesChainData.links.filter((lk) => visibleIds.has(lk.from) && visibleIds.has(lk.to));
    const contractById = {};
    window.FuturesChainData.contracts.forEach((c) => { contractById[c.id] = c; });

    function tick() {
      if (forceTicks <= 0 || state.layoutMode !== "force") {
        forceRaf = null;
        return;
      }
      forceTicks--;

      // Strict rectangular collision repulsion so pill nodes (192x68) never touch or overlap
      for (let i = 0; i < ids.length; i++) {
        const a = ids[i];
        const pa = posMap[a], va = velMap[a];
        if (!pa || !va) continue;
        for (let j = i + 1; j < ids.length; j++) {
          const b = ids[j];
          const pb = posMap[b], vb = velMap[b];
          if (!pb || !vb) continue;
          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const reqX = 212;
          const reqY = 92;
          const ovX = reqX - Math.abs(dx);
          const ovY = reqY - Math.abs(dy);
          if (ovX > 0 && ovY > 0) {
            if (ovX < ovY) {
              const pushX = (dx >= 0 ? 1 : -1) * ovX * 0.22;
              va.vx += pushX; vb.vx -= pushX;
            } else {
              const pushY = (dy >= 0 ? 1 : -1) * ovY * 0.22;
              va.vy += pushY; vb.vy -= pushY;
            }
          }
        }
      }

      // Spring attraction along chain links
      activeLinks.forEach((lk) => {
        const pa = posMap[lk.from], pb = posMap[lk.to];
        const va = velMap[lk.from], vb = velMap[lk.to];
        if (!pa || !pb || !va || !vb) return;
        const sameSec = contractById[lk.from].sector === contractById[lk.to].sector;
        const targetDist = sameSec ? 205 : 295;
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const dist = Math.hypot(dx, dy) || 1;
        const pull = (dist - targetDist) * (sameSec ? 0.016 : 0.004);
        const fx = (dx / dist) * pull;
        const fy = (dy / dist) * pull;
        va.vx += fx; va.vy += fy;
        vb.vx -= fx; vb.vy -= fy;
      });

      // Gentle pull toward sector halo anchor + damping
      ids.forEach((id) => {
        if (dragNode && dragNode.id === id) return;
        const c = contractById[id];
        const sm = SECTOR_META[c.sector];
        const p = posMap[id], v = velMap[id];
        if (sm && state.sectorFilter === "ALL") {
          v.vx += (sm.halo.cx - p.x) * 0.0045;
          v.vy += (sm.halo.cy - p.y) * 0.0045;
        } else {
          v.vx += (WORLD_W / 2 - p.x) * 0.003;
          v.vy += (WORLD_H / 2 - p.y) * 0.003;
        }
        v.vx *= 0.82;
        v.vy *= 0.82;
        p.x = Math.max(100, Math.min(WORLD_W - 100, p.x + v.vx));
        p.y = Math.max(58, Math.min(WORLD_H - 58, p.y + v.vy));
        updateNodeElPosition(id);
      });

      drawCanvasEdges();
      forceRaf = requestAnimationFrame(tick);
    }

    forceRaf = requestAnimationFrame(tick);
  }

  /* ==================== Mode 3: Five Horizontal Sector Chain Ribbons ==================== */
  function renderRibbonsMode(visible) {
    stopForce();
    els.canvasShell.hidden = true;
    els.ribbonsStage.hidden = false;

    const visibleMap = {};
    visible.forEach((c) => { visibleMap[c.id] = c; });

    const html = RIBBON_CHAINS.map((rc) => {
      if (state.sectorFilter !== "ALL" && state.sectorFilter !== rc.sector) return "";
      const stagesFiltered = rc.stages
        .map((ids) => ids.map((id) => visibleMap[id]).filter(Boolean))
        .filter((arr) => arr.length > 0);
      if (!stagesFiltered.length) return "";

      const sm = SECTOR_META[rc.sector];
      return `
        <div class="ribbon-track" data-sector="${rc.sector}">
          <div class="ribbon-track-head">
            <span class="sector-badge sec-${rc.sector}">${sm.label.split(" · ")[0]}</span>
            <h3>${rc.title}</h3>
          </div>
          <div class="ribbon-flow-body">
            <svg class="ribbon-svg" data-ribbon-svg="${rc.sector}" xmlns="http://www.w3.org/2000/svg"></svg>
            <div class="ribbon-stages">
              ${stagesFiltered.map((stageContracts, sIdx) => `
                <div class="ribbon-stage-col">
                  ${stageContracts.map((c) => createPillNodeHtml(c, null, true)).join("")}
                </div>
                ${sIdx < stagesFiltered.length - 1 ? `<div class="ribbon-flow-gap" aria-hidden="true"></div>` : ""}
              `).join("")}
            </div>
          </div>
        </div>`;
    }).join("");

    els.ribbonsStage.innerHTML = html || `<div class="empty-state">当前筛选条件下暂无匹配的期货品种脉络</div>`;
    bindPillEvents(els.ribbonsStage);
    applyRibbonHighlight();
    requestAnimationFrame(() => requestAnimationFrame(drawRibbonEdges));
  }

  function applyRibbonHighlight() {
    const focusId = getActiveFocusId();
    const { upDirect, upCascade, downDirect, downCascade } = getMultiHopSets(focusId);
    if (els.clearBtn) els.clearBtn.hidden = !state.selectedId;

    els.ribbonsStage.querySelectorAll(".chain-pill-node").forEach((n) => {
      const id = n.dataset.id;
      n.classList.remove("selected", "hop-up", "hop-down", "hop-cascade", "dimmed");
      if (!focusId) return;
      if (id === focusId) n.classList.add("selected");
      else if (upDirect.has(id)) n.classList.add("hop-up");
      else if (downDirect.has(id)) n.classList.add("hop-down");
      else if (upCascade.has(id) || downCascade.has(id)) n.classList.add("hop-cascade");
      else n.classList.add("dimmed");
    });
    updateHintText(focusId, upDirect.size + upCascade.size, downDirect.size + downCascade.size);
  }

  function drawRibbonEdges() {
    const focusId = getActiveFocusId();
    const { activeEdges } = getMultiHopSets(focusId);

    els.ribbonsStage.querySelectorAll(".ribbon-track").forEach((track) => {
      const body = track.querySelector(".ribbon-flow-body");
      const svg = track.querySelector(".ribbon-svg");
      if (!body || !svg) return;
      const rect = body.getBoundingClientRect();
      const w = body.scrollWidth;
      const h = body.scrollHeight;
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      const map = {};
      body.querySelectorAll(".chain-pill-node").forEach((el) => {
        const r = el.getBoundingClientRect();
        map[el.dataset.id] = {
          left: r.left - rect.left + body.scrollLeft,
          right: r.right - rect.left + body.scrollLeft,
          cy: r.top - rect.top + body.scrollTop + r.height / 2
        };
      });

      const secCol = SECTOR_META[track.dataset.sector].color;
      const paths = [];
      const labels = [];

      window.FuturesChainData.links.forEach((lk, idx) => {
        const s = map[lk.from];
        const t = map[lk.to];
        if (!s || !t) return;
        const x1 = s.right, y1 = s.cy, x2 = t.left, y2 = t.cy;
        const cp = Math.max(36, Math.abs(x2 - x1) * 0.45);
        const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + cp).toFixed(1)} ${y1.toFixed(1)}, ${(x2 - cp).toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
        const act = activeEdges.get(idx);
        const col = act ? (act.startsWith("up") ? "var(--upstream)" : "var(--downstream)") : secCol;
        const cls = act ? "flow-edge active direct" : (focusId ? "flow-edge dimmed" : "flow-edge intra-link");
        paths.push(`<path class="${cls}" d="${d}" stroke="${col}" />`);
        if (lk.label && (!focusId || act)) {
          const lx = (x1 + x2) / 2, ly = (y1 + y2) / 2;
          const lw = lk.label.length * 9.5 + 14;
          labels.push(`
            <g transform="translate(${(lx - lw / 2).toFixed(1)}, ${(ly - 10).toFixed(1)})">
              <rect class="edge-label-bg ${act ? "active" : ""}" width="${lw}" height="20" rx="6" />
              <text class="edge-label-text" x="${lw / 2}" y="13.5" text-anchor="middle">${lk.label}</text>
            </g>`);
        }
      });

      svg.innerHTML = paths.join("") + labels.join("");
    });
  }

  /* ==================== Master Render ==================== */
  function render() {
    const visible = getFilteredContracts();
    renderSummary(visible);

    if (state.layoutMode === "ribbons") {
      renderRibbonsMode(visible);
    } else {
      renderCanvasMode(visible);
    }
  }

  function clearSelection() {
    state.selectedId = null;
    state.hoveredId = null;
    if (state.layoutMode === "ribbons") {
      applyRibbonHighlight();
      drawRibbonEdges();
    } else {
      applyCanvasHighlight();
      drawCanvasEdges();
    }
  }

  function drawEdges() {
    if (state.layoutMode === "ribbons") drawRibbonEdges();
    else {
      drawCanvasEdges();
      fitWorldToViewport();
    }
  }

  return {
    init,
    render,
    setState,
    getState,
    drawEdges,
    clearSelection,
    getLiveQuote,
    formatPrice
  };
})();
