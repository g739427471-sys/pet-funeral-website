// 支付抽象层：所有支付渠道（Stripe / 后续微信 / 支付宝 / Mock）都实现该接口，
// 业务代码只依赖 PaymentProvider，不依赖具体渠道。

// 金额统一以「最小货币单位」传递（与数据库 priceCents 一致；CNY 的最小单位是「分」）。
export type CheckoutLineItem = {
  name: string;
  quantity: number;
  unitAmountCents: number;
};

export type CreateCheckoutSessionInput = {
  orderId: string;
  orderNumber: string;
  currency: string;
  lineItems: CheckoutLineItem[];
  customerEmail?: string | null;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSession = {
  id: string;
  url: string | null;
};

export type RetrievedCheckoutSession = {
  paymentStatus: string; // "paid" | "unpaid" | "no_payment_required"
  orderId: string | null;
  paymentIntentId: string | null;
};

export type WebhookEvent = {
  type: string;
  orderId: string | null;
  paymentStatus: string;
  paymentIntentId: string | null;
};

export interface PaymentProvider {
  /** 创建支付会话，返回跳转支付页的 URL */
  createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CheckoutSession>;
  /** 查询支付会话状态（支付成功回调页用） */
  retrieveCheckoutSession(sessionId: string): Promise<RetrievedCheckoutSession>;
  /** 校验 webhook 签名并解析事件 */
  constructWebhookEvent(payload: string, signature: string): Promise<WebhookEvent>;
}
