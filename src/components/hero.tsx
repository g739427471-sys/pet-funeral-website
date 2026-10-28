import Link from "next/link";

export function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-section text-center">
        <p className="font-display text-small tracking-[0.35em] text-sage">
          GENTLE FAREWELL
        </p>
        <h1 className="mx-auto mt-6 max-w-2xl font-serif text-display font-medium text-ink">
          以温柔，与它告别
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lead text-ink-muted">
          专业的宠物殡葬服务与纪念用品，让每一次告别都被温柔以待，让它安详地回到自然。
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/services"
            className="rounded-full bg-brand px-8 py-3 text-base text-cream transition-colors hover:bg-brand-dark"
          >
            了解服务
          </Link>
          <Link
            href="/memorial"
            className="rounded-full border border-line px-8 py-3 text-base text-ink transition-colors hover:border-brand hover:text-brand"
          >
            进入纪念空间
          </Link>
        </div>
      </div>
    </section>
  );
}
