import { prisma } from "./prisma";
import { OrderStatus } from "@/generated/prisma/client";

// 支付成功后把订单标记为 PAID。幂等：已支付则不再重复更新。

export async function markOrderPaidBySessionId(sessionId: string) {
  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });
  if (!order) return null;
  if (order.status === OrderStatus.PAID) return order;
  return prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.PAID, paidAt: new Date() },
  });
}

export async function markOrderPaidById(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return null;
  if (order.status === OrderStatus.PAID) return order;
  return prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.PAID, paidAt: new Date() },
  });
}
