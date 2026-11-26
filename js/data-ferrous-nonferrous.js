/* ==========================================================================
   China Futures Visual Chain — Core Fundamental Data (Part 1: 15 Contracts)
   Sectors: 黑色系 (Ferrous: 6) + 有色系 (Non-Ferrous: 7) + 贵金属系 (Precious: 2)
   Snapshot Date: 2026-11-26 | Main Contracts: 2701 / 2702
   ========================================================================== */
window.FuturesChainData = window.FuturesChainData || {
  snapshotDate: "2026-11-26",
  sectors: [
    { id: "ferrous", label: "黑色系", short: "黑色", color: "#f97316", desc: "铁矿/双焦 → 焦化/合金 → 螺纹/热卷" },
    { id: "nonferrous", label: "有色系", short: "有色", color: "#38bdf8", desc: "氧化铝/碳酸锂 → 铜铝锌镍 → 不锈钢/新能源" },
    { id: "precious", label: "贵金属系", short: "贵金属", color: "#eab308", desc: "实际利率/央行购金 → 沪金/沪银/金银比" },
    { id: "energy", label: "能源化工系", short: "能化", color: "#a78bfa", desc: "原油/甲醇 → 燃料油/PTA/纯碱 → 聚丙烯/玻璃/橡胶" },
    { id: "agri", label: "农产品系", short: "农产品", color: "#22c55e", desc: "玉米/棕榈油 → 豆粕 → 豆油/生猪/白糖/棉花" }
  ],
  contracts: [],
  links: [],
  spreads: [],
  dailyIntel: []
};

window.FuturesChainData.contracts.push(
  /* ==================== 黑色系 (6) ==================== */
  {
    id: "i",
    name: "铁矿石",
    code: "I2701",
    sinaSymbol: "nf_I0",
    exchange: "DCE",
    exchangeName: "大商所",
    sector: "ferrous",
    sectorLabel: "黑色系",
    tier: "upstream",
    subRole: "高炉炼铁核心原料 · 澳巴海运定价",
    unit: "元/吨",
    price: 782,
    spotPrice: 808,
    spotBenchmark: "青岛港PB粉折盘面",
    changePct: 0.90,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight_balance",
      label: "紧平衡 (高库低集中)",
      score: 54,
      deliverableSupply: "港口总库存偏高，但中高品主流澳粉（PB/麦克粉）结构性占比回落，交割品流动性充足但主流品溢价具韧性。",
      warehouseReceipts: "3100手 (31万吨)",
      openInterest: "41.8万手",
      virtualToRealRatio: 13.5,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 46,
        headline: "澳巴年末冲量发运回升，国产矿受冬季环保小幅扰动",
        output: "澳巴周度发运 2740 万吨 (环比 +4.2%)",
        utilization: "国内矿山产能利用率 63.8% (北方低温微降)",
        importFlow: "45港周度到港量 2480 万吨，年末冲财报发运维持偏高",
        disruptions: "澳洲飓风季尚未全面爆发，短期供应约束有限；几内亚西芒杜增量预期压制远月。"
      },
      demand: {
        score: 64,
        headline: "日均铁水产量维持235万吨高位，12月钢厂冬储补库启动",
        consumption: "45港日均疏港量 322 万吨 (环比 +1.8%)",
        downstreamOrders: "钢厂进口矿可用天数 19.5 天，处于历年偏低水平",
        downstreamUtil: "247家钢厂高炉盈利率 58%，暂未出现大面积主动减产",
        seasonality: "11月底至12月为钢厂传统春节前原料冬储补库窗口，刚性采购对近月形成阶段性托底。"
      },
      inventory: {
        score: 38,
        headline: "45港港口库存仍居高位，压制上方空间但去化迹象初现",
        level: "45港总库存 1.49 亿吨 (环比 -85万吨)",
        velocity: "连续两周小幅去库，疏港高于到港",
        yoyCompare: "较去年同期 +11.4%，高于5年同期均值约 13%",
        deliverableNote: "绝对库存高位限制逼仓可能，但钢厂厂内低库存形成“港高厂低”结构。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [128, 139, 144, 146, 148, 149, 151, 153, 152, 151, 149, null],
          lastYear: [126, 136, 142, 145, 147, 148, 150, 152, 149, 152, 134, 138],
          avg5y: [125, 133, 137, 135, 132, 130, 132, 134, 133, 135, 132, 134]
        }
      },
      costMargin: {
        score: 62,
        headline: "非主流矿85-90美元成本线强支撑，汇率贬值抬高人民币折算价",
        rawMaterial: "四大矿山CIF现金成本 35-45 美元，非主流矿边际成本 85-90 美元/吨",
        freightFx: "西澳至青岛海运费稳在 9.8 美元/吨；美元兑人民币偏强抬升国内折盘面成本约 18 元/吨",
        margin: "钢厂高炉即期微利 +80 元/吨，尚能承受当前矿价",
        incentive: "矿价跌至95美元下方非主流矿发运即收缩；钢厂低原料库存下存在逢低补库动力。",
        breakeven: 735
      },
      expectationGap: {
        score: 60,
        headline: "钢厂铁水韧性超市场预期，近月冬储逻辑强于远月过剩预期",
        actualVsExpected: "市场原预期11月钢厂大幅检修拖累铁水跌破228万吨，实际铁水稳在235万吨，现实紧于预期。",
        curveFocus: "近月主导 (2701)",
        curveFocusType: "near",
        detail: "近月2701受冬储补库与贴水修复支撑；远月2705/2709面临2027年新增海外矿山投产压制。"
      }
    },
    basisCurve: {
      basis: 26,
      basisPct: 3.22,
      structure: "back",
      structureLabel: "期货贴水 · Back结构",
      nearFarSpread: 28,
      spreadDesc: "I2701 - I2705 = +28 元/吨",
      convergenceLogic: "主力贴水现货26元/吨，在铁水未崩塌前，临近交割月易走贴水收敛行情。",
      curvePoints: [
        { label: "现货折盘", price: 808 },
        { label: "2612", price: 794 },
        { label: "2701", price: 782 },
        { label: "2705", price: 754 },
        { label: "2709", price: 732 }
      ]
    },
    extended: {
      macroDriver: "国内财政化债与基建预期支撑黑色估值，美元走势影响大宗计价",
      positioning: "外资与多头套保席位逢低增持2701，2705空头套保压力较大",
      importExportParity: "港口现货落地利润微幅倒挂，贸易商挺价意愿较强",
      valuationScore: 60,
      driveScore: 56,
      strategy: "短线偏多看待或参与 I2701-I2705 正套，上方820-830压力区不追高。",
      bullFactors: ["钢厂原料库存低位，12月冬储补库刚性需求释放", "日均铁水维持235万吨高位，疏港表现强于预期", "主力贴水现货+Back结构提供安全边际"],
      bearFactors: ["45港绝对库存接近1.5亿吨历史高位，压制上方弹性", "2027年海外新矿投产周期压制远月估值"],
      falsification: "若钢厂利润转负引发高炉集中检修、铁水快速跌破225万吨，则正套与偏多逻辑失效。"
    },
    tags: ["冬储补库", "高港库低厂库", "Back结构", "近强远弱"]
  },
  {
    id: "jm",
    name: "焦煤",
    code: "JM2701",
    sinaSymbol: "nf_JM0",
    exchange: "DCE",
    exchangeName: "大商所",
    sector: "ferrous",
    sectorLabel: "黑色系",
    tier: "upstream",
    subRole: "炼焦配煤源头 · 蒙煤与国内主焦定价",
    unit: "元/吨",
    price: 1328,
    spotPrice: 1310,
    spotBenchmark: "甘其毛都蒙5#精煤折盘面",
    changePct: -0.82,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "loose",
      label: "货源偏松",
      score: 34,
      deliverableSupply: "蒙煤口岸监管区库存高企，且山西大矿复产后交割煤源充裕，仓单套保抛压明显。",
      warehouseReceipts: "2200手 (13.2万吨)",
      openInterest: "26.5万手",
      virtualToRealRatio: 12.0,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 32,
        headline: "国内主产区产能释放充分，蒙煤通关高位维持宽松供给",
        output: "523家样本煤矿原煤日产 199 万吨 (同比 +5.8%)",
        utilization: "洗煤厂开工率 68.4% (处年内偏高区间)",
        importFlow: "甘其毛都日均通关维持 1100 车以上，俄煤/澳煤补充稳定",
        disruptions: "冬季保供背景下安全检查常态化，暂未出现大规模停产限产。"
      },
      demand: {
        score: 44,
        headline: "焦企利润微薄按需采购，下游投机补库意愿不足",
        consumption: "独立焦企与钢厂焦化日耗合计 112 万吨 (环比持平)",
        downstreamOrders: "焦化厂焦煤库存可用天数 11.2 天，随采随用为主",
        downstreamUtil: "焦炭提涨受阻，焦企压价原料以保加工利润",
        seasonality: "虽临近冬储窗口，但因上游供应充裕，下游不急于高价抢货。"
      },
      inventory: {
        score: 30,
        headline: "口岸与煤矿双高库存，上游累库压力尚未有效出清",
        level: "全社会焦煤总库存 2860 万吨 (口岸+矿山持续偏高)",
        velocity: "周度累库 +42 万吨，上游煤矿出货节奏偏慢",
        yoyCompare: "较去年同期 +18.6%，高于5年均值 15.2%",
        deliverableNote: "甘其毛都口岸堆积大量可交割蒙煤，临近交割期现商正套平仓及交割意愿偏强。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [2480, 2320, 2290, 2380, 2450, 2510, 2590, 2680, 2740, 2810, 2860, null],
          lastYear: [2350, 2210, 2180, 2240, 2290, 2310, 2340, 2360, 2390, 2400, 2410, 2460],
          avg5y: [2420, 2280, 2240, 2280, 2320, 2350, 2380, 2400, 2430, 2460, 2480, 2520]
        }
      },
      costMargin: {
        score: 52,
        headline: "山西高成本矿接近盈亏线，但蒙煤进口仍具利润空间",
        rawMaterial: "蒙5#口岸短盘运费回落，坑口竞拍流拍率上升",
        freightFx: "中蒙短盘运费 95 元/吨 (处偏低位)，进口成本优势犹存",
        margin: "国内主力煤矿吨煤毛利收窄至 180-240 元，配煤洗煤厂微亏",
        incentive: "高成本洗煤厂开工受抑，但大矿保量增收思维下减产动力仍不足。",
        breakeven: 1220
      },
      expectationGap: {
        score: 38,
        headline: "蒙煤通关超预期顺畅，现实供应宽松度高于市场此前预期",
        actualVsExpected: "市场原预期冬季寒潮及年末安监将收紧焦煤供应，实际产地稳产且蒙煤持续高位通关，现实比预期更松。",
        curveFocus: "近月承压 (2701)",
        curveFocusType: "near",
        detail: "2701合约升水口岸现货且临近交割月，期现回归压力集中体现在近月合约。"
      }
    },
    basisCurve: {
      basis: -18,
      basisPct: -1.37,
      structure: "contango",
      structureLabel: "期货升水 · Contango结构",
      nearFarSpread: -42,
      spreadDesc: "JM2701 - JM2705 = -42 元/吨",
      convergenceLogic: "期货升水现货18元且呈Contango结构，临近交割月利于空头交货，盘面承压向现货靠拢。",
      curvePoints: [
        { label: "现货折盘", price: 1310 },
        { label: "2612", price: 1320 },
        { label: "2701", price: 1328 },
        { label: "2705", price: 1370 },
        { label: "2709", price: 1395 }
      ]
    },
    extended: {
      macroDriver: "作为黑色系高弹性品种，易受宏观情绪反弹带动但基本面承压最重",
      positioning: "产业卖保盘在1380上方套保积极，前20席位维持净空",
      importExportParity: "澳洲峰景焦煤CFR倒挂，但蒙煤与俄煤性价比极高持续涌入",
      valuationScore: 48,
      driveScore: 36,
      strategy: "逢反弹高空 JM2701，或作为黑色系对冲空头配置（如多热卷/螺纹空焦煤，做扩钢厂盘面利润）。",
      bullFactors: ["若山西突发严厉安监或寒潮中断蒙煤运输，低价区易现脉冲反弹", "1220附近接近部分洗煤与高成本矿底线"],
      bearFactors: ["口岸+矿山双高库存叠加通关高位，交割月货源明显偏松", "期货升水现货+Contango结构，期现回归利空近月", "焦企微利限制原料追涨空间"],
      falsification: "若主产区突发重大矿难引发停产整顿，或蒙煤日均通关跌破700车，则偏空逻辑反转。"
    },
    tags: ["口岸高库存", "期货升水", "供给偏松", "黑色空配"]
  },
  {
    id: "j",
    name: "焦炭",
    code: "J2701",
    sinaSymbol: "nf_J0",
    exchange: "DCE",
    exchangeName: "大商所",
    sector: "ferrous",
    sectorLabel: "黑色系",
    tier: "midstream",
    subRole: "炼铁还原剂 · 煤焦钢利润枢纽",
    unit: "元/吨",
    price: 1945,
    spotPrice: 1920,
    spotBenchmark: "日照港准一级湿熄折盘面",
    changePct: -0.46,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "loose",
      label: "偏松 (成本让利)",
      score: 42,
      deliverableSupply: "港口贸易焦库存充裕，焦企入炉煤成本下移使交割套保利润打开，货源偏宽。",
      warehouseReceipts: "880手 (8.8万吨)",
      openInterest: "3.4万手",
      virtualToRealRatio: 3.9,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 44,
        headline: "入炉煤让利修复吨焦利润，焦企开工维持中高位",
        output: "全样本焦企日均产量 114.6 万吨 (环比 +0.8%)",
        utilization: "独立焦企产能利用率 74.2%",
        importFlow: "内循环为主，出口占比小 (约占产量2%)",
        disruptions: "环保二级预警偶有阶段性限产，但整体供给弹性充足。"
      },
      demand: {
        score: 54,
        headline: "铁水刚需稳定但钢厂焦炭库存尚可，提涨空间受限",
        consumption: "高炉日耗稳定对应 235 万吨铁水",
        downstreamOrders: "钢厂焦炭可用天数 11.8 天，按需采购为主",
        downstreamUtil: "钢厂成材利润偏薄，对焦炭有压价降本诉求",
        seasonality: "12月钢厂适度冬储补库，但难以支撑多轮连续提涨。"
      },
      inventory: {
        score: 48,
        headline: "全链库存中性略增，港口贸易库存积压压制盘面",
        level: "全链总库存 895 万吨 (焦企+港口+钢厂)",
        velocity: "周度小幅累库 +12 万吨",
        yoyCompare: "较去年同期 +4.2%，接近5年均值",
        deliverableNote: "港口准一级焦货源充足，临近交割不存在逼仓基础。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [920, 960, 910, 860, 845, 855, 870, 860, 875, 883, 895, null],
          lastYear: [940, 980, 920, 875, 850, 840, 850, 845, 852, 855, 859, 890],
          avg5y: [950, 990, 940, 895, 870, 865, 875, 880, 885, 890, 895, 920]
        }
      },
      costMargin: {
        score: 45,
        headline: "焦煤走弱打开焦化利润，成本坍塌风险拖累焦炭估值",
        rawMaterial: "1.33吨焦煤成本随蒙煤下移，化产副产品收益尚可",
        freightFx: "汽运火运运费平稳，无显著运力瓶颈",
        margin: "全国平均吨焦盈利 +55 元/吨，山西焦企盈利修复",
        incentive: "盈利状态下焦企倾向保持高开工，供给难以主动收缩。",
        breakeven: 1860
      },
      expectationGap: {
        score: 43,
        headline: "市场原博弈冬储提涨两轮，实际面临钢厂提降博弈",
        actualVsExpected: "焦煤弱势导致成本支撑下移，现货提涨落地困难，实际格局弱于前期乐观预期。",
        curveFocus: "近月承压 (2701)",
        curveFocusType: "near",
        detail: "2701合约升水港口现货25元，成本松动叠加交割期临近令近月承压。"
      }
    },
    basisCurve: {
      basis: -25,
      basisPct: -1.30,
      structure: "contango",
      structureLabel: "期货升水 · 弱Contango",
      nearFarSpread: -40,
      spreadDesc: "J2701 - J2705 = -40 元/吨",
      convergenceLogic: "期货升水港口现货25元，期现套利盘锁定交割利润压制盘面反弹高度。",
      curvePoints: [
        { label: "现货折盘", price: 1920 },
        { label: "2612", price: 1935 },
        { label: "2701", price: 1945 },
        { label: "2705", price: 1985 },
        { label: "2709", price: 2010 }
      ]
    },
    extended: {
      macroDriver: "跟随黑色成材与煤炭情绪波动，自身流动性相对焦煤偏低",
      positioning: "焦化企业卖保盘逢高锁利，资金博弈焦炭/焦煤比值修复",
      importExportParity: "焦炭出口利润平淡，内需定价主导",
      valuationScore: 46,
      driveScore: 44,
      strategy: "单边偏空震荡对待；套利可关注做多焦化利润（多J空JM）对冲原料过剩。",
      bullFactors: ["铁水产量尚未大幅下滑，刚需仍有承接", "焦炭整体库存压力显著小于焦煤"],
      bearFactors: ["上游焦煤偏松导致成本下移，拖累焦炭定价中枢", "期货升水港口现货，面临交割回归压力", "吨焦盈利状态下焦企缺乏减产动力"],
      falsification: "若环保限产大面积落地导致焦炭产量骤降，或焦煤强势反弹，则偏空观点失效。"
    },
    tags: ["焦化微利", "期货升水", "成本下移", "做多焦化比"]
  },
  {
    id: "sm",
    name: "锰硅",
    code: "SM2701",
    sinaSymbol: "nf_SM0",
    exchange: "CZCE",
    exchangeName: "郑商所",
    sector: "ferrous",
    sectorLabel: "黑色系",
    tier: "midstream",
    subRole: "炼钢脱氧合金 · 锰矿与电价双驱动",
    unit: "元/吨",
    price: 6280,
    spotPrice: 6120,
    spotBenchmark: "内蒙古6517硅锰现货出厂",
    changePct: -0.63,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "surplus",
      label: "仓单天量 · 极度偏松",
      score: 22,
      deliverableSupply: "郑商所锰硅注册仓单与有效预报合计处于历史极高水位，临近交割货源极度充裕。",
      warehouseReceipts: "9.8万张 (49万吨)",
      openInterest: "34.2万手",
      virtualToRealRatio: 3.5,
      squeezeRisk: "极低"
    },
    pillars: {
      supply: {
        score: 34,
        headline: "内蒙宁夏大厂保持高开工，周度产量持续高于钢厂需求",
        output: "周度产量 19.8 万吨 (环比 +1.5%)",
        utilization: "内蒙产区开工率 78%，南方桂滇因枯水期电价高小幅减产",
        importFlow: "港口锰矿发运恢复正常，澳矿替代路径成熟，矿端不再短缺",
        disruptions: "北方电价相对稳定，大炉子成本优势下主动减产意愿极低。"
      },
      demand: {
        score: 46,
        headline: "五大钢材周度锰硅需求平稳，钢招压价明显",
        consumption: "五大钢材周度需求 12.6 万吨 (环比 -0.8%)",
        downstreamOrders: "主流大钢厂12月招标价环比小降 50-80 元/吨",
        downstreamUtil: "螺纹钢冬季需求趋弱，合金补库节奏谨慎",
        seasonality: "12月钢厂冬储招标量虽有小幅增量，但远不足以消化天量仓单。"
      },
      inventory: {
        score: 20,
        headline: "交易所仓单叠加厂库创历史新高，去库举步维艰",
        level: "63家样本厂库 + 交易所仓单合计超 72 万吨",
        velocity: "周度继续累库 +1.4 万吨",
        yoyCompare: "较去年同期 +48.5%，处5年历史 95% 极高分位",
        deliverableNote: "近50万吨注册仓单压在盘面，任何期价升水都会吸引期现商无风险交货。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [41, 44, 48, 52, 55, 58, 61, 64, 67, 70, 72, null],
          lastYear: [34, 36, 38, 39, 41, 42, 43, 45, 46, 47, 48.5, 49],
          avg5y: [31, 33, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45]
        }
      },
      costMargin: {
        score: 54,
        headline: "南非半碳酸锰矿企稳托底成本，但内蒙产区仍有套保利润",
        rawMaterial: "天津港加蓬/南非锰矿企稳，化工焦价格随焦炭走弱",
        freightFx: "海运费稳定，美元走强小幅抬升进口锰矿折算成本",
        margin: "内蒙即期现金利润约 +90 元/吨；宁夏亏损 -80 元/吨",
        incentive: "内蒙低电价大厂仍有盈利+盘面升水套保空间，出清速度慢。",
        breakeven: 6020
      },
      expectationGap: {
        score: 32,
        headline: "澳矿复运进度快于预期，供给过剩现实持续兑现",
        actualVsExpected: "市场此前期待南方枯水期减产带动去库，但北方增量完全覆盖南方减量，格局比预期更松。",
        curveFocus: "近月承压 (2701)",
        curveFocusType: "near",
        detail: "天量仓单+期货升水160元，2701合约临近交割月面临严峻的实盘接货考验。"
      }
    },
    basisCurve: {
      basis: -160,
      basisPct: -2.61,
      structure: "contango",
      structureLabel: "期货深升水 · Contango",
      nearFarSpread: -90,
      spreadDesc: "SM2701 - SM2705 = -90 元/吨",
      convergenceLogic: "期货升水现货160元，期现正套盘大量注册仓单锁定利润，临近交割月期价大概率向现货成本回归。",
      curvePoints: [
        { label: "内蒙现货", price: 6120 },
        { label: "2612", price: 6220 },
        { label: "2701", price: 6280 },
        { label: "2705", price: 6370 },
        { label: "2709", price: 6430 }
      ]
    },
    extended: {
      macroDriver: "高度受高耗能产区电价政策与海外锰矿供应链事件影响",
      positioning: "产融期现商套保空单席位集中，产业空头主导盘面",
      importExportParity: "进口锰矿库存回升至600万吨以上，矿端溢价持续回吐",
      valuationScore: 42,
      driveScore: 30,
      strategy: "逢高沽空 SM2701 或参与反套（空2701多2705），下方接近内蒙现金成本6000附近止盈。",
      bullFactors: ["若南非/加蓬锰矿发运突发不可抗力或主产区能耗双控加码，将引爆成本交易"],
      bearFactors: ["天量仓单近50万吨压顶，交割月货源极度过剩", "期货深升水现货160元，提供极佳卖保赔率", "内蒙大厂仍有利润，供给难以快速出清"],
      falsification: "若港口锰矿价格单月暴涨超25%或内蒙产区突发电网限电减产，则看空失效。"
    },
    tags: ["天量仓单", "期货深升水", "过剩出清慢", "高赔率空配"]
  },
  {
    id: "rb",
    name: "螺纹钢",
    code: "RB2701",
    sinaSymbol: "nf_RB0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "ferrous",
    sectorLabel: "黑色系",
    tier: "downstream",
    subRole: "建筑钢材终端 · 黑色系定价中枢",
    unit: "元/吨",
    price: 3340,
    spotPrice: 3420,
    spotBenchmark: "上海HRB400E 20mm现货",
    changePct: 0.72,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight_balance",
      label: "紧平衡偏紧",
      score: 64,
      deliverableSupply: "华东交割库新国标仓单注册量偏低，且全社会库存创5年新低，交割月可交割资源集中度较高。",
      warehouseReceipts: "6.8万吨",
      openInterest: "168万手",
      virtualToRealRatio: 24.7,
      squeezeRisk: "中等偏高"
    },
    pillars: {
      supply: {
        score: 62,
        headline: "钢厂主动控产与电炉亏损限制供应，周产量维持低位",
        output: "五大材螺纹周产 234 万吨 (环比 -2.8%)",
        utilization: "高炉开工率 81.4%，独立电炉产能利用率 54.2%",
        importFlow: "钢坯及长材直接/间接出口维持高位，有效分流国内供给",
        disruptions: "北方采暖季环保限产趋严，12月多家钢厂公布高炉例行年检计划。"
      },
      demand: {
        score: 48,
        headline: "步入冬季建筑淡季，但重点基建赶工与冬储博弈托底",
        consumption: "周度表观消费 241 万吨 (同比 -5.1%)",
        downstreamOrders: "全国建材日均成交 11.4 万吨，华东华南施工仍有韧性",
        downstreamUtil: "地产新开工偏弱，专项债与化债推进改善基建回款",
        seasonality: "11月下旬东北西北停工、北材南下启动，市场核心转向12月冬储心理价位博弈。"
      },
      inventory: {
        score: 72,
        headline: "社库+厂库延续去化，绝对库存创近5年同期最低纪录",
        level: "总库存 448 万吨 (社库298 + 厂库150)",
        velocity: "周度去库 -7.2 万吨，淡季去库表现显著强于往年",
        yoyCompare: "较去年同期 -16.8%，较5年均值低 21.5%",
        deliverableNote: "低库存+低仓单（仅6.8万吨）赋予2701近月合约极强抗跌性与向上弹性。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [710, 1080, 1140, 960, 810, 740, 690, 620, 530, 485, 448, null],
          lastYear: [780, 1190, 1260, 1050, 890, 810, 760, 690, 605, 558, 538, 565],
          avg5y: [830, 1280, 1340, 1120, 950, 860, 800, 725, 645, 592, 570, 610]
        }
      },
      costMargin: {
        score: 66,
        headline: "电炉平电亏损筑牢下方成本防线，钢厂无盲目扩产意愿",
        rawMaterial: "高炉铁水成本 2760 元/吨，废钢价格坚挺抬升电炉成本",
        freightFx: "海运费稳健，出口汇率具优势",
        margin: "华东高炉即期毛利 +85 元/吨；独立电炉平电亏损 -110 元/吨",
        incentive: "微利格局下钢厂更倾向保价控产而非增产，低库存促使贸易商在3250下方具备冬储接货意愿。",
        breakeven: 3250
      },
      expectationGap: {
        score: 62,
        headline: "淡季延续去库强于预期，近月贴水修复逻辑清晰",
        actualVsExpected: "市场原预期11月中旬转入季节性累库，实际低供给令去库延续，现实格局比预期更紧。",
        curveFocus: "近月主导 (2701)",
        curveFocusType: "near",
        detail: "低库存与80元现货升水重点利多2701近月；2705远月则博弈明年春季政策预期。"
      }
    },
    basisCurve: {
      basis: 80,
      basisPct: 2.34,
      structure: "back",
      structureLabel: "期货贴水 · Back结构",
      nearFarSpread: 55,
      spreadDesc: "RB2701 - RB2705 = +55 元/吨",
      convergenceLogic: "期货贴水现货80元且仓单极低，临近交割月在现货坚挺背景下偏向向上修复基差。",
      curvePoints: [
        { label: "上海现货", price: 3420 },
        { label: "2612", price: 3368 },
        { label: "2701", price: 3340 },
        { label: "2705", price: 3285 },
        { label: "2710", price: 3255 }
      ]
    },
    extended: {
      macroDriver: "中央经济工作会议预期升温，财政增量与城中村改造预期提振黑色估值",
      positioning: "前20席位净多温和增加，产业套保盘在3450上方择机卖保",
      importExportParity: "国内钢价全球最具竞争力，钢材出口维持高位",
      valuationScore: 68,
      driveScore: 62,
      strategy: "逢回调轻仓试多 RB2701，或做扩盘面钢厂利润（多螺纹空焦煤），跌破3240止损。",
      bullFactors: ["总库存创5年新低+低仓单，交割月货源偏紧", "期货贴水现货80元，具备临近交割修复动力", "电炉平电亏损封杀深跌空间"],
      bearFactors: ["冬季施工淡季压制现货持续拉涨高度", "12月钢厂冬储定价若偏低将短期拖累盘面"],
      falsification: "若表需骤降至210万吨下方且社库提前大幅累库，或双焦铁矿负反馈崩塌，则偏多逻辑失效。"
    },
    tags: ["5年最低库存", "期货贴水", "低仓单", "做扩钢厂利润"]
  },
  {
    id: "hc",
    name: "热轧卷板",
    code: "HC2701",
    sinaSymbol: "nf_HC0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "ferrous",
    sectorLabel: "黑色系",
    tier: "downstream",
    subRole: "制造业板材核心 · 出口与汽车家电锚",
    unit: "元/吨",
    price: 3515,
    spotPrice: 3560,
    spotBenchmark: "上海4.75mm热卷现货",
    changePct: 0.86,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight_balance",
      label: "紧平衡",
      score: 58,
      deliverableSupply: "华东热卷仓单持续去化，且钢厂热卷订单饱满，交割资源紧张度略高于往年。",
      warehouseReceipts: "18.5万吨",
      openInterest: "112万手",
      virtualToRealRatio: 6.1,
      squeezeRisk: "中等"
    },
    pillars: {
      supply: {
        score: 55,
        headline: "板材钢厂排产稳定，部分产线检修控制供给增速",
        output: "周度产量 312 万吨 (环比 -1.4%)",
        utilization: "热轧产线产能利用率 79.6%",
        importFlow: "板材直接出口及机电汽车间接出口表现亮眼",
        disruptions: "北方大型板材厂12月有两条热轧产线安排10-15天年修。"
      },
      demand: {
        score: 66,
        headline: "家电以旧换新+新能源汽车+造船订单强劲，需求韧性远胜建材",
        consumption: "周度表观消费 319 万吨 (同比 +2.4%)",
        downstreamOrders: "汽车冷轧/镀锌及家电排产同比增 8%-12%，造船订单排至2028年",
        downstreamUtil: "制造业PMI处于扩张区间，板材无明显季节性淡季",
        seasonality: "年末制造业冲刺交付叠加海外圣诞后补库订单，支撑板材消费高位。"
      },
      inventory: {
        score: 64,
        headline: "社库连续六周去化，库存压力明显低于三季度",
        level: "总库存 324 万吨 (社库246 + 厂库78)",
        velocity: "周度去库 -7.0 万吨，去化流畅",
        yoyCompare: "较去年同期 -8.2%，较5年均值偏低 6.4%",
        deliverableNote: "热卷仓单已从年中高点大幅下降，临近交割抛压明显减轻。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [310, 415, 428, 412, 398, 392, 405, 410, 382, 351, 324, null],
          lastYear: [305, 408, 418, 405, 395, 388, 395, 402, 385, 368, 353, 338],
          avg5y: [315, 410, 420, 395, 378, 365, 372, 378, 362, 355, 346, 335]
        }
      },
      costMargin: {
        score: 60,
        headline: "热卷利润好于螺纹但仍偏薄，铁水成本支撑稳固",
        rawMaterial: "板材铁水+轧制综合成本约 3380 元/吨",
        freightFx: "人民币汇率偏弱利好机电及板材出口接单",
        margin: "华东热卷即期毛利 +140 元/吨，盈利相对稳健",
        incentive: "利润适中维持稳定生产，暂未触发产能大幅扩张。",
        breakeven: 3380
      },
      expectationGap: {
        score: 62,
        headline: "出口反倾销担忧下实际接单仍韧性十足，预期差偏多",
        actualVsExpected: "市场此前担忧海外关税/反倾销重创板材出口，实际通过东南亚转口及机电间接出口维持高景气，现实更紧。",
        curveFocus: "近远共振",
        curveFocusType: "both",
        detail: "近月受去库与贴水支撑，远月受益于制造业升级与设备更新政策延续。"
      }
    },
    basisCurve: {
      basis: 45,
      basisPct: 1.26,
      structure: "back",
      structureLabel: "期货贴水 · 温和Back",
      nearFarSpread: 32,
      spreadDesc: "HC2701 - HC2705 = +32 元/吨",
      convergenceLogic: "期货贴水现货45元，卷螺差维持+175元高位，基差具备温和向上修复动能。",
      curvePoints: [
        { label: "上海现货", price: 3560 },
        { label: "2612", price: 3535 },
        { label: "2701", price: 3515 },
        { label: "2705", price: 3483 },
        { label: "2710", price: 3465 }
      ]
    },
    extended: {
      macroDriver: "设备更新与消费品以旧换新政策直接拉动板材需求",
      positioning: "机构多头偏好配置热卷作为黑色系多头头寸",
      importExportParity: "中国热卷FOB出口较欧美日价差优势仍在120美元/吨以上",
      valuationScore: 62,
      driveScore: 65,
      strategy: "逢低偏多配置 HC2701，或做多卷螺差（多HC空RB）/多热卷空焦煤。",
      bullFactors: ["汽车、家电、造船需求旺盛，无明显冬季淡季拖累", "社库连续去化+仓单回落，交割压力小", "出口韧性超市场预期，期货贴水现货"],
      bearFactors: ["需防范欧美及东南亚进一步升级钢材贸易关税壁垒", "若螺纹大幅转弱仍会通过铁水切换压制卷螺差"],
      falsification: "若钢材单月出口环比大降超20%且热卷社库拐头回升至380万吨以上，则偏多逻辑失效。"
    },
    tags: ["制造业景气", "连续去库", "出口韧性", "黑色多配"]
  },

  /* ==================== 有色系 (7) ==================== */
  {
    id: "ao",
    name: "氧化铝",
    code: "AO2701",
    sinaSymbol: "nf_AO0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "nonferrous",
    sectorLabel: "有色系",
    tier: "upstream",
    subRole: "电解铝核心原料 · 铝土矿供应咽喉",
    unit: "元/吨",
    price: 4860,
    spotPrice: 5280,
    spotBenchmark: "山东/河南氧化铝现货均价",
    changePct: 1.65,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "very_tight",
      label: "极度偏紧 (现货一货难求)",
      score: 88,
      deliverableSupply: "全社会库存与交易所注册仓单双双处于历史极低水平，电解铝厂冬储抢货导致可交割现货极度稀缺。",
      warehouseReceipts: "4.2万吨",
      openInterest: "22.4万手",
      virtualToRealRatio: 53.3,
      squeezeRisk: "高"
    },
    pillars: {
      supply: {
        score: 76,
        headline: "几内亚铝土矿发运扰动叠加国内矿山复产缓慢，现货供应刚性受限",
        output: "国内运行产能 8320 万吨 (受焙烧炉检修及矿石品位制约)",
        utilization: "全国开工率 82.1%，山西河南国产矿紧缺压制满产",
        importFlow: "海外氧化铝现货价同步飙升，进口窗口深度关闭，净出口反而扩大",
        disruptions: "北方采暖季重污染天气管控偶发焙烧限产；新增产能投产集中于2027年Q2后。"
      },
      demand: {
        score: 78,
        headline: "电解铝运行产能创历史新高，西北铝厂冬季备库刚性拉满",
        consumption: "对应电解铝运行产能 4370 万吨，月均刚需约 705 万吨",
        downstreamOrders: "新疆、青海、内蒙电解铝厂原料库存告急，高价补库迫切",
        downstreamUtil: "电解铝厂高开工率刚性耗矿，短期几乎无减产弹性",
        seasonality: "11-12月北方暴雪影响汽运，西北铝厂冬储囤货需求进一步放大现货缺口。"
      },
      inventory: {
        score: 86,
        headline: "站台+港口+厂库+仓单全面告急，库存处于近5年最低极值",
        level: "全国氧化铝总库存 378 万吨 (环比 -6.8万吨)",
        velocity: "连续10周持续去库，尚未见到累库拐点",
        yoyCompare: "较去年同期 -19.2%，处于5年历史 3% 极低分位",
        deliverableNote: "注册仓单仅4.2万吨，虚实盘比超50倍，2701近月空头交货能力极弱。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [452, 448, 441, 435, 428, 422, 415, 408, 396, 385, 378, null],
          lastYear: [465, 470, 468, 462, 458, 460, 464, 466, 468, 469, 468, 460],
          avg5y: [478, 485, 482, 476, 472, 470, 474, 476, 475, 474, 472, 468]
        }
      },
      costMargin: {
        score: 42,
        headline: "行业暴利刺激远期扩产，但短期受矿石瓶颈无法迅速放量",
        rawMaterial: "进口几内亚矿CIF上涨至 88 美元/吨，烧碱成本小幅抬升",
        freightFx: "西非海运费偏强+汇率因素小幅推升矿石成本",
        margin: "行业即期完全成本约 3180 元/吨，现货毛利高达 +2100 元/吨 (历史极高估值)",
        incentive: "极高利润刺激企业全力推进2027年新建产能，但远水难解2701近月之渴。",
        breakeven: 3180
      },
      expectationGap: {
        score: 82,
        headline: "新产能投产一再延后，近月紧缺持续超预期，强Back结构极致演绎",
        actualVsExpected: "市场原预期四季度新投产能迅速填补缺口，实际调试爬坡缓慢且检修频发，现实比预期紧得多。",
        curveFocus: "极端近月主导 (2701)",
        curveFocusType: "near",
        detail: "2701交易现货极度紧缺与深贴水收敛；2705/2709远月已开始计价明年二季度产能过剩预期。"
      }
    },
    basisCurve: {
      basis: 420,
      basisPct: 7.95,
      structure: "back",
      structureLabel: "深度贴水 · 极强Back",
      nearFarSpread: 680,
      spreadDesc: "AO2701 - AO2705 = +680 元/吨",
      convergenceLogic: "主力贴水现货高达420元/吨，临近交割仓单极缺，空头回补与期现回归驱动近月易涨难跌。",
      curvePoints: [
        { label: "现货均价", price: 5280 },
        { label: "2612", price: 5090 },
        { label: "2701", price: 4860 },
        { label: "2705", price: 4180 },
        { label: "2709", price: 3790 }
      ]
    },
    extended: {
      macroDriver: "高度由产业自身供需缺口定价，与宏观相关性弱于铜铝",
      positioning: "近月多头资金占据绝对主动，远月产业套保盘逢高锁利",
      importExportParity: "澳洲FOB氧化铝高居660美元/吨，进口严重亏损无法补充国内",
      valuationScore: 34,
      driveScore: 86,
      strategy: "高估值+极强驱动：近月2701顺势逢低多或参与正套（多AO2701空AO2705）；严禁摸顶空近月，远月待新产能落地后布局空单。",
      bullFactors: ["注册仓单仅4.2万吨，虚实盘比超50，交割月货源极度偏紧", "主力深贴水现货420元/吨，临近交割修复空间大", "电解铝厂高开工叠加冬储刚需，现货成交继续坚挺"],
      bearFactors: ["吨利润超2000元处于历史绝对高估区，监管/交易所提保风控风险高", "2027年上半年大批量新产能投产预期压制远月"],
      falsification: "若现货价格率先拐头单周下跌超200元，或大型电解铝厂因亏损宣布大规模减产，则近月多头立刻止盈离场。"
    },
    tags: ["极度偏紧", "深贴水420", "高虚实盘比", "强Back正套"]
  },
  {
    id: "lc",
    name: "碳酸锂",
    code: "LC2701",
    sinaSymbol: "nf_LC0",
    exchange: "GFEX",
    exchangeName: "广期所",
    sector: "nonferrous",
    sectorLabel: "有色系",
    tier: "upstream",
    subRole: "新能源锂电核心原料 · 产能出清博弈",
    unit: "元/吨",
    price: 78600,
    spotPrice: 77400,
    spotBenchmark: "SMM电池级碳酸锂现货",
    changePct: -0.95,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "loose",
      label: "仓单高位 · 货源偏松",
      score: 36,
      deliverableSupply: "广期所11月集中注销仓单后，12月新仓单正快速重新注册，上游锂盐厂与贸易商套保货源充足。",
      warehouseReceipts: "3.6万吨",
      openInterest: "21.8万手",
      virtualToRealRatio: 6.1,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 40,
        headline: "国内云母部分停产但辉石+非洲盐湖增量仍在，月度产量回升",
        output: "月度国内产量 6.4 万吨 LCE (环比 +3.2%)",
        utilization: "辉石提锂开工 71%，江西高成本云母产线开工仅 38%",
        importFlow: "智利及阿根廷碳酸锂月度进口仍维持 1.8 万吨高位",
        disruptions: "澳洲部分矿山宣布减产保价带来短期扰动，但全球总供给仍处过剩周期。"
      },
      demand: {
        score: 64,
        headline: "储能抢装+新能源车年末冲量带动正极排产超预期",
        consumption: "磷酸铁锂正极材料月度排产环比 +6.5%，同比大增 34%",
        downstreamOrders: "头部电池厂12月排产维持高位，淡季不淡特征显著",
        downstreamUtil: "储能电芯海外出口抢装，支撑电池厂刚性采买",
        seasonality: "11-12月本为传统淡季，今年受汽车以旧换新与储能出口拉动呈“淡季不淡”。"
      },
      inventory: {
        score: 34,
        headline: "社会总库存虽连续去化，但绝对量仍在10.8万吨高位",
        level: "全产业链总库存 10.8 万吨 (冶炼厂+下游+贸易商)",
        velocity: "周度去库 -1800 吨，去化速度较10月放缓",
        yoyCompare: "较去年同期 +42%，高库存压制价格上方弹性",
        deliverableNote: "期货升水1200元/吨驱动贸易商积极注册2701新仓单，交割压力偏大。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [7.6, 8.1, 7.9, 8.2, 9.1, 10.4, 12.1, 13.0, 12.2, 11.4, 10.8, null],
          lastYear: [6.5, 7.2, 7.5, 7.1, 6.8, 6.9, 7.1, 7.3, 7.4, 7.5, 7.6, 7.8],
          avg5y: [5.2, 5.6, 5.8, 5.9, 6.1, 6.4, 6.8, 7.0, 7.1, 7.2, 7.3, 7.5]
        }
      },
      costMargin: {
        score: 66,
        headline: "7.2-7.5万元触及高成本外购矿与云母现金成本线，跌深即引减产",
        rawMaterial: "澳矿SC6 CIF报价 780 美元/吨，外购矿锂盐厂持续倒挂",
        freightFx: "海运费稳定，汇率走强小幅抬升进口矿成本",
        margin: "一体化盐湖仍盈利，外购澳矿产线亏损 -4500 元/吨",
        incentive: "8.2万元上方复产套保盘蜂拥而出，7.2万元下方减产挺价，形成清晰箱体。",
        breakeven: 74000
      },
      expectationGap: {
        score: 52,
        headline: "下游排产好于预期但盘面升水提前透支，多空博弈激烈",
        actualVsExpected: "需求端储能与电车排产比预期更强，但高价引发上游复产套保，边际紧缺未演变为趋势反转。",
        curveFocus: "远月升水交易 (2705)",
        curveFocusType: "far",
        detail: "2701临近交割受制于新仓单注册；2705远月含高升水，产业套保意愿强。"
      }
    },
    basisCurve: {
      basis: -1200,
      basisPct: -1.55,
      structure: "contango",
      structureLabel: "期货升水 · Contango",
      nearFarSpread: -2600,
      spreadDesc: "LC2701 - LC2705 = -2600 元/吨",
      convergenceLogic: "期货升水现货1200元且呈Contango结构，给上游套保商提供丰厚无风险交割收益。",
      curvePoints: [
        { label: "电碳现货", price: 77400 },
        { label: "2612", price: 78100 },
        { label: "2701", price: 78600 },
        { label: "2705", price: 81200 },
        { label: "2709", price: 83400 }
      ]
    },
    extended: {
      macroDriver: "中美新能源补贴与欧美电池关税政策直接扰动远期需求预期",
      positioning: "产业空头套保席位（锂矿/贸易商）在82000以上密集加空",
      importExportParity: "南美盐湖低成本货源持续流入，进口盈亏平衡",
      valuationScore: 62,
      driveScore: 46,
      strategy: "区间震荡偏空对待：82000-85000区间逢高逢升水空配，72000-74000成本线附近止盈不追空。",
      bullFactors: ["7.2-7.4万元触及边际高成本矿山停产线，估值具支撑", "四季度电车与储能排产淡季不淡，社库阶段性去化"],
      bearFactors: ["全社会库存仍超10.8万吨，远期过剩周期尚未彻底结束", "期货升水+Contango结构吸引产业巨量卖保套利", "价格一旦反弹至8.5万上方，停产云母与澳矿将迅速复产"],
      falsification: "若海外大型澳矿超预期大规模停产关矿且国内社库跌破6万吨，则底部反转看多。"
    },
    tags: ["成本箱体", "淡季不淡", "期货升水", "套保压顶"]
  },
  {
    id: "cu",
    name: "沪铜",
    code: "CU2701",
    sinaSymbol: "nf_CU0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "nonferrous",
    sectorLabel: "有色系",
    tier: "midstream",
    subRole: "工业金属之王 · 铜矿紧缺与AI电力双核",
    unit: "元/吨",
    price: 75480,
    spotPrice: 75660,
    spotBenchmark: "上海1#电解铜现货",
    changePct: 0.68,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight",
      label: "货源偏紧",
      score: 72,
      deliverableSupply: "上期所社会库存与仓单连续去化，进口精铜到货偏少，现货升水坚挺，交割月货源偏紧。",
      warehouseReceipts: "3.9万吨",
      openInterest: "15.6万手",
      virtualToRealRatio: 20.0,
      squeezeRisk: "中等偏高"
    },
    pillars: {
      supply: {
        score: 78,
        headline: "铜精矿现货TC维持历史极低位，冶炼厂检修增多制约精铜产出",
        output: "国内精炼铜月产 99.2 万吨 (环比 -1.8%)",
        utilization: "粗炼产能受矿紧制约，部分中小冶炼厂提前安排检修",
        importFlow: "铜精矿长单TC谈判博弈激烈，废铜冷料供应受税收政策影响偏紧",
        disruptions: "南美智利/秘鲁矿山品位下降与社区扰动频发，全球铜矿增量连续低于预期。"
      },
      demand: {
        score: 68,
        headline: "特高压电网投资+新能源车+AI数据中心用铜强劲对冲地产拖累",
        consumption: "国内精铜表观消费同比 +4.6%",
        downstreamOrders: "电力电缆与漆包线订单饱满，铜价回调至7.4万下方即现大量点价买盘",
        downstreamUtil: "精铜杆企业周度开工率 76.8%，高于去年同期 4.2 个百分点",
        seasonality: "年底电网工程赶工与家电排产冲刺，消费韧性显著强于市场预期。"
      },
      inventory: {
        score: 74,
        headline: "国内社库持续快速去化至12万吨低位，全球显性库存结构分化",
        level: "国内主流社库 12.1 万吨 (周度 -1.3万吨)",
        velocity: "连续6周去库，去库斜率陡峭",
        yoyCompare: "处于近5年同期偏低水平，SHFE仓单降至4万吨以下",
        deliverableNote: "低仓单叠加现货升水+180元，临近交割月对多头极为有利。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [9.2, 28.5, 38.8, 40.2, 41.5, 39.6, 35.1, 27.8, 19.2, 14.8, 12.1, null],
          lastYear: [8.8, 26.2, 34.5, 36.1, 35.8, 33.2, 29.4, 24.5, 18.6, 15.9, 14.2, 11.5],
          avg5y: [11.5, 29.0, 35.2, 33.8, 30.5, 26.8, 23.4, 19.8, 16.5, 15.2, 13.8, 12.4]
        }
      },
      costMargin: {
        score: 72,
        headline: "现货TC极低令冶炼厂深度亏损，硫酸副产品仅能勉强覆盖",
        rawMaterial: "铜精矿现货TC仅 8-12 美元/吨，远低于冶炼盈亏线(约60美元)",
        freightFx: "人民币汇率波动直接抬升沪铜内盘计价；洋山铜溢价回升至65美元",
        margin: "无长单保护的现货冶炼亏损超 -1200 元/吨",
        incentive: "冶炼深度亏损倒逼主动降负荷与提前检修，中长期强化供应刚性约束。",
        breakeven: 71500
      },
      expectationGap: {
        score: 70,
        headline: "美元走强压制后国内低价买盘涌现，去库超预期修复宏微背离",
        actualVsExpected: "市场此前担忧强美元与海外衰退压垮铜价，实际国内消费弹性与矿端紧缺令去库加速，现实紧于预期。",
        curveFocus: "近远共振偏多",
        curveFocusType: "both",
        detail: "近月受国内低库存+现货升水支撑；远月由全球铜矿资本开支不足与AI电力周期驱动。"
      }
    },
    basisCurve: {
      basis: 180,
      basisPct: 0.24,
      structure: "back",
      structureLabel: "现货升水 · 温和Back",
      nearFarSpread: 240,
      spreadDesc: "CU2701 - CU2705 = +240 元/吨",
      convergenceLogic: "现货维持+180元升水，低仓单下临近交割近月具向上挤压潜力。",
      curvePoints: [
        { label: "上海现货", price: 75660 },
        { label: "2612", price: 75570 },
        { label: "2701", price: 75480 },
        { label: "2703", price: 75360 },
        { label: "2705", price: 75240 }
      ]
    },
    extended: {
      macroDriver: "宏观属性极强，受美联储降息节奏、美元指数与中美制造业PMI共振驱动",
      positioning: "COMEX基金净多温和回补，沪铜产业逢回调点价买盘承接极强",
      importExportParity: "沪伦比值回升至8.28附近，精铜进口窗口接近盈亏平衡线",
      valuationScore: 64,
      driveScore: 76,
      strategy: "基本面强驱动：逢回调73500-74500区间分批配置多单，或参与沪铜正套（多近空远）。",
      bullFactors: ["铜精矿TC极低导致冶炼深度亏损，供给约束硬核", "国内社库快速去化至12万吨，交割月仓单偏紧", "电网、AI算力与新能源用铜构筑长期需求增量"],
      bearFactors: ["若美元指数超预期飙升或海外经济硬着陆，将带来宏观流动性冲击", "高铜价对部分中小电缆厂存在阶段性负反馈"],
      falsification: "若全球三大交易所显性库存同步大幅累库且现货TC反弹至50美元上方，则看多逻辑削弱。"
    },
    tags: ["矿端极紧TC低", "快速去库", "AI电网需求", "战略多配"]
  },
  {
    id: "al",
    name: "沪铝",
    code: "AL2701",
    sinaSymbol: "nf_AL0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "nonferrous",
    sectorLabel: "有色系",
    tier: "midstream",
    subRole: "产能天花板约束 · 氧化铝成本强传导",
    unit: "元/吨",
    price: 20680,
    spotPrice: 20740,
    spotBenchmark: "SMM A00铝现货均价",
    changePct: 0.53,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight",
      label: "货源偏紧",
      score: 70,
      deliverableSupply: "铝锭社会库存处于近5年极低水平，新疆发运周期拉长叠加铝水比例高（74%），铸锭量极少。",
      warehouseReceipts: "11.2万吨",
      openInterest: "18.9万手",
      virtualToRealRatio: 8.4,
      squeezeRisk: "中等"
    },
    pillars: {
      supply: {
        score: 72,
        headline: "4500万吨合规产能逼近天花板，高成本氧化铝抑制复产弹性",
        output: "国内运行产能 4370 万吨 (开工率高达 96.8%)",
        utilization: "铝水直接转化率高达 74%，流向期货交割的铝锭供给稀缺",
        importFlow: "俄铝及海外原铝进口窗口关闭，净进口量环比缩减",
        disruptions: "氧化铝暴涨令河南/广西/四川高成本外购电铝厂出现小幅检修减产。"
      },
      demand: {
        score: 64,
        headline: "光伏边框与汽车轻量化韧性犹存，铝材出口退税取消前抢出口",
        consumption: "国内原铝表观消费同比 +3.8%",
        downstreamOrders: "铝板带箔及工业型材订单稳健，建筑型材偏弱",
        downstreamUtil: "下游铝加工龙头综合开工率 63.4%，环比保持平稳",
        seasonality: "四季度虽有建筑淡季影响，但光伏装机翘尾及抢出口支撑总消费。"
      },
      inventory: {
        score: 76,
        headline: "国内铝锭社库跌破56万吨，处于近5年同期最低区间",
        level: "主流消费地铝锭社库 55.4 万吨 (环比 -1.9万吨)",
        velocity: "西北发运偏紧叠加出库稳健，去库流畅",
        yoyCompare: "较去年同期 -14.8%，较5年均值低 22%",
        deliverableNote: "高铝水比例导致交割品铝锭持续紧缺，低库结构易引发多头情绪。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [46, 78, 86, 82, 77, 76, 79, 80, 71, 61, 55.4, null],
          lastYear: [49, 76, 84, 83, 79, 77, 79, 81, 74, 67, 65, 58],
          avg5y: [68, 102, 115, 106, 94, 85, 81, 79, 75, 72, 71, 67]
        }
      },
      costMargin: {
        score: 78,
        headline: "氧化铝暴涨将行业平均成本推升至19800元上方，成本强托底",
        rawMaterial: "1.93吨氧化铝成本较年初飙升超3500元/吨，预焙阳极持稳",
        freightFx: "新疆至华东铁路车皮紧张，汽运运费小幅上行",
        margin: "全行业即期平均利润压缩至 +850 元/吨，外购氧化铝高电价产能已亏损",
        incentive: "高成本区铝厂面临减产压力，且高昂氧化铝成本强力抬升沪铝底部估值。",
        breakeven: 19850
      },
      expectationGap: {
        score: 64,
        headline: "成本上移与铝锭低库形成强支撑，市场对铝材出口退税冲击消化快于预期",
        actualVsExpected: "市场原担忧出口退税政策调整引发内盘暴跌，实际低库存+成本刚性迅速稳住盘面。",
        curveFocus: "近月主导 (2701)",
        curveFocusType: "near",
        detail: "2701受氧化铝高成本和极低铝锭库存双重托底；2705需观察明年氧化铝成本回落后的让利节奏。"
      }
    },
    basisCurve: {
      basis: 60,
      basisPct: 0.29,
      structure: "back",
      structureLabel: "现货升水 · 温和Back",
      nearFarSpread: 110,
      spreadDesc: "AL2701 - AL2705 = +110 元/吨",
      convergenceLogic: "现货维持小幅升水且社库极低，临近交割期价下方成本支撑极硬。",
      curvePoints: [
        { label: "A00现货", price: 20740 },
        { label: "2612", price: 20710 },
        { label: "2701", price: 20680 },
        { label: "2703", price: 20620 },
        { label: "2705", price: 20570 }
      ]
    },
    extended: {
      macroDriver: "受益于国内产能天花板红利与绿色能源转型，抗跌属性突出",
      positioning: "产业买保与多头配置资金在20000整数关口下方承接踊跃",
      importExportParity: "进口原铝亏损约 1100 元/吨，海外货源难以流入补充库存",
      valuationScore: 68,
      driveScore: 70,
      strategy: "逢回调20000-20300区域逢低做多 AL2701，中期关注多铝空氧化铝（做扩电解铝冶炼利润）的远月2705机会。",
      bullFactors: ["铝锭社库仅55.4万吨创5年新低，铝水比例高制约交割品", "氧化铝成本强力推升行业成本至19850元，下方跌不动", "进口窗口深度关闭，国内供应逼近产能上限"],
      bearFactors: ["若明年上半年氧化铝价格暴跌，电解铝成本支撑将同步下移", "建筑型材与部分出口材订单面临阶段性调整"],
      falsification: "若氧化铝现货崩塌叠加铝锭社库快速累库至80万吨上方，则多头逻辑减弱。"
    },
    tags: ["产能天花板", "成本强抬升", "5年低库存", "多铝空氧化铝(远月)"]
  },
  {
    id: "zn",
    name: "沪锌",
    code: "ZN2701",
    sinaSymbol: "nf_ZN0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "nonferrous",
    sectorLabel: "有色系",
    tier: "midstream",
    subRole: "镀锌防锈主力金属 · 矿紧TC极低",
    unit: "元/吨",
    price: 25120,
    spotPrice: 25380,
    spotBenchmark: "上海0#锌锭现货",
    changePct: 0.76,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight",
      label: "货源偏紧",
      score: 74,
      deliverableSupply: "冶炼厂联合减产叠加前期进口窗口间歇关闭，国内七地锌锭社库偏低，上海/天津现货高升水。",
      warehouseReceipts: "2.8万吨",
      openInterest: "11.4万手",
      virtualToRealRatio: 20.4,
      squeezeRisk: "中等偏高"
    },
    pillars: {
      supply: {
        score: 76,
        headline: "国内外锌精矿TC跌至历史冰点，冶炼厂深度亏损倒逼减产",
        output: "国内精炼锌月产 50.8 万吨 (同比 -8.4%)",
        utilization: "冶炼厂主动降负荷检修，冬季北方矿山季节性停产加剧矿紧",
        importFlow: "进口矿TC转负，精炼锌仅偶尔开启短期进口窗口",
        disruptions: "高海拔矿山冬季停产至次年4月，冬储抢矿令加工费低位难起。"
      },
      demand: {
        score: 52,
        headline: "镀锌板需求平稳但北方施工趋弱，高锌价抑制下游补库",
        consumption: "镀锌管及压铸锌合金消费同比微降 -1.2%",
        downstreamOrders: "下游逢高刚需采购，逢回调至24500下方补库积极",
        downstreamUtil: "镀锌企业开工率 58.6%，环比持稳",
        seasonality: "北方入冬压制户外镀锌结构件消费，但家电汽车镀锌卷韧性尚可。"
      },
      inventory: {
        score: 72,
        headline: "国内七地社库处于10万吨偏低水平，上期所仓单持续下降",
        level: "国内七地锌锭社库 10.4 万吨 (环比 -0.6万吨)",
        velocity: "供给缩量对冲需求平淡，库存缓步去化",
        yoyCompare: "较去年同期 -11.5%，SHFE注册仓单不足3万吨",
        deliverableNote: "仓单集中度高叠加现货升水+260元，2701临近交割空头回补压力较大。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [7.8, 16.5, 20.8, 21.4, 21.1, 19.8, 16.5, 13.8, 11.9, 11.0, 10.4, null],
          lastYear: [8.2, 15.8, 19.6, 20.2, 19.5, 18.2, 15.8, 13.2, 12.1, 11.8, 11.7, 9.8],
          avg5y: [10.5, 21.2, 25.4, 23.1, 20.4, 17.8, 15.5, 13.6, 12.8, 12.5, 12.2, 11.0]
        }
      },
      costMargin: {
        score: 70,
        headline: "极低加工费令冶炼厂吨亏超1500元，供给端出清逻辑扎实",
        rawMaterial: "国产锌矿TC仅 1500 元/金属吨，进口矿TC为 -30 美元/干吨",
        freightFx: "汇率波动小幅抬高进口成本",
        margin: "即便计入二八分成与副产品，纯冶炼厂仍处亏损状态",
        incentive: "冶炼厂在TC回升至3000元前缺乏提产动力，供给偏紧格局将延续至明年一季度。",
        breakeven: 23600
      },
      expectationGap: {
        score: 65,
        headline: "冶炼厂减产持续时间超预期，近月强Back兑现低库逻辑",
        actualVsExpected: "市场原预期海外矿山复产在四季度迅速缓解国内矿荒，实际冬季矿山停产叠加运输延迟，现实仍紧。",
        curveFocus: "近月主导 (2701)",
        curveFocusType: "near",
        detail: "2701受益于仓单低位与冶炼缩产；远月2705则计价明年海外新矿释放预期。"
      }
    },
    basisCurve: {
      basis: 260,
      basisPct: 1.02,
      structure: "back",
      structureLabel: "现货高升水 · 强Back",
      nearFarSpread: 540,
      spreadDesc: "ZN2701 - ZN2705 = +540 元/吨",
      convergenceLogic: "现货高升水+260元且月差Back走阔，临近交割支撑近月偏强。",
      curvePoints: [
        { label: "上海0#现货", price: 25380 },
        { label: "2612", price: 25260 },
        { label: "2701", price: 25120 },
        { label: "2703", price: 24820 },
        { label: "2705", price: 24580 }
      ]
    },
    extended: {
      macroDriver: "跟随有色板块宏观情绪，但近月结构性逼仓特征显著",
      positioning: "LME与SHFE持仓集中度均偏高，正套资金活跃",
      importExportParity: "进口锌锭盈亏在 -300 元附近，需警惕比价修复后进口货集中流入",
      valuationScore: 54,
      driveScore: 70,
      strategy: "低吸偏多 ZN2701 或参与多2701空2705正套，紧盯进口窗口与仓单变化。",
      bullFactors: ["锌矿TC冰点引发冶炼厂深度减产，国内产量同比大降", "国内仓单不足3万吨且现货升水+260元，近月易涨难跌", "冬季高海拔矿山停产，短期矿紧难解"],
      bearFactors: ["绝对锌价处年内偏高区，高价对下游镀锌需求有负反馈", "若进口窗口大开引发海外隐性库存集中涌入，将快速打压近月升水"],
      falsification: "若锌矿TC连续大幅回升且精炼锌单月进口超6万吨导致社库累至15万吨上方，则多头撤退。"
    },
    tags: ["TC历史冰点", "冶炼减产", "现货高升水", "强Back正套"]
  },
  {
    id: "ni",
    name: "沪镍",
    code: "NI2701",
    sinaSymbol: "nf_NI0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "nonferrous",
    sectorLabel: "有色系",
    tier: "midstream",
    subRole: "不锈钢与三元锂电原料 · 印尼供给主导",
    unit: "元/吨",
    price: 124800,
    spotPrice: 124400,
    spotBenchmark: "上海1#金川/俄镍均价",
    changePct: -0.78,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "surplus",
      label: "显性累库 · 货源偏松",
      score: 28,
      deliverableSupply: "国产电积镍产能持续投放，LME与SHFE交割品库存双双创近三年新高，交割货源极度充裕。",
      warehouseReceipts: "2.95万吨",
      openInterest: "7.8万手",
      virtualToRealRatio: 2.6,
      squeezeRisk: "极低"
    },
    pillars: {
      supply: {
        score: 28,
        headline: "国产与印尼电积镍产能释放，纯镍从结构短缺彻底转为过剩",
        output: "国内精炼镍月产 3.05 万吨 (同比 +24.5%)",
        utilization: "精炼镍产能利用率维持 88% 高位，新注册交割品牌持续增加",
        importFlow: "印尼中间品MHP与高冰镍源源不断回流国内加工电积镍",
        disruptions: "印尼RKAB镍矿配额偶有升水扰动，但未能扭转纯镍产能过剩大格局。"
      },
      demand: {
        score: 44,
        headline: "三元锂电占比受磷酸铁锂挤压，不锈钢排产高位但利润微薄",
        consumption: "电镀合金需求平淡，三元前驱体月度排产环比下滑 -4%",
        downstreamOrders: "300系不锈钢厂以低成本印尼镍铁为主，纯镍消耗占比极低",
        downstreamUtil: "新能源车磷酸铁锂市占率超75%，持续蚕食硫酸镍需求",
        seasonality: "年末不锈钢与电池厂以去库存为主，纯镍买兴平淡。"
      },
      inventory: {
        score: 22,
        headline: "LME+SHFE全球纯镍库存持续单边累库，压制一切反弹",
        level: "LME库存 16.2 万吨 + 国内社库 3.9 万吨 (创三年新高)",
        velocity: "海内外持续同步累库，周均增加超 2500 吨",
        yoyCompare: "全球显性库存较去年同期暴增 +145%",
        deliverableNote: "上期所仓单逼近3万吨，虚实盘比仅2.6，临近交割空头交货毫无压力。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [8.4, 9.2, 10.1, 10.8, 11.6, 12.8, 14.1, 15.4, 16.8, 18.6, 20.1, null],
          lastYear: [5.2, 5.0, 4.8, 4.6, 4.5, 4.7, 5.1, 5.6, 6.2, 7.1, 8.2, 8.6],
          avg5y: [11.0, 11.2, 11.0, 10.8, 10.5, 10.4, 10.6, 10.8, 11.2, 11.5, 11.8, 12.0]
        }
      },
      costMargin: {
        score: 56,
        headline: "一体化MHP制电积镍仍有盈利，但11.8万附近逼近外购硫酸镍成本线",
        rawMaterial: "印尼红土镍矿内贸升水坚挺，为镍价提供底部成本防线",
        freightFx: "海运费稳定，汇率小幅托底内盘",
        margin: "印尼一体化产线利润约 +8000 元/吨；外购高冰镍产线逼近盈亏平衡",
        incentive: "高利润一体化产能毫无减产意愿，仅靠成本托底难以形成大涨驱动。",
        breakeven: 118000
      },
      expectationGap: {
        score: 36,
        headline: "印尼矿端炒作证伪后，纯镍累库斜率超预期拖累盘面",
        actualVsExpected: "市场此前博弈印尼RKAB审批收紧引发断供，实际审批顺畅且电积镍累库加速，现实明显偏松。",
        curveFocus: "全曲线承压 (Contango)",
        curveFocusType: "both",
        detail: "近月受仓单压顶，远月Contango反映高库存持仓成本，整体偏空定价。"
      }
    },
    basisCurve: {
      basis: -400,
      basisPct: -0.32,
      structure: "contango",
      structureLabel: "期货升水 · Contango",
      nearFarSpread: -1350,
      spreadDesc: "NI2701 - NI2705 = -1350 元/吨",
      convergenceLogic: "期货升水+深Contango结构，利于国产电积镍企业持续向交易所交仓套保。",
      curvePoints: [
        { label: "现货均价", price: 124400 },
        { label: "2612", price: 124600 },
        { label: "2701", price: 124800 },
        { label: "2703", price: 125500 },
        { label: "2705", price: 126150 }
      ]
    },
    extended: {
      macroDriver: "有色系中基本面最弱品种，常被机构作为多铜/多铝的对冲空头标的",
      positioning: "LME与SHFE套保空单席位庞大，反弹即遇产业抛压",
      importExportParity: "国产电积镍出口交割LME窗口持续打开，内外盘过剩高度联动",
      valuationScore: 52,
      driveScore: 30,
      strategy: "逢反弹至128000-131000区逢高沽空，或作为有色系套利空头配置（多铜/多铝空镍）。",
      bullFactors: ["11.8万元附近逼近部分外购中间品成本线，下跌流畅度放缓", "需防范印尼突发资源出口限制政策引发脉冲行情"],
      bearFactors: ["海内外纯镍显性库存暴增145%且仍在累库", "国产电积镍交割品过剩，仓单高位+Contango结构", "三元电池需求持续被磷酸铁锂替代"],
      falsification: "若印尼政府强制大幅削减年度镍矿配额超20%引发全球供应短缺，则空单坚决止损。"
    },
    tags: ["海内外累库", "电积镍过剩", "Contango", "有色空配"]
  },
  {
    id: "ss",
    name: "不锈钢",
    code: "SS2701",
    sinaSymbol: "nf_SS0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "nonferrous",
    sectorLabel: "有色系",
    tier: "downstream",
    subRole: "镍铬合金终端成材 · 制造业消费晴雨表",
    unit: "元/吨",
    price: 13380,
    spotPrice: 13320,
    spotBenchmark: "无锡304冷轧切边现货",
    changePct: -0.37,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "loose",
      label: "仓单充足 · 偏松",
      score: 38,
      deliverableSupply: "无锡佛山两地社会库存偏高，上期所交割仓库仓单量超10万吨，交割资源十分充裕。",
      warehouseReceipts: "10.6万吨",
      openInterest: "12.8万手",
      virtualToRealRatio: 6.0,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 38,
        headline: "钢厂300系粗钢排产维持高位，年底冲量供给承压",
        output: "国内300系月度排产 176 万吨 (同比 +6.2%)",
        utilization: "华南大型一体化钢厂保持满产，仅中小非一体化厂微幅减产",
        importFlow: "印尼冷热轧不锈钢回流国内稳定，海内外供给充裕",
        disruptions: "暂未出现大规模钢厂集中减产检修。"
      },
      demand: {
        score: 46,
        headline: "终端制造业刚需平稳，但贸易商囤货意愿薄弱",
        consumption: "表观消费同比微增 +1.5%，不及产量增速",
        downstreamOrders: "石化、家电需求尚可，建筑装饰与厨卫需求疲软",
        downstreamUtil: "下游冷轧加工厂随采随用，逢低点价为主",
        seasonality: "11-12月下游资金回笼期，主动备库动能不足。"
      },
      inventory: {
        score: 36,
        headline: "无锡佛山社库与交易所仓单居高不下，去库缓慢",
        level: "无锡+佛山300系社库 61.5 万吨 + 仓单 10.6 万吨",
        velocity: "周度小幅累库 +0.8 万吨",
        yoyCompare: "较去年同期 +9.4%，高于5年同期均值",
        deliverableNote: "高仓单与期货小幅升水压制2701合约，交割月卖方主导。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [55, 68, 72, 69, 66, 65, 63, 62, 60, 60.7, 61.5, null],
          lastYear: [54, 65, 69, 66, 62, 60, 58, 57, 56, 56.5, 56.2, 55.8],
          avg5y: [52, 63, 66, 63, 60, 58, 57, 56, 55, 55.5, 55.2, 54.5]
        }
      },
      costMargin: {
        score: 58,
        headline: "高镍铁与高碳铬铁价格松动，钢厂盈亏平衡附近挣扎",
        rawMaterial: "高镍铁报价回落至 975 元/镍，铬铁招标价下调",
        freightFx: "印尼资源海运顺畅",
        margin: "非一体化钢厂即期利润 -180 元/吨，一体化钢厂微利 +120 元/吨",
        incentive: "成本支撑限制大跌，但只要一体化钢厂不亏现金流就难以主动减产。",
        breakeven: 13100
      },
      expectationGap: {
        score: 42,
        headline: "旺季去库不及预期后转入淡季累库，现实偏弱",
        actualVsExpected: "市场原期待四季度钢厂亏损倒逼减产，实际排产居高不下，供应比预期更松。",
        curveFocus: "近月承压 (2701)",
        curveFocusType: "near",
        detail: "2701面临高仓单压制，下方紧贴原料成本缓慢磨底。"
      }
    },
    basisCurve: {
      basis: -60,
      basisPct: -0.45,
      structure: "contango",
      structureLabel: "期货小升水 · Contango",
      nearFarSpread: -140,
      spreadDesc: "SS2701 - SS2705 = -140 元/吨",
      convergenceLogic: "期货微升水现货叠加高仓单，反弹空间受套保盘牢牢封锁。",
      curvePoints: [
        { label: "无锡现货", price: 13320 },
        { label: "2612", price: 13350 },
        { label: "2701", price: 13380 },
        { label: "2703", price: 13450 },
        { label: "2705", price: 13520 }
      ]
    },
    extended: {
      macroDriver: "兼具黑色制造与有色镍成本属性，波动率相对温和",
      positioning: "钢厂与大型贸易商在13700上方卖保坚决",
      importExportParity: "出口东南亚/欧洲订单平稳，难以彻底消化国内产能",
      valuationScore: 58,
      driveScore: 40,
      strategy: "弱势震荡偏空思路，13600上方逢反弹试空，靠近13000成本线附近及时止盈。",
      bullFactors: ["非一体化钢厂陷入亏损，13000-13100区域存在强成本防线"],
      bearFactors: ["300系排产居高不下，社库与仓单双高", "高镍铁与铬铁成本同步松动，拖累估值中枢", "期货升水+Contango不利于近月多头"],
      falsification: "若龙头钢厂宣布300系联合减产超15%或高镍铁大幅反弹，则偏空思路转为震荡。"
    },
    tags: ["排产高位", "高仓单", "成本磨底", "震荡偏空"]
  },

  /* ==================== 贵金属系 (2) ==================== */
  {
    id: "au",
    name: "沪金",
    code: "AU2702",
    sinaSymbol: "nf_AU0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "precious",
    sectorLabel: "贵金属系",
    tier: "upstream",
    subRole: "全球货币信用锚 · 央行购金与实际利率定价",
    unit: "元/克",
    price: 628.4,
    spotPrice: 626.8,
    spotBenchmark: "上海黄金交易所 Au(T+D)",
    changePct: 0.92,
    deliveryMonth: "2702合约 (主力交割月)",
    deliveryTightness: {
      status: "tight",
      label: "结构偏紧 (央行扫货)",
      score: 72,
      deliverableSupply: "实物黄金被新兴市场央行与长期ETF持续锁仓，商业可流通交割金条偏紧，国内内外盘维持正溢价。",
      warehouseReceipts: "12.4吨",
      openInterest: "19.8万手",
      virtualToRealRatio: 16.0,
      squeezeRisk: "中等"
    },
    pillars: {
      supply: {
        score: 74,
        headline: "全球金矿产量增速逼近天花板，再生金增量难以满足官方需求",
        output: "全球季度矿产金 920 吨 (同比仅 +1.1%，品位逐年下降)",
        utilization: "主要大型金矿满产运行，新发现世界级金矿寥寥无几",
        importFlow: "中国与印度官方及民间进口需求强劲，海关配额节奏影响内外盘溢价",
        disruptions: "全球地缘冲突及矿业资源民族主义抬升开采资本开支与供应刚性。"
      },
      demand: {
        score: 82,
        headline: "全球央行战略购金构筑长牛底座，避险与资产配置买盘强劲",
        consumption: "全球央行年度净购金连续维持千吨级别高位",
        downstreamOrders: "欧美黄金ETF重回净流入通道，国内金条及金币投资需求大增 +28%",
        downstreamUtil: "高金价虽短期抑制传统金饰克重消费，但投资与官方储备完全接棒",
        seasonality: "11月底至次年1月为春节及印度婚庆传统实物黄金备货旺季。"
      },
      inventory: {
        score: 70,
        headline: "COMEX与SHFE可交割注册仓单处于近5年偏低区间",
        level: "SHFE仓单 12.4 吨；COMEX注册仓单处于低位水平",
        velocity: "实物提取需求稳健，库存难现大幅累库",
        yoyCompare: "COMEX可交割库存较5年均值低约 24%",
        deliverableNote: "黄金作为金融属性极强的资产，低仓单+高持有意愿支持长周期慢牛。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [16.8, 16.2, 15.5, 14.9, 14.2, 13.8, 13.5, 13.1, 12.9, 12.6, 12.4, null],
          lastYear: [18.5, 18.2, 17.9, 17.4, 17.1, 16.8, 16.5, 16.2, 15.9, 15.6, 15.4, 15.2],
          avg5y: [19.2, 19.0, 18.6, 18.2, 17.9, 17.6, 17.4, 17.1, 16.9, 16.6, 16.4, 16.2]
        }
      },
      costMargin: {
        score: 76,
        headline: "全球AISC全维持开采成本升至1450美元，人民币汇率提供双重缓冲",
        rawMaterial: "矿企能源、人工及环保通胀推升全球AISC成本持续上移",
        freightFx: "美元兑人民币汇率波动对沪金形成天然保护垫（汇率贬值直接利多内盘沪金）",
        margin: "矿企盈利丰厚，但受限于矿脉品位与审批周期，高利润无法迅速转化为产量",
        incentive: "黄金定价核心在货币信用与利率，而非单纯边际生产成本。",
        breakeven: 560
      },
      expectationGap: {
        score: 78,
        headline: "美债赤字货币化与去美元化韧性超预期，黄金抗跌性远超传统利率模型",
        actualVsExpected: "即便美债名义利率阶段性反弹，央行购金与主权债务担忧仍令金价跌幅极浅、修复极快，现实强于预期。",
        curveFocus: "全曲线多头 (远月升水反映持有利率)",
        curveFocusType: "both",
        detail: "黄金因金融无风险利率属性天然呈温和Contango，多头主驱动贯通近远月。"
      }
    },
    basisCurve: {
      basis: -1.6,
      basisPct: -0.26,
      structure: "contango",
      structureLabel: "利率贴现 · 温和Contango",
      nearFarSpread: -4.2,
      spreadDesc: "AU2702 - AU2706 = -4.2 元/克 (反映无风险资金利率)",
      convergenceLogic: "黄金期货升水反映持有资金成本而非现货过剩，属正常正向利率结构。",
      curvePoints: [
        { label: "Au(T+D)", price: 626.8 },
        { label: "2612", price: 627.4 },
        { label: "2702", price: 628.4 },
        { label: "2704", price: 630.5 },
        { label: "2706", price: 632.6 }
      ]
    },
    extended: {
      macroDriver: "核心定价三支柱：美国财政赤字扩张、美联储降息周期、地缘避险与央行储备多元化",
      positioning: "全球长线主权资金与ETF逢回调持续吸筹，投机拥挤度已通过震荡充分消化",
      importExportParity: "沪金相对伦敦金折算溢价约 +3.5 元/克，反映国内强劲配置需求",
      valuationScore: 60,
      driveScore: 82,
      strategy: "战略级中长线看多核心资产：逢回调610-618元/克分批低吸 AU2702，作为组合压舱石。",
      bullFactors: ["全球央行购金与去美元化大周期未结束，买盘结构极稳", "春节实物旺季叠加欧美ETF资金回流共振", "人民币汇率波动为内盘沪金提供额外保护垫"],
      bearFactors: ["若美国通胀超预期反弹迫使美联储重启加息预期，将引发阶段性回调", "短期多头拥挤度升高时易出现急跌洗盘"],
      falsification: "若全球央行集体转向净抛售黄金且美国财政赤字实质性大幅削减，则长牛逻辑改变。"
    },
    tags: ["央行购金", "实际利率周期", "春节旺季", "战略核心多配"]
  },
  {
    id: "ag",
    name: "沪银",
    code: "AG2702",
    sinaSymbol: "nf_AG0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "precious",
    sectorLabel: "贵金属系",
    tier: "midstream",
    subRole: "金融+光伏工业双属性 · 高弹性贵金属",
    unit: "元/千克",
    price: 7860,
    spotPrice: 7835,
    spotBenchmark: "上海华通1#国标白银",
    changePct: 1.48,
    deliveryMonth: "2702合约 (主力交割月)",
    deliveryTightness: {
      status: "tight",
      label: "结构偏紧 (连年供需缺口)",
      score: 76,
      deliverableSupply: "全球白银连续第5年录得实物结构性短缺，光伏银浆刚性耗银令LBMA与SHFE可交割白银库存持续走低。",
      warehouseReceipts: "1020吨",
      openInterest: "48.2万手",
      virtualToRealRatio: 7.1,
      squeezeRisk: "中等偏高"
    },
    pillars: {
      supply: {
        score: 74,
        headline: "70%为铜铅锌伴生矿，供给刚性极强难以因银价上涨快速扩产",
        output: "全球矿产银年度约 2.58 万吨 (增速不足 1%)",
        utilization: "独立银矿受品位下降制约，伴生矿增量受制于铜铅锌冶炼节奏",
        importFlow: "国内白银维持净出口态势，出口加工贸易消耗大量标准银锭",
        disruptions: "拉美主产国墨西哥与秘鲁矿业社区与环保审批持续掣肘增量。"
      },
      demand: {
        score: 80,
        headline: "N型TOPCon/HJT光伏电池单位耗银高+AI服务器导电银浆爆发",
        consumption: "全球工业用银占比攀升至 58% 历史新高，光伏用银同比 +16%",
        downstreamOrders: "国内银粉与光伏银浆厂四季度排产饱满，年底装机潮拉动提货",
        downstreamUtil: "消费电子与AI算力板卡镀银需求同步上行",
        seasonality: "年底光伏抢装叠加贵金属春节消费旺季，工业与金融买盘双共振。"
      },
      inventory: {
        score: 78,
        headline: "LBMA与SHFE显性库存处于近5年低位，实物去库趋势不改",
        level: "SHFE仓单 1020 吨，LBMA可自由流通库存持续下降",
        velocity: "年度全球实物短缺预计超 5200 吨，显性库存持续消耗",
        yoyCompare: "SHFE仓单较去年同期 -18.5%，较5年均值低 34%",
        deliverableNote: "连续多年去库使白银对多头资金极其敏感，易爆发高斜率补涨行情。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [1280, 1240, 1190, 1150, 1120, 1140, 1110, 1090, 1065, 1040, 1020, null],
          lastYear: [1480, 1450, 1410, 1390, 1360, 1350, 1330, 1310, 1290, 1270, 1251, 1230],
          avg5y: [1850, 1820, 1790, 1760, 1720, 1690, 1650, 1610, 1590, 1570, 1545, 1520]
        }
      },
      costMargin: {
        score: 70,
        headline: "金银比仍在80偏高区间，白银相对黄金显著低估具备补涨弹性",
        rawMaterial: "伴生矿属性弱化单一开采成本锚，核心锚为金银比与工业边际成本",
        freightFx: "人民币汇率波动放大沪银相对伦敦银的溢价弹性",
        margin: "白银加工费平稳，光伏电池厂对银浆的成本承受力较强",
        incentive: "高金银比（约80，历史均值65）吸引套利资金做空金银比、逢低增配白银。",
        breakeven: 6900
      },
      expectationGap: {
        score: 75,
        headline: "光伏“少银化”推进慢于预期，实物紧缺叠加金银比修复预期差偏多",
        actualVsExpected: "市场此前担忧电镀铜/无银技术迅速替代银浆，实际N型电池渗透加速令耗银量超预期增长，现实更紧。",
        curveFocus: "近远共振偏多",
        curveFocusType: "both",
        detail: "白银作为高Beta弹性品种，在黄金企稳上行阶段往往呈现加速补涨。"
      }
    },
    basisCurve: {
      basis: -25,
      basisPct: -0.32,
      structure: "contango",
      structureLabel: "利率贴现 · 温和Contango",
      nearFarSpread: -65,
      spreadDesc: "AG2702 - AG2706 = -65 元/千克 (正常资金贴现)",
      convergenceLogic: "温和Contango反映持有资金利率，一旦现货逼紧随时可能转为平水或Back。",
      curvePoints: [
        { label: "华通现货", price: 7835 },
        { label: "2612", price: 7848 },
        { label: "2702", price: 7860 },
        { label: "2704", price: 7892 },
        { label: "2706", price: 7925 }
      ]
    },
    extended: {
      macroDriver: "兼具黄金货币金融属性与工业金属经济弹性，降息+制造复苏周期弹性最大",
      positioning: "投机资金活跃度高，波动率约为黄金的 1.8-2.2 倍，需严控仓位",
      importExportParity: "内外盘比价接近平水，国内加工出口需求稳健",
      valuationScore: 68,
      driveScore: 78,
      strategy: "低估高弹性看多：逢回调7550-7680轻仓分批做多 AG2702，或参与做空金银比（多银空金）。",
      bullFactors: ["全球连续5年实物短缺，库存处于5年低位", "N型光伏银浆与AI电子耗银增长超预期", "金银比约80处于偏高区，相对黄金具备显著补涨空间"],
      bearFactors: ["工业属性使其在海外经济衰退恐慌时回撤幅度远大于黄金", "高波动率易触发杠杆资金踩踏洗盘"],
      falsification: "若全球光伏新增装机断崖式下滑叠加黄金转入熊市周期，则白银多头失效。"
    },
    tags: ["连年实物缺口", "光伏AI耗银", "金银比修复", "高弹性多配"]
  }
);
