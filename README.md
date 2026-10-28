# 归栖 GuiXi · 宠物殡葬与纪念服务

一个温暖、庄重、克制的宠物殡葬服务电商网站。提供纪念用品选购、殡葬服务在线预约、线上纪念空间，以及 Stripe 测试支付。

## 技术栈

- **前端**：Next.js 16（App Router、Turbopack）、React 19、TypeScript
- **样式**：Tailwind CSS v4（`@theme` CSS 变量配置，暖大地色系）
- **数据层**：Prisma 7（`prisma-client` 生成器 + `@prisma/adapter-pg` 驱动适配器 + `pg`）
- **支付**：Stripe Checkout（测试模式），通过可替换的 `PaymentProvider` 抽象
- **字体**：Fontsource 自托管（Noto Sans SC / Noto Serif SC / Playfair Display）

## 核心架构

- 服务端组件直接查询数据库；查询封装在 `<Suspense>` 子组件中并提供骨架屏加载态（配合 `next.config.ts` 的 `cacheComponents`）。
- 金额一律以「分」存储（整数），展示时用 `src/lib/format.ts` 的 `formatPrice` 转成「元」。
- 支付抽象：`src/lib/payments/` 定义 `PaymentProvider` 接口，`stripe.ts` 是 Stripe 实现，`index.ts` 是工厂。更换支付渠道只需实现接口并替换工厂。
- 购物车为前端 localStorage（`src/lib/cart.ts`，`useSyncExternalStore` 响应式读取），无需登录。
- Prisma Client 生成到 `src/generated/prisma`（已在 `.gitignore` 中，构建时重新生成）。

## 目录结构

```
prisma/                  # schema、迁移、种子数据
src/app/                 # 页面路由（首页 / 产品 / 服务 / 纪念 / 购物车 / 支付成功）
src/app/api/             # API 路由（预约、支付、webhook、纪念提交）
src/components/          # 共享组件（导航、页脚、表单、加购按钮）
src/lib/                 # 工具（prisma、cart、format、payments、orders）
src/generated/prisma/    # 生成的 Prisma Client（gitignore）
```

## 本地启动

### 前置要求

- Node.js 20.9+（开发环境实测 22.x）
- npm

### 步骤

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量：在项目根目录创建 .env，填入下方「环境变量」表格中的项

# 3. 启动本地数据库（Prisma 7 内置的本地 Postgres，保持运行）
npx prisma dev

# 4. 生成 Client + 应用迁移 + 写入种子数据（首次或数据库为空时执行）
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器（Turbopack） |
| `npm run build` | 生产构建 |
| `npm start` | 运行生产构建 |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | TypeScript 类型检查 |
| `npx prisma dev` | 启动本地 Postgres |
| `npx prisma generate` | 生成 Prisma Client |
| `npx prisma migrate deploy` | 应用迁移 |
| `npx prisma db seed` | 写入种子数据（产品 / 服务 / 纪念） |
| `npx prisma studio` | 图形化浏览数据 |

## 环境变量

| 变量 | 说明 | 本地示例 |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL 连接串 | `postgres://postgres:postgres@localhost:51214/petfuneral?sslmode=disable` |
| `STRIPE_SECRET_KEY` | Stripe 测试密钥 | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook 签名密钥（可选） | `whsec_...` |
| `APP_URL` | 应用对外地址 | `http://localhost:3000` |

> `.env` 已在 `.gitignore` 中，不会被提交到 Git。

## 测试支付

用 Stripe 测试卡号 `4242 4242 4242 4242`（任意未来有效期、任意 CVC）走通支付。支付成功后订单状态更新为 `PAID`，购物车清空。

## 部署到 Vercel

### 1. 准备云数据库

Vercel 构建需要一个可公开访问的 PostgreSQL（本地 `prisma dev` 的数据库无法在云端使用）。任选其一：

- **Vercel Postgres**（推荐，最简单）：在 Vercel 控制台创建，自动获得连接串。
- **Neon** 或 **Supabase**：注册后创建数据库，复制连接串。

拿到形如 `postgresql://user:password@host:5432/dbname?sslmode=require` 的连接串，填入后面的 `DATABASE_URL`。

### 2. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

### 3. 在 Vercel 导入项目

1. 打开 https://vercel.com/new → **Import Git Repository** → 选择刚才的 GitHub 仓库。
2. 框架自动识别为 Next.js，**Root Directory** 保持默认。
3. 将 **Build Command** 改为：

   ```bash
   npx prisma generate && npx prisma migrate deploy && npx prisma db seed && next build
   ```

4. 配置环境变量（**Settings → Environment Variables**）：

   | 变量 | 值 |
   | --- | --- |
   | `DATABASE_URL` | 第 1 步的云数据库连接串 |
   | `STRIPE_SECRET_KEY` | `sk_test_...` |
   | `STRIPE_WEBHOOK_SECRET` | 先留空，第 4 步配好 webhook 后回来填 |
   | `APP_URL` | 部署后的地址，如 `https://你的项目.vercel.app` |

5. 点击 **Deploy**。

### 4. 配置 Stripe Webhook

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**。
2. **Endpoint URL** 填 `https://你的项目.vercel.app/api/webhooks/stripe`。
3. 监听事件勾选 `checkout.session.completed`。
4. 创建后复制 **Signing secret**（`whsec_...`），回到 Vercel 填入 `STRIPE_WEBHOOK_SECRET`，再重新部署一次。

> 说明：即使不配 webhook，成功页的 `/api/checkout/confirm` 也会把订单标记为已支付；webhook 是兜底，用于应对「支付成功但用户未跳回成功页」的情况，生产环境建议配置。

### 5. 部署后验证

- 打开站点，确认首页 / 纪念用品 / 殡葬服务 / 纪念空间正常显示内容（种子数据）。
- 走一遍「购物车 → 支付 → 成功页」流程。
- 用 `npx prisma studio`（本地连云端库）或云数据库控制台确认订单状态为 `PAID`。
