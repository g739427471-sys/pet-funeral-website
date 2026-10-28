import Link from "next/link";

const services = [
  {
    title: "火化服务",
    description: "专业、安详的火化流程，尊重每一个生命，全程可预约接送。",
    href: "/services",
  },
  {
    title: "告别仪式",
    description: "庄重而温暖的告别仪式，为它留下一段完整而郑重的告别。",
    href: "/services",
  },
  {
    title: "上门接送",
    description: "24 小时贴心上门，温柔地将它接来，也温柔地送它回家。",
    href: "/services",
  },
];

export function ServiceCards() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-section">
        <div className="text-center">
          <h2 className="font-serif text-h2 text-ink">我们的服务</h2>
          <p className="mt-3 text-body text-ink-muted">
            透明定价，全程陪伴，让告别不再仓促。
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group rounded-2xl border border-line bg-cream p-8 transition-colors hover:border-brand"
            >
              <div className="h-1.5 w-8 rounded-full bg-sage" />
              <h3 className="mt-6 font-serif text-h3 text-ink">
                {service.title}
              </h3>
              <p className="mt-3 text-body text-ink-muted">
                {service.description}
              </p>
              <span className="mt-6 inline-block text-small text-brand transition-transform group-hover:translate-x-1">
                了解更多 →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
