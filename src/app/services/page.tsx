import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { BookingForm } from "@/components/booking-form";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "殡葬服务",
  description:
    "单独火化、温馨告别仪式与 24 小时上门接送，透明定价，全程陪伴，温柔地陪它走完最后一程。",
};

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <header className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-section text-center">
            <p className="font-display text-small tracking-[0.35em] text-sage">
              FUNERAL SERVICES
            </p>
            <h1 className="mt-6 font-serif text-display font-medium text-ink">
              殡葬服务
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lead text-ink-muted">
              透明定价，全程陪伴。从接送、告别到火化，我们温柔地陪它走完最后一程。
            </p>
          </div>
        </header>

        {/* 数据库查询移入子组件并用 Suspense 包裹，提供骨架屏加载占位 */}
        <Suspense fallback={<ServicesSkeleton />}>
          <ServiceContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function ServiceContent() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { priceCents: "asc" },
  });

  const bookingOptions = services.map((s) => ({
    id: s.id,
    name: s.name,
    priceLabel: formatPrice(s.priceCents),
  }));

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-section">
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.id}
                className="rounded-2xl border border-line bg-surface p-8"
              >
                <div className="h-1.5 w-8 rounded-full bg-sage" />
                <h2 className="mt-6 font-serif text-h3 text-ink">{s.name}</h2>
                <p className="mt-3 text-small leading-relaxed text-ink-muted">
                  {s.description}
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-serif text-2xl text-brand">
                    {formatPrice(s.priceCents)}
                  </span>
                  {s.durationMinutes ? (
                    <span className="text-small text-ink-muted">
                      / 约 {s.durationMinutes} 分钟
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-section">
          <div className="text-center">
            <h2 className="font-serif text-h2 text-ink">在线预约</h2>
            <p className="mt-3 text-body text-ink-muted">
              留下您的信息，我们会在 24 小时内温柔地回复确认。
            </p>
          </div>
          <BookingForm services={bookingOptions} />
        </div>
      </section>
    </>
  );
}

function ServicesSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-section">
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-8">
            <div className="h-1.5 w-8 animate-pulse rounded-full bg-line" />
            <div className="mt-6 h-6 w-1/2 animate-pulse rounded bg-line" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-line" />
            <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-line" />
            <div className="mt-6 h-7 w-1/3 animate-pulse rounded bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
