/* ==========================================================================
   China Futures Visual Chain — Real-Time Quotes & Daily Fundamental Judgment Server
   Zero external npm dependencies (requires Node.js 18/20+ built-in fetch)
   Features:
     - Static file hosting for index.html, css/, js/
     - GET /api/quotes          : Dual-source real-time China futures quotes
                                  (Eastmoney Push2 primary + Sina Finance fallback)
                                  + live Near/Far contract spread (Back vs Contango)
     - GET /api/news            : Multi-sector live China commodity RSS intelligence
     - GET /api/daily-judgment  : Automated daily fundamental bull/bear judgment engine
                                  combining 5-pillar baseline + live tape/OI momentum
                                  + live term structure + 72h live news catalysts
                                  (+ optional GEMINI_API_KEY executive brief)
     - GET /api/health          : Render health check endpoint
   ========================================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT) || 3001;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

/* ==================== 30 Core China Commodity Futures Mapping ==================== */
const FUTURES_MAP = [
  // Ferrous (6)
  { id: "i", name: "铁矿石", sina: "nf_I0", em: "114.im", emCode: "im", prefix: "I", sector: "ferrous", cycle: "159", breakeven: 620, baseScore: 55, baseTight: 54, keywords: ["铁矿", "铁矿石", "澳粉", "铁水", "力拓", "必和必拓", "淡水河谷"] },
  { id: "jm", name: "焦煤", sina: "nf_JM0", em: "114.jmm", emCode: "jmm", prefix: "JM", sector: "ferrous", cycle: "159", breakeven: 1220, baseScore: 37, baseTight: 34, keywords: ["焦煤", "蒙煤", "炼焦煤", "甘其毛都", "煤矿"] },
  { id: "j", name: "焦炭", sina: "nf_J0", em: "114.jm", emCode: "jm", prefix: "J", sector: "ferrous", cycle: "159", breakeven: 1860, baseScore: 44, baseTight: 42, keywords: ["焦炭", "焦化", "提涨", "提降"] },
  { id: "sm", name: "锰硅", sina: "nf_SM0", em: "115.SMM", emCode: "SMM", prefix: "SM", sector: "ferrous", cycle: "159", breakeven: 5750, baseScore: 34, baseTight: 22, keywords: ["锰硅", "硅锰", "锰矿", "铁合金"] },
  { id: "rb", name: "螺纹钢", sina: "nf_RB0", em: "113.rbm", emCode: "rbm", prefix: "RB", sector: "ferrous", cycle: "1510", breakeven: 3000, baseScore: 63, baseTight: 64, keywords: ["螺纹", "螺纹钢", "钢材", "钢厂", "冬储", "建材"] },
  { id: "hc", name: "热轧卷板", sina: "nf_HC0", em: "113.hcm", emCode: "hcm", prefix: "HC", sector: "ferrous", cycle: "1510", breakeven: 3150, baseScore: 61, baseTight: 58, keywords: ["热卷", "热轧卷板", "板材", "冷轧"] },

  // Non-Ferrous (7)
  { id: "ao", name: "氧化铝", sina: "nf_AO0", em: "113.aom", emCode: "aom", prefix: "AO", sector: "nonferrous", cycle: "159", breakeven: 3180, baseScore: 77, baseTight: 88, keywords: ["氧化铝", "铝土矿", "几内亚", "焙烧"] },
  { id: "lc", name: "碳酸锂", sina: "nf_LC0", em: "225.lcm", emCode: "lcm", prefix: "LC", sector: "nonferrous", cycle: "159", breakeven: 74000, baseScore: 46, baseTight: 36, keywords: ["碳酸锂", "锂矿", "锂盐", "锂电", "锂辉石", "云母"] },
  { id: "cu", name: "沪铜", sina: "nf_CU0", em: "113.cum", emCode: "cum", prefix: "CU", sector: "nonferrous", cycle: "monthly", breakeven: 71500, baseScore: 72, baseTight: 72, keywords: ["沪铜", "铜价", "铜精矿", "伦铜", "电解铜", "lme铜"] },
  { id: "al", name: "沪铝", sina: "nf_AL0", em: "113.alm", emCode: "alm", prefix: "AL", sector: "nonferrous", cycle: "monthly", breakeven: 19850, baseScore: 70, baseTight: 70, keywords: ["沪铝", "电解铝", "铝锭", "铝价"] },
  { id: "zn", name: "沪锌", sina: "nf_ZN0", em: "113.znm", emCode: "znm", prefix: "ZN", sector: "nonferrous", cycle: "monthly", breakeven: 23600, baseScore: 68, baseTight: 74, keywords: ["沪锌", "锌锭", "锌矿", "镀锌"] },
  { id: "ni", name: "沪镍", sina: "nf_NI0", em: "113.nim", emCode: "nim", prefix: "NI", sector: "nonferrous", cycle: "monthly", breakeven: 118000, baseScore: 35, baseTight: 28, keywords: ["沪镍", "镍价", "印尼镍", "电积镍", "rkab"] },
  { id: "ss", name: "不锈钢", sina: "nf_SS0", em: "113.ssm", emCode: "ssm", prefix: "SS", sector: "nonferrous", cycle: "monthly", breakeven: 13100, baseScore: 43, baseTight: 38, keywords: ["不锈钢", "304冷轧", "镍铁"] },

  // Precious Metals (2)
  { id: "au", name: "沪金", sina: "nf_AU0", em: "113.aum", emCode: "aum", prefix: "AU", sector: "precious", cycle: "even", breakeven: 560, baseScore: 74, baseTight: 72, keywords: ["沪金", "黄金", "金价", "央行购金", "美联储", "comex金"] },
  { id: "ag", name: "沪银", sina: "nf_AG0", em: "113.agm", emCode: "agm", prefix: "AG", sector: "precious", cycle: "even", breakeven: 6900, baseScore: 74, baseTight: 76, keywords: ["沪银", "白银", "银价", "金银比", "光伏银浆"] },

  // Energy & Chemicals (8)
  { id: "sc", name: "原油", sina: "nf_SC0", em: "142.scm", emCode: "scm", prefix: "SC", sector: "energy", cycle: "monthly", breakeven: 505, baseScore: 57, baseTight: 54, keywords: ["原油", "油价", "opec", "布伦特", "wti", "欧佩克"] },
  { id: "ma", name: "甲醇", sina: "nf_MA0", em: "115.MAM", emCode: "MAM", prefix: "MA", sector: "energy", cycle: "159", breakeven: 2320, baseScore: 67, baseTight: 70, keywords: ["甲醇", "伊朗限气", "mto", "煤制甲醇"] },
  { id: "fu", name: "燃料油", sina: "nf_FU0", em: "113.fum", emCode: "fum", prefix: "FU", sector: "energy", cycle: "159", breakeven: 2980, baseScore: 66, baseTight: 68, keywords: ["燃料油", "高硫", "船燃", "低硫"] },
  { id: "ta", name: "PTA", sina: "nf_TA0", em: "115.TAM", emCode: "TAM", prefix: "TA", sector: "energy", cycle: "159", breakeven: 4720, baseScore: 41, baseTight: 34, keywords: ["pta", "聚酯", "px", "涤纶"] },
  { id: "sa", name: "纯碱", sina: "nf_SA0", em: "115.SAM", emCode: "SAM", prefix: "SA", sector: "energy", cycle: "159", breakeven: 1380, baseScore: 29, baseTight: 20, keywords: ["纯碱", "重碱", "天然碱", "碱厂"] },
  { id: "pp", name: "聚丙烯", sina: "nf_PP0", em: "114.ppm", emCode: "ppm", prefix: "PP", sector: "energy", cycle: "159", breakeven: 7250, baseScore: 54, baseTight: 52, keywords: ["聚丙烯", "聚烯烃", "pdh", "拉丝"] },
  { id: "fg", name: "玻璃", sina: "nf_FG0", em: "115.FGM", emCode: "FGM", prefix: "FG", sector: "energy", cycle: "159", breakeven: 1220, baseScore: 61, baseTight: 58, keywords: ["玻璃", "浮法玻璃", "冷修", "沙河"] },
  { id: "ru", name: "天然橡胶", sina: "nf_RU0", em: "113.rum", emCode: "rum", prefix: "RU", sector: "energy", cycle: "159", breakeven: 16500, baseScore: 65, baseTight: 68, keywords: ["橡胶", "天胶", "轮胎", "割胶", "泰南", "半钢胎"] },

  // Agriculture (7)
  { id: "c", name: "玉米", sina: "nf_C0", em: "114.cm", emCode: "cm", prefix: "C", sector: "agri", cycle: "159", breakeven: 2140, baseScore: 44, baseTight: 36, keywords: ["玉米", "深加工", "北港", "售粮", "中储粮"] },
  { id: "p", name: "棕榈油", sina: "nf_P0", em: "114.pm", emCode: "pm", prefix: "P", sector: "agri", cycle: "159", breakeven: 9200, baseScore: 80, baseTight: 84, keywords: ["棕榈油", "马棕", "b40", "生柴", "mpob", "印尼棕榈"] },
  { id: "m", name: "豆粕", sina: "nf_M0", em: "114.mm", emCode: "mm", prefix: "M", sector: "agri", cycle: "159", breakeven: 2820, baseScore: 57, baseTight: 56, keywords: ["豆粕", "美豆", "巴西大豆", "油厂", "压榨"] },
  { id: "y", name: "豆油", sina: "nf_Y0", em: "114.ym", emCode: "ym", prefix: "Y", sector: "agri", cycle: "159", breakeven: 7900, baseScore: 67, baseTight: 64, keywords: ["豆油", "豆棕价差", "油粕比", "油脂"] },
  { id: "lh", name: "生猪", sina: "nf_LH0", em: "114.lhm", emCode: "lhm", prefix: "LH", sector: "agri", cycle: "1359", breakeven: 14200, baseScore: 48, baseTight: 42, keywords: ["生猪", "猪价", "能繁母猪", "腌腊", "出栏"] },
  { id: "sr", name: "白糖", sina: "nf_SR0", em: "115.SRM", emCode: "SRM", prefix: "SR", sector: "agri", cycle: "159", breakeven: 5700, baseScore: 61, baseTight: 58, keywords: ["白糖", "原糖", "糖浆", "榨季", "广西糖"] },
  { id: "cf", name: "棉花", sina: "nf_CF0", em: "115.CFM", emCode: "CFM", prefix: "CF", sector: "agri", cycle: "159", breakeven: 14250, baseScore: 52, baseTight: 42, keywords: ["棉花", "新疆棉", "棉纱", "纺企", "皮棉"] }
];

const SECTOR_LABELS = {
  ferrous: "黑色系",
  nonferrous: "有色系",
  precious: "贵金属系",
  energy: "能源化工系",
  agri: "农产品系"
};

/* ==================== Time Helpers (China Standard Time UTC+8) ==================== */
function getChinaTimeParts(dateObj = new Date()) {
  const cn = new Date(dateObj.getTime() + 8 * 3600 * 1000);
  const iso = cn.toISOString();
  const dateStr = iso.slice(0, 10);
  const timeStr = iso.slice(11, 19);
  const hour = Number(iso.slice(11, 13));
  const minute = Number(iso.slice(14, 16));
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(5, 7));

  let sessionLabel = "盘后复盘研判";
  const hm = hour * 100 + minute;
  if (hm >= 830 && hm < 900) sessionLabel = "盘前早报研判";
  else if (hm >= 900 && hm <= 1505) sessionLabel = "日盘实时追踪";
  else if (hm >= 2055 || hm < 235) sessionLabel = "夜盘实时追踪";

  return { dateStr, timeStr, hour, minute, year, month, sessionLabel };
}

/**
 * Dynamically pick the current active Near and Far delivery contract YYMM codes
 * so term-structure monitoring never goes stale across years!
 */
function getNearFarSymbols(item) {
  const { year, month } = getChinaTimeParts();
  let months;
  if (item.cycle === "1510") months = [1, 5, 10];
  else if (item.cycle === "1359") months = [1, 3, 5, 9];
  else if (item.cycle === "even") months = [2, 4, 6, 8, 10, 12];
  else if (item.cycle === "monthly") months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  else months = [1, 5, 9];

  // Build candidate future contract months starting >= current month + 1
  const candidates = [];
  for (let y = year; y <= year + 1; y++) {
    for (const m of months) {
      if (y === year && m <= month) continue;
      candidates.push({ y, m });
    }
  }
  const near = candidates[0] || { y: year + 1, m: 1 };
  const far = item.cycle === "monthly" ? (candidates[3] || candidates[1] || near) : (candidates[1] || near);
  const fmt = (o) => `${String(o.y).slice(-2)}${String(o.m).padStart(2, "0")}`;
  return {
    nearCode: `${item.prefix}${fmt(near)}`,
    farCode: `${item.prefix}${fmt(far)}`,
    nearSina: `nf_${item.prefix}${fmt(near)}`,
    farSina: `nf_${item.prefix}${fmt(far)}`
  };
}

/* ==================== Caches ==================== */
const quotesCache = { data: {}, updatedAt: null, lastFetchMs: 0, fetching: null };
const newsCache = { items: [], updatedAt: null, lastFetchMs: 0, fetching: null };
const judgmentCache = { report: null, generatedDate: null, updatedAt: null, aiSummary: null, aiDate: null };

async function fetchWithTimeout(url, timeoutMs = 8000, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        ...headers
      },
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/* ==================== Dual-Source Real-Time China Futures Quotes ==================== */
async function fetchEastmoneyQuotes() {
  const secids = FUTURES_MAP.map((f) => f.em).join(",");
  const url = `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f12,f14,f2,f3,f4,f5,f15,f16,f17,f18,f133&secids=${encodeURIComponent(secids)}`;
  const res = await fetchWithTimeout(url, 7500);
  const json = await res.json();
  const diffs = (json && json.data && json.data.diff) || [];
  const byCode = {};
  diffs.forEach((d) => { if (d && d.f12) byCode[d.f12] = d; });

  const out = {};
  const cn = getChinaTimeParts();
  FUTURES_MAP.forEach((item) => {
    const d = byCode[item.emCode];
    if (!d) return;
    const price = Number(d.f2);
    if (!Number.isFinite(price) || price <= 0) return;
    const prevSettle = Number(d.f18) || price;
    const changePercent = Number.isFinite(Number(d.f3)) ? Number(d.f3) : (prevSettle > 0 ? ((price - prevSettle) / prevSettle) * 100 : 0);
    const change = Number.isFinite(Number(d.f4)) ? Number(d.f4) : (price - prevSettle);
    out[item.id] = {
      id: item.id,
      symbol: item.em,
      price: Number(price.toFixed(2)),
      prevSettle: Number(prevSettle.toFixed(2)),
      open: Number(d.f17) || price,
      high: Number(d.f15) || price,
      low: Number(d.f16) || price,
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Number(d.f5) || 0,
      openInterest: Number(d.f133) || 0,
      tradeDate: cn.dateStr,
      source: "Eastmoney Futures"
    };
  });
  return out;
}

async function fetchSinaQuotesAndSpreads() {
  const pairMap = {};
  const symList = [];
  FUTURES_MAP.forEach((item) => {
    const nf = getNearFarSymbols(item);
    pairMap[item.id] = nf;
    symList.push(item.sina, nf.nearSina, nf.farSina);
  });

  // Fetch in 2 chunks to keep URL compact
  const chunkSize = 48;
  let fullText = "";
  for (let i = 0; i < symList.length; i += chunkSize) {
    const slice = symList.slice(i, i + chunkSize).join(",");
    try {
      const res = await fetchWithTimeout(`https://hq.sinajs.cn/list=${slice}`, 7500, {
        Referer: "https://finance.sina.com.cn"
      });
      const buf = await res.arrayBuffer();
      fullText += "\n" + new TextDecoder("gbk", { fatal: false }).decode(buf);
    } catch (_) {}
  }

  const parseSinaLine = (sym) => {
    const m = fullText.match(new RegExp(`hq_str_${sym}="([^"]+)"`));
    if (!m) return null;
    const f = m[1].split(",");
    if (f.length < 15) return null;
    const price = Number(f[8]) || Number(f[6]) || Number(f[2]);
    if (!Number.isFinite(price) || price <= 0) return null;
    const prevSettle = Number(f[10]) || Number(f[5]) || price;
    return {
      price: Number(price.toFixed(2)),
      prevSettle: Number(prevSettle.toFixed(2)),
      open: Number(f[2]) || price,
      high: Number(f[3]) || price,
      low: Number(f[4]) || price,
      openInterest: Math.round(Number(f[13]) || 0),
      volume: Math.round(Number(f[14]) || 0),
      tradeDate: f[17] || getChinaTimeParts().dateStr
    };
  };

  const out = {};
  const spreads = {};
  FUTURES_MAP.forEach((item) => {
    const main = parseSinaLine(item.sina);
    const nf = pairMap[item.id];
    const near = parseSinaLine(nf.nearSina);
    const far = parseSinaLine(nf.farSina);

    if (main) {
      const change = main.price - main.prevSettle;
      const changePercent = main.prevSettle > 0 ? (change / main.prevSettle) * 100 : 0;
      out[item.id] = {
        id: item.id,
        symbol: item.sina,
        ...main,
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        source: "Sina Futures"
      };
    }

    if (near && far) {
      const diff = Number((near.price - far.price).toFixed(2));
      const diffPct = far.price > 0 ? Number(((diff / far.price) * 100).toFixed(2)) : 0;
      spreads[item.id] = {
        nearCode: nf.nearCode,
        farCode: nf.farCode,
        nearPrice: near.price,
        farPrice: far.price,
        nearFarSpread: diff,
        nearFarSpreadPct: diffPct,
        liveStructure: diff > 0 ? "back" : diff < 0 ? "contango" : "flat"
      };
    }
  });

  return { quotes: out, spreads };
}

async function refreshQuotes(force = false) {
  const now = Date.now();
  if (quotesCache.fetching) return quotesCache.fetching;
  if (!force && now - quotesCache.lastFetchMs < 30000 && Object.keys(quotesCache.data).length > 0) {
    return quotesCache;
  }

  quotesCache.fetching = (async () => {
    const merged = { ...quotesCache.data };
    const [emRes, sinaRes] = await Promise.allSettled([
      fetchEastmoneyQuotes(),
      fetchSinaQuotesAndSpreads()
    ]);

    const emData = emRes.status === "fulfilled" ? emRes.value : {};
    const sinaData = sinaRes.status === "fulfilled" ? sinaRes.value : { quotes: {}, spreads: {} };

    FUTURES_MAP.forEach((item) => {
      const qEm = emData[item.id];
      const qSina = sinaData.quotes[item.id];
      const sp = sinaData.spreads[item.id];

      // Prefer Sina when available (includes exact OI + tradeDate), fallback to Eastmoney
      let chosen = qSina || qEm || merged[item.id];
      if (qSina && qEm) {
        chosen = {
          ...qSina,
          openInterest: qSina.openInterest || qEm.openInterest,
          volume: qSina.volume || qEm.volume,
          source: "Sina + Eastmoney"
        };
      }
      if (chosen) {
        merged[item.id] = sp ? { ...chosen, ...sp } : chosen;
      }
    });

    quotesCache.data = merged;
    quotesCache.updatedAt = new Date().toISOString();
    quotesCache.lastFetchMs = Date.now();
    quotesCache.fetching = null;

    // Keep daily judgment synchronized with latest quotes
    rebuildDailyJudgment();
    return quotesCache;
  })();

  return quotesCache.fetching;
}

/* ==================== Live Multi-Sector China Commodity News ==================== */
const RSS_FEEDS = [
  {
    name: "黑色系快讯",
    url: "https://news.google.com/rss/search?q=%E8%9E%BA%E7%BA%B9%E9%92%A2+OR+%E9%93%81%E7%9F%BF%E7%9F%B3+OR+%E7%84%A6%E7%85%A4+OR+%E7%84%A6%E7%82%AD+OR+%E9%94%B0%E7%A1%85+%E6%9C%9F%E8%B4%A7+when:3d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    defaultSector: "ferrous"
  },
  {
    name: "有色系快讯",
    url: "https://news.google.com/rss/search?q=%E6%B2%AA%E9%93%9C+OR+%E6%B2%AA%E9%93%9D+OR+%E6%B0%A7%E5%8C%96%E9%93%9D+OR+%E7%A2%B3%E9%85%B8%E9%94%82+OR+%E6%B2%AA%E9%95%8D+OR+%E6%B2%AA%E9%94%8C+%E6%9C%9F%E8%B4%A7+when:3d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    defaultSector: "nonferrous"
  },
  {
    name: "贵金属快讯",
    url: "https://news.google.com/rss/search?q=%E6%B2%AA%E9%87%91+OR+%E9%BB%84%E9%87%91%E6%9C%9F%E8%B4%A7+OR+%E7%99%BD%E9%93%B6%E6%9C%9F%E8%B4%A7+OR+%E9%87%91%E9%93%B6%E6%AF%94+when:3d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    defaultSector: "precious"
  },
  {
    name: "能源化工快讯",
    url: "https://news.google.com/rss/search?q=%E5%8E%9F%E6%B2%B9+OR+%E7%94%B2%E9%86%87+OR+%E7%BA%AF%E7%A2%B1+OR+%E7%8E%BB%E7%92%83+OR+PTA+OR+%E6%A9%A1%E8%83%B6+%E6%9C%9F%E8%B4%A7+when:3d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    defaultSector: "energy"
  },
  {
    name: "农产品快讯",
    url: "https://news.google.com/rss/search?q=%E6%A3%95%E6%A6%88%E6%B2%B9+OR+%E8%B1%86%E7%B2%95+OR+%E8%B1%86%E6%B2%B9+OR+%E7%94%9F%E7%8C%AA+OR+%E7%8E%89%E7%B1%B3+OR+%E7%99%BD%E7%B3%96+OR+%E6%A3%89%E8%8A%B1+%E6%9C%9F%E8%B4%A7+when:3d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    defaultSector: "agri"
  }
];

function decodeXml(str) {
  return String(str || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

function extractTag(blk, tag) {
  const m = blk.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decodeXml(m[1]) : "";
}

function classifyIntel(title, summary, defaultSector) {
  const hay = `${title} ${summary}`.toLowerCase();
  const contracts = [];
  let sector = defaultSector;
  FUTURES_MAP.forEach((f) => {
    if (f.keywords.some((kw) => hay.includes(kw))) {
      contracts.push(f.id);
      if (contracts.length === 1) sector = f.sector;
    }
  });

  // Identify which of the 5 fundamental pillars is impacted
  let pillarTag = "综合基本面";
  if (/检修|限产|减产|停产|发运|开工率|产量|暴雨|干旱|飓风|矿山|复产|增产|通关/.test(hay)) pillarTag = "供给端";
  else if (/库存|去库|累库|仓单|交割|逼仓/.test(hay)) pillarTag = "库存与仓单";
  else if (/消费|订单|出口|旺季|淡季|冬储|腌腊|冷修|排产/.test(hay)) pillarTag = "需求端";
  else if (/成本|利润|加工费|tc|运费|汇率|关税|亏损|盈利/.test(hay)) pillarTag = "成本与利润";
  else if (/升水|贴水|基差|超预期|不及预期|正套|反套/.test(hay)) pillarTag = "升贴水/预期差";

  const bullRe = /大涨|飙升|暴涨|紧缺|去库|检修|限产|减产|停产|突破|新高|走强|看多|升水|超预期|抢货|短缺|拉涨|反弹|回暖|提涨|增储|收储/;
  const bearRe = /大跌|暴跌|重挫|累库|过剩|增产|复产|承压|亏损|下调|走弱|看空|贴水扩大|不及预期|疲软|提降|天量|抛压|淡季|萎缩/;
  let sentiment = "neutral";
  const hasBull = bullRe.test(hay);
  const hasBear = bearRe.test(hay);
  if (hasBull && !hasBear) sentiment = "bullish";
  else if (hasBear && !hasBull) sentiment = "bearish";
  else if (hasBull && hasBear) sentiment = hay.indexOf("涨") >= 0 && hay.indexOf("跌") < 0 ? "bullish" : "neutral";

  return { sector, sentiment, pillarTag, contracts: contracts.slice(0, 4) };
}

async function refreshNews(force = false) {
  const now = Date.now();
  if (newsCache.fetching) return newsCache.fetching;
  if (!force && now - newsCache.lastFetchMs < 5 * 60 * 1000 && newsCache.items.length > 0) {
    return newsCache;
  }

  newsCache.fetching = (async () => {
    const batches = await Promise.all(RSS_FEEDS.map(async (feed) => {
      try {
        const res = await fetchWithTimeout(feed.url, 7500);
        const xml = await res.text();
        const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
        const parsed = [];
        blocks.slice(0, 8).forEach((blk) => {
          let title = extractTag(blk, "title");
          if (!title) return;
          const dash = title.lastIndexOf(" - ");
          let source = extractTag(blk, "source") || feed.name;
          if (dash > 10 && title.length - dash < 36) {
            if (!extractTag(blk, "source")) source = title.slice(dash + 3).trim();
            title = title.slice(0, dash).trim();
          }
          const link = extractTag(blk, "link");
          const pubRaw = extractTag(blk, "pubDate");
          const pubDate = new Date(pubRaw || Date.now());
          const ts = Number.isNaN(pubDate.getTime()) ? Date.now() : pubDate.getTime();
          const cn = getChinaTimeParts(new Date(ts));
          const desc = extractTag(blk, "description");
          const summary = desc && desc.length > 24 && desc !== title
            ? desc.slice(0, 210) + (desc.length > 210 ? "..." : "")
            : `来自 ${source} 的最新中国期货基本面动态，点击原文查看详情。`;
          const meta = classifyIntel(title, summary, feed.defaultSector);
          parsed.push({
            id: "live-" + Buffer.from(title).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) + "-" + ts,
            ts,
            date: cn.dateStr,
            time: cn.timeStr.slice(0, 5),
            source,
            title,
            summary,
            link,
            isLive: true,
            ...meta
          });
        });
        return parsed;
      } catch (_) {
        return [];
      }
    }));

    const seen = new Set();
    const deduped = [];
    batches.flat().sort((a, b) => b.ts - a.ts).forEach((it) => {
      const key = it.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, "").slice(0, 26);
      if (!key || seen.has(key)) return;
      seen.add(key);
      deduped.push(it);
    });

    if (deduped.length) newsCache.items = deduped.slice(0, 36);
    newsCache.updatedAt = new Date().toISOString();
    newsCache.lastFetchMs = Date.now();
    newsCache.fetching = null;

    rebuildDailyJudgment();
    return newsCache;
  })();

  return newsCache.fetching;
}

/* ==================== Daily Automated Fundamental Judgment Engine ==================== */
function classifySignal(score) {
  if (score >= 72) return { key: "strong_bull", group: "bull", label: "强烈看多", short: "强多", badgeClass: "sig-strong-bull" };
  if (score >= 60) return { key: "bull", group: "bull", label: "基本面偏多", short: "偏多", badgeClass: "sig-bull" };
  if (score >= 48) return { key: "neutral", group: "neutral", label: "中性震荡", short: "震荡", badgeClass: "sig-neutral" };
  if (score >= 38) return { key: "bear", group: "bear", label: "基本面偏空", short: "偏空", badgeClass: "sig-bear" };
  return { key: "strong_bear", group: "bear", label: "强烈看空", short: "强空", badgeClass: "sig-strong-bear" };
}

function clamp(v, lo = 12, hi = 95) {
  return Math.max(lo, Math.min(hi, Math.round(v)));
}

function rebuildDailyJudgment() {
  const cn = getChinaTimeParts();
  const quotes = quotesCache.data || {};
  const news = newsCache.items || [];

  const contractsOut = {};
  const rankedList = [];
  const sectorStats = {};

  FUTURES_MAP.forEach((item) => {
    const q = quotes[item.id];
    const matchedNews = news.filter((n) => n.contracts && n.contracts.includes(item.id)).slice(0, 4);

    // 1. Live Tape & Momentum Adjustment (-6 to +6)
    let tapeDelta = 0;
    let intradayTag = "行情待同步";
    if (q) {
      const chg = q.changePercent || 0;
      tapeDelta = Math.max(-6, Math.min(6, Math.round(chg * 2.1)));
      if (chg >= 2.0) intradayTag = `放量强攻 (+${chg.toFixed(2)}%)`;
      else if (chg >= 0.7) intradayTag = `偏强上行 (+${chg.toFixed(2)}%)`;
      else if (chg <= -2.0) intradayTag = `放量下挫 (${chg.toFixed(2)}%)`;
      else if (chg <= -0.7) intradayTag = `承压走弱 (${chg.toFixed(2)}%)`;
      else intradayTag = `窄幅震荡 (${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%)`;
    }

    // 2. Live Near-Far Curve Structure Adjustment (-5 to +5)
    let curveDelta = 0;
    let curveNote = "参考基准期限结构";
    if (q && q.liveStructure) {
      if (item.sector === "precious") {
        curveNote = `${q.nearCode}-${q.farCode} 价差 ${q.nearFarSpread} (正常利率贴现)`;
      } else if (q.liveStructure === "back") {
        curveDelta = q.nearFarSpreadPct >= 2 ? 4 : 2;
        curveNote = `实盘近强远弱 Back (${q.nearCode}-${q.farCode}=${q.nearFarSpread > 0 ? "+" : ""}${q.nearFarSpread})`;
      } else if (q.liveStructure === "contango") {
        curveDelta = q.nearFarSpreadPct <= -2 ? -4 : -2;
        curveNote = `实盘近弱远强 Contango (${q.nearCode}-${q.farCode}=${q.nearFarSpread})`;
      }
    }

    // 3. Live 72h News Catalyst Adjustment (-7 to +7)
    let newsDelta = 0;
    matchedNews.forEach((n) => {
      if (n.sentiment === "bullish") newsDelta += 2.5;
      else if (n.sentiment === "bearish") newsDelta -= 2.5;
    });
    newsDelta = Math.max(-7, Math.min(7, Math.round(newsDelta)));

    // 4. Live Cost Safety Buffer Check
    let costNote = "";
    if (q && item.breakeven > 0) {
      const ratio = ((q.price - item.breakeven) / item.breakeven) * 100;
      if (ratio <= 2) costNote = `现价逼近/跌破成本支撑锚 (${item.breakeven})，下方抗跌`;
      else if (ratio >= 25) costNote = `现价大幅高于成本锚 (+${ratio.toFixed(0)}%)，谨防高估值回调`;
      else costNote = `现价位于成本锚上方 +${ratio.toFixed(1)}% 合理区间`;
    }

    const totalDelta = tapeDelta + curveDelta + newsDelta;
    const liveScore = clamp(item.baseScore + totalDelta);
    const liveTightness = clamp(item.baseTight + Math.round(curveDelta * 1.4 + newsDelta * 0.6));
    const signal = classifySignal(liveScore);

    // Synthesize Today's Dated Fundamental Summary
    const topNews = matchedNews[0];
    const catalystSentence = topNews
      ? `今日重点催化 [${topNews.pillarTag}]：「${topNews.title}」。`
      : "近72小时暂无突发极端新闻冲击，维持核心基本面逻辑主导。";

    const priceSentence = q
      ? `${cn.dateStr} ${cn.sessionLabel}：最新价 ${q.price} (${q.changePercent >= 0 ? "+" : ""}${q.changePercent.toFixed(2)}%)，${curveNote}；${costNote}。`
      : `${cn.dateStr} 投研快照：等待实盘开盘同步，当前由五项基本面基准主导。`;

    const actionAdvice = signal.key === "strong_bull"
      ? "多头趋势与基本面共振，建议顺势回调低吸或参与近远月正套。"
      : signal.key === "bull"
        ? "基本面边际偏强，逢支撑位轻仓试多为主，关注交割月基差修复。"
        : signal.key === "strong_bear"
          ? "高库存/供给宽松压力突出，建议逢反弹高空或作为产业链对冲空配。"
          : signal.key === "bear"
            ? "上方套保与累库承压，反弹沽空思路为主，贴近成本线及时止盈。"
            : "多空驱动交织，建议围绕成本线与压力区高抛低吸，等待库存拐点。";

    const entry = {
      id: item.id,
      name: item.name,
      sector: item.sector,
      sectorLabel: SECTOR_LABELS[item.sector],
      reportDate: cn.dateStr,
      sessionLabel: cn.sessionLabel,
      baseScore: item.baseScore,
      liveScore,
      scoreDelta: liveScore - item.baseScore,
      liveTightness,
      signal,
      tapeDelta,
      curveDelta,
      newsDelta,
      intradayTag,
      curveNote,
      costNote,
      dailySummary: `${priceSentence}${catalystSentence}综合评定「${signal.label} (${liveScore}分)」，${actionAdvice}`,
      catalysts: matchedNews.map((n) => ({
        title: n.title,
        sentiment: n.sentiment,
        pillarTag: n.pillarTag,
        source: n.source,
        date: n.date,
        time: n.time,
        link: n.link
      }))
    };

    contractsOut[item.id] = entry;
    rankedList.push({ ...entry, price: q ? q.price : null, changePercent: q ? q.changePercent : 0 });

    if (!sectorStats[item.sector]) {
      sectorStats[item.sector] = { id: item.sector, label: SECTOR_LABELS[item.sector], scoreSum: 0, chgSum: 0, count: 0, bull: 0, bear: 0 };
    }
    const ss = sectorStats[item.sector];
    ss.scoreSum += liveScore;
    ss.chgSum += q ? q.changePercent : 0;
    ss.count += 1;
    if (signal.group === "bull") ss.bull += 1;
    if (signal.group === "bear") ss.bear += 1;
  });

  const sortedByScore = [...rankedList].sort((a, b) => b.liveScore - a.liveScore);
  const topLongs = sortedByScore.slice(0, 4);
  const topShorts = [...sortedByScore].reverse().slice(0, 4);
  const deliveryAlerts = [...rankedList].sort((a, b) => b.liveTightness - a.liveTightness).slice(0, 3);

  const bullTotal = rankedList.filter((x) => x.signal.group === "bull").length;
  const bearTotal = rankedList.filter((x) => x.signal.group === "bear").length;
  const neutralTotal = rankedList.length - bullTotal - bearTotal;

  const sectorSummary = Object.values(sectorStats).map((s) => ({
    id: s.id,
    label: s.label,
    avgScore: Math.round(s.scoreSum / (s.count || 1)),
    avgChangePct: Number((s.chgSum / (s.count || 1)).toFixed(2)),
    bull: s.bull,
    bear: s.bear,
    count: s.count
  })).sort((a, b) => b.avgScore - a.avgScore);

  const leadSector = sectorSummary[0];
  const weakSector = sectorSummary[sectorSummary.length - 1];
  const headlineBrief = `${cn.dateStr} ${cn.sessionLabel}：全市场 30 品种呈「${bullTotal}多 / ${neutralTotal}震 / ${bearTotal}空」格局。领涨强驱动板块为${leadSector.label}（均分${leadSector.avgScore}），弱势承压板块为${weakSector.label}（均分${weakSector.avgScore}）。多头焦点：${topLongs.slice(0, 3).map((x) => `${x.name}(${x.liveScore})`).join("、")}；空头焦点：${topShorts.slice(0, 3).map((x) => `${x.name}(${x.liveScore})`).join("、")}。`;

  judgmentCache.report = {
    reportDate: cn.dateStr,
    reportTime: cn.timeStr,
    sessionLabel: cn.sessionLabel,
    updatedAt: new Date().toISOString(),
    quotesCount: Object.keys(quotes).length,
    liveNewsCount: news.length,
    marketMood: { bull: bullTotal, neutral: neutralTotal, bear: bearTotal },
    headlineBrief,
    aiBrief: judgmentCache.aiDate === cn.dateStr ? judgmentCache.aiSummary : null,
    topLongs,
    topShorts,
    deliveryAlerts,
    sectorSummary,
    contracts: contractsOut
  };
  judgmentCache.generatedDate = cn.dateStr;
  judgmentCache.updatedAt = judgmentCache.report.updatedAt;
  return judgmentCache.report;
}

/* Optional Daily Gemini AI Market Commentary (if GEMINI_API_KEY env var is set on Render) */
async function maybeGenerateAiBrief() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !judgmentCache.report) return;
  const cn = getChinaTimeParts();
  if (judgmentCache.aiDate === cn.dateStr && judgmentCache.aiSummary) return;

  try {
    const r = judgmentCache.report;
    const prompt = `你是资深中国商品期货首席基本面研究员。基于今日(${r.reportDate} ${r.sessionLabel})实时数据，用120字以内给出精炼的今日全市场多空主线与跨品种对冲建议：\n` +
      `多空分布：${r.marketMood.bull}多/${r.marketMood.neutral}震/${r.marketMood.bear}空\n` +
      `最强多头：${r.topLongs.map((x) => `${x.name}(${x.liveScore}分,涨跌${x.changePercent}%)`).join("、")}\n` +
      `最强空头：${r.topShorts.map((x) => `${x.name}(${x.liveScore}分,涨跌${x.changePercent}%)`).join("、")}\n` +
      `交割偏紧：${r.deliveryAlerts.map((x) => `${x.name}(紧缺${x.liveTightness})`).join("、")}`;

    const postRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    if (!postRes.ok) return;
    const data = await postRes.json();
    const txt = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
    if (txt) {
      judgmentCache.aiSummary = txt.trim();
      judgmentCache.aiDate = cn.dateStr;
      judgmentCache.report.aiBrief = judgmentCache.aiSummary;
    }
  } catch (_) {}
}

/* ==================== HTTP Router ==================== */
function sendJson(res, status, obj) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(obj));
}

function serveStatic(reqPath, res) {
  const clean = reqPath === "/" ? "/index.html" : reqPath;
  const resolved = path.normalize(path.join(ROOT_DIR, clean));
  if (!resolved.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(resolved, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 Not Found");
    }
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const parsed = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (parsed.pathname === "/api/health") {
      const cn = getChinaTimeParts();
      return sendJson(res, 200, {
        status: "ok",
        chinaTime: `${cn.dateStr} ${cn.timeStr} CST`,
        session: cn.sessionLabel,
        quotesLoaded: Object.keys(quotesCache.data).length,
        newsLoaded: newsCache.items.length,
        dailyJudgmentDate: judgmentCache.generatedDate,
        uptimeSec: Math.round(process.uptime())
      });
    }

    if (parsed.pathname === "/api/quotes") {
      const force = parsed.searchParams.get("refresh") === "1";
      const result = await refreshQuotes(force);
      return sendJson(res, 200, {
        updatedAt: result.updatedAt,
        count: Object.keys(result.data).length,
        quotes: result.data
      });
    }

    if (parsed.pathname === "/api/news") {
      const force = parsed.searchParams.get("refresh") === "1";
      const result = await refreshNews(force);
      return sendJson(res, 200, {
        updatedAt: result.updatedAt,
        count: result.items.length,
        items: result.items
      });
    }

    if (parsed.pathname === "/api/daily-judgment") {
      const force = parsed.searchParams.get("refresh") === "1";
      if (force || !judgmentCache.report || judgmentCache.generatedDate !== getChinaTimeParts().dateStr) {
        await Promise.allSettled([refreshQuotes(force), refreshNews(force)]);
        rebuildDailyJudgment();
        maybeGenerateAiBrief().catch(() => {});
      }
      return sendJson(res, 200, judgmentCache.report);
    }

    serveStatic(parsed.pathname, res);
  } catch (err) {
    sendJson(res, 500, { error: err.message || "Internal Server Error" });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  const cn = getChinaTimeParts();
  console.log(`[China-Futures-Chain Server] Listening on http://0.0.0.0:${PORT} (${cn.dateStr} ${cn.timeStr} CST)`);
  // Initial warm-up on startup
  Promise.allSettled([refreshQuotes(true), refreshNews(true)]).then(() => {
    rebuildDailyJudgment();
    maybeGenerateAiBrief().catch(() => {});
  });
  // Live quotes auto-refresh every 45s
  setInterval(() => refreshQuotes(true).catch(() => {}), 45 * 1000);
  // Live commodity news & daily judgment auto-refresh every 10 minutes
  setInterval(() => {
    refreshNews(true).then(() => {
      rebuildDailyJudgment();
      maybeGenerateAiBrief().catch(() => {});
    }).catch(() => {});
  }, 10 * 60 * 1000);
});
