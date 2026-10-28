import Stripe from "stripe";
import type {
  PaymentProvider,
  CreateCheckoutSessionInput,
  CheckoutSession,
  RetrievedCheckoutSession,
  WebhookEvent,
} from "./types";

type StripeOptions = {
  secretKey: string;
  webhookSecret?: string;
};

export class StripePaymentProvider implements PaymentProvider {
  private readonly stripe: Stripe;
  private readonly webhookSecret?: string;

  constructor(options: StripeOptions) {
    this.stripe = new Stripe(options.secretKey);
    this.webhookSecret = options.webhookSecret;
  }

  async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.customerEmail || undefined,
      line_items: input.lineItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: input.currency,
          unit_amount: item.unitAmountCents,
          product_data: { name: item.name },
        },
      })),
      metadata: { orderId: input.orderId, orderNumber: input.orderNumber },
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    });

    return { id: session.id, url: session.url };
  }

  async retrieveCheckoutSession(sessionId: string): Promise<RetrievedCheckoutSession> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      paymentStatus: session.payment_status ?? "",
      orderId: session.metadata?.orderId ?? null,
      paymentIntentId: (session.payment_intent as string) ?? null,
    };
  }

  async constructWebhookEvent(
    payload: string,
    signature: string
  ): Promise<WebhookEvent> {
    if (!this.webhookSecret) {
      throw new Error("缺少 STRIPE_WEBHOOK_SECRET 环境变量，无法校验 webhook");
    }
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret
    );

    let orderId: string | null = null;
    let paymentStatus = "";
    let paymentIntentId: string | null = null;
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      orderId = session.metadata?.orderId ?? null;
      paymentStatus = session.payment_status ?? "";
      paymentIntentId = (session.payment_intent as string) ?? null;
    }

    return { type: event.type, orderId, paymentStatus, paymentIntentId };
  }
}
