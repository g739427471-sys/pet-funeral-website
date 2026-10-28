import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type MemorialPayload = {
  petName?: string;
  petType?: string | null;
  birthDate?: string | null;
  passedDate?: string | null;
  story?: string;
  ownerName?: string | null;
  imageUrl?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MemorialPayload;
    const petName = body.petName?.trim();
    const story = body.story?.trim();

    if (!petName || !story) {
      return NextResponse.json(
        { error: "请填写宠物名字和纪念故事" },
        { status: 400 }
      );
    }

    // 图片暂用 Base64 存储，限制体积避免撑爆数据库
    if (body.imageUrl && body.imageUrl.length > 3_000_000) {
      return NextResponse.json(
        { error: "图片过大，请压缩后重试（建议 2MB 以内）" },
        { status: 400 }
      );
    }

    const memorial = await prisma.memorial.create({
      data: {
        slug: `mem-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        petName,
        petType: body.petType?.trim() || null,
        birthDate: parseDate(body.birthDate),
        passedDate: parseDate(body.passedDate),
        story,
        ownerName: body.ownerName?.trim() || null,
        imageUrl: body.imageUrl || null,
        published: false, // 默认私密，审核后公开
      },
    });

    return NextResponse.json({ ok: true, id: memorial.id }, { status: 201 });
  } catch (error) {
    console.error("创建纪念页失败：", error);
    return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 });
  }
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
