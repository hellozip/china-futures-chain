# 中国期货全产业链可视化基本面投研终端 (China Futures Visual Chain)

借鉴 `ai-chain-web` 架构打造的**中国商品期货全产业链实时可视化与每日基本面空多研判终端**，覆盖**黑色系、有色系、贵金属系、能源化工系、农产品系**五大板块共 **30 个主力期货合约**。

## 核心能力
- **双源实时行情 (`/api/quotes`)**：后端自动聚合 **新浪国内期货 (`hq.sinajs.cn`) + 东方财富期货 (`push2.eastmoney.com`)** 30/30 全品种实时行情、成交量、持仓量，并实时抓取**近远月合约价差**动态识别 `Back / Contango` 结构（每 45 秒自动刷新）。
- **每日最新基本面空多研判 (`/api/daily-judgment`)**：结合「交割月货源松紧 + 供/需/库/成本利润/预期差五项 + 升贴水」基准底盘，融合**当日实盘动量、实盘近远月月差、近72小时全网大宗商品实时新闻催化**，每天自动更新 30 个品种的动态评分、多空结论、最强多空 TOP 4 与交割月预警。
- **可选 AI 首席点评**：在 Render 环境变量中配置 `GEMINI_API_KEY`（可选），每日自动生成一句机构级全市场多空主线点评。
- **零第三方依赖**：纯 Node.js 18/20+ 内置 `fetch`，也支持直接双击 `index.html` 本地离线运行。

## Render 一键部署
仓库根目录已内置 `render.yaml` Blueprint 配置：
- Runtime: `node` (Node 20)
- Start Command: `node server.js`
- Health Check: `/api/health`
- Auto Deploy: `true`

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/hellozip/china-futures-chain)
