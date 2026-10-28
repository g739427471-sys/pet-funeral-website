import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@/generated/prisma/client";

type BookingPayload = {
  serviceId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string | null;
  petName?: string;
  petType?: string | null;
  scheduledAt?: string;
  address?: string | null;
  note?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingPayload;

    const serviceId = body.serviceId?.trim();
    const customerName = body.customerName?.trim();
    const customerPhone = body.customerPhone?.trim();
    const petName = body.petName?.trim();
    const scheduledAt = body.scheduledAt;

    // 基础校验：必填项
    if (!serviceId || !customerName || !customerPhone || !petName || !scheduledAt) {
      return NextResponse.json({ error: "请填写所有必填项" }, { status: 400 });
    }

    // 校验时间格式
    const scheduledDate = new Date(scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: "期望时间格式不正确" }, { status: 400 });
    }

    // 校验服务是否存在
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json(
        { error: "所选服务不存在，请重新选择" },
        { status: 400 }
      );
    }

    // 写入预约，状态默认为 PENDING（后台人工确认）
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        customerName,
        customerPhone,
        customerEmail: body.customerEmail?.trim() || null,
        petName,
        petType: body.petType?.trim() || null,
        scheduledAt: scheduledDate,
        address: body.address?.trim() || null,
        note: body.note?.trim() || null,
        status: BookingStatus.PENDING,
      },
    });

    return NextResponse.json(
      { ok: true, booking: { id: booking.id, status: booking.status } },
      { status: 201 }
    );
  } catch (error) {
    console.error("创建预约失败：", error);
    return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 });
  }
}
