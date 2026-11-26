/* ==========================================================================
   China Futures Fundamental Quantitative Scoring Engine & What-If Simulator
   7-Factor Model:
     1. Supply Tightness (16%)
     2. Demand Strength (16%)
     3. Inventory & Deliverable Receipts (18%)
     4. Cost & Margin Support (14%)
     5. Expectation Gap (14%)
     6. Delivery-Month Tightness (12%)
     7. Basis & Term Structure (10%)
   ========================================================================== */
window.FuturesScoring = (function () {
  const WEIGHTS = {
    supply: 0.16,
    demand: 0.16,
    inventory: 0.18,
    costMargin: 0.14,
    expectationGap: 0.14,
    delivery: 0.12,
    basis: 0.10
  };

  function clamp(v, lo = 0, hi = 100) {
    return Math.max(lo, Math.min(hi, Math.round(v)));
  }

  /**
   * Convert basis % and term structure into a 0-100 fundamental bullish score.
   * Futures discount (basis > 0) & Back structure provide bullish safety margin;
   * Futures premium (basis < 0) & Contango invite delivery arbitrage selling
   * (except precious metals where mild Contango reflects risk-free carry rate).
   */
  function calcBasisScore(c) {
    const bc = c.basisCurve;
    if (!bc) return 50;
    if (c.sector === "precious") {
      // Gold/Silver mild contango is normal carry; slightly reward tight carry
      return clamp(62 + bc.basisPct * 4, 45, 78);
    }
    let base = 50 + bc.basisPct * 6.5;
    if (bc.structure === "back") base += 8;
    else if (bc.structure === "contango") base -= 8;
    // Special case: hog deep discount when oversupplied still has near-month cushion but weak trend
    if (c.id === "lh") base = Math.min(base, 64);
    return clamp(base, 15, 92);
  }

  function classifySignal(score) {
    if (score >= 72) {
      return { key: "strong_bull", group: "bull", label: "强烈看多", short: "强多", badgeClass: "sig-strong-bull" };
    }
    if (score >= 60) {
      return { key: "bull", group: "bull", label: "基本面偏多", short: "偏多", badgeClass: "sig-bull" };
    }
    if (score >= 48) {
      return { key: "neutral", group: "neutral", label: "中性震荡", short: "震荡", badgeClass: "sig-neutral" };
    }
    if (score >= 38) {
      return { key: "bear", group: "bear", label: "基本面偏空", short: "偏空", badgeClass: "sig-bear" };
    }
    return { key: "strong_bear", group: "bear", label: "强烈看空", short: "强空", badgeClass: "sig-strong-bear" };
  }

  function classifyTightness(score) {
    if (score >= 80) return { key: "very_tight", label: "极度偏紧", cls: "tight-very" };
    if (score >= 65) return { key: "tight", label: "货源偏紧", cls: "tight-high" };
    if (score >= 48) return { key: "tight_balance", label: "紧平衡", cls: "tight-mid" };
    if (score >= 32) return { key: "loose", label: "货源偏松", cls: "tight-low" };
    return { key: "surplus", label: "明显过剩", cls: "tight-surplus" };
  }

  function classifyQuadrant(valScore, driveScore) {
    if (valScore >= 55 && driveScore >= 58) {
      return { id: "q1", label: "低估 + 强驱动", action: "高胜率战略做多", cls: "q-bull" };
    }
    if (valScore < 55 && driveScore >= 58) {
      return { id: "q2", label: "高估 + 强驱动", action: "顺势试多 / 防回调", cls: "q-warn" };
    }
    if (valScore < 55 && driveScore < 58) {
      return { id: "q3", label: "高估 + 弱驱动", action: "高赔率战略做空", cls: "q-bear" };
    }
    return { id: "q4", label: "低估 + 弱驱动", action: "成本磨底 / 区间震荡", cls: "q-neutral" };
  }

  function evaluate(contract, overrides) {
    const ov = overrides || {};
    const supply = clamp(ov.supply != null ? ov.supply : contract.pillars.supply.score);
    const demand = clamp(ov.demand != null ? ov.demand : contract.pillars.demand.score);
    const inventory = clamp(ov.inventory != null ? ov.inventory : contract.pillars.inventory.score);
    const costMargin = clamp(ov.costMargin != null ? ov.costMargin : contract.pillars.costMargin.score);
    const expectationGap = clamp(ov.expectationGap != null ? ov.expectationGap : contract.pillars.expectationGap.score);
    const delivery = clamp(ov.delivery != null ? ov.delivery : contract.deliveryTightness.score);
    const basis = clamp(ov.basis != null ? ov.basis : calcBasisScore(contract));

    const baseTotalScore = Math.round(
      supply * WEIGHTS.supply +
      demand * WEIGHTS.demand +
      inventory * WEIGHTS.inventory +
      costMargin * WEIGHTS.costMargin +
      expectationGap * WEIGHTS.expectationGap +
      delivery * WEIGHTS.delivery +
      basis * WEIGHTS.basis
    );

    // If live server daily judgment is loaded (and user is not in manual What-If simulator), blend live daily score
    const liveDaily = !overrides && window.FuturesLive && window.FuturesLive.daily && window.FuturesLive.daily.contracts
      ? window.FuturesLive.daily.contracts[contract.id]
      : null;

    const totalScore = liveDaily ? clamp(baseTotalScore + (liveDaily.scoreDelta || 0), 12, 96) : baseTotalScore;
    const effectiveDelivery = liveDaily ? clamp(liveDaily.liveTightness, 12, 96) : delivery;
    const signal = classifySignal(totalScore);
    const tightness = classifyTightness(effectiveDelivery);

    // Recalculate drive & valuation as delta from baseline so unedited simulator matches Tab 1 identically
    const baseBasis = calcBasisScore(contract);
    const baseRawDrive = contract.pillars.supply.score * 0.25 + contract.pillars.demand.score * 0.25 + contract.pillars.inventory.score * 0.28 + contract.pillars.expectationGap.score * 0.22;
    const simRawDrive = supply * 0.25 + demand * 0.25 + inventory * 0.28 + expectationGap * 0.22;
    const baseRawVal = contract.pillars.costMargin.score * 0.55 + baseBasis * 0.45;
    const simRawVal = costMargin * 0.55 + basis * 0.45;

    const liveDriveBump = liveDaily ? Math.round((liveDaily.tapeDelta || 0) * 0.5 + (liveDaily.newsDelta || 0) * 0.8) : 0;
    const driveScore = overrides
      ? clamp(contract.extended.driveScore + (simRawDrive - baseRawDrive))
      : clamp(contract.extended.driveScore + liveDriveBump);
    const valuationScore = overrides
      ? clamp(contract.extended.valuationScore + (simRawVal - baseRawVal))
      : contract.extended.valuationScore;
    const quadrant = classifyQuadrant(valuationScore, driveScore);

    return {
      totalScore,
      baseTotalScore,
      scoreDelta: liveDaily ? (liveDaily.scoreDelta || 0) : 0,
      liveDaily,
      signal,
      tightness,
      driveScore,
      valuationScore,
      quadrant,
      factors: [
        { key: "supply", label: "供给约束", short: "供给", score: supply, weight: "16%" },
        { key: "demand", label: "需求景气", short: "需求", score: demand, weight: "16%" },
        { key: "inventory", label: "库存与仓单", short: "库存", score: inventory, weight: "18%" },
        { key: "costMargin", label: "成本与利润", short: "成本利润", score: costMargin, weight: "14%" },
        { key: "expectationGap", label: "预期差", short: "预期差", score: expectationGap, weight: "14%" },
        { key: "delivery", label: "交割月松紧", short: "交割松紧", score: effectiveDelivery, weight: "12%" },
        { key: "basis", label: "升贴水结构", short: "升贴水", score: basis, weight: "10%" }
      ]
    };
  }

  return {
    WEIGHTS,
    calcBasisScore,
    classifySignal,
    classifyTightness,
    classifyQuadrant,
    evaluate
  };
})();
