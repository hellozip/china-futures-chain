/* ==========================================================================
   China Futures Visual Chain — One-Click 2x Retina PNG Share Poster Generator
   Zero external dependencies (pure HTML5 Canvas @ 2x DPR -> instant PNG download)
   ========================================================================== */
window.FuturesSharePoster = (function () {
  function fmtPrice(p) {
    if (p == null || !Number.isFinite(Number(p))) return "--";
    const n = Number(p);
    if (n >= 10000) return Math.round(n).toLocaleString();
    if (n >= 1000) return n.toFixed(0);
    return n.toFixed(1);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function fillStrokeRR(ctx, x, y, w, h, r, fill, stroke, lw = 1) {
    roundRect(ctx, x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  }

  function generateAndDownload() {
    const W = 1080;
    const H = 1600;
    const DPR = 2;
    const canvas = document.createElement("canvas");
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    const ctx = canvas.getContext("2d");
    ctx.scale(DPR, DPR);

    const fontSans = '"Microsoft YaHei", "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif';
    const fontMono = 'Consolas, ui-monospace, SFMono-Regular, monospace';

    // Gather live data
    const daily = window.FuturesLive && window.FuturesLive.daily;
    const quotes = (window.FuturesLive && window.FuturesLive.quotes) || {};
    const contracts = window.FuturesChainData.contracts;
    const dateStr = (daily && daily.reportDate) || new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
    const timeStr = (daily && daily.reportTime) ? daily.reportTime.slice(0, 5) : new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(11, 16);
    const sessionLabel = (daily && daily.sessionLabel) || "实时基本面研判";

    const enriched = contracts.map((c) => {
      const ev = window.FuturesScoring.evaluate(c);
      const lq = window.FuturesChainGraph.getLiveQuote(c);
      return { c, ev, lq, q: quotes[c.id] || {} };
    });

    const bullCnt = enriched.filter((x) => x.ev.signal.group === "bull").length;
    const bearCnt = enriched.filter((x) => x.ev.signal.group === "bear").length;
    const neutCnt = enriched.length - bullCnt - bearCnt;
    const sorted = [...enriched].sort((a, b) => b.ev.totalScore - a.ev.totalScore);
    const topLongs = sorted.slice(0, 4);
    const topShorts = [...sorted].reverse().slice(0, 4);
    const delivAlerts = [...enriched].sort((a, b) => b.ev.factors[5].score - a.ev.factors[5].score).slice(0, 3);

    // 1. Background & Ambient Glows
    ctx.fillStyle = "#060a13";
    ctx.fillRect(0, 0, W, H);
    const g1 = ctx.createRadialGradient(140, 80, 10, 140, 80, 420);
    g1.addColorStop(0, "rgba(244, 63, 94, 0.16)"); g1.addColorStop(1, "rgba(6,10,19,0)");
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(940, 120, 10, 940, 120, 420);
    g2.addColorStop(0, "rgba(56, 189, 248, 0.14)"); g2.addColorStop(1, "rgba(6,10,19,0)");
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
    const g3 = ctx.createRadialGradient(540, 1520, 10, 540, 1520, 480);
    g3.addColorStop(0, "rgba(16, 185, 129, 0.12)"); g3.addColorStop(1, "rgba(6,10,19,0)");
    ctx.fillStyle = g3; ctx.fillRect(0, 0, W, H);

    // 2. Header
    const pad = 38;
    fillStrokeRR(ctx, pad, 34, 348, 24, 12, "rgba(56,189,248,0.14)", "rgba(56,189,248,0.38)", 1);
    ctx.fillStyle = "#38bdf8";
    ctx.font = `700 11.5px ${fontSans}`;
    ctx.fillText("CHINA COMMODITY FUTURES VISUAL CHAIN · 实时研判", pad + 12, 50);

    ctx.fillStyle = "#f8fafc";
    ctx.font = `900 35px ${fontSans}`;
    ctx.fillText("中国期货全产业链 · 每日空多研判", pad, 98);

    ctx.fillStyle = "#94a3b8";
    ctx.font = `500 14px ${fontSans}`;
    ctx.fillText("交割月货源松紧 · 供需库成本预期差五项 · 期现升贴水 · 30主力实时联算", pad, 124);

    // Date Box
    fillStrokeRR(ctx, W - pad - 208, 36, 208, 74, 14, "rgba(15,23,42,0.88)", "rgba(148,163,184,0.28)", 1);
    ctx.fillStyle = "#f8fafc";
    ctx.font = `900 22px ${fontMono}`;
    ctx.textAlign = "right";
    ctx.fillText(dateStr, W - pad - 16, 68);
    ctx.fillStyle = "#38bdf8";
    ctx.font = `700 12.5px ${fontSans}`;
    ctx.fillText(`${timeStr} CST · ${sessionLabel}`, W - pad - 16, 94);
    ctx.textAlign = "left";

    // Divider
    ctx.strokeStyle = "rgba(148,163,184,0.2)";
    ctx.beginPath(); ctx.moveTo(pad, 144); ctx.lineTo(W - pad, 144); ctx.stroke();

    // 3. Market Mood Bar Card
    const my = 162;
    fillStrokeRR(ctx, pad, my, W - pad * 2, 104, 16, "rgba(13,20,36,0.92)", "rgba(148,163,184,0.2)", 1);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = `800 15.5px ${fontSans}`;
    ctx.fillText("全市场 30 主力品种基本面多空分布（红多 · 黄震 · 绿空）", pad + 20, my + 28);

    ctx.textAlign = "right";
    ctx.font = `900 16px ${fontMono}`;
    ctx.fillStyle = "#34d399"; ctx.fillText(`${bearCnt} 空`, W - pad - 20, my + 28);
    ctx.fillStyle = "#fbbf24"; ctx.fillText(`${neutCnt} 震  /`, W - pad - 76, my + 28);
    ctx.fillStyle = "#fb7185"; ctx.fillText(`${bullCnt} 多  /`, W - pad - 146, my + 28);
    ctx.textAlign = "left";

    const barX = pad + 20, barY = my + 42, barW = W - pad * 2 - 40, barH = 11;
    const bw1 = (bullCnt / enriched.length) * barW;
    const bw2 = (neutCnt / enriched.length) * barW;
    fillStrokeRR(ctx, barX, barY, barW, barH, 5.5, "#1e293b");
    ctx.save();
    roundRect(ctx, barX, barY, barW, barH, 5.5); ctx.clip();
    ctx.fillStyle = "#f43f5e"; ctx.fillRect(barX, barY, bw1, barH);
    ctx.fillStyle = "#fbbf24"; ctx.fillRect(barX + bw1, barY, bw2, barH);
    ctx.fillStyle = "#10b981"; ctx.fillRect(barX + bw1 + bw2, barY, barW - bw1 - bw2, barH);
    ctx.restore();

    const briefTxt = (daily && daily.headlineBrief) ||
      `${dateStr} ${sessionLabel}：多头聚焦 ${topLongs.slice(0, 3).map((x) => `${x.c.name}(${x.ev.totalScore})`).join("、")}；空头聚焦 ${topShorts.slice(0, 3).map((x) => `${x.c.name}(${x.ev.totalScore})`).join("、")}。`;
    ctx.fillStyle = "#cbd5e1";
    ctx.font = `500 13px ${fontSans}`;
    ctx.fillText(briefTxt.slice(0, 72) + (briefTxt.length > 72 ? "…" : ""), barX, my + 80);

    // 4. Top Longs vs Top Shorts
    const duoY = 284;
    const colW = (W - pad * 2 - 16) / 2;
    const colH = 382;

    const drawPickCol = (x0, list, isBull) => {
      fillStrokeRR(ctx, x0, duoY, colW, colH, 16, "rgba(13,20,36,0.92)", "rgba(148,163,184,0.18)", 1);
      ctx.fillStyle = isBull ? "#f43f5e" : "#10b981";
      ctx.fillRect(x0 + 16, duoY, colW - 32, 3);

      ctx.font = `800 15px ${fontSans}`;
      ctx.fillText(isBull ? "▲ 今日基本面最强看多 TOP 4" : "▼ 今日基本面最强看空 TOP 4", x0 + 16, duoY + 30);
      ctx.fillStyle = "#64748b";
      ctx.font = `500 11.5px ${fontSans}`;
      ctx.textAlign = "right";
      ctx.fillText(isBull ? "高分+实盘/月差共振" : "高库/过剩/承压聚焦", x0 + colW - 16, duoY + 30);
      ctx.textAlign = "left";

      list.forEach((item, idx) => {
        const cy = duoY + 46 + idx * 81;
        fillStrokeRR(ctx, x0 + 14, cy, colW - 28, 72, 11, "#121c31", "rgba(148,163,184,0.16)", 1);
        ctx.fillStyle = "#f8fafc";
        ctx.font = `800 15px ${fontSans}`;
        ctx.fillText(item.c.name, x0 + 26, cy + 24);
        ctx.fillStyle = "#94a3b8";
        ctx.font = `600 11.5px ${fontMono}`;
        ctx.fillText(item.lq.nearCode || item.c.code, x0 + 26 + ctx.measureText(item.c.name).width + 16, cy + 24);

        ctx.textAlign = "right";
        ctx.fillStyle = isBull ? "#fb7185" : "#34d399";
        ctx.font = `900 15px ${fontMono}`;
        const dStr = item.ev.scoreDelta ? ` (${item.ev.scoreDelta > 0 ? "+" : ""}${item.ev.scoreDelta})` : "";
        ctx.fillText(`${item.ev.totalScore}分${dStr}`, x0 + colW - 26, cy + 24);
        ctx.textAlign = "left";

        ctx.fillStyle = "#f1f5f9";
        ctx.font = `800 13px ${fontMono}`;
        ctx.fillText(fmtPrice(item.lq.price), x0 + 26, cy + 45);
        ctx.fillStyle = item.lq.changePct >= 0 ? "#fb7185" : "#34d399";
        ctx.font = `700 12px ${fontMono}`;
        ctx.fillText(`${item.lq.changePct >= 0 ? "+" : ""}${item.lq.changePct.toFixed(2)}%`, x0 + 104, cy + 45);

        ctx.textAlign = "right";
        ctx.fillStyle = "#38bdf8";
        ctx.font = `700 11.5px ${fontMono}`;
        const spStr = item.lq.nearFarSpread != null
          ? `${item.lq.liveStructure === "back" ? "Back" : "Contango"} ${item.lq.nearFarSpread >= 0 ? "+" : ""}${item.lq.nearFarSpread}`
          : item.c.basisCurve.structureLabel.slice(0, 10);
        ctx.fillText(spStr, x0 + colW - 26, cy + 45);
        ctx.textAlign = "left";

        ctx.fillStyle = "#94a3b8";
        ctx.font = `500 11px ${fontSans}`;
        const subLine = item.ev.liveDaily ? `${item.ev.liveDaily.intradayTag} · ${item.ev.liveDaily.costNote}` : item.c.subRole;
        ctx.fillText(subLine.slice(0, 34), x0 + 26, cy + 63);
      });
    };

    drawPickCol(pad, topLongs, true);
    drawPickCol(pad + colW + 16, topShorts, false);

    // 5. Delivery Tightness Alerts TOP 3
    const delTitleY = 696;
    ctx.fillStyle = "#f8fafc";
    ctx.font = `800 17px ${fontSans}`;
    ctx.fillText("⚠ 临近交割月货源偏紧预警 TOP 3", pad, delTitleY);
    ctx.fillStyle = "#64748b";
    ctx.font = `500 12px ${fontSans}`;
    ctx.textAlign = "right";
    ctx.fillText("低注册仓单 · 高虚实盘比 · 现货强升水 Back", W - pad, delTitleY);
    ctx.textAlign = "left";

    const dCardW = (W - pad * 2 - 24) / 3;
    delivAlerts.forEach((item, idx) => {
      const dx = pad + idx * (dCardW + 12);
      const dy = delTitleY + 14;
      const tScore = item.ev.factors[5].score;
      fillStrokeRR(ctx, dx, dy, dCardW, 84, 13, "rgba(13,20,36,0.92)", "rgba(251,191,36,0.34)", 1);
      ctx.fillStyle = "#f8fafc";
      ctx.font = `800 14.5px ${fontSans}`;
      ctx.fillText(`${item.c.name} `, dx + 14, dy + 26);
      ctx.fillStyle = "#94a3b8";
      ctx.font = `600 11px ${fontMono}`;
      ctx.fillText(item.lq.nearCode || item.c.code, dx + 68, dy + 26);

      ctx.textAlign = "right";
      ctx.fillStyle = "#fbbf24";
      ctx.font = `900 13px ${fontMono}`;
      ctx.fillText(`紧缺 ${tScore}/100`, dx + dCardW - 14, dy + 26);
      ctx.textAlign = "left";

      fillStrokeRR(ctx, dx + 14, dy + 38, dCardW - 28, 7, 3.5, "#1e293b");
      fillStrokeRR(ctx, dx + 14, dy + 38, ((dCardW - 28) * tScore) / 100, 7, 3.5, "#f43f5e");

      ctx.fillStyle = "#94a3b8";
      ctx.font = `500 11.5px ${fontSans}`;
      ctx.fillText(`综合 ${item.ev.totalScore}分 (${item.ev.signal.label}) · 仓单 ${item.c.deliveryTightness.warehouseReceipts}`, dx + 14, dy + 68);
    });

    // 6. Five-Sector 30-Contract Panorama
    const secTitleY = 824;
    ctx.fillStyle = "#f8fafc";
    ctx.font = `800 17px ${fontSans}`;
    ctx.fillText("✦ 五大板块 30 品种全产业链实时空多全景", pad, secTitleY);
    ctx.fillStyle = "#64748b";
    ctx.font = `500 11.5px ${fontSans}`;
    ctx.textAlign = "right";
    ctx.fillText("评分模型：7因子基本面底盘 + 盘面动量(±6) + 实盘月差(±4) + 72h资讯(±7)", W - pad, secTitleY);
    ctx.textAlign = "left";

    const panelY = secTitleY + 14;
    const panelH = 668;
    fillStrokeRR(ctx, pad, panelY, W - pad * 2, panelH, 16, "rgba(13,20,36,0.92)", "rgba(148,163,184,0.2)", 1);

    const sectorDefs = [
      { id: "ferrous", title: "黑色系 · 煤焦矿钢链", col: "#f97316", flow: "焦煤/铁矿/锰硅 → 焦炭/高炉 → 螺纹/热卷", ids: ["jm", "j", "i", "sm", "rb", "hc"] },
      { id: "nonferrous", title: "有色系 · 矿冶新能源链", col: "#38bdf8", flow: "氧化铝→沪铝 · 铜铝替代 · 锂/镍→不锈钢", ids: ["ao", "al", "cu", "zn", "lc", "ni", "ss"] },
      { id: "precious", title: "贵金属 · 货币与工业锚", col: "#eab308", flow: "央行购金/利率 → 沪金 ⇄ 金银比 → 沪银", ids: ["au", "ag"] },
      { id: "energy", title: "能源化工 · 油煤化建材链", col: "#a78bfa", flow: "原油→燃/TA/PP/胶 · 甲醇→MTO · 碱→玻", ids: ["sc", "fu", "ta", "ma", "pp", "ru", "sa", "fg"] },
      { id: "agri", title: "农产品 · 粮油压榨养殖链", col: "#22c55e", flow: "棕榈⇄豆油 · 玉米/豆粕→生猪 · 糖/棉", ids: ["p", "y", "m", "c", "lh", "sr", "cf"] }
    ];

    const byId = {};
    enriched.forEach((x) => { byId[x.c.id] = x; });

    let curY = panelY + 26;
    sectorDefs.forEach((sd, sIdx) => {
      ctx.beginPath(); ctx.arc(pad + 22, curY - 4, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = sd.col; ctx.fill();
      ctx.font = `800 13.5px ${fontSans}`;
      ctx.fillText(sd.title, pad + 34, curY);
      ctx.fillStyle = "#64748b";
      ctx.font = `500 11px ${fontSans}`;
      ctx.textAlign = "right";
      ctx.fillText(sd.flow, W - pad - 18, curY);
      ctx.textAlign = "left";

      const rowW = W - pad * 2 - 36;
      const count = sd.ids.length;
      const gap = 8;
      const cardW = Math.min(148, (rowW - gap * (count - 1)) / count);
      const cardY = curY + 11;

      sd.ids.forEach((cid, i) => {
        const it = byId[cid];
        if (!it) return;
        const cx = pad + 18 + i * (cardW + gap);
        const sc = it.ev.totalScore;
        const borderCol = sc >= 72 ? "rgba(244,63,94,0.7)" : sc >= 60 ? "rgba(244,63,94,0.38)" : sc >= 48 ? "rgba(251,191,36,0.38)" : sc >= 38 ? "rgba(16,185,129,0.42)" : "rgba(16,185,129,0.72)";
        const bgCol = sc >= 60 ? "rgba(244,63,94,0.1)" : sc < 48 ? "rgba(16,185,129,0.1)" : "#121c31";
        fillStrokeRR(ctx, cx, cardY, cardW, 54, 9, bgCol, borderCol, 1);

        ctx.fillStyle = "#f8fafc";
        ctx.font = `800 12.2px ${fontSans}`;
        ctx.fillText(it.c.name, cx + 8, cardY + 21);

        ctx.textAlign = "right";
        ctx.fillStyle = sc >= 60 ? "#fb7185" : sc < 48 ? "#34d399" : "#fbbf24";
        ctx.font = `800 11px ${fontMono}`;
        ctx.fillText(`${it.ev.signal.short}${sc}`, cx + cardW - 7, cardY + 21);
        ctx.textAlign = "left";

        ctx.fillStyle = "#cbd5e1";
        ctx.font = `600 10.5px ${fontMono}`;
        ctx.fillText(fmtPrice(it.lq.price), cx + 8, cardY + 42);

        ctx.textAlign = "right";
        ctx.fillStyle = it.lq.changePct >= 0 ? "#fb7185" : "#34d399";
        ctx.font = `700 10.5px ${fontMono}`;
        ctx.fillText(`${it.lq.changePct >= 0 ? "+" : ""}${it.lq.changePct.toFixed(1)}%`, cx + cardW - 7, cardY + 42);
        ctx.textAlign = "left";
      });

      curY += 108;
      if (sIdx < sectorDefs.length - 1) {
        ctx.strokeStyle = "rgba(148,163,184,0.13)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(pad + 18, curY - 24); ctx.lineTo(W - pad - 18, curY - 24); ctx.stroke();
        ctx.setLineDash([]);
      }
      curY += 20;
    });

    // 7. Footer
    const fy = H - 62;
    ctx.strokeStyle = "rgba(148,163,184,0.2)";
    ctx.beginPath(); ctx.moveTo(pad, fy - 14); ctx.lineTo(W - pad, fy - 14); ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = `700 12.5px ${fontSans}`;
    ctx.fillText("中国期货全产业链可视链终端 · 全景流光链网 / 引力星云链 / 估值×驱动矩阵 / What-If推演沙盘", pad, fy + 8);
    ctx.fillStyle = "#94a3b8";
    ctx.font = `500 11.5px ${fontSans}`;
    ctx.fillText("数据同步自新浪/东财国内期货实盘与公开资讯，量化研判仅供投研分享参考，不构成投资建议。", pad, fy + 28);

    fillStrokeRR(ctx, W - pad - 244, fy - 4, 244, 34, 9, "rgba(56,189,248,0.12)", "rgba(56,189,248,0.38)", 1);
    ctx.fillStyle = "#38bdf8";
    ctx.font = `800 12.5px ${fontMono}`;
    ctx.textAlign = "center";
    ctx.fillText("china-futures-chain.onrender.com", W - pad - 122, fy + 17);

    // Trigger PNG download
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `中国期货每日空多研判-${dateStr}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return { generateAndDownload };
})();
