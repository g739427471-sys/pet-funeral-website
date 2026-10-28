# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 项目：宠物殡葬服务电商网站

## 业务背景
- 目标：为宠物主人提供殡葬用品售卖 + 服务预约的一站式平台
- 情感基调：温暖、庄重、克制。避免任何"促销感"过强的文案，用户可能正处于失去宠物的悲伤中
- 目标用户：正在经历宠物离世的宠物主人

## 行业背景数据（请基于以下信息做设计决策）
- 2025年中国宠物殡葬行业市场规模约50亿元，预计2030年突破100亿元，是宠物产业链中增速最快的细分领域
- 现存相关企业4.7万家，五年内增幅超300%
- 宠物殡葬渗透率不到4%，存在巨大未满足需求
- 行业核心痛点：价格不透明、服务标准缺失。网站需要在"透明定价"和"信任建设"上做重点设计

## 必须包含的功能模块
1. 首页（品牌展示 + 服务入口 + 情感引导）
2. 产品展示页（骨灰盒、纪念品、祭祀用品，需透明定价）
3. 服务预约页（火化、告别仪式、上门接送）
4. 在线支付（Stripe Checkout，开发阶段先用测试模式）
5. 纪念页面（用户可上传宠物照片、撰写纪念文字）

## 开发约定
- 所有面向用户的文案使用中文，语气温暖克制
- 组件命名用 PascalCase，文件命名用 kebab-case
- 提交前必须运行 lint 和测试

## 技术栈（实际版本）
- Node 22.23.3（nvm 管理；Next.js 需 ≥ 18.18）
- Next.js 16.4.1（App Router + Turbopack；**16.x 有破坏性变更**，见 AGENTS.md 与 node_modules/next/dist/docs/）
- ⚠️ Next 16 预渲染期禁止 `new Date()` / `Date.now()` / `Math.random()`（服务端组件静态渲染直接报错）；动态时间/随机值放到客户端组件、Server Action 或 API 路由
- ⚠️ next.config.ts 已开 `cacheComponents`，服务端组件**禁止** `export const dynamic = "force-dynamic"`（编译直接报错）；DB 数据页在 dev 下每次请求都会重取，无需 force-dynamic
- React 19.3.0
- Tailwind CSS v4（CSS 式配置，无 tailwind.config.js）
- ESLint 9（flat config；`next lint` 已移除）
- Prisma ORM 7.10.0（`prisma-client` 生成器输出到 src/generated/prisma；配置在 prisma7.config.ts，导入 dotenv；运行时用 driver adapter：`@prisma/adapter-pg` + `pg`，单例见 src/lib/prisma.ts）
- 数据库：PostgreSQL（本地开发用 `npx prisma dev` 起 PostgreSQL 兼容库，无需 Docker）
- 金额以「分」存整数（priceCents/totalCents/unitPriceCents），展示用 src/lib/format.ts 的 formatPrice 转「元」

## 开发命令
- 安装依赖：`npm install`
- 启动开发服务器：`npm run dev` → http://localhost:3000
- 生产构建：`npm run build`
- 启动生产服务：`npm start`
- Lint（提交前必跑）：`npm run lint`
- 测试（Vitest，待接入）：`npm test`
- 本地数据库：`npx prisma dev`（后台 `--detach`；管理用 `ls / stop / rm`）
- 迁移：`npx prisma migrate dev`
- 生成客户端：`npx prisma generate`
- 种子数据：`npx prisma db seed`（配置在 prisma7.config.ts 的 `migrations.seed`，需 `tsx`）
