import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { OrderStatus } from "@/generated/prisma/client";

type CheckoutPayload = {
  items?: { productId: string; quantity: number }[];
  customerEmail?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;
    const items = body.items ?? [];
    if (items.length === 0) {
      return NextResponse.json({ error: "购物车为空" }, { status: 400 });
    }

    // 价格以数据库为准（不信任客户端），并做下单快照
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const lineItems: {
      productId: string;
      name: string;
      quantity: number;
      unitAmountCents: number;
    }[] = [];
    for (const item of items) {
      const product = productMap.get(item.productId);
      const quantity = Math.max(1, Math.floor(item.quantity || 1));
      if (!product) {
        return NextResponse.json(
          { error: "部分商品不存在或已下架，请刷新购物车" },
          { status: 400 }
        );
      }
      lineItems.push({
        productId: product.id,
        name: product.name,
        quantity,
        unitAmountCents: product.priceCents,
      });
    }

    const totalCents = lineItems.reduce(
      (sum, l) => sum + l.unitAmountCents * l.quantity,
      0
    );
    const customerEmail = body.customerEmail?.trim() || "guest@guixi.example";

    const order = await prisma.order.create({
      data: {
        orderNumber: `GX${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`,
        status: OrderStatus.PENDING,
        totalCents,
        currency: "cny",
        customerEmail,
        items: {
          create: lineItems.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            unitPriceCents: l.unitAmountCents,
          })),
        },
      },
    });

    const provider = getPaymentProvider();
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    const session = await provider.createCheckoutSession({
      orderId: order.id,
      orderNumber: order.orderNumber,
      currency: "cny",
      lineItems: lineItems.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        unitAmountCents: l.unitAmountCents,
      })),
      customerEmail,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/cart`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("创建支付会话失败：", error);
    const message =
      error instanceof Error ? error.message : "创建支付会话失败，请稍后重试";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
