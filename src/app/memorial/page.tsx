import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { MemorialForm } from "@/components/memorial-form";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "纪念空间",
  description:
    "为它留一页温柔的记忆。写下你们的故事，在纪念墙上被好好记得。",
};

export default function MemorialPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <header className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-section text-center">
            <p className="font-display text-small tracking-[0.35em] text-sage">
              MEMORIAL WALL
            </p>
            <h1 className="mt-6 font-serif text-display font-medium text-ink">
              纪念空间
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lead text-ink-muted">
              为它留一页温柔的记忆。写下你们的故事，让它被好好记得。
            </p>
          </div>
        </header>

        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-section">
            <div className="text-center">
              <h2 className="font-serif text-h2 text-ink">纪念墙</h2>
              <p className="mt-3 text-body text-ink-muted">
                每一段相遇，都值得被温柔地记得。
              </p>
            </div>

            <Suspense fallback={<MemorialWallSkeleton />}>
              <MemorialWall />
            </Suspense>
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto max-w-3xl px-6 py-section">
            <div className="text-center">
              <h2 className="font-serif text-h2 text-ink">为它写一页纪念</h2>
              <p className="mt-3 text-body text-ink-muted">
                新提交的纪念页默认为私密，经我们温柔审核后会在纪念墙公开。
              </p>
            </div>
            <MemorialForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

async function MemorialWall() {
  const memorials = await prisma.memorial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  if (memorials.length === 0) {
    return (
      <p className="mt-10 text-center text-body text-ink-muted">
        纪念墙上还没有公开的纪念，稍后再来看看。
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {memorials.map((m) => (
        <article
          key={m.id}
          className="overflow-hidden rounded-2xl border border-line bg-surface"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-cream">
            {m.imageUrl ? (
              m.imageUrl.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element -- base64 数据 URL 无法用 next/image 优化
                <img
                  src={m.imageUrl}
                  alt={m.petName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={m.imageUrl}
                  alt={m.petName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream to-line">
                <span className="font-serif text-5xl text-brand/40">
                  {m.petName.slice(0, 1)}
                </span>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-h3 text-ink">{m.petName}</h3>
              {m.petType && (
                <span className="text-small text-ink-muted">{m.petType}</span>
              )}
            </div>
            {m.birthDate || m.passedDate ? (
              <p className="mt-1 text-small text-ink-muted">
                {m.birthDate ? `${m.birthDate.getFullYear()} 年` : ""}
                {m.birthDate && m.passedDate ? " — " : ""}
                {m.passedDate ? `${m.passedDate.getFullYear()} 年` : ""}
              </p>
            ) : null}
            <p className="mt-3 text-small leading-relaxed text-ink-muted line-clamp-4">
              {m.story}
            </p>
            {m.ownerName && (
              <p className="mt-4 text-small text-ink-muted">
                由 {m.ownerName} 纪念
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function MemorialWallSkeleton() {
  return (
    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-line bg-surface"
        >
          <div className="aspect-[4/3] animate-pulse bg-line" />
          <div className="space-y-3 p-6">
            <div className="h-6 w-1/2 animate-pulse rounded bg-line" />
            <div className="h-4 w-full animate-pulse rounded bg-line" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-line" />
          </div>
        </div>
      ))}
    </div>
  );
}
