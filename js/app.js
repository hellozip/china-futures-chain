/* ==========================================================================
   China Futures Visual Chain Terminal — Main Application Controller
   5 Views + 6-Tab Fundamental Deep-Dive Drawer + Interactive What-If Sandbox
   ========================================================================== */
(function () {
  const STORAGE_KEYS = {
    THEME: "cfchain_theme_v1",
    CUSTOM_INTEL: "cfchain_custom_intel_v1"
  };

  const SECTOR_COLORS = {
    ferrous: "#f97316",
    nonferrous: "#38bdf8",
    precious: "#eab308",
    energy: "#a78bfa",
    agri: "#22c55e"
  };

  const SECTOR_LABELS = {
    ferrous: "黑色系",
    nonferrous: "有色系",
    precious: "贵金属系",
    energy: "能源化工系",
    agri: "农产品系"
  };

  const SENTIMENT_LABELS = {
    bullish: "利多",
    neutral: "中性",
    bearish: "利空"
  };

  const appState = {
    currentView: "chain",
    searchQuery: "",
    activeContractId: null,
    drawerTab: "overview",
    simOverrides: null,

    // Matrix View
    matrixSector: "ALL",
    matrixSortKey: "totalScore",
    matrixSortAsc: false,

    // Spreads View
    spreadSector: "ALL",

    // Delivery Radar View
    deliveryRisk: "ALL",

    // Intel View
    intelSector: "ALL",
    intelSentiment: "ALL",
    intelItems: []
  };

  window.FuturesLive = {
    quotes: {},
    news: [],
    daily: null,
    online: false,
    updatedAt: null
  };

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
  }

  function getContractById(id) {
    return window.FuturesChainData.contracts.find((c) => c.id === id) || null;
  }

  function getQuote(c) {
    return window.FuturesChainGraph.getLiveQuote(c);
  }

  function fmtPrice(v) {
    return window.FuturesChainGraph.formatPrice(v);
  }

  /* ==================== Live Server Sync (Optional Node Backend) ==================== */
  function setLivePill(online, text) {
    const btn = document.getElementById("liveSyncBtn");
    const txt = document.getElementById("liveSyncText");
    if (!btn || !txt) return;
    btn.classList.toggle("online", !!online);
    txt.textContent = text;
  }

  async function syncLiveQuotes(force = false) {
    if (window.location.protocol === "file:") {
      setLivePill(false, "投研快照 · 2026-11-26");
      return;
    }
    try {
      const res = await fetch(force ? "/api/quotes?refresh=1" : "/api/quotes");
      if (!res.ok) throw new Error("quotes err");
      const data = await res.json();
      if (data && data.quotes && Object.keys(data.quotes).length) {
        window.FuturesLive.quotes = data.quotes;
        window.FuturesLive.online = true;
        window.FuturesLive.updatedAt = data.updatedAt;
        const hhmm = new Date(data.updatedAt || Date.now()).toTimeString().slice(0, 8);
        setLivePill(true, `实盘行情 · ${data.count}/30 · ${hhmm}`);
        window.FuturesChainGraph.render();
        if (appState.currentView === "matrix") renderMatrixView();
        if (appState.activeContractId) {
          const c = getContractById(appState.activeContractId);
          if (c) renderDrawerHeader(c);
        }
      } else {
        setLivePill(false, "基准快照模式");
      }
    } catch (_) {
      setLivePill(false, "基准快照模式");
    }
  }

  async function syncLiveNews(force = false) {
    if (window.location.protocol === "file:") return;
    try {
      const res = await fetch(force ? "/api/news?refresh=1" : "/api/news");
      if (!res.ok) throw new Error("news err");
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length) {
        window.FuturesLive.news = data.items;
        loadIntel();
        renderTicker();
        if (appState.currentView === "intel") renderIntelView();
      }
    } catch (_) {}
  }

  async function syncDailyJudgment(force = false) {
    if (window.location.protocol === "file:") {
      renderDailyBriefPanel();
      return;
    }
    try {
      const res = await fetch(force ? "/api/daily-judgment?refresh=1" : "/api/daily-judgment");
      if (!res.ok) throw new Error("daily err");
      const data = await res.json();
      if (data && data.contracts) {
        window.FuturesLive.daily = data;
        renderDailyBriefPanel();
        window.FuturesChainGraph.render();
        if (appState.currentView === "matrix") renderMatrixView();
        if (appState.currentView === "delivery") renderDeliveryView();
        if (appState.activeContractId) {
          const c = getContractById(appState.activeContractId);
          if (c) {
            renderDrawerHeader(c);
            if (appState.drawerTab === "overview") renderDrawerBody(c);
          }
        }
      }
    } catch (_) {
      renderDailyBriefPanel();
    }
  }

  function renderDailyBriefPanel() {
    const panel = document.getElementById("dailyBriefPanel");
    if (!panel) return;
    const d = window.FuturesLive.daily;
    const todayStr = new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);

    let reportDate = d ? d.reportDate : todayStr;
    let sessionLabel = d ? `${d.sessionLabel} · 实盘+全网资讯自动更新` : "本地投研快照 (部署 Render 后自动实盘更新)";
    let headline = d ? d.headlineBrief : "";
    let topLongs = [];
    let topShorts = [];
    let deliveryAlerts = [];

    if (d && d.topLongs) {
      topLongs = d.topLongs;
      topShorts = d.topShorts;
      deliveryAlerts = d.deliveryAlerts;
    } else {
      const ranked = window.FuturesChainData.contracts.map((c) => {
        const ev = window.FuturesScoring.evaluate(c);
        return {
          id: c.id, name: c.name, liveScore: ev.totalScore, scoreDelta: 0,
          liveTightness: c.deliveryTightness.score, changePercent: c.changePct
        };
      }).sort((a, b) => b.liveScore - a.liveScore);
      topLongs = ranked.slice(0, 4);
      topShorts = [...ranked].reverse().slice(0, 4);
      deliveryAlerts = [...ranked].sort((a, b) => b.liveTightness - a.liveTightness).slice(0, 3);
      headline = `${todayStr} 基本面多空主线：当前多头最强聚焦 ${topLongs.slice(0, 3).map((x) => `${x.name}(${x.liveScore}分)`).join("、")}；空头承压聚焦 ${topShorts.slice(0, 3).map((x) => `${x.name}(${x.liveScore}分)`).join("、")}。`;
    }

    const aiHtml = d && d.aiBrief
      ? `<div class="spread-trade-box" style="margin-bottom:10px;"><strong>AI 首席每日点评：</strong>${esc(d.aiBrief)}</div>`
      : "";

    const renderChip = (x, mode) => {
      const valCls = mode === "bull" ? "val-bull" : mode === "bear" ? "val-bear" : "val-warn";
      const valTxt = mode === "tight" ? `紧缺 ${x.liveTightness}` : `${x.liveScore}分`;
      const deltaTxt = x.scoreDelta ? `<span class="daily-delta ${x.scoreDelta > 0 ? "up" : "down"}">${x.scoreDelta > 0 ? "+" : ""}${x.scoreDelta}</span>` : "";
      return `<button class="daily-chip" data-brief-open="${x.id}"><span>${esc(x.name)}</span><strong class="${valCls}" style="font-family:var(--font-mono);">${valTxt}</strong>${deltaTxt}</button>`;
    };

    panel.innerHTML = `
      <div class="daily-brief-head">
        <div class="daily-brief-title">
          <h3>今日最新基本面空多研判</h3>
          <span class="daily-date-pill">${esc(reportDate)} ${d && d.reportTime ? d.reportTime.slice(0, 5) + " CST" : ""}</span>
          <span class="panel-badge">${esc(sessionLabel)}</span>
        </div>
        <button class="btn-subtle" id="refreshDailyBtn">↻ 刷新实时行情与今日研判</button>
      </div>
      <p class="daily-brief-text">${esc(headline)}</p>
      ${aiHtml}
      <div class="daily-brief-grid">
        <div class="daily-pick-col">
          <div class="daily-pick-label"><span class="val-bull">▲ 今日基本面最强看多</span><span>点击看研判</span></div>
          <div class="daily-pick-pills">${topLongs.map((x) => renderChip(x, "bull")).join("")}</div>
        </div>
        <div class="daily-pick-col">
          <div class="daily-pick-label"><span class="val-bear">▼ 今日基本面最强看空</span><span>点击看研判</span></div>
          <div class="daily-pick-pills">${topShorts.map((x) => renderChip(x, "bear")).join("")}</div>
        </div>
        <div class="daily-pick-col">
          <div class="daily-pick-label"><span class="val-warn">⚠ 交割月货源偏紧预警</span><span>低仓单/高贴水</span></div>
          <div class="daily-pick-pills">${deliveryAlerts.map((x) => renderChip(x, "tight")).join("")}</div>
        </div>
      </div>`;

    panel.querySelectorAll("[data-brief-open]").forEach((btn) => {
      btn.addEventListener("click", () => openDrawer(btn.dataset.briefOpen, "overview"));
    });
    const refBtn = document.getElementById("refreshDailyBtn");
    if (refBtn) {
      refBtn.addEventListener("click", () => {
        refBtn.textContent = "同步中...";
        Promise.allSettled([syncLiveQuotes(true), syncLiveNews(true), syncDailyJudgment(true)]).finally(() => {
          const b = document.getElementById("refreshDailyBtn");
          if (b) b.textContent = "↻ 刷新实时行情与今日研判";
        });
      });
    }
  }

  /* ==================== Intel Storage ==================== */
  function loadIntel() {
    let custom = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_INTEL);
      if (raw) custom = JSON.parse(raw);
    } catch (_) {}
    const live = window.FuturesLive.news || [];
    appState.intelItems = [...custom, ...live, ...window.FuturesChainData.dailyIntel];
    const badge = document.getElementById("intelCountBadge");
    if (badge) badge.textContent = String(appState.intelItems.length);
  }

  function saveCustomIntel(item) {
    let custom = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_INTEL);
      if (raw) custom = JSON.parse(raw);
    } catch (_) {}
    custom.unshift(item);
    try { localStorage.setItem(STORAGE_KEYS.CUSTOM_INTEL, JSON.stringify(custom)); } catch (_) {}
    loadIntel();
  }

  /* ==================== Theme & Navigation ==================== */
  function initTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch (_) {}
    document.getElementById("themeToggle").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(STORAGE_KEYS.THEME, next); } catch (_) {}
      if (appState.currentView === "chain") requestAnimationFrame(() => window.FuturesChainGraph.drawEdges());
    });
  }

  function switchView(viewName) {
    appState.currentView = viewName;
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      const active = btn.dataset.view === viewName;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === `view-${viewName}`);
    });

    if (viewName === "chain") requestAnimationFrame(() => window.FuturesChainGraph.drawEdges());
    else if (viewName === "matrix") renderMatrixView();
    else if (viewName === "spreads") renderSpreadsView();
    else if (viewName === "delivery") renderDeliveryView();
    else if (viewName === "intel") renderIntelView();
  }

  function renderTicker() {
    const el = document.getElementById("tickerContainer");
    if (!el) return;
    el.innerHTML = appState.intelItems.slice(0, 8).map((item) => `
      <div class="ticker-item" data-intel-id="${esc(item.id)}">
        <span class="ticker-tag ${item.sentiment}">${SENTIMENT_LABELS[item.sentiment] || "中性"}</span>
        <span class="mono-dim">[${SECTOR_LABELS[item.sector] || "综合"}]</span>
        <span>${esc(item.title)}</span>
      </div>`).join("");

    el.querySelectorAll(".ticker-item").forEach((node) => {
      node.addEventListener("click", () => {
        const it = appState.intelItems.find((x) => x.id === node.dataset.intelId);
        if (it && it.contracts && it.contracts.length) openDrawer(it.contracts[0], "intel");
        else switchView("intel");
      });
    });
  }

  /* ==================== VIEW 2: VALUATION x DRIVE MATRIX ==================== */
  function renderMatrixView() {
    const q = appState.searchQuery.trim().toLowerCase();
    const list = window.FuturesChainData.contracts.filter((c) => {
      if (appState.matrixSector !== "ALL" && c.sector !== appState.matrixSector) return false;
      if (!q) return true;
      return `${c.name} ${c.code} ${c.sectorLabel} ${c.tags.join(" ")}`.toLowerCase().includes(q);
    });

    window.FuturesCharts.renderValuationDriveQuadrant(
      document.getElementById("quadrantChart"),
      list,
      SECTOR_COLORS,
      (id) => openDrawer(id, "overview")
    );
    window.FuturesCharts.renderSectorStrengthChart(
      document.getElementById("sectorStrengthChart"),
      window.FuturesChainData.contracts,
      window.FuturesChainData.sectors
    );
    window.FuturesCharts.renderBasisRankChart(
      document.getElementById("basisRankChart"),
      list,
      (id) => openDrawer(id, "basis")
    );

    const enriched = list.map((c) => ({ c, ev: window.FuturesScoring.evaluate(c), lq: getQuote(c) }));
    const key = appState.matrixSortKey;
    const dir = appState.matrixSortAsc ? 1 : -1;

    enriched.sort((a, b) => {
      if (key === "name") return a.c.name.localeCompare(b.c.name, "zh-CN") * dir;
      if (key === "sector") return a.c.sector.localeCompare(b.c.sector) * dir;
      if (key === "price") return (a.lq.changePct - b.lq.changePct) * dir;
      if (key === "tightness") return (a.c.deliveryTightness.score - b.c.deliveryTightness.score) * dir;
      if (key === "supply") return (a.c.pillars.supply.score - b.c.pillars.supply.score) * dir;
      if (key === "demand") return (a.c.pillars.demand.score - b.c.pillars.demand.score) * dir;
      if (key === "inventory") return (a.c.pillars.inventory.score - b.c.pillars.inventory.score) * dir;
      if (key === "costMargin") return (a.c.pillars.costMargin.score - b.c.pillars.costMargin.score) * dir;
      if (key === "expectationGap") return (a.c.pillars.expectationGap.score - b.c.pillars.expectationGap.score) * dir;
      if (key === "basisPct") return (a.c.basisCurve.basisPct - b.c.basisCurve.basisPct) * dir;
      return (a.ev.totalScore - b.ev.totalScore) * dir;
    });

    const tbody = document.getElementById("matrixTableBody");
    const scColor = (v) => v >= 62 ? "val-bull" : v < 45 ? "val-bear" : "val-warn";

    tbody.innerHTML = enriched.map(({ c, ev, lq }) => {
      const chgCls = lq.changePct >= 0 ? "val-bull" : "val-bear";
      const basisTag = c.basisCurve.basis >= 0 ? `贴水 ${c.basisCurve.basis}` : `升水 ${Math.abs(c.basisCurve.basis)}`;
      return `
        <tr data-id="${c.id}">
          <td><strong>${esc(c.name)}</strong> <span class="mono-dim">${esc(c.code)}</span></td>
          <td><span class="sector-badge sec-${c.sector}">${esc(c.sectorLabel)}</span></td>
          <td class="num">
            <strong>${fmtPrice(lq.price)}</strong>
            <div class="${chgCls}" style="font-size:11px;">${lq.changePct >= 0 ? "+" : ""}${lq.changePct.toFixed(2)}%</div>
          </td>
          <td class="num"><span class="verdict-pill ${ev.signal.badgeClass}"><span>${ev.signal.short}</span><strong>${ev.totalScore}</strong></span></td>
          <td class="num ${ev.tightness.cls}">${c.deliveryTightness.score} · ${ev.tightness.label}</td>
          <td class="num ${scColor(c.pillars.supply.score)}">${c.pillars.supply.score}</td>
          <td class="num ${scColor(c.pillars.demand.score)}">${c.pillars.demand.score}</td>
          <td class="num ${scColor(c.pillars.inventory.score)}">${c.pillars.inventory.score}</td>
          <td class="num ${scColor(c.pillars.costMargin.score)}">${c.pillars.costMargin.score}</td>
          <td class="num ${scColor(c.pillars.expectationGap.score)}">${c.pillars.expectationGap.score}</td>
          <td class="num">
            <span class="${c.basisCurve.basis >= 0 ? "val-bull" : "val-bear"}">${basisTag}</span>
            <div class="mono-dim">${c.basisCurve.basisPct >= 0 ? "+" : ""}${c.basisCurve.basisPct.toFixed(2)}%</div>
          </td>
          <td style="min-width:260px;">
            <span class="quad-tag ${ev.quadrant.cls}">${ev.quadrant.label}</span>
            <div style="font-size:11.8px;color:var(--text-secondary);">${esc(c.extended.strategy)}</div>
          </td>
        </tr>`;
    }).join("");

    tbody.querySelectorAll("tr").forEach((tr) => {
      tr.addEventListener("click", () => openDrawer(tr.dataset.id, "overview"));
    });
  }

  /* ==================== VIEW 3: INDUSTRY SPREADS & MARGINS ==================== */
  function renderSpreadsView() {
    const grid = document.getElementById("spreadsGrid");
    const list = window.FuturesChainData.spreads.filter((sp) =>
      appState.spreadSector === "ALL" || sp.sector === appState.spreadSector
    );

    grid.innerHTML = list.map((sp) => {
      const sigCls = sp.signal === "bullish" ? "sig-bull" : sp.signal === "bearish" ? "sig-bear" : "sig-neutral";
      const legChips = sp.legs.map((id) => {
        const c = getContractById(id);
        return c ? `<button class="rel-chip" data-open-id="${c.id}"><strong>${esc(c.name)}</strong> <small>${esc(c.code)}</small></button>` : "";
      }).join("");

      return `
        <article class="spread-card">
          <div class="spread-head">
            <div>
              <span class="sector-badge sec-${sp.sector}">${SECTOR_LABELS[sp.sector]}</span>
              <h3>${esc(sp.name)}</h3>
              <div class="spread-formula">${esc(sp.formula)}</div>
            </div>
            <span class="verdict-pill ${sigCls}">${esc(sp.signalLabel)}</span>
          </div>

          <div class="spread-val-row">
            <div>
              <span style="display:block;font-size:11px;color:var(--text-muted);">当前盘面价差 / 利润</span>
              <span class="spread-val-main">${esc(sp.currentVal)}</span>
            </div>
            <span class="panel-badge">${esc(sp.status)}</span>
          </div>

          <div class="pct-bar-wrap">
            <div class="pct-bar-meta"><span>历史 5 年分位</span><strong style="font-family:var(--font-mono);">${sp.percentile}% 分位</strong></div>
            <div class="pct-track"><div class="pct-fill" style="width:${sp.percentile}%;"></div></div>
          </div>

          <p style="margin:0;font-size:12.8px;color:var(--text-secondary);">${esc(sp.logic)}</p>

          <div class="spread-trade-box">
            <strong>建议套利表达：</strong>${esc(sp.trade)}
          </div>

          <div class="relation-chips">${legChips}</div>
        </article>`;
    }).join("");

    grid.querySelectorAll("[data-open-id]").forEach((btn) => {
      btn.addEventListener("click", () => openDrawer(btn.dataset.openId, "pillars"));
    });
  }

  /* ==================== VIEW 4: DELIVERY MONTH & RECEIPTS RADAR ==================== */
  function renderDeliveryView() {
    const all = window.FuturesChainData.contracts;
    const veryTight = all.filter((c) => c.deliveryTightness.score >= 70).length;
    const looseSurplus = all.filter((c) => c.deliveryTightness.score < 45).length;
    const highVirtual = all.filter((c) => c.deliveryTightness.virtualToRealRatio >= 20).length;
    const deepDiscount = all.filter((c) => c.basisCurve.basisPct >= 1.5).length;

    document.getElementById("deliverySummaryStrip").innerHTML = `
      <div class="summary-card">
        <div class="summary-card-label"><span>交割月货源偏紧品种</span><span>紧缺指数 ≥ 70</span></div>
        <div class="summary-card-value val-bull">${veryTight} 个品种</div>
        <div class="summary-card-sub">重点：氧化铝、棕榈油、沪银、沪锌、沪铜、沪铝</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label"><span>高虚实盘比预警</span><span>虚实盘比 ≥ 20x</span></div>
        <div class="summary-card-value val-warn">${highVirtual} 个品种</div>
        <div class="summary-card-sub">临近交割空头交货能力弱，易走基差向上收敛</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label"><span>期货显著贴水品种</span><span>基差率 ≥ +1.5%</span></div>
        <div class="summary-card-value val-bull">${deepDiscount} 个品种</div>
        <div class="summary-card-sub">现货升水+Back结构提供多头安全垫</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label"><span>仓单高压 / 货源过剩</span><span>紧缺指数 &lt; 45</span></div>
        <div class="summary-card-value val-bear">${looseSurplus} 个品种</div>
        <div class="summary-card-sub">重点：纯碱、锰硅、沪镍、焦煤、PTA、玉米</div>
      </div>`;

    const filtered = all.filter((c) => {
      const s = c.deliveryTightness.score;
      if (appState.deliveryRisk === "tight") return s >= 65;
      if (appState.deliveryRisk === "balance") return s >= 48 && s < 65;
      if (appState.deliveryRisk === "loose") return s < 48;
      return true;
    }).sort((a, b) => b.deliveryTightness.score - a.deliveryTightness.score);

    const tbody = document.getElementById("deliveryTableBody");
    tbody.innerHTML = filtered.map((c) => {
      const dt = c.deliveryTightness;
      const ev = window.FuturesScoring.evaluate(c);
      const fillCol = dt.score >= 65 ? "var(--bull)" : dt.score < 48 ? "var(--bear)" : "var(--warning)";
      const riskCls = dt.squeezeRisk === "高" ? "sig-strong-bull" : dt.squeezeRisk === "中等偏高" ? "sig-bull" : dt.squeezeRisk === "中等" ? "sig-neutral" : "sig-bear";
      const basisStr = c.basisCurve.basis >= 0 ? `贴水 ${c.basisCurve.basis} (${c.basisCurve.basisPct.toFixed(1)}%)` : `升水 ${Math.abs(c.basisCurve.basis)} (${c.basisCurve.basisPct.toFixed(1)}%)`;

      return `
        <tr data-id="${c.id}">
          <td>
            <strong>${esc(c.name)}</strong> <span class="mono-dim">${esc(c.code)}</span>
            <div style="font-size:11px;color:var(--text-muted);">${esc(c.deliveryMonth)}</div>
          </td>
          <td><span class="sector-badge sec-${c.sector}">${esc(c.sectorLabel)}</span></td>
          <td class="num">
            <div class="tight-bar-wrap">
              <div class="tight-mini-track"><div class="tight-mini-fill" style="width:${dt.score}%;background:${fillCol};"></div></div>
              <strong style="color:${fillCol};">${dt.score}</strong>
            </div>
          </td>
          <td class="${ev.tightness.cls}"><strong>${esc(dt.label)}</strong></td>
          <td class="num">${esc(dt.warehouseReceipts)}</td>
          <td class="num">${dt.virtualToRealRatio > 0 ? dt.virtualToRealRatio.toFixed(1) + "x" : "活体/现货"}</td>
          <td><span class="verdict-pill ${riskCls}">${esc(dt.squeezeRisk)}</span></td>
          <td>
            <div class="${c.basisCurve.basis >= 0 ? "val-bull" : "val-bear"}" style="font-family:var(--font-mono);font-size:12px;font-weight:700;">${basisStr}</div>
            <div style="font-size:11px;color:var(--text-muted);">${esc(c.basisCurve.spreadDesc)}</div>
          </td>
          <td style="max-width:340px;font-size:12.2px;color:var(--text-secondary);">${esc(dt.deliverableSupply)}</td>
        </tr>`;
    }).join("");

    tbody.querySelectorAll("tr").forEach((tr) => {
      tr.addEventListener("click", () => openDrawer(tr.dataset.id, "extended"));
    });
  }

  /* ==================== VIEW 5: DAILY INTEL ==================== */
  function renderIntelView() {
    const q = appState.searchQuery.trim().toLowerCase();
    const list = appState.intelItems.filter((it) => {
      if (appState.intelSector !== "ALL" && it.sector !== appState.intelSector) return false;
      if (appState.intelSentiment !== "ALL" && it.sentiment !== appState.intelSentiment) return false;
      if (!q) return true;
      return `${it.title} ${it.summary} ${it.source}`.toLowerCase().includes(q);
    });

    const feed = document.getElementById("intelFeed");
    if (!list.length) {
      feed.innerHTML = `<div class="empty-state">当前筛选条件下暂无产业资讯，点击上方“录入基本面研判”添加自定义跟踪记录。</div>`;
    } else {
      feed.innerHTML = list.map((it) => {
        const chips = (it.contracts || []).map((cid) => {
          const c = getContractById(cid);
          return c ? `<button class="rel-chip" data-open-id="${c.id}"><strong>${esc(c.name)}</strong> <small>${esc(c.code)}</small></button>` : "";
        }).join("");
        const extLink = it.link ? `<a href="${esc(it.link)}" target="_blank" rel="noopener" style="color:var(--accent);font-size:12px;text-decoration:none;">原文链接 ↗</a>` : "";
        return `
          <article class="news-card">
            <div class="news-card-meta">
              <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">
                <span class="ticker-tag ${it.sentiment}">${SENTIMENT_LABELS[it.sentiment] || "中性"}</span>
                <span class="sector-badge sec-${it.sector}">${SECTOR_LABELS[it.sector] || "宏观"}</span>
                <span>${esc(it.source)}</span>
              </div>
              <span class="mono-dim">${esc(it.date)} ${esc(it.time || "")}</span>
            </div>
            <h3>${esc(it.title)}</h3>
            <p>${esc(it.summary)}</p>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:4px;">
              <div class="relation-chips">${chips}</div>
              ${extLink}
            </div>
          </article>`;
      }).join("");

      feed.querySelectorAll("[data-open-id]").forEach((btn) => {
        btn.addEventListener("click", () => openDrawer(btn.dataset.openId, "overview"));
      });
    }

    // Hot mentioned contracts sidebar
    const counts = {};
    appState.intelItems.forEach((it) => {
      (it.contracts || []).forEach((cid) => { counts[cid] = (counts[cid] || 0) + 1; });
    });
    const hotList = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([cid, cnt]) => ({ c: getContractById(cid), cnt }))
      .filter((x) => x.c);

    const hotEl = document.getElementById("hotContractsList");
    hotEl.innerHTML = hotList.map(({ c, cnt }) => {
      const ev = window.FuturesScoring.evaluate(c);
      return `
        <div class="hot-item" data-open-id="${c.id}">
          <div><strong>${esc(c.name)}</strong> <span class="mono-dim">${esc(c.code)}</span></div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="verdict-pill ${ev.signal.badgeClass}">${ev.signal.short} ${ev.totalScore}</span>
            <span class="mono-dim">${cnt}条</span>
          </div>
        </div>`;
    }).join("");
    hotEl.querySelectorAll("[data-open-id]").forEach((el) => {
      el.addEventListener("click", () => openDrawer(el.dataset.openId, "overview"));
    });
  }

  /* ==================== 6-TAB DEEP-DIVE DRAWER ==================== */
  function openDrawer(contractId, tabName) {
    const c = getContractById(contractId);
    if (!c) return;
    appState.activeContractId = contractId;
    appState.drawerTab = tabName || "overview";
    appState.simOverrides = null;

    renderDrawerHeader(c);
    switchDrawerTab(appState.drawerTab);

    document.getElementById("drawerBackdrop").hidden = false;
    const drawer = document.getElementById("contractDrawer");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    appState.activeContractId = null;
    appState.simOverrides = null;
    document.getElementById("drawerBackdrop").hidden = true;
    const drawer = document.getElementById("contractDrawer");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderDrawerHeader(c) {
    const ev = window.FuturesScoring.evaluate(c);
    const lq = getQuote(c);
    const chgCls = lq.changePct >= 0 ? "val-bull" : "val-bear";
    const basisTxt = c.basisCurve.basis >= 0
      ? `贴水 ${c.basisCurve.basis} (${c.basisCurve.basisPct >= 0 ? "+" : ""}${c.basisCurve.basisPct.toFixed(2)}%)`
      : `升水 ${Math.abs(c.basisCurve.basis)} (${c.basisCurve.basisPct.toFixed(2)}%)`;

    // Connected upstream & downstream contracts
    const related = [];
    window.FuturesChainData.links.forEach((lk) => {
      if (lk.to === c.id) {
        const up = getContractById(lk.from);
        if (up) related.push({ dir: "上游", c: up, label: lk.label });
      }
      if (lk.from === c.id) {
        const dn = getContractById(lk.to);
        if (dn) related.push({ dir: "下游", c: dn, label: lk.label });
      }
    });

    const relHtml = related.length
      ? `<div class="relation-chips" style="margin-top:10px;">
           <span style="font-size:11.5px;color:var(--text-muted);align-self:center;">产业链直连传导：</span>
           ${related.map((r) => `
             <button class="rel-chip" data-jump-id="${r.c.id}">
               <span style="color:${r.dir === "上游" ? "var(--upstream)" : "var(--downstream)"};font-weight:700;">${r.dir}</span>
               <strong>${esc(r.c.name)}</strong>
               <small>${esc(r.label)}</small>
             </button>`).join("")}
         </div>`
      : "";

    const header = document.getElementById("drawerHeader");
    header.innerHTML = `
      <div class="drawer-header-inner">
        <div class="drawer-top-row">
          <div class="drawer-title-group">
            <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">
              <span class="sector-badge sec-${c.sector}">${esc(c.sectorLabel)}</span>
              <span class="exch-tag">${esc(c.exchangeName)} · ${esc(c.exchange)}</span>
              <span class="exch-tag">${esc(c.deliveryMonth)}</span>
            </div>
            <h2>
              <span>${esc(c.name)}</span>
              <span class="mono-dim" style="font-size:15px;">${esc(c.code)}</span>
              <span class="verdict-pill ${ev.signal.badgeClass}" style="font-size:13px;padding:4px 12px;">
                <span>${ev.signal.label}</span>
                <strong>${ev.totalScore} 分</strong>
              </span>
            </h2>
            <div style="font-size:12.6px;color:var(--text-secondary);">${esc(c.subRole)} · 现货基准：${esc(c.spotBenchmark)} (${fmtPrice(c.spotPrice)} ${esc(c.unit)})</div>
          </div>
          <button class="drawer-close" id="closeDrawerBtn" aria-label="关闭详情面板">&times;</button>
        </div>

        <div class="drawer-kpi-row">
          <div class="dkpi">
            <span>主力合约价 (${esc(c.unit)})</span>
            <strong>${fmtPrice(lq.price)} <small class="${chgCls}" style="font-size:12px;">${lq.changePct >= 0 ? "+" : ""}${lq.changePct.toFixed(2)}%</small></strong>
          </div>
          <div class="dkpi">
            <span>交割月货源松紧</span>
            <strong class="${ev.tightness.cls}">${esc(c.deliveryTightness.label)} (${c.deliveryTightness.score})</strong>
          </div>
          <div class="dkpi">
            <span>期现基差与升贴水</span>
            <strong class="${c.basisCurve.basis >= 0 ? "val-bull" : "val-bear"}">${basisTxt}</strong>
          </div>
          <div class="dkpi">
            <span>预期差影响期限</span>
            <strong>${esc(c.pillars.expectationGap.curveFocus)}</strong>
          </div>
          <div class="dkpi">
            <span>估值×驱动象限</span>
            <strong class="${ev.quadrant.cls === "q-bull" ? "val-bull" : ev.quadrant.cls === "q-bear" ? "val-bear" : "val-warn"}">${esc(ev.quadrant.label)}</strong>
          </div>
        </div>
        ${relHtml}
      </div>`;

    document.getElementById("closeDrawerBtn").addEventListener("click", closeDrawer);
    header.querySelectorAll("[data-jump-id]").forEach((btn) => {
      btn.addEventListener("click", () => openDrawer(btn.dataset.jumpId, appState.drawerTab));
    });
  }

  function switchDrawerTab(tabName) {
    appState.drawerTab = tabName;
    document.querySelectorAll(".drawer-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    const c = getContractById(appState.activeContractId);
    if (c) renderDrawerBody(c);
  }

  function renderDrawerBody(c) {
    const body = document.getElementById("drawerBody");
    const ev = window.FuturesScoring.evaluate(c);

    if (appState.drawerTab === "overview") {
      const heroCls = ev.signal.group === "bull" ? "" : ev.signal.group === "bear" ? "bear-hero" : "neutral-hero";
      const ringCls = ev.signal.group;
      const ld = ev.liveDaily;
      const liveDailyHtml = ld ? `
        <div class="live-daily-box">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <strong style="font-size:13.8px;color:var(--accent);">✦ 今日实时动态研判 (${esc(ld.reportDate)} · ${esc(ld.sessionLabel)})</strong>
              <span class="panel-badge">盘面 ${ld.tapeDelta >= 0 ? "+" : ""}${ld.tapeDelta} · 月差 ${ld.curveDelta >= 0 ? "+" : ""}${ld.curveDelta} · 资讯 ${ld.newsDelta >= 0 ? "+" : ""}${ld.newsDelta}</span>
            </div>
            <span class="mono-dim">基准 ${ev.baseTotalScore} → 今日 <strong>${ev.totalScore}</strong></span>
          </div>
          <p style="margin:0 0 8px;font-size:12.8px;color:var(--text-primary);">${esc(ld.dailySummary)}</p>
          ${ld.catalysts && ld.catalysts.length ? `
            <div style="display:flex;flex-direction:column;gap:5px;">
              ${ld.catalysts.slice(0, 3).map((cat) => `
                <div style="font-size:12px;color:var(--text-secondary);display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span class="ticker-tag ${cat.sentiment}">${SENTIMENT_LABELS[cat.sentiment] || "中性"}</span>
                  <span class="exch-tag">${esc(cat.pillarTag)}</span>
                  <span>${esc(cat.title)}</span>
                  ${cat.link ? `<a href="${esc(cat.link)}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;">原文 ↗</a>` : ""}
                </div>`).join("")}
            </div>` : ""}
        </div>` : "";

      body.innerHTML = `
        <div class="drawer-body-inner">
          ${liveDailyHtml}
          <div class="verdict-hero ${heroCls}">
            <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:260px;">
              <div class="score-ring ${ringCls}">
                <strong>${ev.totalScore}</strong>
                <span>综合分</span>
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
                  <span class="verdict-pill ${ev.signal.badgeClass}" style="font-size:13px;">基本面结论：${ev.signal.label}</span>
                  <span class="quad-tag ${ev.quadrant.cls}">${ev.quadrant.label} · ${ev.quadrant.action}</span>
                </div>
                <p style="margin:0 0 5px;font-size:13.4px;"><strong>核心交割月诊断：</strong>${esc(c.deliveryTightness.deliverableSupply)}</p>
                <p style="margin:0;font-size:13px;color:var(--accent);"><strong>推荐交易策略：</strong>${esc(c.extended.strategy)}</p>
              </div>
            </div>
          </div>

          <div class="d-grid-2">
            <div class="d-block" style="margin-bottom:0;">
              <div class="d-block-head">
                <h3>七维基本面量化雷达图</h3>
                <span class="panel-badge">驱动 ${ev.driveScore} / 估值安全边际 ${ev.valuationScore}</span>
              </div>
              <div id="drawerRadarBox" style="max-width:360px;margin:0 auto;"></div>
            </div>

            <div class="d-block" style="margin-bottom:0;">
              <div class="d-block-head">
                <h3>七因子权重得分拆解</h3>
                <span class="panel-badge">>60偏多 · &lt;45偏空</span>
              </div>
              ${ev.factors.map((f) => {
                const col = f.score >= 60 ? "var(--bull)" : f.score < 45 ? "var(--bear)" : "var(--warning)";
                return `
                  <div style="margin-bottom:11px;">
                    <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px;">
                      <span><strong>${esc(f.label)}</strong> <span class="mono-dim">(权重 ${f.weight})</span></span>
                      <strong style="font-family:var(--font-mono);color:${col};">${f.score} / 100</strong>
                    </div>
                    <div class="pct-track"><div style="height:100%;width:${f.score}%;background:${col};border-radius:99px;"></div></div>
                  </div>`;
              }).join("")}
            </div>
          </div>

          <div class="d-block" style="margin-top:16px;">
            <div class="d-block-head">
              <h3>多空核心逻辑对抗与证伪条件</h3>
              <span class="panel-badge">盈亏平衡成本锚：${fmtPrice(c.pillars.costMargin.breakeven)} ${esc(c.unit)}</span>
            </div>
            <div class="sw-grid">
              <div class="sw-box bull-box">
                <h4>▲ 看多核心驱动 (Bull Case)</h4>
                <ul>${c.extended.bullFactors.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
              </div>
              <div class="sw-box bear-box">
                <h4>▼ 看空风险与压制 (Bear Case)</h4>
                <ul>${c.extended.bearFactors.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
              </div>
            </div>
            <div class="spread-trade-box" style="margin-top:12px;border-left-color:var(--warning);background:rgba(251,191,36,0.08);">
              <strong>核心证伪条件（止损/反转触发器）：</strong>${esc(c.extended.falsification)}
            </div>
          </div>
        </div>`;

      const radarColor = ev.signal.group === "bull" ? "#f43f5e" : ev.signal.group === "bear" ? "#10b981" : "#fbbf24";
      window.FuturesCharts.renderRadarChart(document.getElementById("drawerRadarBox"), ev.factors, radarColor);
      return;
    }

    if (appState.drawerTab === "pillars") {
      const p = c.pillars;
      const pCls = (sc) => sc >= 60 ? "p-bull" : sc < 45 ? "p-bear" : "p-warn";
      const sBadge = (sc) => sc >= 60
        ? `<span class="verdict-pill sig-bull">偏紧/利多 <strong>${sc}</strong></span>`
        : sc < 45
          ? `<span class="verdict-pill sig-bear">偏松/利空 <strong>${sc}</strong></span>`
          : `<span class="verdict-pill sig-neutral">中性平衡 <strong>${sc}</strong></span>`;

      body.innerHTML = `
        <div class="drawer-body-inner">
          <div class="pillar-card ${pCls(p.supply.score)}">
            <div class="pillar-head">
              <div class="pillar-title"><span class="pillar-num">1</span><h3 style="margin:0;font-size:15px;">供给端：产量、开工率、进口到货与检修限产天气扰动</h3></div>
              ${sBadge(p.supply.score)}
            </div>
            <p class="pillar-headline">${esc(p.supply.headline)}</p>
            <div class="pillar-kv-grid">
              <div class="pillar-kv"><span>产量与供应规模</span><p>${esc(p.supply.output)}</p></div>
              <div class="pillar-kv"><span>产能利用率 / 开工率</span><p>${esc(p.supply.utilization)}</p></div>
              <div class="pillar-kv"><span>进口到货 / 出口分流</span><p>${esc(p.supply.importFlow)}</p></div>
              <div class="pillar-kv"><span>检修、限产、天气与矿山扰动</span><p>${esc(p.supply.disruptions)}</p></div>
            </div>
          </div>

          <div class="pillar-card ${pCls(p.demand.score)}">
            <div class="pillar-head">
              <div class="pillar-title"><span class="pillar-num">2</span><h3 style="margin:0;font-size:15px;">需求端：实际消费、下游订单、开工率与淡旺季节奏</h3></div>
              ${sBadge(p.demand.score)}
            </div>
            <p class="pillar-headline">${esc(p.demand.headline)}</p>
            <div class="pillar-kv-grid">
              <div class="pillar-kv"><span>实际表观消费</span><p>${esc(p.demand.consumption)}</p></div>
              <div class="pillar-kv"><span>下游订单与采购意愿</span><p>${esc(p.demand.downstreamOrders)}</p></div>
              <div class="pillar-kv"><span>下游开工率</span><p>${esc(p.demand.downstreamUtil)}</p></div>
              <div class="pillar-kv"><span>淡旺季季节性研判</span><p>${esc(p.demand.seasonality)}</p></div>
            </div>
          </div>

          <div class="pillar-card ${pCls(p.inventory.score)}">
            <div class="pillar-head">
              <div class="pillar-title"><span class="pillar-num">3</span><h3 style="margin:0;font-size:15px;">库存与可交割货源：绝对水位、去累库速度与 5 年同期对照</h3></div>
              ${sBadge(p.inventory.score)}
            </div>
            <p class="pillar-headline">${esc(p.inventory.headline)}</p>
            <div class="d-grid-2" style="margin-bottom:0;align-items:center;">
              <div style="display:flex;flex-direction:column;gap:8px;">
                <div class="pillar-kv"><span>库存绝对水平</span><p>${esc(p.inventory.level)}</p></div>
                <div class="pillar-kv"><span>累库 / 去库速度</span><p>${esc(p.inventory.velocity)}</p></div>
                <div class="pillar-kv"><span>往年同期对比 (YoY / 5年均值)</span><p>${esc(p.inventory.yoyCompare)}</p></div>
                <div class="pillar-kv"><span>临近交割 · 可交割货源评估</span><p>${esc(p.inventory.deliverableNote)}</p></div>
              </div>
              <div class="panel-card" style="background:var(--bg-surface-2);">
                <div class="panel-card-head" style="margin-bottom:6px;">
                  <h3 style="font-size:13px;">库存季节性走势对照 (2026 vs 2025 vs 5年均值)</h3>
                </div>
                <div id="drawerSeasonalInvBox"></div>
              </div>
            </div>
          </div>

          <div class="pillar-card ${pCls(p.costMargin.score)}">
            <div class="pillar-head">
              <div class="pillar-title"><span class="pillar-num">4</span><h3 style="margin:0;font-size:15px;">成本与利润：原料、运费、汇率、加工利润与企业增减产/补库动力</h3></div>
              ${sBadge(p.costMargin.score)}
            </div>
            <p class="pillar-headline">${esc(p.costMargin.headline)}（成本支撑锚：${fmtPrice(p.costMargin.breakeven)} ${esc(c.unit)}）</p>
            <div class="pillar-kv-grid">
              <div class="pillar-kv"><span>核心原料成本</span><p>${esc(p.costMargin.rawMaterial)}</p></div>
              <div class="pillar-kv"><span>海运费 / 运费与人民币汇率影响</span><p>${esc(p.costMargin.freightFx)}</p></div>
              <div class="pillar-kv"><span>加工 / 冶炼 / 压榨即期利润</span><p>${esc(p.costMargin.margin)}</p></div>
              <div class="pillar-kv"><span>企业增产、减产或补库意愿判定</span><p>${esc(p.costMargin.incentive)}</p></div>
            </div>
          </div>

          <div class="pillar-card ${pCls(p.expectationGap.score)}">
            <div class="pillar-head">
              <div class="pillar-title"><span class="pillar-num">5</span><h3 style="margin:0;font-size:15px;">预期差与期限影响：比市场原先预想更紧还是更松？冲击近月还是远月？</h3></div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="panel-badge" style="color:var(--accent);border-color:var(--accent);">焦点：${esc(p.expectationGap.curveFocus)}</span>
                ${sBadge(p.expectationGap.score)}
              </div>
            </div>
            <p class="pillar-headline">${esc(p.expectationGap.headline)}</p>
            <div class="pillar-kv-grid">
              <div class="pillar-kv"><span>现实变化 vs 市场一致预期</span><p>${esc(p.expectationGap.actualVsExpected)}</p></div>
              <div class="pillar-kv"><span>近月合约 vs 远月合约传导区分</span><p>${esc(p.expectationGap.detail)}</p></div>
            </div>
          </div>
        </div>`;

      window.FuturesCharts.renderSeasonalInventoryChart(
        document.getElementById("drawerSeasonalInvBox"),
        p.inventory.seasonalSeries
      );
      return;
    }

    if (appState.drawerTab === "basis") {
      const bc = c.basisCurve;
      const isDiscount = bc.basis >= 0;
      const basisScore = window.FuturesScoring.calcBasisScore(c);
      body.innerHTML = `
        <div class="drawer-body-inner">
          <div class="d-grid-3">
            <div class="panel-card">
              <span class="mono-dim">期现基差 (现货 − 主力期货)</span>
              <div style="font-family:var(--font-mono);font-size:24px;font-weight:900;margin:4px 0;" class="${isDiscount ? "val-bull" : "val-bear"}">
                ${bc.basis >= 0 ? "+" : ""}${bc.basis} ${esc(c.unit)}
              </div>
              <div style="font-size:12.2px;color:var(--text-secondary);">
                ${isDiscount ? "期货贴水现货（现货升水 · 多头安全垫）" : "期货升水现货（现货贴水 · 吸引卖保交割）"}
              </div>
            </div>
            <div class="panel-card">
              <span class="mono-dim">基差率 & 期限结构定性</span>
              <div style="font-family:var(--font-mono);font-size:24px;font-weight:900;margin:4px 0;" class="${isDiscount ? "val-bull" : "val-bear"}">
                ${bc.basisPct >= 0 ? "+" : ""}${bc.basisPct.toFixed(2)}%
              </div>
              <div style="font-size:12.2px;color:var(--text-secondary);">${esc(bc.structureLabel)}</div>
            </div>
            <div class="panel-card">
              <span class="mono-dim">近远月月间价差</span>
              <div style="font-family:var(--font-mono);font-size:18px;font-weight:800;margin:7px 0;">
                ${esc(bc.spreadDesc)}
              </div>
              <div style="font-size:12.2px;color:var(--text-secondary);">升贴水量化评分：<strong>${basisScore} / 100</strong></div>
            </div>
          </div>

          <div class="d-block">
            <div class="d-block-head">
              <h3>现货与各交割月份期限结构曲线 (Term Structure)</h3>
              <span class="panel-badge">${bc.structure === "back" ? "Back (近强远弱 · 货源偏紧特征)" : "Contango (近弱远强 · 仓储/宽松特征)"}</span>
            </div>
            <div id="drawerCurveBox" style="max-width:760px;margin:0 auto;"></div>
            <div class="spread-trade-box" style="margin-top:14px;">
              <strong>临近交割月期现回归逻辑：</strong>${esc(bc.convergenceLogic)}
            </div>
          </div>
        </div>`;

      window.FuturesCharts.renderTermCurveChart(document.getElementById("drawerCurveBox"), bc, c.unit);
      return;
    }

    if (appState.drawerTab === "extended") {
      const dt = c.deliveryTightness;
      const ex = c.extended;
      const links = window.FuturesChainData.links.filter((lk) => lk.from === c.id || lk.to === c.id);

      body.innerHTML = `
        <div class="drawer-body-inner">
          <div class="d-block">
            <div class="d-block-head">
              <h3>临近交割月仓单与虚实盘比结构监控</h3>
              <span class="verdict-pill ${dt.score >= 65 ? "sig-bull" : dt.score < 48 ? "sig-bear" : "sig-neutral"}">${esc(dt.label)} (${dt.score}/100)</span>
            </div>
            <div class="d-grid-3" style="margin-bottom:12px;">
              <div class="pillar-kv"><span>交易所注册仓单量</span><p style="font-family:var(--font-mono);font-size:16px;font-weight:800;">${esc(dt.warehouseReceipts)}</p></div>
              <div class="pillar-kv"><span>主力单边持仓量</span><p style="font-family:var(--font-mono);font-size:16px;font-weight:800;">${esc(dt.openInterest)}</p></div>
              <div class="pillar-kv"><span>虚实盘比 & 逼仓风险</span><p style="font-family:var(--font-mono);font-size:16px;font-weight:800;">${dt.virtualToRealRatio > 0 ? dt.virtualToRealRatio.toFixed(1) + "x" : "活体车板"} · ${esc(dt.squeezeRisk)}</p></div>
            </div>
            <p style="margin:0;font-size:13px;color:var(--text-secondary);">${esc(dt.deliverableSupply)}</p>
          </div>

          <div class="d-block">
            <div class="d-block-head">
              <h3>进阶投研维度：宏观因子 · 席位持仓 · 内外盘比价与进口窗口</h3>
              <span class="panel-badge">机构商品投研必备补充</span>
            </div>
            <div class="pillar-kv-grid">
              <div class="pillar-kv"><span>宏观流动性与政策主线</span><p>${esc(ex.macroDriver)}</p></div>
              <div class="pillar-kv"><span>席位持仓与产业套保动向</span><p>${esc(ex.positioning)}</p></div>
              <div class="pillar-kv"><span>内外盘比价与进出口窗口</span><p>${esc(ex.importExportParity)}</p></div>
              <div class="pillar-kv"><span>估值安全边际 vs 驱动强度</span><p>估值安全边际 <strong>${ex.valuationScore}/100</strong> · 驱动强度 <strong>${ex.driveScore}/100</strong></p></div>
            </div>
          </div>

          <div class="d-block">
            <div class="d-block-head">
              <h3>上下游产业链价格与利润传导明细</h3>
              <span class="panel-badge">点击关联品种立即跳转分析</span>
            </div>
            ${links.length ? `
              <div class="relation-chips">
                ${links.map((lk) => {
                  const isUp = lk.to === c.id;
                  const target = getContractById(isUp ? lk.from : lk.to);
                  if (!target) return "";
                  const tev = window.FuturesScoring.evaluate(target);
                  return `
                    <button class="rel-chip" data-jump-id="${target.id}" style="padding:9px 13px;">
                      <span style="color:${isUp ? "var(--upstream)" : "var(--downstream)"};font-weight:800;">${isUp ? "◀ 上游成本" : "下游需求 ▶"}</span>
                      <strong>${esc(target.name)} (${esc(target.code)})</strong>
                      <small>${esc(lk.label)}</small>
                      <span class="verdict-pill ${tev.signal.badgeClass}">${tev.signal.short} ${tev.totalScore}</span>
                    </button>`;
                }).join("")}
              </div>` : `<p class="mono-dim">暂无直接链式连接节点</p>`}
          </div>
        </div>`;

      body.querySelectorAll("[data-jump-id]").forEach((btn) => {
        btn.addEventListener("click", () => openDrawer(btn.dataset.jumpId, "overview"));
      });
      return;
    }

    if (appState.drawerTab === "simulator") {
      if (!appState.simOverrides) {
        appState.simOverrides = {
          supply: c.pillars.supply.score,
          demand: c.pillars.demand.score,
          inventory: c.pillars.inventory.score,
          costMargin: c.pillars.costMargin.score,
          expectationGap: c.pillars.expectationGap.score,
          delivery: c.deliveryTightness.score,
          basis: window.FuturesScoring.calcBasisScore(c)
        };
      }
      renderSimulatorTab(c);
      return;
    }

    if (appState.drawerTab === "intel") {
      const relatedNews = appState.intelItems.filter((it) =>
        (it.contracts && it.contracts.includes(c.id)) || it.sector === c.sector
      );
      body.innerHTML = `
        <div class="drawer-body-inner">
          <div class="d-block">
            <div class="d-block-head">
              <h3>${esc(c.name)} (${esc(c.code)}) 相关产业快讯与板块催化</h3>
              <button class="btn-primary" id="drawerQuickAddBtn">+ 录入该品种研判笔记</button>
            </div>
            <div class="news-feed">
              ${relatedNews.map((it) => `
                <article class="news-card" style="background:var(--bg-surface-2);">
                  <div class="news-card-meta">
                    <div style="display:flex;align-items:center;gap:7px;">
                      <span class="ticker-tag ${it.sentiment}">${SENTIMENT_LABELS[it.sentiment] || "中性"}</span>
                      <span>${esc(it.source)}</span>
                    </div>
                    <span class="mono-dim">${esc(it.date)} ${esc(it.time || "")}</span>
                  </div>
                  <h3>${esc(it.title)}</h3>
                  <p>${esc(it.summary)}</p>
                </article>`).join("") || `<div class="empty-state">暂无相关资讯</div>`}
            </div>
          </div>
        </div>`;

      document.getElementById("drawerQuickAddBtn").addEventListener("click", () => {
        openComposer(c.sector, c.id);
      });
    }
  }

  function renderSimulatorTab(c) {
    const body = document.getElementById("drawerBody");
    const baseEv = window.FuturesScoring.evaluate(c);
    const simEv = window.FuturesScoring.evaluate(c, appState.simOverrides);
    const diff = simEv.totalScore - baseEv.totalScore;
    const diffStr = diff === 0 ? "基准情景" : `${diff > 0 ? "+" : ""}${diff} 分 (${diff > 0 ? "更偏多" : "更偏空"})`;

    const sliders = [
      { key: "supply", label: "1. 供给约束强度 (检修/限产/天气减量 → 分高利多)" },
      { key: "demand", label: "2. 需求景气度 (订单/开工/旺季超预期 → 分高利多)" },
      { key: "inventory", label: "3. 库存与仓单紧缺度 (低库加速去库 → 分高利多)" },
      { key: "costMargin", label: "4. 成本支撑与利润安全垫 (亏损倒逼减产 → 分高利多)" },
      { key: "expectationGap", label: "5. 预期差方向 (实际比市场预期更紧 → 分高利多)" },
      { key: "delivery", label: "6. 交割月可交割货源紧缺度 (仓单少/虚实高 → 分高利多)" },
      { key: "basis", label: "7. 期现升贴水与Back保护 (深贴水 → 分高利多)" }
    ];

    body.innerHTML = `
      <div class="drawer-body-inner">
        <div class="d-block">
          <div class="d-block-head">
            <h3>What-If 基本面情景推演沙盘（实时重算空多结论）</h3>
            <div class="sim-presets" style="margin-bottom:0;">
              <button class="btn-subtle" id="simSupplyShockBtn">⚡ 模拟突发检修/天气减产</button>
              <button class="btn-subtle" id="simDemandDropBtn">❄ 模拟需求坍塌/超预期累库</button>
              <button class="btn-subtle" id="simResetBtn">↺ 恢复基准研判</button>
            </div>
          </div>

          <div class="sim-layout">
            <div>
              ${sliders.map((s) => {
                const v = appState.simOverrides[s.key];
                const col = v >= 60 ? "var(--bull)" : v < 45 ? "var(--bear)" : "var(--warning)";
                return `
                  <div class="sim-slider-row">
                    <div class="sim-slider-top">
                      <span>${s.label}</span>
                      <strong style="font-family:var(--font-mono);color:${col};" data-val-for="${s.key}">${v}</strong>
                    </div>
                    <input type="range" min="10" max="95" value="${v}" data-sim-key="${s.key}" />
                  </div>`;
              }).join("")}
            </div>

            <div style="display:flex;flex-direction:column;gap:14px;">
              <div class="verdict-hero ${simEv.signal.group === "bull" ? "" : simEv.signal.group === "bear" ? "bear-hero" : "neutral-hero"}" style="margin-bottom:0;">
                <div style="display:flex;align-items:center;gap:14px;">
                  <div class="score-ring ${simEv.signal.group}">
                    <strong>${simEv.totalScore}</strong>
                    <span>推演分</span>
                  </div>
                  <div>
                    <div style="margin-bottom:4px;">
                      <span class="verdict-pill ${simEv.signal.badgeClass}" style="font-size:13px;">推演结论：${simEv.signal.label}</span>
                    </div>
                    <div style="font-size:12.5px;color:var(--text-secondary);">较基准变化：<strong>${diffStr}</strong></div>
                    <div style="font-size:12.5px;color:var(--text-secondary);margin-top:3px;">
                      新象限定位：<span class="quad-tag ${simEv.quadrant.cls}">${simEv.quadrant.label} · ${simEv.quadrant.action}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="panel-card" style="background:var(--bg-surface-2);">
                <div class="panel-card-head" style="margin-bottom:4px;">
                  <h3 style="font-size:13.5px;">推演后七维基本面雷达</h3>
                  <span class="panel-badge">驱动 ${simEv.driveScore} / 估值 ${simEv.valuationScore}</span>
                </div>
                <div id="simRadarBox" style="max-width:330px;margin:0 auto;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    const radarCol = simEv.signal.group === "bull" ? "#f43f5e" : simEv.signal.group === "bear" ? "#10b981" : "#fbbf24";
    window.FuturesCharts.renderRadarChart(document.getElementById("simRadarBox"), simEv.factors, radarCol);

    body.querySelectorAll("input[data-sim-key]").forEach((inp) => {
      inp.addEventListener("input", () => {
        appState.simOverrides[inp.dataset.simKey] = Number(inp.value);
        renderSimulatorTab(c);
      });
    });

    document.getElementById("simSupplyShockBtn").addEventListener("click", () => {
      appState.simOverrides.supply = Math.min(95, appState.simOverrides.supply + 22);
      appState.simOverrides.inventory = Math.min(95, appState.simOverrides.inventory + 15);
      appState.simOverrides.expectationGap = Math.min(95, appState.simOverrides.expectationGap + 20);
      appState.simOverrides.delivery = Math.min(95, appState.simOverrides.delivery + 16);
      renderSimulatorTab(c);
    });
    document.getElementById("simDemandDropBtn").addEventListener("click", () => {
      appState.simOverrides.demand = Math.max(15, appState.simOverrides.demand - 25);
      appState.simOverrides.inventory = Math.max(15, appState.simOverrides.inventory - 22);
      appState.simOverrides.expectationGap = Math.max(15, appState.simOverrides.expectationGap - 22);
      appState.simOverrides.delivery = Math.max(15, appState.simOverrides.delivery - 18);
      renderSimulatorTab(c);
    });
    document.getElementById("simResetBtn").addEventListener("click", () => {
      appState.simOverrides = null;
      renderDrawerBody(c);
    });
  }

  /* ==================== Composer Modal & Export ==================== */
  function openComposer(defaultSector, defaultContract) {
    document.getElementById("composerBackdrop").hidden = false;
    document.getElementById("composerModal").hidden = false;
    if (defaultSector) document.getElementById("intelSectorInput").value = defaultSector;
    if (defaultContract) document.getElementById("intelContractsInput").value = defaultContract;
  }

  function closeComposer() {
    document.getElementById("composerBackdrop").hidden = true;
    document.getElementById("composerModal").hidden = true;
  }

  function exportJsonBackup() {
    const payload = {
      exportedAt: new Date().toISOString(),
      contracts: window.FuturesChainData.contracts.map((c) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        sector: c.sectorLabel,
        evaluation: window.FuturesScoring.evaluate(c),
        deliveryTightness: c.deliveryTightness,
        basisCurve: c.basisCurve
      })),
      intel: appState.intelItems
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `china-futures-chain-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ==================== Bind All Events ==================== */
  function bindEvents() {
    // Top Navigation
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });
    document.getElementById("brandReset").addEventListener("click", () => {
      switchView("chain");
      window.FuturesChainGraph.clearSelection();
    });
    document.getElementById("tickerMoreBtn").addEventListener("click", () => switchView("intel"));

    // Global Search
    const searchInput = document.getElementById("globalSearch");
    const searchClear = document.getElementById("searchClear");
    searchInput.addEventListener("input", () => {
      appState.searchQuery = searchInput.value;
      searchClear.hidden = !searchInput.value;
      window.FuturesChainGraph.setState({ searchQuery: appState.searchQuery });
      if (appState.currentView === "matrix") renderMatrixView();
      if (appState.currentView === "intel") renderIntelView();
    });
    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
    });

    // View 1 Chain Filters
    document.querySelectorAll("#sectorFilterGroup .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#sectorFilterGroup .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        window.FuturesChainGraph.setState({ sectorFilter: chip.dataset.sector });
      });
    });
    document.querySelectorAll("#signalFilterGroup .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#signalFilterGroup .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        window.FuturesChainGraph.setState({ signalFilter: chip.dataset.signal });
      });
    });
    document.getElementById("tightnessFilter").addEventListener("change", (e) => {
      window.FuturesChainGraph.setState({ tightnessFilter: e.target.value });
    });
    document.getElementById("sortMetric").addEventListener("change", (e) => {
      window.FuturesChainGraph.setState({ sortMetric: e.target.value });
    });
    document.getElementById("toggleAllEdgesBtn").addEventListener("click", (e) => {
      const next = !window.FuturesChainGraph.getState().showCrossLinks;
      e.currentTarget.classList.toggle("active", next);
      window.FuturesChainGraph.setState({ showCrossLinks: next });
    });
    document.querySelectorAll("#chainLayoutSwitch .seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#chainLayoutSwitch .seg-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        window.FuturesChainGraph.setState({ layoutMode: btn.dataset.layout });
      });
    });
    document.getElementById("clearSelectionBtn").addEventListener("click", () => {
      window.FuturesChainGraph.clearSelection();
    });

    // View 2 Matrix Filters & Table Sorting
    document.querySelectorAll("#matrixSectorFilter .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#matrixSectorFilter .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        appState.matrixSector = chip.dataset.sector;
        renderMatrixView();
      });
    });
    document.querySelectorAll("#matrixTable th.sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const k = th.dataset.sort;
        if (appState.matrixSortKey === k) appState.matrixSortAsc = !appState.matrixSortAsc;
        else { appState.matrixSortKey = k; appState.matrixSortAsc = false; }
        renderMatrixView();
      });
    });

    // View 3 Spreads Filters
    document.querySelectorAll("#spreadSectorFilter .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#spreadSectorFilter .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        appState.spreadSector = chip.dataset.sector;
        renderSpreadsView();
      });
    });

    // View 4 Delivery Filters
    document.querySelectorAll("#deliveryRiskFilter .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#deliveryRiskFilter .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        appState.deliveryRisk = chip.dataset.risk;
        renderDeliveryView();
      });
    });

    // View 5 Intel Filters
    document.querySelectorAll("#intelSectorFilter .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#intelSectorFilter .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        appState.intelSector = chip.dataset.sector;
        renderIntelView();
      });
    });
    document.querySelectorAll("#intelSentimentFilter .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#intelSentimentFilter .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        appState.intelSentiment = chip.dataset.sentiment;
        renderIntelView();
      });
    });

    // Drawer Tabs & Backdrop
    document.querySelectorAll(".drawer-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchDrawerTab(tab.dataset.tab));
    });
    document.getElementById("drawerBackdrop").addEventListener("click", closeDrawer);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeComposer();
        closeDrawer();
      }
    });

    // Composer & Live Sync & Export
    document.getElementById("openComposerBtn").addEventListener("click", () => openComposer());
    document.getElementById("intelAddBtn").addEventListener("click", () => openComposer());
    document.getElementById("closeComposerBtn").addEventListener("click", closeComposer);
    document.getElementById("cancelComposerBtn").addEventListener("click", closeComposer);
    document.getElementById("composerBackdrop").addEventListener("click", closeComposer);
    document.getElementById("exportDataBtn").addEventListener("click", exportJsonBackup);
    document.getElementById("liveSyncBtn").addEventListener("click", () => {
      syncLiveQuotes(true);
      syncLiveNews(true);
      syncDailyJudgment(true);
    });
    document.getElementById("refreshLiveNewsBtn").addEventListener("click", () => {
      syncLiveNews(true);
      syncDailyJudgment(true);
    });

    document.getElementById("intelComposerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("intelTitleInput").value.trim();
      const summary = document.getElementById("intelSummaryInput").value.trim();
      if (!title || !summary) return;
      const now = new Date();
      const contracts = document.getElementById("intelContractsInput").value
        .split(/[,，\s]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);

      saveCustomIntel({
        id: "custom-" + Date.now(),
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
        sector: document.getElementById("intelSectorInput").value,
        sentiment: document.getElementById("intelSentimentInput").value,
        source: document.getElementById("intelSourceInput").value.trim() || "自选投研调研",
        title,
        summary,
        contracts
      });
      e.target.reset();
      closeComposer();
      renderTicker();
      if (appState.currentView === "intel") renderIntelView();
      if (appState.activeContractId && appState.drawerTab === "intel") {
        const c = getContractById(appState.activeContractId);
        if (c) renderDrawerBody(c);
      }
    });
  }

  /* ==================== Bootstrap ==================== */
  function init() {
    initTheme();
    loadIntel();
    renderTicker();

    window.FuturesChainGraph.init({
      onSelectContract: (id) => openDrawer(id, "overview")
    });
    renderDailyBriefPanel();
    window.FuturesChainGraph.render();

    bindEvents();
    syncLiveQuotes(false);
    syncLiveNews(false);
    syncDailyJudgment(false);
    if (window.location.protocol !== "file:") {
      setInterval(() => syncLiveQuotes(false), 45 * 1000);
      setInterval(() => syncDailyJudgment(false), 5 * 60 * 1000);
      setInterval(() => syncLiveNews(false), 10 * 60 * 1000);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
