import { StripePaymentProvider } from "./stripe";
import type { PaymentProvider } from "./types";

// 替换支付渠道只需在这里改工厂逻辑：
// 未来接入微信 / 支付宝 / 本地 Mock 时，新增一个实现 PaymentProvider 的类，
// 按环境变量选择返回即可，业务代码无需改动。
let cached: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (cached) return cached;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "缺少 STRIPE_SECRET_KEY 环境变量，请在 .env 中配置 Stripe 测试密钥（sk_test_...）"
    );
  }

  cached = new StripePaymentProvider({
    secretKey,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || undefined,
  });
  return cached;
}
