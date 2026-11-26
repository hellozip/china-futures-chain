/* ==========================================================================
   China Futures Visual Chain — Core Fundamental Data (Part 2: 15 Contracts)
   Sectors: 能源化工系 (Energy & Chem: 8) + 农产品系 (Agriculture: 7)
   + Chain Transmission Links + Cross-Commodity Spreads + Daily Intel
   ========================================================================== */
window.FuturesChainData = window.FuturesChainData || { contracts: [], links: [], spreads: [], dailyIntel: [] };

window.FuturesChainData.contracts.push(
  /* ==================== 能源化工系 (8) ==================== */
  {
    id: "sc",
    name: "原油",
    code: "SC2701",
    sinaSymbol: "nf_SC0",
    exchange: "INE",
    exchangeName: "上期能源",
    sector: "energy",
    sectorLabel: "能源化工系",
    tier: "upstream",
    subRole: "能化全链成本之母 · OPEC+与地缘定价",
    unit: "元/桶",
    price: 538.5,
    spotPrice: 544.0,
    spotBenchmark: "阿曼/迪拜中质含硫原油折人民币",
    changePct: 0.45,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight_balance",
      label: "紧平衡 (低库弱需博弈)",
      score: 54,
      deliverableSupply: "上期能源原油注册仓单处于年内低位，但山东地炼开工偏低限制现货抢购力度，整体紧平衡。",
      warehouseReceipts: "420万桶",
      openInterest: "2.8万手",
      virtualToRealRatio: 6.7,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 58,
        headline: "OPEC+推迟增产托底油价，但美洲非OPEC供应稳步增长",
        output: "OPEC+维持自愿减产纪律，美国原油日产稳居 1340 万桶历史高位",
        utilization: "沙特与阿联酋仍有约 450 万桶/日闲置产能悬于上方",
        importFlow: "中国原油月度进口 4520 万吨，独立炼厂配额释放平稳",
        disruptions: "中东与俄乌能源基础设施地缘溢价反复脉冲，冬季寒潮扰动北美产区。"
      },
      demand: {
        score: 46,
        headline: "全球成品油需求增速放缓，新能源替代压制国内汽柴油消费",
        consumption: "中国表观原油加工量同比 -1.4%，柴油受LNG重卡替代明显",
        downstreamOrders: "欧美冬季取暖油需求季节性回升，航空煤油维持增长",
        downstreamUtil: "山东地炼常减压开工率 59.4%，主营炼厂开工 78.2%",
        seasonality: "11-12月海外进入冬季取暖油消费小高峰，但国内成品油处淡季。"
      },
      inventory: {
        score: 62,
        headline: "OECD商业原油库存与INE仓单偏低，赋予近月抗跌底气",
        level: "美国商业原油库存低于5年均值 4.2%；INE仓单仅 420 万桶",
        velocity: "全球水上浮仓回落，陆上库存小幅去化",
        yoyCompare: "OECD总库存较去年同期 -3.8%，处偏低水位",
        deliverableNote: "INE交割库低仓单叠加中东官价坚挺，限制近月深贴水。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [425, 442, 448, 458, 455, 448, 434, 422, 418, 424, 421, null],
          lastYear: [432, 448, 455, 461, 459, 452, 440, 428, 424, 436, 438, 431],
          avg5y: [440, 455, 464, 470, 468, 460, 448, 438, 434, 442, 440, 435]
        }
      },
      costMargin: {
        score: 58,
        headline: "美国页岩油新井盈亏线65美元与OPEC财政平衡构成双重底",
        rawMaterial: "中东官价OSP小幅下调，VLCC海运费冬季季节性走强",
        freightFx: "人民币汇率偏弱令内盘SC表现强于外盘Brent/WTI",
        margin: "国内炼厂汽柴油裂解价差偏弱，综合炼油毛利维持微利",
        incentive: "Brent跌破70美元下方将倒逼OPEC+进一步延后增产，下方支撑扎实。",
        breakeven: 505
      },
      expectationGap: {
        score: 54,
        headline: "市场对2027年供应过剩高度一致，低库存下短期易现空头回补",
        actualVsExpected: "一致性预期过度悲观，但当前OPEC+护盘决心与低库存令现实并未迅速过剩。",
        curveFocus: "近强远弱 (2701)",
        curveFocusType: "near",
        detail: "近月受低库与冬季取暖油支撑呈小幅Back，远月计价明年非OPEC增量预期。"
      }
    },
    basisCurve: {
      basis: 5.5,
      basisPct: 1.01,
      structure: "back",
      structureLabel: "温和贴水 · 弱Back",
      nearFarSpread: 6.2,
      spreadDesc: "SC2701 - SC2704 = +6.2 元/桶",
      convergenceLogic: "小幅Back结构表明即期现货并未过剩，下行空间受OPEC+底线保护。",
      curvePoints: [
        { label: "中东现货折盘", price: 544.0 },
        { label: "2612", price: 541.2 },
        { label: "2701", price: 538.5 },
        { label: "2703", price: 534.8 },
        { label: "2705", price: 531.0 }
      ]
    },
    extended: {
      macroDriver: "地缘政治、美国能源政策与全球制造业周期三重博弈",
      positioning: "外盘管理基金原油净多处于历史低位，筹码干净不易崩盘",
      importExportParity: "SC相对Brent维持约 +1.2 美元/桶运费及汇率溢价",
      valuationScore: 62,
      driveScore: 52,
      strategy: "宽幅震荡思路对待：505-520区间逢低试多，580上方遇OPEC闲置产能与需求压制逢高减仓。",
      bullFactors: ["OECD商业库存与INE仓单均偏低，近月呈Back结构", "OPEC+延后增产托底，Brent 70美元附近有强政策底", "地缘风险与海运费波动随时触发脉冲上涨"],
      bearFactors: ["2027年美洲非OPEC原油供应增量预期压制远月", "新能源车与LNG重卡持续替代中国汽柴油需求"],
      falsification: "若OPEC+内部瓦解转向价格战大幅增产，则油价将跌破底部成本区间。"
    },
    tags: ["能化成本锚", "OPEC+托底", "低仓单", "区间震荡"]
  },
  {
    id: "ma",
    name: "甲醇",
    code: "MA2701",
    sinaSymbol: "nf_MA0",
    exchange: "CZCE",
    exchangeName: "郑商所",
    sector: "energy",
    sectorLabel: "能源化工系",
    tier: "upstream",
    subRole: "煤化工枢纽 · 煤制成本与伊朗冬季限气",
    unit: "元/吨",
    price: 2568,
    spotPrice: 2595,
    spotBenchmark: "太仓甲醇现货出罐",
    changePct: 1.10,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight",
      label: "货源转紧 (伊朗限气)",
      score: 70,
      deliverableSupply: "伊朗冬季天然气限气导致甲醇装置陆续停车，12-1月华东进口船货缩量预期强烈，港口可流通现货收紧。",
      warehouseReceipts: "6.4万吨",
      openInterest: "68.5万手",
      virtualToRealRatio: 10.7,
      squeezeRisk: "中等"
    },
    pillars: {
      supply: {
        score: 72,
        headline: "国内气头+伊朗进口双缩量，冬季供给边际收紧逻辑兑现",
        output: "国内煤制甲醇开工率 85.2% 高位，但西南天然气制甲醇冬季限气降负",
        utilization: "全国综合开工率环比回落 -2.1%",
        importFlow: "伊朗寒潮限气致多套大型装置停车，预计12-1月月均进口量骤降 25-30 万吨",
        disruptions: "伊朗装船量已出现明显下滑，直接决定华东港口1月到货紧张度。"
      },
      demand: {
        score: 64,
        headline: "华东MTO烯烃装置维持高开工，刚需消化顺畅",
        consumption: "烯烃需求占比 54%，传统下游甲醛/醋酸/MTBE开工平稳",
        downstreamOrders: "宁波、南京及兴兴大型MTO装置运行稳定",
        downstreamUtil: "MTO综合开工率 88.5%，处年内偏高水平",
        seasonality: "冬季燃料及防冻液季节性消费增量叠加MTO刚需，需求具韧性。"
      },
      inventory: {
        score: 66,
        headline: "港口库存见顶拐头进入去库通道，内地厂库处于低位",
        level: "华东+华南港口总库存 102 万吨 (环比 -5.8万吨)",
        velocity: "封航及到港缩量驱动港口加速去库",
        yoyCompare: "虽绝对库存高于去年同期 +8%，但12-1月去库预期极强",
        deliverableNote: "太仓现货基差走强至+27元，交割月港口货权集中度提升。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [76, 82, 68, 65, 72, 79, 96, 108, 114, 112, 102, null],
          lastYear: [78, 84, 71, 69, 75, 82, 92, 98, 99, 96, 94, 86],
          avg5y: [82, 88, 78, 75, 81, 86, 95, 101, 102, 98, 94, 88]
        }
      },
      costMargin: {
        score: 62,
        headline: "煤炭冬季支撑稳固，但MTO加工利润偏薄制约甲醇上方高度",
        rawMaterial: "坑口动力煤冬储需求托底煤制甲醇成本约 2150 元/吨",
        freightFx: "中东航线海运费偏强，人民币汇率抬高进口成本",
        margin: "煤制甲醇盈利 +260 元/吨；华东外采MTO装置即期利润 -320 元/吨",
        incentive: "煤企维持高开工，但若甲醇涨超2700将倒逼MTO停车形成负反馈天花板。",
        breakeven: 2320
      },
      expectationGap: {
        score: 72,
        headline: "伊朗限气早于且强于往年，港口去库斜率超预期",
        actualVsExpected: "市场原预期高港库将压制01合约至交割，实际伊朗寒潮提前限气导致到港断崖缩减，现实转紧。",
        curveFocus: "近月主导 (2701)",
        curveFocusType: "near",
        detail: "12-1月进口缺口精准对应2701近月合约；2705则交易明年春季伊朗复产回归。"
      }
    },
    basisCurve: {
      basis: 27,
      basisPct: 1.04,
      structure: "back",
      structureLabel: "现货升水 · Back走强",
      nearFarSpread: 68,
      spreadDesc: "MA2701 - MA2705 = +68 元/吨",
      convergenceLogic: "太仓现货升水且港口进入强去库周期，支撑2701强势正套结构。",
      curvePoints: [
        { label: "太仓现货", price: 2595 },
        { label: "2612", price: 2582 },
        { label: "2701", price: 2568 },
        { label: "2705", price: 2500 },
        { label: "2709", price: 2475 }
      ]
    },
    extended: {
      macroDriver: "强季节性品种，冬季限气+煤炭价格+MTO利润构成核心三角",
      positioning: "多头席位积极布局2701-2705正套，资金认可度高",
      importExportParity: "CFR中国甲醇报价攀升，顺挂利润收窄减少非伊货源流入",
      valuationScore: 60,
      driveScore: 72,
      strategy: "逢回调2500-2530偏多布局 MA2701 或参与 1-5 正套，上方2680-2720警惕MTO亏损负反馈。",
      bullFactors: ["伊朗冬季限气导致12-1月进口船货大幅缩量", "港口库存拐头加速去化，现货转为升水", "1-5正套逻辑清晰，近月弹性足"],
      bearFactors: ["华东外采MTO装置陷入亏损，高价可能触发负反馈停车", "国内煤制甲醇高利润下开工维持历史高位"],
      falsification: "若华东大型MTO装置集中宣布因亏损停车检修，或伊朗装置迅速复产，则多头离场。"
    },
    tags: ["伊朗冬季限气", "港口去库", "1-5正套", "MTO天花板"]
  },
  {
    id: "fu",
    name: "燃料油",
    code: "FU2701",
    sinaSymbol: "nf_FU0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "energy",
    sectorLabel: "能源化工系",
    tier: "midstream",
    subRole: "高硫重质油 · 航运船燃与炼厂进料",
    unit: "元/吨",
    price: 3145,
    spotPrice: 3210,
    spotBenchmark: "新加坡380CST高硫折人民币",
    changePct: 0.64,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight",
      label: "仓单极低 · 偏紧",
      score: 68,
      deliverableSupply: "国内保税高硫仓单处于极低水平，俄罗斯及中东发往亚洲高硫资源收紧，交割月货源偏紧。",
      warehouseReceipts: "1.9万吨",
      openInterest: "29.4万手",
      virtualToRealRatio: 15.5,
      squeezeRisk: "中等"
    },
    pillars: {
      supply: {
        score: 66,
        headline: "俄罗斯炼厂遇袭及出口受限，中东高硫外流缩减",
        output: "全球高硫重油产出受OPEC+重质油减产结构性制约",
        utilization: "美国及中国二次加工深加工装置争夺高硫进料",
        importFlow: "新加坡及富查伊拉高硫到港量环比回落 -8%",
        disruptions: "中东制裁升级与航运绕行拉长船期，导致新加坡现货贴水转升水。"
      },
      demand: {
        score: 64,
        headline: "脱硫塔船舶加注刚需稳健，中国地炼进口高硫作进料增加",
        consumption: "新加坡高硫船燃销量同比 +9.2%，脱硫塔船队持续扩张",
        downstreamOrders: "国内地炼因原油配额偏紧，增加高硫燃料油作为焦化进料采购",
        downstreamUtil: "红海绕行增加单航次船燃消耗量",
        seasonality: "中东夏季发电旺季已过，但冬季炼厂进料与船燃需求形成有效接棒。"
      },
      inventory: {
        score: 68,
        headline: "新加坡渣油库存低于5年均值，上期所FU仓单处于极低水位",
        level: "新加坡渣油库存 1840 万桶；SHFE仓单仅 1.9 万吨",
        velocity: "近三周持续去库，现货贴水收窄转升水",
        yoyCompare: "新加坡库存较5年均值低 11.4%，国内仓单同比 -62%",
        deliverableNote: "低仓单叠加现货升水+65元，2701近月合约抗跌性显著强于原油。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [21.2, 20.8, 21.5, 20.1, 19.4, 18.9, 19.6, 19.2, 18.8, 18.7, 18.4, null],
          lastYear: [22.4, 22.1, 21.8, 21.2, 20.5, 20.2, 20.8, 20.4, 20.1, 19.8, 19.6, 20.5],
          avg5y: [22.8, 22.5, 22.2, 21.9, 21.4, 21.2, 21.5, 21.3, 21.0, 20.8, 20.7, 21.2]
        }
      },
      costMargin: {
        score: 60,
        headline: "高硫裂解价差偏强，原油成本端相对企稳",
        rawMaterial: "中东重质含硫原油贴水坚挺，高硫燃料油裂解价差维持高位",
        freightFx: "美元兑人民币偏强+油轮运价走高抬升内盘估值",
        margin: "脱硫塔高低硫价差(Hi-5)维持合理经济性，支撑船东持续采购高硫",
        incentive: "高裂解价差反映市场真实紧缺，但在原油未趋势大涨前上方空间需关注裂解估值。",
        breakeven: 2980
      },
      expectationGap: {
        score: 64,
        headline: "淡季不淡，进料需求与俄罗斯发货缩量超预期",
        actualVsExpected: "市场原预期中东发电季结束后高硫将快速走弱，实际地炼进料与俄油受阻令现实保持偏紧。",
        curveFocus: "近月主导 (2701)",
        curveFocusType: "near",
        detail: "新加坡高硫月差维持强Back，国内FU2701同样呈现近强远弱。"
      }
    },
    basisCurve: {
      basis: 65,
      basisPct: 2.02,
      structure: "back",
      structureLabel: "现货升水 · 强Back",
      nearFarSpread: 92,
      spreadDesc: "FU2701 - FU2705 = +92 元/吨",
      convergenceLogic: "极低仓单+现货升水65元，临近交割支撑FU2701维持强Back。",
      curvePoints: [
        { label: "新加坡折盘", price: 3210 },
        { label: "2612", price: 3178 },
        { label: "2701", price: 3145 },
        { label: "2703", price: 3098 },
        { label: "2705", price: 3053 }
      ]
    },
    extended: {
      macroDriver: "兼具原油成本传导与全球航运景气度双重属性",
      positioning: "跨期正套与多高硫空低硫(多FU空LU)策略资金活跃",
      importExportParity: "内盘FU相对新加坡纸货略微贴水，进口仓单注册意愿偏低",
      valuationScore: 56,
      driveScore: 68,
      strategy: "逢回调轻仓偏多 FU2701，或参与正套（多FU2701空FU2705）/ 多高硫空原油裂解。",
      bullFactors: ["SHFE注册仓单不足2万吨，交割月货源偏紧", "OPEC+重质油减产+俄油发运受限，新加坡现货坚挺", "脱硫塔船燃与地炼进料需求双支撑"],
      bearFactors: ["高硫裂解价差已处于历史偏高分位，追高赔率收敛", "若国际原油大跌将直接拖累绝对价格"],
      falsification: "若俄罗斯高硫出口大幅恢复且新加坡渣油库存回升至2200万桶上方，则偏多逻辑减弱。"
    },
    tags: ["极低仓单", "强Back", "裂解强势", "船燃+进料"]
  },
  {
    id: "ta",
    name: "PTA",
    code: "TA2701",
    sinaSymbol: "nf_TA0",
    exchange: "CZCE",
    exchangeName: "郑商所",
    sector: "energy",
    sectorLabel: "能源化工系",
    tier: "midstream",
    subRole: "聚酯化纤核心中间体 · 原油-PX-聚酯链",
    unit: "元/吨",
    price: 4920,
    spotPrice: 4865,
    spotBenchmark: "华东PTA现货自提",
    changePct: -0.52,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "loose",
      label: "产能过剩 · 货源宽松",
      score: 34,
      deliverableSupply: "PTA行业产能基数庞大且交易所仓单充裕，大厂随时可通过基差贸易向盘面交货。",
      warehouseReceipts: "14.2万张 (71万吨)",
      openInterest: "105万手",
      virtualToRealRatio: 7.4,
      squeezeRisk: "极低"
    },
    pillars: {
      supply: {
        score: 36,
        headline: "国内PTA新装置投产叠加高开工，月度供应维持宽松",
        output: "国内PTA周度产量 142 万吨 (同比 +7.4%)",
        utilization: "PTA行业负荷高达 82.8%，仅零星老旧装置例行检修",
        importFlow: "中国为全球绝对产能中心，月均出口约 35 万吨但难解内需过剩",
        disruptions: "2026年底至2027年仍有千万吨级新装置计划投放，供给压力持久。"
      },
      demand: {
        score: 58,
        headline: "聚酯负荷维持90%韧性，但终端织造进入季节性降温",
        consumption: "聚酯综合开工率 90.4%，对PTA刚需承接尚可",
        downstreamOrders: "江浙织机开工率回落至 71%，冬装补单尾声、外贸订单平淡",
        downstreamUtil: "涤纶长丝库存温和回升，聚酯厂促销去库意愿增强",
        seasonality: "12月至春节前下游织造将逐步降负放假，聚酯端面临季节性累库。"
      },
      inventory: {
        score: 32,
        headline: "社会库存叠加仓单处于历年同期偏高水平，年底预期继续累库",
        level: "PTA社会总库存 435 万吨 (含仓单71万吨)",
        velocity: "周度累库 +4.8 万吨，预计12月累库幅度进一步放大",
        yoyCompare: "较去年同期 +14.2%，高于5年均值 19%",
        deliverableNote: "71万吨仓单高悬，且期货升水现货55元，交割月卖压沉重。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [380, 445, 452, 425, 395, 388, 398, 410, 418, 426, 435, null],
          lastYear: [345, 405, 412, 392, 375, 368, 372, 376, 378, 380, 381, 398],
          avg5y: [330, 385, 390, 372, 355, 348, 350, 355, 358, 362, 365, 378]
        }
      },
      costMargin: {
        score: 52,
        headline: "PTA加工费被压缩至320元低位，价格完全锚定PX与原油成本",
        rawMaterial: "PX亚洲开工高位，PXN价差偏弱至 210 美元/吨低位",
        freightFx: "汇率偏弱对进口PX及原油折算有小幅托底",
        margin: "PTA即期现货加工费约 320 元/吨 (贴近大厂盈亏平衡线)",
        incentive: "低加工费虽抑制中小老装置，但一体化大厂仍维持满产保份额。",
        breakeven: 4720
      },
      expectationGap: {
        score: 40,
        headline: "PX调油逻辑证伪叠加年底累库预期，现实偏松",
        actualVsExpected: "芳烃调油需求低迷令上游PX让利超预期，成本支撑弱化叠加累库，格局比市场预期更松。",
        curveFocus: "近月承压 (Contango)",
        curveFocusType: "near",
        detail: "高仓单与期货升水55元令2701面临交割压力，远月跟随原油波动。"
      }
    },
    basisCurve: {
      basis: -55,
      basisPct: -1.13,
      structure: "contango",
      structureLabel: "期货升水 · Contango",
      nearFarSpread: -86,
      spreadDesc: "TA2701 - TA2705 = -86 元/吨",
      convergenceLogic: "现货贴水期货55元且仓单庞大，临近交割基差偏向通过期货回落收敛。",
      curvePoints: [
        { label: "华东现货", price: 4865 },
        { label: "2612", price: 4895 },
        { label: "2701", price: 4920 },
        { label: "2705", price: 5006 },
        { label: "2709", price: 5060 }
      ]
    },
    extended: {
      macroDriver: "成本端高度绑定原油，自身作为能化产能过剩空配标的",
      positioning: "龙头聚酯及PTA大厂卖保盘主导，盘面升水即遭套保压制",
      importExportParity: "PX亚洲供应充裕，国内自给率持续提升",
      valuationScore: 54,
      driveScore: 38,
      strategy: "逢反弹空配 TA2701 或参与多原油/多甲醇空PTA的能化内部对冲，低加工费下不追深跌。",
      bullFactors: ["PTA加工费与PXN价差均处低位，估值已挤出大部分泡沫", "若原油突发地缘暴涨将带动成本端脉冲反弹"],
      bearFactors: ["产能过剩+71万吨高仓单，12月步入季节性累库周期", "期货升水现货55元，交割月面临期现回归压力", "下游织造步入季节性淡季"],
      falsification: "若国际原油大涨突破85美元或PTA大厂联合意外停车检修超15%产能，则空头止损。"
    },
    tags: ["产能过剩", "低加工费", "高仓单", "能化空配"]
  },
  {
    id: "sa",
    name: "纯碱",
    code: "SA2701",
    sinaSymbol: "nf_SA0",
    exchange: "CZCE",
    exchangeName: "郑商所",
    sector: "energy",
    sectorLabel: "能源化工系",
    tier: "midstream",
    subRole: "玻璃核心基础化工原料 · 天然碱扩产周期",
    unit: "元/吨",
    price: 1510,
    spotPrice: 1470,
    spotBenchmark: "沙河重质纯碱送到价",
    changePct: -1.18,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "surplus",
      label: "历史天量库存 · 极度偏松",
      score: 20,
      deliverableSupply: "碱厂厂库创历史新高且郑商所交割仓单充足，天然碱低成本产能持续释放，交割货源极度过剩。",
      warehouseReceipts: "32万吨",
      openInterest: "94万手",
      virtualToRealRatio: 5.9,
      squeezeRisk: "极低"
    },
    pillars: {
      supply: {
        score: 24,
        headline: "天然碱新产能满产运行，行业周产高居72万吨以上",
        output: "国内纯碱周度产量 72.8 万吨 (同比 +14.5%)",
        utilization: "行业开工率 86.5%，夏季检修季结束后产能全面释放",
        importFlow: "纯碱由净进口转为净出口，但海外需求难以消化国内巨大增量",
        disruptions: "冬季环保检查偶有零星短停，对总供给几乎无实质削减。"
      },
      demand: {
        score: 36,
        headline: "光伏玻璃与浮法玻璃双双冷修减产，重碱刚需持续萎缩",
        consumption: "浮法+光伏玻璃日熔量合计较年中高点减少 2.2 万吨/日",
        downstreamOrders: "玻璃厂纯碱原料库存充足，按需压价采购为主",
        downstreamUtil: "光伏组件排产控产去库，光伏玻璃产能出清直接打击重碱需求",
        seasonality: "年底下游以消化库存回笼资金为主，重碱补库动力极弱。"
      },
      inventory: {
        score: 18,
        headline: "碱厂库存突破165万吨创历史天量，持续累库无拐点",
        level: "样本纯碱厂家总库存 166 万吨 (重碱98 + 轻碱68)",
        velocity: "周度继续累库 +3.4 万吨，库存已达历史极值",
        yoyCompare: "较去年同期暴增 +210%，处于近5年 99% 极高分位",
        deliverableNote: "166万吨厂库叠加32万吨仓单，货源极度过剩，任何升水均被期现商套利锁死。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [44, 85, 88, 89, 86, 98, 108, 122, 142, 158, 166, null],
          lastYear: [32, 29, 28, 42, 54, 46, 38, 16, 22, 48, 53.5, 41],
          avg5y: [65, 82, 78, 74, 72, 68, 62, 54, 52, 58, 60, 58]
        }
      },
      costMargin: {
        score: 52,
        headline: "氨碱法陷入亏损逼近现金底，但低成本天然碱仍暴利扩张",
        rawMaterial: "原盐与动力煤平稳，合成氨价格偏弱降低联碱成本",
        freightFx: "内陆汽运火运顺畅，纯内循环定价",
        margin: "天然碱毛利仍超 +550 元/吨；氨碱法亏损 -120 元/吨；联碱双吨微利",
        incentive: "必须跌破氨碱现金成本线引发大规模减产才能见到真正底，目前出清尚不充分。",
        breakeven: 1380
      },
      expectationGap: {
        score: 28,
        headline: "玻璃冷修加速叠加碱厂累库失控，过剩程度持续超预期",
        actualVsExpected: "市场原期待氨碱亏损后迅速减产止跌，实际高开工叠加光伏玻璃冷修令累库速度远超预期。",
        curveFocus: "全曲线过剩 (近月尤甚)",
        curveFocusType: "near",
        detail: "2701升水沙河现货40元且临近交割，套保盘出货压力集中冲击近月。"
      }
    },
    basisCurve: {
      basis: -40,
      basisPct: -2.72,
      structure: "contango",
      structureLabel: "期货升水 · 深Contango",
      nearFarSpread: -95,
      spreadDesc: "SA2701 - SA2705 = -95 元/吨",
      convergenceLogic: "期货升水现货40元且Contango结构给期现商提供丰厚无风险正套交割空间。",
      curvePoints: [
        { label: "沙河现货", price: 1470 },
        { label: "2612", price: 1492 },
        { label: "2701", price: 1510 },
        { label: "2705", price: 1605 },
        { label: "2709", price: 1665 }
      ]
    },
    extended: {
      macroDriver: "地产竣工下行与光伏产能出清双压，需等待高成本产能实质退出",
      positioning: "空头产业套保盘牢牢掌控主导权，散户抄底资金屡次被埋",
      importExportParity: "国内价格全球洼地，出口量有所增长但杯水车薪",
      valuationScore: 54,
      driveScore: 24,
      strategy: "高胜率空头配置：逢宏观情绪反弹至1580-1630区间坚决逢高沽空 SA2701/2705，或做空纯碱多玻璃。",
      bullFactors: ["绝对价格已跌穿氨碱完全成本线，若触发大厂联合检修易现剧烈空头回补反弹"],
      bearFactors: ["166万吨历史天量厂库+32万吨仓单，交割月极度过剩", "浮法与光伏玻璃同步冷修，需求持续萎缩", "期货升水+深Contango，期现回归利空近月"],
      falsification: "若氨碱/联碱大厂出现超15%产能实质性停产减量且厂库连续4周去库超20万吨，则空单止盈。"
    },
    tags: ["166万天量库存", "双玻璃冷修", "期货升水", "核心空配"]
  },
  {
    id: "pp",
    name: "聚丙烯",
    code: "PP2701",
    sinaSymbol: "nf_PP0",
    exchange: "DCE",
    exchangeName: "大商所",
    sector: "energy",
    sectorLabel: "能源化工系",
    tier: "downstream",
    subRole: "通用塑料终端原料 · 油煤PDH多路线博弈",
    unit: "元/吨",
    price: 7420,
    spotPrice: 7460,
    spotBenchmark: "华东拉丝PP现货",
    changePct: 0.14,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight_balance",
      label: "紧平衡 (低库弱扩产)",
      score: 52,
      deliverableSupply: "石化两油库存处于年内偏低位置，但四季度仍有新装置投产压力，交割资源总体均衡。",
      warehouseReceipts: "1.1万手 (5.5万吨)",
      openInterest: "38.6万手",
      virtualToRealRatio: 7.0,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 46,
        headline: "PDH亏损引发阶段性停车检修，对冲部分新装置投产增量",
        output: "国内PP周度产量 68.5 万吨 (同比 +4.2%)",
        utilization: "行业开工率 76.4%，PDH丙烷脱氢产线开工受利润压制",
        importFlow: "拉丝级PP国产自给率超95%，东南亚出口窗口间歇打开",
        disruptions: "多家油制及PDH大厂11-12月安排临时降负，缓解供应冲击。"
      },
      demand: {
        score: 54,
        headline: "家电汽车改性共聚需求亮眼，但塑编与膜料订单转淡",
        consumption: "下游塑编开工 46%、BOPP膜 56%、汽车注塑开工 68%",
        downstreamOrders: "以旧换新拉动白电与新能源车共聚PP消费，拉丝表现平淡",
        downstreamUtil: "下游工厂原料库存偏低，刚需补库为主",
        seasonality: "双11电商包装旺季结束，12月转向春节备货小周期。"
      },
      inventory: {
        score: 60,
        headline: "两油石化库存处于68万吨偏低水平，无明显库存积压",
        level: "两油聚烯烃总库存 68 万吨 (环比 -3.5万吨)",
        velocity: "石化去库顺畅，中游贸易商持货谨慎",
        yoyCompare: "较去年同期 -4.5%，处于5年同期偏低位置",
        deliverableNote: "标准品拉丝排产比例偏低（仅25%），使期货交割品略显紧平衡。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [64, 96, 88, 84, 81, 79, 77, 76, 74, 71.5, 68, null],
          lastYear: [62, 92, 85, 82, 80, 78, 76, 75, 73, 72, 71.2, 65],
          avg5y: [68, 102, 94, 89, 85, 82, 80, 79, 77, 75, 73, 68]
        }
      },
      costMargin: {
        score: 58,
        headline: "油制、PDH、外采MTO三路工艺普遍亏损，成本底部扎实",
        rawMaterial: "原油稳健+丙烷CP冬季走强+甲醇偏强，三大原料成本均有支撑",
        freightFx: "丙烷与原油海运费冬季偏强",
        margin: "油制PP亏损 -420 元/吨；PDH亏损 -580 元/吨；煤制一体化微利 +280 元/吨",
        incentive: "全行业低利润倒逼存量装置高检修率，封杀深跌空间。",
        breakeven: 7250
      },
      expectationGap: {
        score: 52,
        headline: "低排产比例与石化低库令盘面韧性略好于悲观产能预期",
        actualVsExpected: "市场长期看空聚烯烃扩产周期，但标品拉丝低排产和PDH亏损令近月难现流畅下跌。",
        curveFocus: "近月支撑 (2701)",
        curveFocusType: "near",
        detail: "2701贴水现货40元且标品排产低，2705则继续消化明年新产能预期。"
      }
    },
    basisCurve: {
      basis: 40,
      basisPct: 0.54,
      structure: "back",
      structureLabel: "微贴水 · 弱Back",
      nearFarSpread: 55,
      spreadDesc: "PP2701 - PP2705 = +55 元/吨",
      convergenceLogic: "微贴水现货40元，高检修与低库存支撑近月维持震荡抗跌。",
      curvePoints: [
        { label: "华东现货", price: 7460 },
        { label: "2612", price: 7440 },
        { label: "2701", price: 7420 },
        { label: "2705", price: 7365 },
        { label: "2709", price: 7330 }
      ]
    },
    extended: {
      macroDriver: "典型的“高产能+低估值+成本定价”品种，波动率偏低",
      positioning: "多空分歧较小，常作为做空PP-3MA（MTO利润）的配对头寸",
      importExportParity: "拉丝出口东南亚窗口微幅开启，缓解华南压力",
      valuationScore: 60,
      driveScore: 52,
      strategy: "中性震荡思路：7250-7600区间高抛低吸；套利关注做缩MTO利润（多MA空PP）。",
      bullFactors: ["油制/PDH深度亏损，原料甲醇与丙烷走强托底成本", "两油库存偏低且标品拉丝排产仅25%", "期货小幅贴水现货"],
      bearFactors: ["中长期扩产周期尚未结束，上方反弹即面临新装置套保压制", "塑编传统终端步入淡季"],
      falsification: "若国际原油大跌拖累成本塌陷且两油库存回升至90万吨上方，则向下破位。"
    },
    tags: ["多工艺亏损", "标品低排产", "震荡区间", "多MA空PP"]
  },
  {
    id: "fg",
    name: "玻璃",
    code: "FG2701",
    sinaSymbol: "nf_FG0",
    exchange: "CZCE",
    exchangeName: "郑商所",
    sector: "energy",
    sectorLabel: "能源化工系",
    tier: "downstream",
    subRole: "地产竣工端核心建材 · 产线冷修博弈",
    unit: "元/吨",
    price: 1325,
    spotPrice: 1350,
    spotBenchmark: "沙河5mm白玻现货",
    changePct: 0.91,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight_balance",
      label: "去库修复 · 紧平衡",
      score: 58,
      deliverableSupply: "前期行业深度亏损倒逼大量老旧产线集中冷修，日熔量创近三年新低，沙河库存明显去化。",
      warehouseReceipts: "1.6万吨",
      openInterest: "96万手",
      virtualToRealRatio: 30.0,
      squeezeRisk: "中等"
    },
    pillars: {
      supply: {
        score: 72,
        headline: "行业亏损倒逼产线密集冷修，日熔量降至15.8万吨低位",
        output: "浮法玻璃在产日熔量 15.8 万吨 (较年内高点剧降 -10.4%)",
        utilization: "产线产能利用率降至 78.2%，供给端实质性出清效果显现",
        importFlow: "纯内循环品种，无进口冲击",
        disruptions: "一旦点火复产成本极高，冷修产线在利润未持续修复前不会轻易复产。"
      },
      demand: {
        score: 48,
        headline: "北方赶工步入尾声，但化债与保交房推动华东华南刚需企稳",
        consumption: "深加工企业订单天数回升至 13.5 天 (环比改善)",
        downstreamOrders: "中游贸易商与期现商库存低位，低价补库意愿较强",
        downstreamUtil: "地产竣工周期仍在探底，但边际失速最坏阶段已过",
        seasonality: "12月北方将逐步停工进入淡季，华南华东赶工支撑至元旦前后。"
      },
      inventory: {
        score: 64,
        headline: "厂库连续八周大幅去化，沙河与湖北产销率维持100%以上",
        level: "样本浮法玻璃厂库 4920 万重箱 (较三季度高点大降 2400 万重箱)",
        velocity: "周度去库 -185 万重箱，去库流畅度远超预期",
        yoyCompare: "仍高于去年同期 +12%，但较前期极端库存压力大幅缓解",
        deliverableNote: "注册仓单降至1.6万吨低位，且期价微贴水现货，交割压力较三季度大为减轻。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [3300, 5600, 6450, 6100, 5980, 6150, 6750, 7050, 7320, 5850, 4920, null],
          lastYear: [3250, 5400, 5800, 5200, 4900, 5100, 4800, 4400, 4150, 4250, 4390, 3850],
          avg5y: [3900, 6100, 6500, 5900, 5400, 5200, 5050, 4850, 4750, 4900, 4850, 4500]
        }
      },
      costMargin: {
        score: 60,
        headline: "上游纯碱暴跌大幅让利，玻璃煤制气与石油焦工艺重回盈利",
        rawMaterial: "重质纯碱跌破1500元大幅降低玻璃生产成本约 180 元/吨",
        freightFx: "煤炭/天然气冬季燃料成本微升",
        margin: "石油焦产线盈利 +150 元/吨；煤制气盈利 +90 元/吨；天然气产线微亏 -40 元/吨",
        incentive: "低成本产线利润修复后冷修速度放缓，需警惕1450上方诱发产线点火复产。",
        breakeven: 1220
      },
      expectationGap: {
        score: 68,
        headline: "供给冷修出清+连续去库超预期，成为建材链中弹性最大的修复品种",
        actualVsExpected: "市场原以为地产低迷将令玻璃永无翻身之日，实际冷修减产叠加纯碱让利令厂库大降，现实强于预期。",
        curveFocus: "近远共振修复",
        curveFocusType: "both",
        detail: "2701交易冷修去库与低仓单；2705远月交易明年政策刺激与竣工企稳预期。"
      }
    },
    basisCurve: {
      basis: 25,
      basisPct: 1.85,
      structure: "contango",
      structureLabel: "近贴水现货 · 远月升水",
      nearFarSpread: -65,
      spreadDesc: "FG2701 - FG2705 = -65 元/吨 (远月计价宏观预期)",
      convergenceLogic: "2701贴水沙河现货25元且仓单极低，短期现货挺价支撑2701偏强。",
      curvePoints: [
        { label: "沙河现货", price: 1350 },
        { label: "2612", price: 1338 },
        { label: "2701", price: 1325 },
        { label: "2705", price: 1390 },
        { label: "2709", price: 1445 }
      ]
    },
    extended: {
      macroDriver: "强宏观情绪与地产政策博弈品种，高波动高弹性",
      positioning: "多头资金青睐“多玻璃空纯碱”的产业链利润扩张组合",
      importExportParity: "纯内需定价，不受海外汇率和进出口干扰",
      valuationScore: 64,
      driveScore: 66,
      strategy: "逢回调1260-1290轻仓偏多 FG2701，最佳策略为产业链套利：多玻璃空纯碱（做扩玻璃利润）。",
      bullFactors: ["日熔量大幅冷修至15.8万吨，供给实质性出清", "厂库连续八周大降2400万重箱，仓单极低", "纯碱暴跌显著修复玻璃厂现金流利润"],
      bearFactors: ["冬季临近北方施工停工，12月下旬面临季节性累库考验", "若价格大涨至1500上方，冷修产线重新点火将破坏供需平衡"],
      falsification: "若玻璃产销率跌破80%且厂库重新大幅累库超6000万重箱，或产线密集复产，则多头离场。"
    },
    tags: ["产线冷修出清", "连续大幅去库", "纯碱让利", "多玻璃空纯碱"]
  },
  {
    id: "ru",
    name: "天然橡胶",
    code: "RU2701",
    sinaSymbol: "nf_RU0",
    exchange: "SHFE",
    exchangeName: "上期所",
    sector: "energy",
    sectorLabel: "能源化工系",
    tier: "downstream",
    subRole: "轮胎核心原料 · 东南亚天气与割胶周期",
    unit: "元/吨",
    price: 17850,
    spotPrice: 17520,
    spotBenchmark: "上海云南全乳胶现货",
    changePct: 1.25,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight",
      label: "低产季临近 · 结构偏紧",
      score: 68,
      deliverableSupply: "云南产区11月底全面停割，海南12月停割；今年新胶交割品增量有限，老胶集中注销后新仓单压力轻。",
      warehouseReceipts: "14.8万吨 (老胶刚注销)",
      openInterest: "16.4万手",
      virtualToRealRatio: 11.1,
      squeezeRisk: "中等"
    },
    pillars: {
      supply: {
        score: 74,
        headline: "泰国南部强降雨反复干扰割胶，国内云南海南步入冬季停割期",
        output: "泰国原料胶水/杯胶价格居高不下，旺产季上量持续不及预期",
        utilization: "ANRPC主产国2012-2019低价期新种面积锐减，全球产能进入长周期拐点",
        importFlow: "国内天胶月度进口量同比偏低 -6.8%，青岛到港节奏偏慢",
        disruptions: "拉尼娜气候叠加泰南暴雨洪水频发，严重制约四季度旺产期割胶天数。"
      },
      demand: {
        score: 64,
        headline: "半钢胎出口维持历史高开工，重卡置换政策托底全钢胎",
        consumption: "国内半钢胎开工率高达 79.4% (创近5年同期新高)",
        downstreamOrders: "海外欧美雪地胎及替换胎出口订单饱满，全钢胎开工 61% 企稳",
        downstreamUtil: "新能源车保有量激增大幅提升高规格半钢胎替换消费",
        seasonality: "12月轮胎厂冲刺年度目标及海外圣诞补货，下游刚需强劲。"
      },
      inventory: {
        score: 72,
        headline: "青岛保税+一般贸易库存处于近5年同期绝对低位",
        level: "青岛天然橡胶总库存 42.6 万吨 (远低于去年同期 68 万吨)",
        velocity: "季节性累库迟迟未大规模兑现，库存持续低位徘徊",
        yoyCompare: "较去年同期 -37.4%，处5年历史 15% 低位",
        deliverableNote: "11月RU老胶仓单集中注销完毕，2701新仓单注册进度偏慢，交割压力极轻。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [67, 66, 65, 61, 56, 51, 47, 45, 43, 41.8, 42.6, null],
          lastYear: [68, 74, 79, 82, 84, 83, 81, 78, 74, 70, 68, 67],
          avg5y: [65, 70, 74, 73, 70, 68, 66, 64, 62, 60, 59, 60]
        }
      },
      costMargin: {
        score: 66,
        headline: "泰国原料胶水高价支撑加工成本，合成胶丁二烯坚挺形成替代托底",
        rawMaterial: "泰国合艾胶水价格维持 72 泰铢/公斤高位，加工厂生产利润微薄",
        freightFx: "海运费平稳，美元兑人民币走强抬升进口美金胶成本",
        margin: "国内浓乳与全乳胶利润倒挂，海南胶水持续分流至浓乳减少全乳交割品",
        incentive: "高原料成本+低全乳产出促使交割品偏紧，支撑盘面估值重心上移。",
        breakeven: 16500
      },
      expectationGap: {
        score: 70,
        headline: "旺产季不旺+青岛迟迟未见大累库，供给偏紧超市场预期",
        actualVsExpected: "市场原预期11-12月东南亚旺产季将触发青岛大幅累库压垮胶价，实际降雨扰动令累库极慢，现实更紧。",
        curveFocus: "近远共振偏多",
        curveFocusType: "both",
        detail: "2701受益于老胶注销与国内停割；2705交易次年一季度东南亚全面停割与EUDR合规溢价。"
      }
    },
    basisCurve: {
      basis: -330,
      basisPct: -1.88,
      structure: "contango",
      structureLabel: "常规期货升水 · 升水收窄",
      nearFarSpread: -180,
      spreadDesc: "RU2701 - RU2705 = -180 元/吨 (低于历史正常仓储升水)",
      convergenceLogic: "RU因全乳胶金融交割属性常年升水现货，当前-330元升水处于历年偏低水平，套利抛压显著减轻。",
      curvePoints: [
        { label: "全乳现货", price: 17520 },
        { label: "2701", price: 17850 },
        { label: "2705", price: 18030 },
        { label: "2709", price: 18160 }
      ]
    },
    extended: {
      macroDriver: "具备农作物天气属性与汽车工业消费双重特征，产能大周期拐点显现",
      positioning: "套利非标空头因升水收窄撤退，多头配置资金逐步主导趋势",
      importExportParity: "泰国混合胶与NR20号胶同步走强，内外盘正反馈明显",
      valuationScore: 60,
      driveScore: 74,
      strategy: "顺势逢低偏多布局 RU2701 / RU2705，回调至17000-17300区间分批建仓。",
      bullFactors: ["青岛库存较去年大降37%，旺产季累库不及预期", "泰南强降雨干扰割胶叠加国内云南海南全面停割", "半钢胎开工创5年新高，老胶注销后新仓单压力极轻"],
      bearFactors: ["欧盟EUDR法案延后实施令部分政策溢价回吐", "若泰南放晴导致12月下旬到港井喷，可能引发高位宽幅震荡"],
      falsification: "若泰国原料胶水暴跌超20%且青岛库存单月累库超15万吨，则多头趋势破坏。"
    },
    tags: ["泰南降雨扰动", "青岛低库存", "半钢胎高开工", "产能周期拐点"]
  },

  /* ==================== 农产品系 (7) ==================== */
  {
    id: "c",
    name: "玉米",
    code: "C2701",
    sinaSymbol: "nf_C0",
    exchange: "DCE",
    exchangeName: "大商所",
    sector: "agri",
    sectorLabel: "农产品系",
    tier: "upstream",
    subRole: "饲料与深加工粮食底座 · 东北新粮上量博弈",
    unit: "元/吨",
    price: 2215,
    spotPrice: 2180,
    spotBenchmark: "锦州港二等新玉米平舱价",
    changePct: -0.45,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "loose",
      label: "新粮上量 · 货源宽松",
      score: 36,
      deliverableSupply: "东北及华北新季玉米集中上市售粮，北方港口集港量创同期新高，可交割新粮极为充裕。",
      warehouseReceipts: "6.5万手 (65万吨)",
      openInterest: "72万手",
      virtualToRealRatio: 11.1,
      squeezeRisk: "极低"
    },
    pillars: {
      supply: {
        score: 34,
        headline: "东北新季玉米丰产且基层售粮进度加快，潮粮上市压力集中",
        output: "全国新季玉米产量维持 2.9 亿吨高位，华北与东北同步丰收",
        utilization: "东北农户售粮进度约 28%，春节前仍有大量地趴粮待变现",
        importFlow: "进口玉米与大麦高粱配额严控缩量，远期进口替代压力大减",
        disruptions: "东北气温偏暖不利于潮粮长期储存，迫使农户加快售粮节奏。"
      },
      demand: {
        score: 54,
        headline: "生猪存栏回升+深加工高开机承接，但贸易商建库仍偏谨慎",
        consumption: "淀粉及酒精深加工企业开机率回升至 66.5%",
        downstreamOrders: "大型饲料厂按需滚动补库，尚未开启大规模囤粮",
        downstreamUtil: "生猪养殖盈利恢复带动能量饲料消费稳步回暖",
        seasonality: "11月下旬至12月为东北基层售粮高峰，需待元旦后贸易商与中储粮增储承接。"
      },
      inventory: {
        score: 38,
        headline: "北方四港库存快速攀升至430万吨高位，短期消化承压",
        level: "北方四港库存 432 万吨 (环比 +38万吨)；深加工库存回升",
        velocity: "新粮集港高峰期，港口连续四周大幅累库",
        yoyCompare: "北港库存较去年同期 +68%，创近5年同期新高",
        deliverableNote: "北港高库存叠加盘面升水现货35元，交割套保货源源源不断。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [185, 165, 220, 295, 310, 260, 215, 175, 155, 245, 432, null],
          lastYear: [195, 180, 210, 265, 280, 245, 205, 168, 142, 188, 257, 235],
          avg5y: [230, 215, 250, 290, 305, 275, 240, 200, 175, 210, 275, 265]
        }
      },
      costMargin: {
        score: 64,
        headline: "价格已跌破东北包地种植完全成本，政策收储预期托底下方",
        rawMaterial: "东北包地种植成本约 2250-2350 元/吨，自有地成本约 1850 元",
        freightFx: "北粮南运海运费小幅走强",
        margin: "玉米淀粉加工利润转正 +85 元/吨，刺激深加工维持高开机",
        incentive: "低价抑制进口替代并刺激中储粮增储意愿，2150下方具备强政策底与长线价值。",
        breakeven: 2140
      },
      expectationGap: {
        score: 44,
        headline: "暖冬潮粮售粮压力大于预期，但进口严控为远月埋下反转种子",
        actualVsExpected: "市场原预期增储迅速拉起粮价，实际暖冬潮粮集中变现令北港累库超预期，近月比预期更松。",
        curveFocus: "近弱远强 (2701承压 / 2705看底)",
        curveFocusType: "near",
        detail: "2701直面春节前售粮高峰与升水回归压力；2705/2709远月交易进口缩量与供需再平衡。"
      }
    },
    basisCurve: {
      basis: -35,
      basisPct: -1.61,
      structure: "contango",
      structureLabel: "期货升水 · 典型Contango",
      nearFarSpread: -65,
      spreadDesc: "C2701 - C2705 = -65 元/吨",
      convergenceLogic: "北港新粮集中上量+期货升水35元，临近交割2701面临仓单压制向现货靠拢。",
      curvePoints: [
        { label: "锦州港现货", price: 2180 },
        { label: "2701", price: 2215 },
        { label: "2703", price: 2248 },
        { label: "2705", price: 2280 },
        { label: "2709", price: 2335 }
      ]
    },
    extended: {
      macroDriver: "高度受中储粮收储公告、进口配额管控及生猪存栏周期影响",
      positioning: "粮贸套保盘逢高锁利2701，长线价值资金在2705下方左侧潜伏",
      importExportParity: "美玉米完税成本已高于国产玉米，商业进口窗口基本关闭",
      valuationScore: 70,
      driveScore: 40,
      strategy: "低估值弱驱动：2701短期承压震荡偏空不追多，耐心等待12月下旬售粮高峰过后在2705布局长线多单。",
      bullFactors: ["价格跌破包地成本线，进口窗口关闭且中储粮增储托底", "深加工盈利高开机叠加生猪存栏回升，需求温和改善"],
      bearFactors: ["暖冬加速潮粮上市，北港库存飙升至432万吨创5年新高", "期货升水现货+高仓单，2701交割月承压"],
      falsification: "若中储粮突然宣布大规模高溢价增储收购，则底部提前启动反转。"
    },
    tags: ["新粮售粮高峰", "北港高库", "政策底临近", "近弱远强"]
  },
  {
    id: "p",
    name: "棕榈油",
    code: "P2701",
    sinaSymbol: "nf_P0",
    exchange: "DCE",
    exchangeName: "大商所",
    sector: "agri",
    sectorLabel: "农产品系",
    tier: "upstream",
    subRole: "东南亚热带油料源头 · 生柴与减产周期驱动",
    unit: "元/吨",
    price: 9840,
    spotPrice: 10060,
    spotBenchmark: "华南24度棕榈油现货",
    changePct: 1.54,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "very_tight",
      label: "买船倒挂 · 极度偏紧",
      score: 84,
      deliverableSupply: "国内进口利润深度倒挂导致前期买船极少，华南华东港口24度现货紧缺，注册仓单极低。",
      warehouseReceipts: "0.4万吨",
      openInterest: "44.2万手",
      virtualToRealRatio: 110.5,
      squeezeRisk: "高"
    },
    pillars: {
      supply: {
        score: 84,
        headline: "马印步入季节性减产周期，洪涝降雨叠加树龄老化强化减产",
        output: "马来西亚11月产量环比大降 -9.2%，印尼主产区受降雨影响产出不及预期",
        utilization: "东南亚油棕树龄老化结构性压制单产上限",
        importFlow: "国内12-1月买船严重不足，预计月均到港量仅 22-25 万吨低位",
        disruptions: "拉尼娜带来的东南亚强降雨直接阻碍油棕鲜果串收割与外运。"
      },
      demand: {
        score: 76,
        headline: "印尼B40生柴政策强制落地锁定巨量消费，海外斋月备货临近",
        consumption: "印尼生柴消费增量预计超 250 万吨/年，彻底重塑全球供需平衡表",
        downstreamOrders: "国内因高价压缩餐饮替代仅剩刚需（约20万吨/月），但印度补库需求回升",
        downstreamUtil: "豆棕价差倒挂创历史极值，高价倒逼国内需求极度萎缩",
        seasonality: "11月-次年2月为产地减产季，叠加印尼B40启动与斋月前海外备货共振。"
      },
      inventory: {
        score: 82,
        headline: "马来西亚库存跌破180万吨，国内商业库存处于5年低位",
        level: "国内棕榈油商业库存 49.5 万吨；马棕库存 178 万吨",
        velocity: "产销区双双进入去库通道，国内到港偏少令低库难解",
        yoyCompare: "国内库存较去年同期 -48.5%，马棕库存低于5年均值 16%",
        deliverableNote: "大商所仓单几乎清零（仅0.4万吨），现货升水220元，2701近月极具多头主导优势。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [78, 66, 54, 48, 42, 41, 49, 58, 55, 51, 49.5, null],
          lastYear: [98, 92, 86, 82, 76, 72, 79, 86, 91, 94, 96, 92],
          avg5y: [82, 78, 72, 66, 58, 54, 59, 65, 68, 71, 74, 76]
        }
      },
      costMargin: {
        score: 74,
        headline: "产地FOB坚挺+汇率走弱，国内近月进口利润倒挂超 -500 元/吨",
        rawMaterial: "BMD毛棕榈油飙升至 4850 林吉特/吨上方，成本强传导至国内",
        freightFx: "海运费稳定，人民币汇率偏弱进一步推高完税进口成本",
        margin: "华南24度进口盘面榨利/贸易利润倒挂 -520 元/吨",
        incentive: "严重倒挂抑制中国贸易商新增买船，形成“倒挂→少买船→低库存→强基差”正循环。",
        breakeven: 10300
      },
      expectationGap: {
        score: 80,
        headline: "印尼B40落地决心与产地减产幅度双超预期，驱动油脂领涨大宗",
        actualVsExpected: "市场此前质疑B40补贴资金与执行节奏，实际印尼强力推进叠加马棕减产，现实比预期紧得多。",
        curveFocus: "近月主导 (2701强Back)",
        curveFocusType: "near",
        detail: "2701交易国内零仓单、深度进口倒挂与冬季减产；2705则需防范明年二季度增产季与高价需求破坏。"
      }
    },
    basisCurve: {
      basis: 220,
      basisPct: 2.19,
      structure: "back",
      structureLabel: "现货高升水 · 极强Back",
      nearFarSpread: 460,
      spreadDesc: "P2701 - P2705 = +460 元/吨",
      convergenceLogic: "现货高升水220元且大商所近乎零仓单，临近交割空头无货可交，强Back格局稳固。",
      curvePoints: [
        { label: "华南24度现货", price: 10060 },
        { label: "2701", price: 9840 },
        { label: "2703", price: 9610 },
        { label: "2705", price: 9380 },
        { label: "2709", price: 9120 }
      ]
    },
    extended: {
      macroDriver: "绑定印尼生物柴油能源政策与原油价格，为农产品板块最强多头旗帜",
      positioning: "内外盘多头资金高度共振，正套（多P2701空P2705）收益丰厚",
      importExportParity: "近月进口利润深度倒挂-520元/吨，进口窗口持续关闭",
      valuationScore: 36,
      driveScore: 86,
      strategy: "高估值+极强驱动：回调顺势轻仓偏多 P2701 或坚守 1-5 正套，警惕历史高位剧烈洗盘；严禁盲目摸顶做空近月。",
      bullFactors: ["马印进入季节性减产季叠加降雨，产地库存持续走低", "印尼B40生柴政策锁定新增需求，重塑全球平衡表", "国内买船倒挂+零仓单+现货高升水，2701极度偏紧"],
      bearFactors: ["绝对价格突破万元大关处历史高估区，豆棕倒挂严重抑制食用消费", "若印尼推迟B40执行或国际原油暴跌，高位获利盘踩踏风险极大"],
      falsification: "若印尼官方宣布推迟B40实施且马来西亚月度出口骤降超25%引发库存回升，则多头果断止盈。"
    },
    tags: ["极度偏紧", "印尼B40生柴", "进口深倒挂", "强势正套"]
  },
  {
    id: "m",
    name: "豆粕",
    code: "M2701",
    sinaSymbol: "nf_M0",
    exchange: "DCE",
    exchangeName: "大商所",
    sector: "agri",
    sectorLabel: "农产品系",
    tier: "midstream",
    subRole: "饲料核心蛋白源 · 美豆/南美豆压榨中枢",
    unit: "元/吨",
    price: 2945,
    spotPrice: 2990,
    spotBenchmark: "张家港43%蛋白豆粕现货",
    changePct: 0.31,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight_balance",
      label: "近紧远松 (到港节奏分化)",
      score: 56,
      deliverableSupply: "11-12月海关商检通关偏慢导致油厂短期大豆供应节奏偏紧，华东现货转为小升水，但远期南美丰产预期充足。",
      warehouseReceipts: "1.8万手 (18万吨)",
      openInterest: "118万手",
      virtualToRealRatio: 6.6,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 48,
        headline: "美豆定产丰收且巴西播种创纪录顺利，但12月国内到港短期偏慢",
        output: "全国主要油厂周度大豆压榨量 192 万吨 (受部分区域断豆微降)",
        utilization: "油厂开机率 55%，部分华东华南油厂阶段性停机催提",
        importFlow: "11-12月月均大豆到港约 780 万吨，低于三季度月均 950 万吨",
        disruptions: "巴西主产区降雨充沛播种顺利，预计2027年南美大豆产量再创历史新高。"
      },
      demand: {
        score: 58,
        headline: "生猪压栏增重与冬季禽料消费回升，饲料物理提货尚可",
        consumption: "油厂豆粕日均提货量维持 15.5 万吨稳健水平",
        downstreamOrders: "饲料企业物理库存天数 7.4 天，处偏低水平，12月存春节前备库刚需",
        downstreamUtil: "生猪养殖盈利推动料肉比提升，豆粕在饲料中配方占比维持高位",
        seasonality: "12月为年底生猪育肥与节前饲料备货小旺季。"
      },
      inventory: {
        score: 56,
        headline: "油厂豆粕库存从高点显著去化至82万吨，催提压力缓解",
        level: "全国油厂豆粕库存 82 万吨 (较9月140万吨高点大降)",
        velocity: "连续6周去库，周度去库约 -5 万吨",
        yoyCompare: "较去年同期 +4.5%，基本回落至5年正常中枢区间",
        deliverableNote: "现货转升水45元且库存去化，缓解了此前2701合约的胀库抛压。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [92, 68, 42, 49, 76, 105, 132, 146, 134, 102, 82, null],
          lastYear: [88, 65, 38, 46, 68, 86, 102, 118, 105, 88, 78.5, 84],
          avg5y: [74, 58, 44, 48, 66, 84, 96, 104, 95, 82, 76, 78]
        }
      },
      costMargin: {
        score: 62,
        headline: "CBOT美豆跌破1000美分触及种植成本，汇率与贸易摩擦增添底部溢价",
        rawMaterial: "CBOT美豆在 990-1020 美分筑底，巴西新作升贴水承压",
        freightFx: "人民币汇率波动及中美贸易关税预期抬升美豆进口风险溢价",
        margin: "油厂大豆盘面压榨利润得益于豆油走强转正至 +110 元/吨",
        incentive: "压榨盈利鼓励油厂积极采购巴西新作，远月2705套保压力显著大于近月2701。",
        breakeven: 2820
      },
      expectationGap: {
        score: 58,
        headline: "海关通关慢+库存去化快令近月偏紧，远月聚焦南美天气与关税博弈",
        actualVsExpected: "市场原沉浸于全球大豆过剩叙事，实际国内11-12月豆粕快速去库并转现货升水，近月现实紧于预期。",
        curveFocus: "近月支撑 / 远月承压 (1-5正套)",
        curveFocusType: "near",
        detail: "2701反映近月通关偏慢、春节备货与关税溢价；2705则直面创纪录巴西大豆集中上市。"
      }
    },
    basisCurve: {
      basis: 45,
      basisPct: 1.51,
      structure: "back",
      structureLabel: "现货升水 · 1-5 Back",
      nearFarSpread: 165,
      spreadDesc: "M2701 - M2705 = +165 元/吨",
      convergenceLogic: "华东现货升水45元叠加春节备货，支撑2701强于2705形成清晰正套结构。",
      curvePoints: [
        { label: "张家港现货", price: 2990 },
        { label: "2701", price: 2945 },
        { label: "2703", price: 2840 },
        { label: "2705", price: 2780 },
        { label: "2709", price: 2890 }
      ]
    },
    extended: {
      macroDriver: "核心交易两条线：南美产区降雨天气 + 中美关税贸易政策预期",
      positioning: "油厂远月套保集中在2705，多头资金博弈近月正套及关税脉冲",
      importExportParity: "巴西远期榨利良好，油厂2-4月船期采购进度较快",
      valuationScore: 66,
      driveScore: 54,
      strategy: "中性偏强震荡：2701逢低2860附近试多或做 1-5 正套；2705若无南美干旱则逢反弹偏空看待。",
      bullFactors: ["油厂库存大幅去化，现货转为升水+45元", "CBOT美豆跌破种植成本线，下方空间受限", "贸易摩擦预期与年底饲料备货托底近月"],
      bearFactors: ["巴西大豆播种顺利，2027年南美创纪录丰产预期压制远月", "全球大豆库消比处历年偏高水平"],
      falsification: "若巴西南部与阿根廷在12-1月遭遇严重拉尼娜干旱，则豆粕将由震荡转为全面趋势大牛。"
    },
    tags: ["去库转升水", "南美丰产预期", "1-5正套", "关税与天气"]
  },
  {
    id: "y",
    name: "豆油",
    code: "Y2701",
    sinaSymbol: "nf_Y0",
    exchange: "DCE",
    exchangeName: "大商所",
    sector: "agri",
    sectorLabel: "农产品系",
    tier: "downstream",
    subRole: "国民消费主油脂 · 豆棕价差替代核心",
    unit: "元/吨",
    price: 8320,
    spotPrice: 8480,
    spotBenchmark: "张家港一级豆油现货",
    changePct: 0.85,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight_balance",
      label: "替代提速 · 紧平衡偏紧",
      score: 64,
      deliverableSupply: "棕榈油高价迫使餐饮及食品厂全面改用豆油，油厂豆油提货加速去库，现货基差维持+160元强势。",
      warehouseReceipts: "1.4万手 (14万吨)",
      openInterest: "52万手",
      virtualToRealRatio: 3.7,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 56,
        headline: "12月大豆到港阶段性回落，油厂豆油产出边际收紧",
        output: "油厂周度豆油产出约 36 万吨 (随压榨量温和回落)",
        utilization: "油厂开机率55%，部分地区因检疫延迟出现阶段性停机",
        importFlow: "国内豆油以大豆压榨自产为主，进口补充极少",
        disruptions: "全球大豆丰产压制远期原料，但短期受棕榈油强带动情绪。"
      },
      demand: {
        score: 74,
        headline: "豆棕价差深度倒挂-1520元，豆油全面替代棕榈油迎来消费爆发",
        consumption: "豆油表观消费同比大增 +11.2%，餐饮与烘焙渠道加速切换豆油",
        downstreamOrders: "元旦与春节双节包装油备货全面启动，现货成交放量",
        downstreamUtil: "包装油厂开机提速，低价豆油性价比优势达到历史极致",
        seasonality: "11月下旬至1月为国内传统油脂消费最旺季，刚需强劲。"
      },
      inventory: {
        score: 66,
        headline: "商业库存拐头加速去库，正快速回落至百万吨下方",
        level: "国内豆油商业库存 101 万吨 (环比 -4.2万吨)",
        velocity: "连续5周去库，替代消费令去库斜率明显加快",
        yoyCompare: "接近去年同期水平，高于5年均值幅度大幅收窄",
        deliverableNote: "华东一级豆油升水盘面160元，临近交割基差支撑稳健。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [94, 88, 86, 84, 92, 102, 108, 112, 114, 108, 101, null],
          lastYear: [92, 86, 84, 82, 88, 96, 101, 104, 103, 102, 100, 96],
          avg5y: [88, 85, 82, 79, 84, 91, 96, 98, 97, 96, 94, 90]
        }
      },
      costMargin: {
        score: 64,
        headline: "油强粕弱格局稳固，豆油承担油厂主要利润贡献",
        rawMaterial: "大豆到港成本平稳，人民币汇率偏弱小幅抬升成本",
        freightFx: "海运费平稳，进口豆油盘面利润倒挂",
        margin: "油粕比攀升至 2.82 历史偏高位，油厂挺油意愿强于挺粕",
        incentive: "高性价比替代逻辑支撑豆油在油脂板块中具备极佳多头防守性。",
        breakeven: 7900
      },
      expectationGap: {
        score: 66,
        headline: "豆棕替代效应与春节备货共振，去库速度好于市场预期",
        actualVsExpected: "市场此前认为大豆丰产将拖累豆油滞涨，实际棕榈油飙升把巨量需求推向豆油，现实比预期更紧。",
        curveFocus: "近月主导 (2701)",
        curveFocusType: "near",
        detail: "2701交易春节消费旺季、高基差修复与替代去库；2705则联动棕榈油及美豆油生柴政策。"
      }
    },
    basisCurve: {
      basis: 160,
      basisPct: 1.89,
      structure: "back",
      structureLabel: "现货升水 · Back结构",
      nearFarSpread: 210,
      spreadDesc: "Y2701 - Y2705 = +210 元/吨",
      convergenceLogic: "现货高升水+160元，春节旺季提货强劲推动近月偏强修复基差。",
      curvePoints: [
        { label: "张家港现货", price: 8480 },
        { label: "2701", price: 8320 },
        { label: "2703", price: 8210 },
        { label: "2705", price: 8110 },
        { label: "2709", price: 8040 }
      ]
    },
    extended: {
      macroDriver: "受美豆油生物柴油政策、国际原油与棕榈油外溢效应共同影响",
      positioning: "资金积极布局多豆油空棕榈油（做扩历史极低豆棕价差）",
      importExportParity: "南美毛豆油进口倒挂，国内压榨产出自给自足",
      valuationScore: 66,
      driveScore: 70,
      strategy: "逢回调8050-8150偏多配置 Y2701；跨品种套利优选多豆油空棕榈油（博弈豆棕价差从-1520修复）。",
      bullFactors: ["豆棕深度倒挂-1520元带来海量替代消费，去库加速", "元旦春节双节包装油消费进入最旺季", "现货升水160元，近月基差保护强"],
      bearFactors: ["远期南美大豆创纪录丰产预期限制豆油独立暴涨高度", "若棕榈油高位剧烈回撤，短期情绪会拖累豆油跟跌"],
      falsification: "若美豆油生柴政策大幅缩水且棕榈油崩盘，导致豆油库存重新累至120万吨上方，则多头撤离。"
    },
    tags: ["替代消费爆发", "春节旺季", "现货升水", "多豆油空棕榈"]
  },
  {
    id: "lh",
    name: "生猪",
    code: "LH2701",
    sinaSymbol: "nf_LH0",
    exchange: "DCE",
    exchangeName: "大商所",
    sector: "agri",
    sectorLabel: "农产品系",
    tier: "downstream",
    subRole: "民生养殖终端 · 能繁母猪滞后10月周期",
    unit: "元/吨",
    price: 15240,
    spotPrice: 16400,
    spotBenchmark: "河南外三元生猪出栏均价",
    changePct: -0.78,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "loose",
      label: "产能兑现 · 偏松",
      score: 42,
      deliverableSupply: "前期压栏大猪与二次育肥集中出栏，且集团猪企12月冲刺年度出栏计划，春节前活猪供应充裕。",
      warehouseReceipts: "活体交割 (按车板/厂库)",
      openInterest: "7.6万手",
      virtualToRealRatio: 0,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 36,
        headline: "能繁母猪滞后产能逐步释放，叠加出栏均重偏高，猪肉供给充裕",
        output: "样本集团场12月计划出栏量环比大增 +8.6%",
        utilization: "生猪出栏均重高达 126.5 公斤 (高于正常水平约 3.5 公斤)",
        importFlow: "冻猪肉进口占比极小，纯国内养殖周期定价",
        disruptions: "冬季北方偶发零星疫病但整体可控，未触发恐慌性去产能。"
      },
      demand: {
        score: 62,
        headline: "南方气温骤降开启冬季腌腊灌肠旺季，屠宰开工环比明显回升",
        consumption: "重点屠宰企业日均屠宰量环比 +14%，冻品库容率处低位",
        downstreamOrders: "西南华南腌腊需求逐步起量，但消费结构升级下总量弱于往年",
        downstreamUtil: "白条走货速度加快，标肥价差维持偏强支撑大猪消化",
        seasonality: "11月底至1月中旬为全年猪肉消费最旺季，决定猪价跌幅上限。"
      },
      inventory: {
        score: 42,
        headline: "冻品库容虽低，但活体压栏+二育“活体库存”正集中释放",
        level: "屠企冻品库容率 16.8% (偏低)，但栏内130kg以上大猪存栏充裕",
        velocity: "集团厂加速出栏冲年终业绩，活体库存向市场集中出清",
        yoyCompare: "能繁母猪对应2027年Q1商品猪出栏量较去年同期回升 +5.2%",
        deliverableNote: "生猪以活体交割为主，2701贴水当前现货1160元已提前计价春节前后的回落预期。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [121.5, 121.8, 122.4, 123.6, 124.2, 124.8, 125.1, 125.4, 125.8, 126.1, 126.5, null],
          lastYear: [122.0, 121.5, 121.8, 122.2, 122.6, 123.0, 122.8, 122.4, 122.5, 122.8, 123.2, 123.5],
          avg5y: [122.5, 122.2, 122.4, 122.8, 123.0, 123.2, 123.1, 122.9, 123.0, 123.4, 123.8, 124.0]
        }
      },
      costMargin: {
        score: 44,
        headline: "玉米豆粕低位令养殖完全成本降至14200元，行业盈利刺激产能稳增",
        rawMaterial: "玉米2200+豆粕2950，猪粮比高达 7.5:1，饲料成本处近四年低位",
        freightFx: "纯内需品种，无汇率干扰",
        margin: "自繁自养头均盈利约 +280 元/头，头部集团厂成本已低于 13.8 元/公斤",
        incentive: "持续盈利使养殖端毫无去产能动力，反而缓慢补栏能繁母猪，压制远月2703/2705估值。",
        breakeven: 14200
      },
      expectationGap: {
        score: 48,
        headline: "盘面已提前交易产能过剩深贴水，现货腌腊支撑令近月跌势反复",
        actualVsExpected: "市场对2027年产能恢复高度一致，导致期货大幅贴水现货；短期现货抗跌限制近月单边暴跌速度。",
        curveFocus: "远月承压更重 (2703/2705)",
        curveFocusType: "far",
        detail: "2701贴水现货1160元具一定基差保护；2703/2705对应春节后消费断崖淡季叠加出栏增期，空头逻辑最顺。"
      }
    },
    basisCurve: {
      basis: 1160,
      basisPct: 7.07,
      structure: "back",
      structureLabel: "期货深贴水 · Back结构",
      nearFarSpread: 1180,
      spreadDesc: "LH2701 - LH2703 = +1180 元/吨 (计价年后淡季)",
      convergenceLogic: "现货16400 vs 2701 15240，深贴水反映市场预期12-1月出栏冲量压低现货，期现大概率以现货下跌完成回归。",
      curvePoints: [
        { label: "河南现货", price: 16400 },
        { label: "2701", price: 15240 },
        { label: "2703", price: 14060 },
        { label: "2705", price: 14420 },
        { label: "2709", price: 15180 }
      ]
    },
    extended: {
      macroDriver: "独立于宏观周期的经典农业蛛网周期，核心锚是能繁母猪存栏与出栏体重",
      positioning: "大型养殖集团在利润丰厚区积极卖出远月套保锁利",
      importExportParity: "国内自给率超95%，猪粮比7.5反映高养殖利润",
      valuationScore: 54,
      driveScore: 42,
      strategy: "反弹偏空思路：2701因深贴水不追空，优选反弹逢高沽空2703/2705，或关注现货跌势确立后的反套。",
      bullFactors: ["冬季南方腌腊旺季全面启动，2701深贴水1160元限制短期急跌", "若冬季突发大面积猪瘟疫情将逆转供给预期"],
      bearFactors: ["能繁母猪滞后产能持续兑现，集团厂12月出栏冲量+均重偏高", "低饲料成本下养殖盈利丰厚，产能无法出清压制远月", "春节后传统消费淡季将面临显著供过于求"],
      falsification: "若冬季北方爆发超预期大面积疫病导致生猪存栏锐减，则周期提前反转看多。"
    },
    tags: ["产能恢复周期", "低饲料高盈利", "腌腊博弈", "深贴水偏空"]
  },
  {
    id: "sr",
    name: "白糖",
    code: "SR2701",
    sinaSymbol: "nf_SR0",
    exchange: "CZCE",
    exchangeName: "郑商所",
    sector: "agri",
    sectorLabel: "农产品系",
    tier: "downstream",
    subRole: "食糖消费终端 · 广西新榨季与巴西原糖联动",
    unit: "元/吨",
    price: 5940,
    spotPrice: 6180,
    spotBenchmark: "广西南宁白砂糖现货",
    changePct: 0.42,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "tight_balance",
      label: "新老交替 · 近紧远松",
      score: 58,
      deliverableSupply: "老榨季工业库存清零、新榨季广西糖厂刚刚开榨上量，现货依然坚挺，2701深贴水现货240元。",
      warehouseReceipts: "1.1万张 (11万吨)",
      openInterest: "32.5万手",
      virtualToRealRatio: 2.9,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 46,
        headline: "广西26/27新榨季丰产开榨上量，但前期糖浆预拌粉管控收紧补充",
        output: "预计国内新榨季产糖增至 1100 万吨 (同比 +10%)",
        utilization: "广西糖厂开榨家数快速增加，12月中下旬将迎集中上量高峰",
        importFlow: "巴西原糖配额外进口持续小幅倒挂，海关严控糖浆及预拌粉进口利多国产糖",
        disruptions: "巴西中南部干旱导致甘蔗单产下滑，限制国际原糖深跌空间。"
      },
      demand: {
        score: 58,
        headline: "元旦春节食品饮料备货启动，糖浆管控回流国产白糖消费",
        consumption: "国内年度食糖刚需稳定在 1550 万吨，仍存约 450 万吨产需缺口",
        downstreamOrders: "下游食品厂节前刚性采购释放，现货成交好转",
        downstreamUtil: "替代品果葡糖浆价格平稳，对白糖额外挤压有限",
        seasonality: "12月为新糖集中上市与春节备货双高峰的正面碰撞期。"
      },
      inventory: {
        score: 64,
        headline: "工业结转库存处于近5年极低水位，新糖累库尚在初期",
        level: "国内工业食糖库存处于榨季初低点 42 万吨",
        velocity: "随开榨推进开始季节性累库，但起点极低",
        yoyCompare: "较去年同期 -12%，整体库存结构健康",
        deliverableNote: "2701合约深贴水广西南宁现货240元，已充分提前计价丰产压力。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [265, 385, 445, 395, 310, 235, 165, 102, 48, 35, 42, null],
          lastYear: [280, 405, 468, 415, 330, 250, 178, 112, 54, 42, 48, 145],
          avg5y: [310, 440, 495, 435, 355, 275, 200, 130, 68, 52, 62, 168]
        }
      },
      costMargin: {
        score: 64,
        headline: "广西甘蔗收购价刚性托底5700制糖成本，配额外进口成本6100",
        rawMaterial: "广西甘蔗首付价维持 540 元/吨高位，制糖完全成本约 5650-5750 元/吨",
        freightFx: "巴西至中国海运费及人民币汇率支撑配额外进口成本在 6100 元上方",
        margin: "糖厂新榨季顺价销售意愿强，但跌破5800即逼近成本防线",
        incentive: "成本线与进口倒挂共同构筑下方强支撑，限制盘面深跌。",
        breakeven: 5700
      },
      expectationGap: {
        score: 60,
        headline: "糖浆管控政策超预期收紧，显著对冲国内增产压力",
        actualVsExpected: "市场原预期国产增产+廉价糖浆将打垮糖价至5500，实际糖浆管控趋严令国产糖需求回流，现实更紧。",
        curveFocus: "近月贴水修复 (2701)",
        curveFocusType: "near",
        detail: "2701贴水现货240元，春节备货支撑下具备基差收敛动力；2705则看巴西新榨季天气。"
      }
    },
    basisCurve: {
      basis: 240,
      basisPct: 3.88,
      structure: "back",
      structureLabel: "深度贴水 · 强Back",
      nearFarSpread: 145,
      spreadDesc: "SR2701 - SR2705 = +145 元/吨",
      convergenceLogic: "现货6180 vs 2701 5940，深贴水+低结转库存支撑近月易涨难跌。",
      curvePoints: [
        { label: "南宁现货", price: 6180 },
        { label: "2701", price: 5940 },
        { label: "2703", price: 5865 },
        { label: "2705", price: 5795 },
        { label: "2709", price: 5820 }
      ]
    },
    extended: {
      macroDriver: "内外盘高度联动，关注ICE原糖走势、巴西制醇比及国内糖浆政策",
      positioning: "糖企在新榨季逢高套保2705，多头资金关注2701贴水修复",
      importExportParity: "配额外巴西原糖加工成本约 6120 元/吨，盘面深度贴水进口成本",
      valuationScore: 68,
      driveScore: 58,
      strategy: "低估值温和偏多：逢回调5800-5860轻仓低吸 SR2701，或参与 1-5 正套；6150上方遇新糖套保减仓。",
      bullFactors: ["2701深贴水南宁现货240元且低于配额外进口成本", "海关严控糖浆预拌粉进口，提振国产白糖销量", "广西5700制糖成本线与春节备货共同托底"],
      bearFactors: ["国内新榨季增产约10%，12-1月新糖集中上市套保压制上方高度", "印度与泰国新榨季恢复性增产压制外盘原糖"],
      falsification: "若糖浆进口政策重新放开且ICE原糖跌破18美分，则偏多逻辑失效。"
    },
    tags: ["深贴水240", "糖浆管控利多", "成本强支撑", "新糖上量博弈"]
  },
  {
    id: "cf",
    name: "棉花",
    code: "CF2701",
    sinaSymbol: "nf_CF0",
    exchange: "CZCE",
    exchangeName: "郑商所",
    sector: "agri",
    sectorLabel: "农产品系",
    tier: "downstream",
    subRole: "纺织服装核心纤维 · 新疆新棉上市与外贸订单",
    unit: "元/吨",
    price: 13960,
    spotPrice: 14780,
    spotBenchmark: "3128B新疆机采棉现货",
    changePct: -0.29,
    deliveryMonth: "2701合约 (临近交割)",
    deliveryTightness: {
      status: "loose",
      label: "新棉集中公检 · 货源充足",
      score: 42,
      deliverableSupply: "新疆新季机采棉大丰产且加工公检进度超75%，新花仓单正加速生成，交割货源十分充足。",
      warehouseReceipts: "4200张 (17万吨, 加速注册中)",
      openInterest: "41万手",
      virtualToRealRatio: 12.1,
      squeezeRisk: "低"
    },
    pillars: {
      supply: {
        score: 36,
        headline: "新疆棉花大丰产超610万吨，籽棉收购完毕进入轧花厂套保期",
        output: "全国新季棉花产量预计 645 万吨 (同比大增 +9.5%，新疆单产创纪录)",
        utilization: "新疆轧花厂加工进入中后期，皮棉现货资源极其充裕",
        importFlow: "内外棉价差收窄，商业进口棉配额发放克制",
        disruptions: "采摘期天气极佳，皮棉颜色级与长度指标优异，无天气减产干扰。"
      },
      demand: {
        score: 48,
        headline: "下游纺企进入淡季开机回落，外贸关税担忧压制补库意愿",
        consumption: "国内纺织企业开机负荷回落至 72% (环比 -2.5%)",
        downstreamOrders: "纺企棉纱库存回升至 28 天，外贸服装抢出口窗口临近尾声",
        downstreamUtil: "织布厂原料随买随用，对14500以上高价棉抵触明显",
        seasonality: "金九银十旺季已过，12月至春节前下游纺服以回款去库为主。"
      },
      inventory: {
        score: 40,
        headline: "新棉商业库存季节性飙升，皮棉仓单快速生成压制盘面",
        level: "全国棉花商业库存 385 万吨 (环比季节性激增 +115万吨)",
        velocity: "新棉集中上市期，库存快速攀升且高于往年同期",
        yoyCompare: "较去年同期 +14.8%，较5年均值偏高 11%",
        deliverableNote: "新疆新花质量极佳，易于注册郑商所标准仓单，14500上方轧花厂套保抛压极重。",
        seasonalSeries: {
          labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          current: [540, 520, 475, 418, 352, 296, 248, 205, 162, 270, 385, null],
          lastYear: [510, 492, 445, 390, 328, 275, 228, 188, 148, 232, 335, 485],
          avg5y: [495, 475, 430, 380, 320, 268, 222, 182, 145, 235, 345, 470]
        }
      },
      costMargin: {
        score: 62,
        headline: "新疆籽棉收购折皮棉成本14300元，期货已贴水轧花厂成本线",
        rawMaterial: "北疆机采籽棉均价约 6.2 元/公斤，折皮棉交割成本约 14200-14400 元/吨",
        freightFx: "出疆运费平稳，人民币贬值利好纺织服装出口竞争力",
        margin: "当前盘面下轧花厂套保小幅亏损，惜售心态开始抬头",
        incentive: "13600-13800下方触及强成本底线与低估区，限制深跌但高库存令反弹举步维艰。",
        breakeven: 14250
      },
      expectationGap: {
        score: 48,
        headline: "新疆丰产与外贸关税利空已充分计价，低估值下步入底部磨底",
        actualVsExpected: "产量增幅高于年初预期，但期货深贴水现货820元已高度反映悲观情绪，边际再恶化空间有限。",
        curveFocus: "底部磨底 (近弱远稳)",
        curveFocusType: "both",
        detail: "2701面临新花仓单生成压力；2705则等待明年春季金三银四消费验证与新年度植棉面积博弈。"
      }
    },
    basisCurve: {
      basis: 820,
      basisPct: 5.55,
      structure: "contango",
      structureLabel: "现货高升水 · 远月小Contango",
      nearFarSpread: -110,
      spreadDesc: "CF2701 - CF2705 = -110 元/吨",
      convergenceLogic: "新疆现货价格坚挺使2701深贴水820元（含品质升水折算），封杀近月深跌空间但新仓单压制上行。",
      curvePoints: [
        { label: "3128B现货", price: 14780 },
        { label: "2701", price: 13960 },
        { label: "2705", price: 14070 },
        { label: "2709", price: 14210 }
      ]
    },
    extended: {
      macroDriver: "对中美贸易关税与欧美服装补库周期高度敏感",
      positioning: "轧花厂在14400以上套保盘密集，13600下方产业买保承接强劲",
      importExportParity: "1%关税下美棉进口成本约 14150 元/吨，内外棉接近平水",
      valuationScore: 68,
      driveScore: 44,
      strategy: "低估值弱驱动区间震荡：13600-14500箱体高抛低吸，14400上方套保压制明显，跌破13700可左侧布局多单。",
      bullFactors: ["2701贴水现货820元且低于轧花厂收购成本线，安全边际高", "人民币汇率偏弱利好纺服出口竞争力"],
      bearFactors: ["新疆新棉大丰产超610万吨，商业库存与仓单快速攀升", "下游纺企步入季节性淡季，外贸关税阴云未散"],
      falsification: "若出口关税冲击落地叠加纺企大面积停机，或国内出台超预期消费刺激，将打破箱体。"
    },
    tags: ["新疆大丰产", "贴水收购成本", "外贸关税博弈", "底部箱体"]
  }
);

/* ==================== Supply-Chain Transmission Links ==================== */
window.FuturesChainData.links = [
  // Ferrous Chain
  { from: "jm", to: "j", label: "1.33吨焦煤→1吨焦炭" },
  { from: "j", to: "rb", label: "0.48吨焦炭→1吨螺纹" },
  { from: "j", to: "hc", label: "高炉炼铁燃料成本" },
  { from: "i", to: "rb", label: "1.6吨铁矿→1吨生铁" },
  { from: "i", to: "hc", label: "板材铁水核心成本" },
  { from: "sm", to: "rb", label: "炼钢脱氧合金添加" },

  // Non-Ferrous Chain
  { from: "ao", to: "al", label: "1.93吨氧化铝→1吨铝" },
  { from: "ni", to: "ss", label: "镍铁占300系成本55%" },
  { from: "cu", to: "al", label: "铜铝线缆替代比价" },
  { from: "zn", to: "hc", label: "镀锌卷板下游联动" },
  { from: "lc", to: "ni", label: "三元锂电共下游博弈" },

  // Precious Metals Chain
  { from: "au", to: "ag", label: "金银比80与利率共振" },
  { from: "ag", to: "cu", label: "光伏电力工业联动" },

  // Energy & Chemical Chain
  { from: "sc", to: "fu", label: "原油裂解与船燃成本" },
  { from: "sc", to: "ta", label: "原油→PX→PTA成本链" },
  { from: "sc", to: "pp", label: "石脑油裂解制聚烯烃" },
  { from: "ma", to: "pp", label: "3吨甲醇→1吨MTO聚丙烯" },
  { from: "sa", to: "fg", label: "0.2吨纯碱→1吨玻璃" },
  { from: "sc", to: "ru", label: "合成胶成本替代天胶" },
  { from: "ta", to: "cf", label: "涤纶短纤与棉纺替代" },

  // Agriculture Chain
  { from: "c", to: "lh", label: "玉米占猪料成本55%" },
  { from: "m", to: "lh", label: "豆粕占猪料蛋白25%" },
  { from: "m", to: "y", label: "大豆压榨联产·油粕比" },
  { from: "p", to: "y", label: "豆棕价差-1520强替代" },
  { from: "sc", to: "p", label: "原油→印尼B40生柴传导" },
  { from: "sc", to: "sr", label: "原油→巴西制醇比传导" }
];

/* ==================== Industry Chain Margins & Cross-Commodity Spreads ==================== */
window.FuturesChainData.spreads = [
  {
    id: "sp-steel-margin",
    name: "华东高炉螺纹盘面利润",
    sector: "ferrous",
    formula: "RB - 1.6×I - 0.48×J - 1100",
    currentVal: "+56 元/吨",
    percentile: 34,
    status: "偏低修复",
    signal: "bullish",
    signalLabel: "做扩盘面利润",
    legs: ["rb", "i", "j", "jm"],
    logic: "成材库存创5年新低且电炉亏损，上游焦煤供应宽松，利润具备向成材端转移的修复动力。",
    trade: "多 RB2701 / 空 JM2701 或做扩盘面钢厂利润"
  },
  {
    id: "sp-coking-ratio",
    name: "焦炭 / 焦煤比价 (焦化盘面利润)",
    sector: "ferrous",
    formula: "J2701 / JM2701 (理论平衡约1.45)",
    currentVal: "1.465",
    percentile: 48,
    status: "中性偏扩",
    signal: "bullish",
    signalLabel: "温和做扩",
    legs: ["j", "jm"],
    logic: "焦煤口岸与矿山双高库存压力显著大于焦炭，入炉煤让利使焦炭相对焦煤更具韧性。",
    trade: "多 J2701 / 空 JM2701"
  },
  {
    id: "sp-alu-margin",
    name: "电解铝盘面冶炼利润 (AL vs AO)",
    sector: "nonferrous",
    formula: "AL - 1.93×AO - 10300",
    currentVal: "+1000 元/吨 (2701) / +2310 (2705)",
    percentile: 18,
    status: "近月极度压缩",
    signal: "bullish",
    signalLabel: "远月做扩冶炼利润",
    legs: ["al", "ao"],
    logic: "氧化铝暴利超2000元极度挤压电解铝利润，2701因氧化铝现货逼仓暂勿逆势，2705远月氧化铝新产能投放将推动利润回流电解铝。",
    trade: "布局远月 多 AL2705 / 空 AO2705"
  },
  {
    id: "sp-au-ag-ratio",
    name: "沪金 / 沪银比价 (金银比)",
    sector: "precious",
    formula: "AU2702 × 1000 / AG2702",
    currentVal: "79.95",
    percentile: 76,
    status: "显著偏高",
    signal: "bearish",
    signalLabel: "做空金银比 (多银空金)",
    legs: ["au", "ag"],
    logic: "历史中枢约65，当前近80处于偏高区间；在白银连续5年实物短缺与光伏N型银浆高需求下，白银补涨弹性远大于黄金。",
    trade: "多 AG2702 / 空 AU2702 (按等市值配比)"
  },
  {
    id: "sp-mto-margin",
    name: "华东外采 MTO 盘面利润 (PP - 3×MA)",
    sector: "energy",
    formula: "PP2701 - 3 × MA2701",
    currentVal: "-284 元/吨",
    percentile: 26,
    status: "深度压缩",
    signal: "bearish",
    signalLabel: "短期继续做缩 · 跌破-500反手做扩",
    legs: ["ma", "pp"],
    logic: "伊朗冬季限气驱动甲醇近月走强，而PP受产能周期压制涨幅滞后，短期利润承压；但若跌破-500将触发MTO装置停车倒逼利润触底。",
    trade: "短线 多 MA2701 / 空 PP2701，触及-500止盈反手"
  },
  {
    id: "sp-fg-sa",
    name: "玻璃 - 纯碱 价差 (建材利润分配)",
    sector: "energy",
    formula: "FG2701 - SA2701",
    currentVal: "-185 元/吨",
    percentile: 42,
    status: "玻璃占优",
    signal: "bullish",
    signalLabel: "多玻璃空纯碱",
    legs: ["fg", "sa"],
    logic: "玻璃通过大规模产线冷修实现连续8周大幅去库，而纯碱因天然碱扩产+双玻璃冷修库存创166万吨历史天量，产业链利润明确向玻璃倾斜。",
    trade: "多 FG2701 / 空 SA2701"
  },
  {
    id: "sp-y-p",
    name: "豆油 - 棕榈油价差 (豆棕价差)",
    sector: "agri",
    formula: "Y2701 - P2701",
    currentVal: "-1520 元/吨",
    percentile: 3,
    status: "历史极端倒挂",
    signal: "bullish",
    signalLabel: "远月博弈价差修复",
    legs: ["y", "p"],
    logic: "棕榈油受印尼B40与产地减产推动创历史溢价，国内豆棕深度倒挂迫使餐饮需求全面转向豆油；待2705步入马印增产季，豆棕价差具备强均值回归赔率。",
    trade: "2701不逆势摸顶，择机布局 多 Y2705 / 空 P2705"
  },
  {
    id: "sp-oil-meal",
    name: "油粕比 (Y2701 / M2701)",
    sector: "agri",
    formula: "Y2701 / M2701",
    currentVal: "2.825",
    percentile: 86,
    status: "历史高位",
    signal: "neutral",
    signalLabel: "顺势偏强 · 警惕南美干旱反转",
    legs: ["y", "m"],
    logic: "全球大豆丰产压制蛋白粕、生柴与替代提振油脂，维持“油强粕弱”；若南美12-1月出现严重拉尼娜干旱，油粕比将从高位急剧回落。",
    trade: "顺势持有油强粕弱，紧盯巴西阿根廷降雨预报作为止盈信号"
  },
  {
    id: "sp-hog-corn",
    name: "猪粮比 (生猪养殖利润周期)",
    sector: "agri",
    formula: "现货生猪均价 / 玉米均价",
    currentVal: "7.52 : 1",
    percentile: 64,
    status: "高盈利区",
    signal: "bearish",
    signalLabel: "远月养殖利润压缩",
    legs: ["lh", "c", "m"],
    logic: "低玉米+低豆粕令生猪头均盈利近300元，养殖端毫无去产能动力反而补栏母猪，明年上半年面临“猪价跌+玉米筑底”的养殖利润压缩。",
    trade: "远月关注 空 LH2705 / 多 C2705 (做缩远期养殖利润)"
  }
];

/* ==================== Curated Fundamental Daily Intel ==================== */
window.FuturesChainData.dailyIntel = [
  {
    id: "fi-1",
    date: "2026-11-26",
    time: "09:45",
    sector: "nonferrous",
    sentiment: "bullish",
    source: "SMM 产业快讯",
    title: "山东与河南氧化铝现货再涨30元至5280元/吨，西北电解铝厂冬季补库紧迫",
    summary: "国内氧化铝仓单降至4.2万吨历史极低位，几内亚矿发运节奏仍偏慢，AO2701贴水现货高达420元，临近交割空头回补压力加剧。",
    contracts: ["ao", "al"]
  },
  {
    id: "fi-2",
    date: "2026-11-26",
    time: "09:15",
    sector: "energy",
    sentiment: "bullish",
    source: "隆众资讯",
    title: "伊朗气温骤降触发冬季天然气限气，三套大型甲醇装置确认降负停车",
    summary: "预计12月至明年1月伊朗甲醇装船量环比缩减超30万吨，华东港口进入强去库通道，MA2701-2705正套价差进一步走强。",
    contracts: ["ma", "pp"]
  },
  {
    id: "fi-3",
    date: "2026-11-26",
    time: "08:50",
    sector: "ferrous",
    sentiment: "bullish",
    source: "Mysteel 钢联周报",
    title: "五大钢材总库存延续去化，螺纹钢社库+厂库跌至448万吨创近5年新低",
    summary: "电炉平电亏损抑制复产，淡季去库表现显著强于市场预期；反观焦煤口岸库存攀升，黑色产业链呈现“成材强、煤焦弱”的利润修复格局。",
    contracts: ["rb", "hc", "jm", "i"]
  },
  {
    id: "fi-4",
    date: "2026-11-25",
    time: "16:30",
    sector: "agri",
    sentiment: "bullish",
    source: "MPOB & 船运调研",
    title: "马来西亚11月前25日棕榈油产量环比骤降9.2%，国内买船倒挂令华南现货紧缺",
    summary: "拉尼娜强降雨叠加印尼B40生柴强制执行，全球棕榈油进入强去库周期；豆棕价差倒挂-1520元加速餐饮全面切换豆油消费。",
    contracts: ["p", "y"]
  },
  {
    id: "fi-5",
    date: "2026-11-25",
    time: "15:10",
    sector: "energy",
    sentiment: "bearish",
    source: "卓创资讯",
    title: "国内样本纯碱厂家库存突破166万吨刷新历史纪录，浮法与光伏玻璃继续冷修",
    summary: "天然碱满产叠加下游双玻璃日熔量下滑，纯碱供需过剩加剧，SA2701升水现货40元面临巨大交割套保抛压，多玻璃空纯碱逻辑强化。",
    contracts: ["sa", "fg"]
  },
  {
    id: "fi-6",
    date: "2026-11-25",
    time: "14:20",
    sector: "precious",
    sentiment: "bullish",
    source: "世界黄金协会 / 行业调研",
    title: "新兴市场央行持续增持黄金储备，光伏N型银浆排产高企推动白银库存再降",
    summary: "沪金稳步运行于上升通道，当前金银比接近80偏高位置，白银兼具连年实物缺口与工业补涨弹性，做空金银比胜率提升。",
    contracts: ["au", "ag"]
  },
  {
    id: "fi-7",
    date: "2026-11-25",
    time: "11:05",
    sector: "nonferrous",
    sentiment: "bearish",
    source: "LME & 上期所仓单日报",
    title: "LME+SHFE纯镍显性库存突破20万吨创三年新高，电积镍交割品过剩难解",
    summary: "国产与印尼电积镍持续放量而三元前驱体排产走弱，沪镍呈典型Contango结构，仍是机构多铜/多铝对冲的首选空头配置。",
    contracts: ["ni", "ss", "cu"]
  },
  {
    id: "fi-8",
    date: "2026-11-24",
    time: "17:40",
    sector: "agri",
    sentiment: "bearish",
    source: "我的农产品网",
    title: "东北暖冬加速基层潮粮变现，北方四港玉米库存攀升至432万吨五年新高",
    summary: "C2701临近交割受制于升水与高库存压制，但价格已跌破包地成本且进口窗口关闭，市场紧盯中储粮增储动向布局2705远月底部。",
    contracts: ["c", "lh", "m"]
  },
  {
    id: "fi-9",
    date: "2026-11-24",
    time: "15:55",
    sector: "energy",
    sentiment: "bullish",
    source: "ANRPC & 青岛港口监测",
    title: "泰南持续暴雨影响旺季割胶，青岛天然橡胶库存维持42.6万吨低位",
    summary: "云南产区即将全面停割叠加老胶仓单注销完成，半钢胎开工维持79.4%高位，RU2701旺产季迟迟不见大累库强化多头预期差。",
    contracts: ["ru", "sc"]
  },
  {
    id: "fi-10",
    date: "2026-11-24",
    time: "10:30",
    sector: "ferrous",
    sentiment: "bearish",
    source: "郑商所仓单日报",
    title: "锰硅注册仓单与有效预报逼近50万吨天量，12月主流钢招继续压价",
    summary: "内蒙低电价大厂盈利维系高开工，SM2701深升水现货160元吸引期现正套盘持续交货，临近交割月货源极度偏松。",
    contracts: ["sm", "jm", "j"]
  }
];
