import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { markOrderPaidBySessionId } from "@/lib/orders";

// 支付成功回跳页调用：向 Stripe 核实会话确已支付后，把订单标记为 PAID。
export async function POST(request: Request) {
  try {
    const { sessionId } = (await request.json()) as { sessionId?: string };
    if (!sessionId) {
      return NextResponse.json({ error: "缺少 sessionId" }, { status: 400 });
    }

    const provider = getPaymentProvider();
    const session = await provider.retrieveCheckoutSession(sessionId);

    if (session.paymentStatus !== "paid") {
      return NextResponse.json({ ok: false, paid: false });
    }

    const order = await markOrderPaidBySessionId(sessionId);
    return NextResponse.json({ ok: true, paid: true, orderId: order?.id ?? null });
  } catch (error) {
    console.error("确认支付失败：", error);
    return NextResponse.json(
      { error: "确认支付失败，请稍后重试" },
      { status: 500 }
    );
  }
}
