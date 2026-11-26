/* ==========================================================================
   Interactive China Futures Supply-Chain Diagram Engine
   3 Columns (Upstream Raw Materials -> Midstream Smelting/Refining -> Downstream)
   with Glowing SVG Bezier Transmission Paths & Fundamental Bull/Bear Badges
   ========================================================================== */
window.FuturesChainGraph = (function () {
  let state = {
    selectedId: null,
    hoveredId: null,
    showAllEdges: true,
    sectorFilter: "ALL",
    signalFilter: "ALL", // ALL | bull | neutral | bear
    tightnessFilter: "ALL", // ALL | tight | balance | loose
    sortMetric: "score", // score | tightness | basisPct | liveChange | valuation
    searchQuery: ""
  };

  let callbacks = {
    onSelectContract: null
  };

  const els = {};

  function init(opts) {
    callbacks = { ...callbacks, ...opts };
    els.stage = document.getElementById("chainStage");
    els.svg = document.getElementById("chainEdgesSvg");
    els.upstream = document.getElementById("nodes-upstream");
    els.midstream = document.getElementById("nodes-midstream");
    els.downstream = document.getElementById("nodes-downstream");
    els.metaUp = document.getElementById("meta-upstream");
    els.metaMid = document.getElementById("meta-midstream");
    els.metaDown = document.getElementById("meta-downstream");
    els.summary = document.getElementById("chainSummaryStrip");
    els.hintText = document.getElementById("chainHintText");
    els.clearBtn = document.getElementById("clearSelectionBtn");

    window.addEventListener("resize", () => requestAnimationFrame(drawEdges));
  }

  function setState(patch) {
    state = { ...state, ...patch };
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
      if (state.tightnessFilter === "tight" && c.deliveryTightness.score < 65) return false;
      if (state.tightnessFilter === "balance" && (c.deliveryTightness.score < 48 || c.deliveryTightness.score >= 65)) return false;
      if (state.tightnessFilter === "loose" && c.deliveryTightness.score >= 48) return false;
      if (!q) return true;
      const hay = [
        c.name, c.code, c.exchangeName, c.sectorLabel, c.subRole,
        c.deliveryTightness.label, c.basisCurve.structureLabel,
        ev.signal.label, ...c.tags
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  function sortContracts(list) {
    const metric = state.sortMetric;
    return [...list].sort((a, b) => {
      const ea = window.FuturesScoring.evaluate(a);
      const eb = window.FuturesScoring.evaluate(b);
      if (metric === "tightness") return b.deliveryTightness.score - a.deliveryTightness.score;
      if (metric === "basisPct") return b.basisCurve.basisPct - a.basisCurve.basisPct;
      if (metric === "valuation") return eb.valuationScore - ea.valuationScore;
      if (metric === "liveChange") return getLiveQuote(b).changePct - getLiveQuote(a).changePct;
      return eb.totalScore - ea.totalScore;
    });
  }

  function renderSummary(visible) {
    let bullCnt = 0, neutralCnt = 0, bearCnt = 0, backCnt = 0, tightSum = 0;
    visible.forEach((c) => {
      const ev = window.FuturesScoring.evaluate(c);
      if (ev.signal.group === "bull") bullCnt++;
      else if (ev.signal.group === "bear") bearCnt++;
      else neutralCnt++;
      if (c.basisCurve.structure === "back") backCnt++;
      tightSum += c.deliveryTightness.score;
    });
    const avgTight = visible.length ? Math.round(tightSum / visible.length) : 0;
    const backRatio = visible.length ? Math.round((backCnt / visible.length) * 100) : 0;

    els.summary.innerHTML = `
      <div class="summary-card">
        <div class="summary-card-label"><span>当前视图覆盖品种</span><span>五大板块 · 30主力</span></div>
        <div class="summary-card-value">${visible.length} 个品种</div>
        <div class="summary-card-sub">覆盖上期所 / 大商所 / 郑商所 / 上期能源 / 广期所</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label"><span>基本面空多分布</span><span>红多 · 黄震 · 绿空</span></div>
        <div class="summary-card-value">
          <span class="val-bull">${bullCnt} 多</span>
          <span class="val-sep">/</span>
          <span class="val-warn">${neutralCnt} 震</span>
          <span class="val-sep">/</span>
          <span class="val-bear">${bearCnt} 空</span>
        </div>
        <div class="summary-card-sub">基于交割松紧 + 五大项 + 升贴水量化模型</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label"><span>平均交割月紧缺指数</span><span>0(过剩) - 100(极紧)</span></div>
        <div class="summary-card-value ${avgTight >= 60 ? "val-bull" : avgTight < 45 ? "val-bear" : "val-warn"}">${avgTight} / 100</div>
        <div class="summary-card-sub">氧化铝 / 棕榈油 / 沪银 / 沪铜交割月偏紧领跑</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label"><span>现货升水 (Back) 占比</span><span>期限结构监测</span></div>
        <div class="summary-card-value">${backRatio}% <span class="summary-mini">(${backCnt}/${visible.length})</span></div>
        <div class="summary-card-sub">贴水+低仓单品种临近交割具向上修复弹性</div>
      </div>`;
  }

  function createNodeHtml(c) {
    const ev = window.FuturesScoring.evaluate(c);
    const lq = getLiveQuote(c);
    const isHit = state.searchQuery.trim().length > 0;
    const leftPort = c.tier !== "upstream" ? `<span class="node-port port-left"></span>` : "";
    const rightPort = c.tier !== "downstream" ? `<span class="node-port port-right"></span>` : "";

    const chgCls = lq.changePct > 0 ? "bull" : lq.changePct < 0 ? "bear" : "flat";
    const chgSign = lq.changePct > 0 ? "+" : "";
    const basisTxt = c.basisCurve.basis >= 0
      ? `贴水 ${c.basisCurve.basis}`
      : `升水 ${Math.abs(c.basisCurve.basis)}`;
    const basisCls = c.basisCurve.basis >= 0 ? "val-bull" : "val-bear";
    const effStructure = lq.liveStructure || c.basisCurve.structure;
    const deltaHtml = ev.scoreDelta
      ? `<span class="daily-delta ${ev.scoreDelta > 0 ? "up" : "down"}" title="今日实时动态修正">${ev.scoreDelta > 0 ? "+" : ""}${ev.scoreDelta}</span>`
      : "";

    return `
      <article class="futures-node ${isHit ? "search-hit" : ""}" data-id="${c.id}" data-tier="${c.tier}" data-sector="${c.sector}" tabindex="0" role="button" aria-label="${c.name} ${c.code}">
        ${leftPort}
        ${rightPort}
        <div class="node-top">
          <div class="node-identity">
            <div class="node-name-row">
              <span class="node-name">${c.name}</span>
              <span class="node-code">${lq.nearCode || c.code}</span>
              <span class="exch-tag">${c.exchangeName}</span>
            </div>
            <div class="node-role" title="${c.subRole}">${c.subRole}</div>
          </div>
          <span class="sector-badge sec-${c.sector}">${c.sectorLabel.replace("系", "")}</span>
        </div>

        <div class="node-price-verdict">
          <div class="npv-price">
            <span class="live-price-val">${formatPrice(lq.price)}</span>
            <span class="live-chg-badge ${chgCls}">${chgSign}${lq.changePct.toFixed(2)}%</span>
          </div>
          <div class="verdict-pill ${ev.signal.badgeClass}" title="今日基本面综合评分 ${ev.totalScore}/100">
            <span>${ev.signal.short}</span>
            <strong>${ev.totalScore}</strong>
            ${deltaHtml}
          </div>
        </div>

        <div class="node-metrics">
          <div class="nm-item">
            <span class="nm-label">交割月货源</span>
            <span class="nm-val ${ev.tightness.cls}">${ev.tightness.label}</span>
          </div>
          <div class="nm-item">
            <span class="nm-label">${lq.isLive && lq.nearFarSpread != null ? "实盘月差" : "期现基差"}</span>
            <span class="nm-val ${lq.isLive && lq.nearFarSpread != null ? (lq.nearFarSpread >= 0 ? "val-bull" : "val-bear") : basisCls}">
              ${lq.isLive && lq.nearFarSpread != null ? `${lq.nearFarSpread >= 0 ? "+" : ""}${lq.nearFarSpread}` : basisTxt}
            </span>
          </div>
          <div class="nm-item">
            <span class="nm-label">期限 / 影响</span>
            <span class="nm-val">${effStructure === "back" ? "Back" : "Contango"} · ${c.pillars.expectationGap.curveFocusType === "near" ? "近月" : c.pillars.expectationGap.curveFocusType === "far" ? "远月" : "共振"}</span>
          </div>
        </div>

        <div class="node-tags">
          ${c.tags.slice(0, 3).map((t) => `<span class="mini-pill">${t}</span>`).join("")}
        </div>
      </article>`;
  }

  function renderColumn(container, metaEl, list) {
    const bullCount = list.filter((c) => window.FuturesScoring.evaluate(c).signal.group === "bull").length;
    const bearCount = list.filter((c) => window.FuturesScoring.evaluate(c).signal.group === "bear").length;
    metaEl.innerHTML = `<span>${list.length} 个品种</span><span>·</span><span class="val-bull">${bullCount} 偏多</span><span>·</span><span class="val-bear">${bearCount} 偏空</span>`;

    if (!list.length) {
      container.innerHTML = `<div class="empty-state">当前筛选条件下暂无该环节期货品种</div>`;
      return;
    }
    container.innerHTML = list.map(createNodeHtml).join("");
  }

  function bindNodeEvents() {
    els.stage.querySelectorAll(".futures-node").forEach((node) => {
      const id = node.dataset.id;
      node.addEventListener("mouseenter", () => {
        if (!state.selectedId) {
          state.hoveredId = id;
          applyHighlight();
          drawEdges();
        }
      });
      node.addEventListener("mouseleave", () => {
        if (!state.selectedId && state.hoveredId === id) {
          state.hoveredId = null;
          applyHighlight();
          drawEdges();
        }
      });
      node.addEventListener("click", () => {
        state.selectedId = id;
        state.hoveredId = null;
        applyHighlight();
        drawEdges();
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

  function getRelatedSets(focusId) {
    const upIds = new Set();
    const downIds = new Set();
    if (!focusId) return { upIds, downIds };
    window.FuturesChainData.links.forEach((lk) => {
      if (lk.to === focusId) upIds.add(lk.from);
      if (lk.from === focusId) downIds.add(lk.to);
    });
    return { upIds, downIds };
  }

  function applyHighlight() {
    const focusId = getActiveFocusId();
    const { upIds, downIds } = getRelatedSets(focusId);

    if (els.clearBtn) els.clearBtn.hidden = !state.selectedId;

    els.stage.querySelectorAll(".futures-node").forEach((n) => {
      const id = n.dataset.id;
      n.classList.remove("selected", "connected-up", "connected-down", "dimmed");
      if (!focusId) return;
      if (id === focusId) n.classList.add("selected");
      else if (upIds.has(id)) n.classList.add("connected-up");
      else if (downIds.has(id)) n.classList.add("connected-down");
      else n.classList.add("dimmed");
    });

    if (focusId) {
      const c = window.FuturesChainData.contracts.find((x) => x.id === focusId);
      if (c) {
        const ev = window.FuturesScoring.evaluate(c);
        els.hintText.innerHTML = `已聚焦 <strong>${c.name} (${c.code})</strong> · <strong>${ev.signal.label} (${ev.totalScore}分)</strong>：蓝线为直接上游原料成本传导（${upIds.size} 个），绿线为直接下游需求/利润传导（${downIds.size} 个）。点击卡片查看 6 维基本面深度拆解。`;
      }
    } else {
      els.hintText.textContent = "悬停任意品种卡片可动态高亮上下游成本/需求传导路径；点击品种可打开深度基本面分析抽屉（交割月松紧 · 供需库成本预期差五项 · 升贴水曲线 · 交互推演沙盘）。";
    }
  }

  function drawEdges() {
    if (!els.stage || !els.svg) return;
    const stageRect = els.stage.getBoundingClientRect();
    const scrollW = els.stage.scrollWidth;
    const scrollH = els.stage.scrollHeight;
    els.svg.setAttribute("width", scrollW);
    els.svg.setAttribute("height", scrollH);
    els.svg.style.width = scrollW + "px";
    els.svg.style.height = scrollH + "px";
    els.svg.setAttribute("viewBox", `0 0 ${scrollW} ${scrollH}`);

    const nodeMap = {};
    els.stage.querySelectorAll(".futures-node").forEach((el) => {
      const r = el.getBoundingClientRect();
      nodeMap[el.dataset.id] = {
        left: r.left - stageRect.left + els.stage.scrollLeft,
        right: r.right - stageRect.left + els.stage.scrollLeft,
        cy: r.top - stageRect.top + els.stage.scrollTop + r.height / 2,
        tier: el.dataset.tier
      };
    });

    const focusId = getActiveFocusId();
    const paths = [];
    const labels = [];

    window.FuturesChainData.links.forEach((lk) => {
      const src = nodeMap[lk.from];
      const dst = nodeMap[lk.to];
      if (!src || !dst) return;

      const isUpEdge = focusId && lk.to === focusId;
      const isDownEdge = focusId && lk.from === focusId;
      const isActive = isUpEdge || isDownEdge;
      const sameCol = src.tier === dst.tier;
      if (sameCol && !isActive) return;

      let d, labelX, labelY;
      if (sameCol) {
        const x = src.left;
        const dx = 42;
        d = `M ${x} ${src.cy} C ${x - dx} ${src.cy}, ${x - dx} ${dst.cy}, ${x} ${dst.cy}`;
        labelX = x - dx;
        labelY = (src.cy + dst.cy) / 2;
      } else {
        const x1 = src.right;
        const y1 = src.cy;
        const x2 = dst.left;
        const y2 = dst.cy;
        const cpOffset = Math.max(48, Math.abs(x2 - x1) * 0.46);
        d = `M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`;
        labelX = (x1 + x2) / 2;
        labelY = (y1 + y2) / 2;
      }

      let cls = "edge-path";
      if (isUpEdge) cls += " edge-upstream";
      else if (isDownEdge) cls += " edge-downstream";
      else if (focusId) cls += " edge-dimmed";
      else if (!state.showAllEdges) cls += " ambient-hidden";

      paths.push(`<path class="${cls}" d="${d}" />`);

      if (isActive && lk.label) {
        const textLen = lk.label.length * 10.5 + 18;
        labels.push(`
          <g transform="translate(${labelX - textLen / 2}, ${labelY - 11})">
            <rect class="edge-label-bg" width="${textLen}" height="22" rx="6" />
            <text class="edge-label-text" x="${textLen / 2}" y="14.5" text-anchor="middle">${lk.label}</text>
          </g>`);
      }
    });

    els.svg.innerHTML = paths.join("") + labels.join("");
  }

  function render() {
    const visible = getFilteredContracts();
    renderSummary(visible);

    const up = sortContracts(visible.filter((c) => c.tier === "upstream"));
    const mid = sortContracts(visible.filter((c) => c.tier === "midstream"));
    const down = sortContracts(visible.filter((c) => c.tier === "downstream"));

    renderColumn(els.upstream, els.metaUp, up);
    renderColumn(els.midstream, els.metaMid, mid);
    renderColumn(els.downstream, els.metaDown, down);

    bindNodeEvents();
    applyHighlight();
    requestAnimationFrame(() => requestAnimationFrame(drawEdges));
  }

  function clearSelection() {
    state.selectedId = null;
    state.hoveredId = null;
    applyHighlight();
    drawEdges();
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
