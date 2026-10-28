import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { markOrderPaidById } from "@/lib/orders";

// Stripe webhook：支付成功后由 Stripe 服务端回调，更新订单为 PAID。
// 本地调试可用 `stripe listen --forward-to localhost:3000/api/webhooks/stripe`。
export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature") ?? "";

    const provider = getPaymentProvider();
    const event = await provider.constructWebhookEvent(payload, signature);

    if (event.type === "checkout.session.completed" && event.orderId) {
      await markOrderPaidById(event.orderId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook 处理失败：", error);
    const message =
      error instanceof Error ? error.message : "webhook 处理失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
