/* ==========================================================================
   China Futures Visual Chain — Zero-Dependency Crisp SVG Chart Library
   Charts:
     1. 7-Dimension Fundamental Radar Chart
     2. Term Structure Curve (Spot -> Delivery Months, Back vs Contango)
     3. 5-Year Seasonal Inventory Comparison Line Chart
     4. Valuation x Drive 4-Quadrant Interactive Scatter Matrix
     5. Sector Strength Comparison & Basis Rate Diverging Bar Chart
   ========================================================================== */
window.FuturesCharts = (function () {
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
  }

  /* 1. 7-Factor Fundamental Radar Chart */
  function renderRadarChart(container, factors, accentColor) {
    if (!container || !factors || !factors.length) return;
    const width = 400;
    const height = 340;
    const cx = width / 2;
    const cy = height / 2 + 4;
    const maxR = 102;
    const n = factors.length;
    const color = accentColor || "#f43f5e";

    const angleAt = (i) => -Math.PI / 2 + (2 * Math.PI * i) / n;
    const pt = (i, r) => [cx + r * Math.cos(angleAt(i)), cy + r * Math.sin(angleAt(i))];

    let ringsSvg = "";
    [25, 50, 75, 100].forEach((lvl) => {
      const r = (lvl / 100) * maxR;
      const pts = factors.map((_, i) => pt(i, r).map((v) => v.toFixed(1)).join(",")).join(" ");
      ringsSvg += `<polygon points="${pts}" fill="none" stroke="var(--border-subtle)" stroke-dasharray="${lvl === 50 ? "4 3" : "none"}" stroke-width="${lvl === 50 ? 1.2 : 0.9}" />`;
    });

    let axesSvg = "";
    let labelsSvg = "";
    const polyPts = [];

    factors.forEach((f, i) => {
      const [ax, ay] = pt(i, maxR);
      axesSvg += `<line x1="${cx}" y1="${cy}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" stroke="var(--border-subtle)" stroke-width="1" />`;

      const [vx, vy] = pt(i, (f.score / 100) * maxR);
      polyPts.push(`${vx.toFixed(1)},${vy.toFixed(1)}`);

      const [lx, ly] = pt(i, maxR + 22);
      const anchor = Math.abs(lx - cx) < 14 ? "middle" : lx > cx ? "start" : "end";
      labelsSvg += `
        <text x="${lx.toFixed(1)}" y="${(ly - 2).toFixed(1)}" text-anchor="${anchor}" fill="var(--text-secondary)" font-size="11.5" font-weight="600">${esc(f.short)}</text>
        <text x="${lx.toFixed(1)}" y="${(ly + 12).toFixed(1)}" text-anchor="${anchor}" fill="${f.score >= 60 ? "var(--bull)" : f.score < 45 ? "var(--bear)" : "var(--warning)"}" font-size="11" font-family="var(--font-mono)" font-weight="700">${f.score}</text>`;
    });

    const dotsSvg = factors.map((f, i) => {
      const [vx, vy] = pt(i, (f.score / 100) * maxR);
      return `<circle cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="4.2" fill="${color}" stroke="var(--bg-surface)" stroke-width="1.8"><title>${esc(f.label)}: ${f.score}/100 (权重 ${f.weight})</title></circle>`;
    }).join("");

    container.innerHTML = `
      <svg class="svg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="七维基本面雷达图">
        ${ringsSvg}
        ${axesSvg}
        <polygon points="${polyPts.join(" ")}" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" />
        ${dotsSvg}
        ${labelsSvg}
      </svg>`;
  }

  /* 2. Term Structure Curve Chart (Spot -> Delivery Months) */
  function renderTermCurveChart(container, basisCurve, unit) {
    if (!container || !basisCurve || !basisCurve.curvePoints || !basisCurve.curvePoints.length) return;
    const pts = basisCurve.curvePoints;
    const width = 620;
    const height = 228;
    const pad = { top: 34, right: 34, bottom: 38, left: 66 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;

    const prices = pts.map((p) => p.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const span = Math.max(maxP - minP, minP * 0.015, 1);
    const yMin = minP - span * 0.25;
    const yMax = maxP + span * 0.28;
    const yScale = (v) => pad.top + ((yMax - v) / (yMax - yMin)) * ch;
    const xScale = (i) => pad.left + (pts.length === 1 ? cw / 2 : (i / (pts.length - 1)) * cw);

    const isBack = basisCurve.structure === "back";
    const lineColor = isBack ? "var(--bull)" : "var(--bear)";

    let grid = "";
    for (let i = 0; i <= 4; i++) {
      const v = yMin + ((yMax - yMin) * i) / 4;
      const y = yScale(v);
      const txt = v >= 1000 ? Math.round(v).toLocaleString() : v.toFixed(1);
      grid += `
        <line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${width - pad.right}" y2="${y.toFixed(1)}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
        <text x="${pad.left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="var(--text-muted)" font-size="10.5" font-family="var(--font-mono)">${txt}</text>`;
    }

    const coords = pts.map((p, i) => ({ x: xScale(i), y: yScale(p.price), ...p }));
    const pathD = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
    const areaD = `${pathD} L ${coords[coords.length - 1].x.toFixed(1)} ${(pad.top + ch).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(pad.top + ch).toFixed(1)} Z`;

    const nodesSvg = coords.map((c, i) => {
      const isSpot = i === 0;
      const pTxt = c.price >= 1000 ? Math.round(c.price).toLocaleString() : c.price.toFixed(1);
      return `
        <circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${isSpot ? 6 : 5}" fill="${isSpot ? "var(--warning)" : lineColor}" stroke="var(--bg-surface)" stroke-width="2" />
        <text x="${c.x.toFixed(1)}" y="${(c.y - 11).toFixed(1)}" text-anchor="middle" fill="${isSpot ? "var(--warning)" : "var(--text-primary)"}" font-size="11" font-family="var(--font-mono)" font-weight="700">${pTxt}</text>
        <text x="${c.x.toFixed(1)}" y="${height - 12}" text-anchor="middle" fill="${isSpot ? "var(--warning)" : "var(--text-secondary)"}" font-size="11.5" font-weight="600">${esc(c.label)}</text>`;
    }).join("");

    container.innerHTML = `
      <svg class="svg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="期现升贴水与期限结构曲线">
        <defs>
          <linearGradient id="curveFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.28" />
            <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${grid}
        <path d="${areaD}" fill="url(#curveFillGrad)" />
        <path d="${pathD}" fill="none" stroke="${lineColor}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" />
        ${nodesSvg}
        <text x="${pad.left}" y="16" fill="var(--text-secondary)" font-size="11.5" font-weight="600">
          ${esc(basisCurve.structureLabel)} · 单位: ${esc(unit)}
        </text>
      </svg>`;
  }

  /* 3. 5-Year Seasonal Inventory Comparison Chart */
  function renderSeasonalInventoryChart(container, series) {
    if (!container || !series || !series.labels) return;
    const width = 620;
    const height = 225;
    const pad = { top: 32, right: 24, bottom: 32, left: 54 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;

    const allVals = [
      ...series.current.filter((v) => v != null),
      ...series.lastYear.filter((v) => v != null),
      ...series.avg5y.filter((v) => v != null)
    ];
    const minV = Math.min(...allVals) * 0.88;
    const maxV = Math.max(...allVals) * 1.1;
    const range = Math.max(maxV - minV, 1);

    const xScale = (i) => pad.left + (i / (series.labels.length - 1)) * cw;
    const yScale = (v) => pad.top + ((maxV - v) / range) * ch;

    let grid = "";
    for (let i = 0; i <= 4; i++) {
      const v = minV + (range * i) / 4;
      const y = yScale(v);
      const txt = v >= 100 ? Math.round(v) : v.toFixed(1);
      grid += `
        <line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${width - pad.right}" y2="${y.toFixed(1)}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
        <text x="${pad.left - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="var(--text-muted)" font-size="10.5" font-family="var(--font-mono)">${txt}</text>`;
    }

    const buildPath = (arr) => {
      let d = "";
      arr.forEach((v, i) => {
        if (v == null) return;
        d += `${d ? " L " : "M "}${xScale(i).toFixed(1)} ${yScale(v).toFixed(1)}`;
      });
      return d;
    };

    const avgPath = buildPath(series.avg5y);
    const lastPath = buildPath(series.lastYear);
    const curPath = buildPath(series.current);

    let lastCurIdx = -1;
    series.current.forEach((v, i) => { if (v != null) lastCurIdx = i; });
    const latestDot = lastCurIdx >= 0
      ? `<circle cx="${xScale(lastCurIdx).toFixed(1)}" cy="${yScale(series.current[lastCurIdx]).toFixed(1)}" r="5" fill="var(--accent)" stroke="var(--bg-surface)" stroke-width="2" />
         <text x="${xScale(lastCurIdx).toFixed(1)}" y="${(yScale(series.current[lastCurIdx]) - 9).toFixed(1)}" text-anchor="middle" fill="var(--accent)" font-size="11" font-family="var(--font-mono)" font-weight="700">${series.current[lastCurIdx]}</text>`
      : "";

    const xLabels = series.labels.map((lbl, i) => `
      <text x="${xScale(i).toFixed(1)}" y="${height - 10}" text-anchor="middle" fill="var(--text-muted)" font-size="10.5">${esc(lbl)}</text>
    `).join("");

    container.innerHTML = `
      <svg class="svg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="库存季节性同期对比图">
        ${grid}
        <path d="${avgPath}" fill="none" stroke="var(--text-muted)" stroke-width="1.6" stroke-dasharray="5 4" opacity="0.75" />
        <path d="${lastPath}" fill="none" stroke="var(--warning)" stroke-width="1.8" opacity="0.82" />
        <path d="${curPath}" fill="none" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
        ${latestDot}
        ${xLabels}
        <g transform="translate(${pad.left}, 12)">
          <line x1="0" y1="4" x2="14" y2="4" stroke="var(--accent)" stroke-width="2.8" />
          <text x="19" y="8" fill="var(--text-primary)" font-size="11" font-weight="600">2026当前</text>
          <line x1="88" y1="4" x2="102" y2="4" stroke="var(--warning)" stroke-width="2" />
          <text x="107" y="8" fill="var(--text-secondary)" font-size="11">2025去年同期</text>
          <line x1="196" y1="4" x2="210" y2="4" stroke="var(--text-muted)" stroke-width="1.8" stroke-dasharray="4 3" />
          <text x="215" y="8" fill="var(--text-secondary)" font-size="11">近5年均值</text>
        </g>
      </svg>`;
  }

  /* 4. Interactive Valuation x Drive 4-Quadrant Matrix */
  function renderValuationDriveQuadrant(container, contracts, sectorColors, onClickContract) {
    if (!container) return;
    const width = 660;
    const height = 360;
    const pad = { top: 28, right: 26, bottom: 42, left: 52 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;

    const minX = 18, maxX = 94;
    const minY = 24, maxY = 82;
    const midX = 58, midY = 55;

    const sx = (v) => pad.left + ((Math.max(minX, Math.min(maxX, v)) - minX) / (maxX - minX)) * cw;
    const sy = (v) => pad.top + ((maxY - Math.max(minY, Math.min(maxY, v))) / (maxY - minY)) * ch;

    const mx = sx(midX);
    const my = sy(midY);

    // Quadrant tint backgrounds
    const bgSvg = `
      <rect x="${mx}" y="${pad.top}" width="${pad.left + cw - mx}" height="${my - pad.top}" fill="rgba(244, 63, 94, 0.09)" />
      <rect x="${mx}" y="${my}" width="${pad.left + cw - mx}" height="${pad.top + ch - my}" fill="rgba(251, 191, 36, 0.06)" />
      <rect x="${pad.left}" y="${my}" width="${mx - pad.left}" height="${pad.top + ch - my}" fill="rgba(16, 185, 129, 0.09)" />
      <rect x="${pad.left}" y="${pad.top}" width="${mx - pad.left}" height="${my - pad.top}" fill="rgba(148, 163, 184, 0.05)" />
      <line x1="${mx}" y1="${pad.top}" x2="${mx}" y2="${pad.top + ch}" stroke="var(--border-strong)" stroke-dasharray="4 4" />
      <line x1="${pad.left}" y1="${my}" x2="${pad.left + cw}" y2="${my}" stroke="var(--border-strong)" stroke-dasharray="4 4" />
      <rect x="${pad.left}" y="${pad.top}" width="${cw}" height="${ch}" fill="none" stroke="var(--border-subtle)" rx="6" />
      <text x="${pad.left + cw - 8}" y="${pad.top + 18}" text-anchor="end" fill="var(--bull)" font-size="11.5" font-weight="700">★ 低估 + 强驱动 (高胜率多配)</text>
      <text x="${pad.left + cw - 8}" y="${pad.top + ch - 10}" text-anchor="end" fill="var(--warning)" font-size="11" font-weight="600">高估 + 强驱动 (顺势防回调)</text>
      <text x="${pad.left + 8}" y="${pad.top + ch - 10}" text-anchor="start" fill="var(--bear)" font-size="11.5" font-weight="700">▼ 高估 + 弱驱动 (高赔率空配)</text>
      <text x="${pad.left + 8}" y="${pad.top + 18}" text-anchor="start" fill="var(--text-muted)" font-size="11" font-weight="600">低估 + 弱驱动 (成本磨底震荡)</text>
    `;

    // Smart collision avoidance for dots & text labels
    const placedLabels = [];
    const seen = {};
    const dotsSvg = contracts.map((c) => {
      const ev = window.FuturesScoring.evaluate(c);
      const key = `${Math.round(ev.driveScore / 3)}-${Math.round(ev.valuationScore / 3)}`;
      const idx = seen[key] || 0;
      seen[key] = idx + 1;
      const offsetX = idx ? ((idx % 2 === 1 ? 1 : -1) * 10 * Math.ceil(idx / 2)) : 0;
      const offsetY = idx ? ((idx % 2 === 0 ? 1 : -1) * 8) : 0;

      const x = Math.max(pad.left + 18, Math.min(pad.left + cw - 18, sx(ev.driveScore) + offsetX));
      const y = Math.max(pad.top + 16, Math.min(pad.top + ch - 14, sy(ev.valuationScore) + offsetY));
      const col = sectorColors[c.sector] || "#38bdf8";

      // Try candidate label offsets (top, bottom, right, left) to avoid overlap
      const candidates = [
        { dx: 0, dy: -10, anchor: "middle" },
        { dx: 0, dy: 18, anchor: "middle" },
        { dx: 11, dy: 4, anchor: "start" },
        { dx: -11, dy: 4, anchor: "end" },
        { dx: 10, dy: -10, anchor: "start" },
        { dx: -10, dy: 16, anchor: "end" }
      ];
      let chosen = candidates[0];
      for (const cand of candidates) {
        const lx = x + cand.dx;
        const ly = y + cand.dy;
        const clash = placedLabels.some((p) => Math.abs(p.x - lx) < 42 && Math.abs(p.y - ly) < 13);
        if (!clash && lx > pad.left + 12 && lx < pad.left + cw - 12 && ly > pad.top + 12 && ly < pad.top + ch - 4) {
          chosen = cand;
          break;
        }
      }
      placedLabels.push({ x: x + chosen.dx, y: y + chosen.dy });

      return `
        <g class="quad-dot" data-id="${c.id}" style="cursor:pointer;">
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="${col}" fill-opacity="0.9" stroke="var(--bg-surface)" stroke-width="1.8">
            <title>${esc(c.name)} (${esc(c.code)}) · 综合评分 ${ev.totalScore} (${esc(ev.signal.label)}) | 驱动 ${ev.driveScore} / 估值安全边际 ${ev.valuationScore}</title>
          </circle>
          <text x="${(x + chosen.dx).toFixed(1)}" y="${(y + chosen.dy).toFixed(1)}" text-anchor="${chosen.anchor}" fill="var(--text-primary)" font-size="10.2" font-weight="700">${esc(c.name)}</text>
        </g>`;
    }).join("");

    container.innerHTML = `
      <svg class="svg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="估值与驱动四象限矩阵">
        ${bgSvg}
        ${dotsSvg}
        <text x="${pad.left + cw / 2}" y="${height - 10}" text-anchor="middle" fill="var(--text-secondary)" font-size="12" font-weight="600">基本面驱动强度 (供给约束 + 需求 + 去库 + 预期差) →</text>
        <text x="15" y="${pad.top + ch / 2}" text-anchor="middle" fill="var(--text-secondary)" font-size="12" font-weight="600" transform="rotate(-90 15 ${pad.top + ch / 2})">估值安全边际 (低利润 + 贴水支撑) →</text>
      </svg>`;

    if (onClickContract) {
      container.querySelectorAll(".quad-dot").forEach((el) => {
        el.addEventListener("click", () => onClickContract(el.dataset.id));
      });
    }
  }

  /* 5. Sector Average Bull/Bear Score vs Delivery Tightness */
  function renderSectorStrengthChart(container, contracts, sectors) {
    if (!container) return;
    const stats = sectors.map((s) => {
      const list = contracts.filter((c) => c.sector === s.id);
      const avgScore = list.reduce((acc, c) => acc + window.FuturesScoring.evaluate(c).totalScore, 0) / (list.length || 1);
      const avgTight = list.reduce((acc, c) => acc + c.deliveryTightness.score, 0) / (list.length || 1);
      return { ...s, avgScore, avgTight, count: list.length };
    });

    const width = 560;
    const height = 235;
    const pad = { top: 32, right: 18, bottom: 34, left: 38 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;
    const yScale = (v) => pad.top + ((100 - v) / 100) * ch;

    let grid = "";
    [0, 25, 50, 75, 100].forEach((v) => {
      const y = yScale(v);
      grid += `
        <line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="${v === 50 ? "var(--border-strong)" : "var(--border-subtle)"}" stroke-dasharray="${v === 50 ? "5 3" : "3 3"}" />
        <text x="${pad.left - 6}" y="${y + 4}" text-anchor="end" fill="var(--text-muted)" font-size="10.5" font-family="var(--font-mono)">${v}</text>`;
    });

    const gw = cw / stats.length;
    const bw = 24;
    const bars = stats.map((s, i) => {
      const cx = pad.left + gw * i + gw / 2;
      const y1 = yScale(s.avgScore);
      const h1 = pad.top + ch - y1;
      const y2 = yScale(s.avgTight);
      const h2 = pad.top + ch - y2;
      return `
        <rect x="${cx - bw - 3}" y="${y1}" width="${bw}" height="${h1}" rx="4" fill="${s.color}" opacity="0.92" />
        <text x="${cx - bw / 2 - 3}" y="${y1 - 5}" text-anchor="middle" fill="${s.color}" font-size="10.5" font-family="var(--font-mono)" font-weight="700">${s.avgScore.toFixed(0)}</text>
        <rect x="${cx + 3}" y="${y2}" width="${bw}" height="${h2}" rx="4" fill="var(--warning)" opacity="0.82" />
        <text x="${cx + bw / 2 + 3}" y="${y2 - 5}" text-anchor="middle" fill="var(--warning)" font-size="10.5" font-family="var(--font-mono)" font-weight="700">${s.avgTight.toFixed(0)}</text>
        <text x="${cx}" y="${height - 10}" text-anchor="middle" fill="var(--text-secondary)" font-size="11.5" font-weight="600">${esc(s.short)} (${s.count})</text>`;
    }).join("");

    container.innerHTML = `
      <svg class="svg-chart" viewBox="0 0 ${width} ${height}">
        ${grid}
        ${bars}
        <g transform="translate(${pad.left}, 10)">
          <rect width="10" height="10" rx="2" fill="var(--accent)"></rect>
          <text x="15" y="9" fill="var(--text-secondary)" font-size="11">板块均分 (左柱 · >50偏多)</text>
          <rect x="172" width="10" height="10" rx="2" fill="var(--warning)"></rect>
          <text x="187" y="9" fill="var(--text-secondary)" font-size="11">交割月紧缺均分 (右柱)</text>
        </g>
      </svg>`;
  }

  /* 6. Basis Rate (%) Leaderboard (Discount vs Premium) */
  function renderBasisRankChart(container, contracts, onClickContract) {
    if (!container) return;
    const sorted = [...contracts].sort((a, b) => b.basisCurve.basisPct - a.basisCurve.basisPct);
    const pick = [...sorted.slice(0, 6), ...sorted.slice(-5)];
    const maxAbs = Math.max(...pick.map((c) => Math.abs(c.basisCurve.basisPct)), 3);

    const rows = pick.map((c) => {
      const pct = c.basisCurve.basisPct;
      const isDiscount = pct >= 0;
      const barW = Math.max(6, (Math.abs(pct) / maxAbs) * 100);
      const col = isDiscount ? "var(--bull)" : "var(--bear)";
      const tag = isDiscount ? "贴水" : "升水";
      return `
        <div class="basis-rank-row" data-id="${c.id}">
          <div class="br-name">${esc(c.name)} <span class="mono-dim">${esc(c.code)}</span></div>
          <div class="br-track">
            <div class="br-fill" style="width:${barW.toFixed(1)}%;background:${col};"></div>
          </div>
          <div class="br-val" style="color:${col};">${pct >= 0 ? "+" : ""}${pct.toFixed(2)}% <small>${tag}</small></div>
        </div>`;
    }).join("");

    container.innerHTML = `<div class="basis-rank-list">${rows}</div>`;
    if (onClickContract) {
      container.querySelectorAll(".basis-rank-row").forEach((el) => {
        el.addEventListener("click", () => onClickContract(el.dataset.id));
      });
    }
  }

  return {
    renderRadarChart,
    renderTermCurveChart,
    renderSeasonalInventoryChart,
    renderValuationDriveQuadrant,
    renderSectorStrengthChart,
    renderBasisRankChart
  };
})();
