import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-serif text-lg text-ink">归栖</p>
            <p className="mt-1 font-display text-small italic text-brand">
              GuiXi
            </p>
            <p className="mt-4 text-small leading-relaxed text-ink-muted">
              让每一次告别，都被温柔以待。
            </p>
          </div>

          <div>
            <h4 className="text-small font-medium text-ink">服务</h4>
            <ul className="mt-4 space-y-2 text-small text-ink-muted">
              <li>
                <Link href="/services" className="hover:text-brand">
                  火化服务
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand">
                  告别仪式
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand">
                  上门接送
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-small font-medium text-ink">用品</h4>
            <ul className="mt-4 space-y-2 text-small text-ink-muted">
              <li>
                <Link href="/products" className="hover:text-brand">
                  骨灰盒
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand">
                  纪念品
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand">
                  祭祀用品
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-small font-medium text-ink">联系</h4>
            <p className="mt-4 text-small leading-relaxed text-ink-muted">
              如有需要，请随时联系我们，我们会第一时间温柔地回应。
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-small text-ink-muted">
          © 2026 归栖 · 保留所有权利
        </div>
      </div>
    </footer>
  );
}
