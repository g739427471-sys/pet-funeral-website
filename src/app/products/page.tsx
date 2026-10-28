import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCategory } from "@/generated/prisma/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "纪念用品",
  description:
    "骨灰盒、纪念品与祭祀用品，透明定价，如实标注。为珍藏一份思念而准备，让陪伴以另一种方式继续。",
};

const categoryMeta = [
  {
    key: ProductCategory.URN,
    label: "骨灰盒",
    intro: "收纳它安息的归宿，庄重而长久。",
  },
  {
    key: ProductCategory.KEEPSAKE,
    label: "纪念品",
    intro: "留存它独一无二的印记，让陪伴继续。",
  },
  {
    key: ProductCategory.OFFERING,
    label: "祭祀用品",
    intro: "一点心意，安静地献上思念。",
  },
];

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <header className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-section text-center">
            <p className="font-display text-small tracking-[0.35em] text-sage">
              MEMORIAL GOODS
            </p>
            <h1 className="mt-6 font-serif text-display font-medium text-ink">
              纪念用品
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lead text-ink-muted">
              透明定价，如实标注。每一件，都为珍藏一份思念而准备。
            </p>
          </div>
        </header>

        {/* 数据库查询移入子组件并用 Suspense 包裹，提供骨架屏加载占位 */}
        <Suspense fallback={<ProductCatalogSkeleton />}>
          <ProductCatalog />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function ProductCatalog() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { priceCents: "asc" }],
  });

  return (
    <>
      {categoryMeta.map((cat) => {
        const items = products.filter((p) => p.category === cat.key);
        if (items.length === 0) return null;

        return (
          <section key={cat.key} className="border-b border-line">
            <div className="mx-auto max-w-6xl px-6 py-section">
              <div className="flex items-baseline gap-4">
                <h2 className="font-serif text-h2 text-ink">{cat.label}</h2>
                <span className="text-small text-ink-muted">{cat.intro}</span>
              </div>

              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <article
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-brand"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden bg-cream">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink-muted">
                          暂无图片
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-h3 text-ink">{p.name}</h3>
                      <p className="mt-3 text-small leading-relaxed text-ink-muted">
                        {p.description}
                      </p>
                      <div className="mt-6 flex items-baseline justify-between">
                        <span className="font-serif text-xl text-brand">
                          {formatPrice(p.priceCents)}
                        </span>
                        {p.stock !== null && (
                          <span className="text-small text-ink-muted">
                            {p.stock > 0 ? "现货" : "暂时缺货"}
                          </span>
                        )}
                      </div>
                      <div className="mt-5">
                        <AddToCartButton
                          productId={p.id}
                          name={p.name}
                          priceCents={p.priceCents}
                          imageUrl={p.imageUrl}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

function ProductCatalogSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-section">
      <div className="space-y-12">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="h-7 w-36 animate-pulse rounded bg-line" />
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="overflow-hidden rounded-2xl border border-line bg-surface"
                >
                  <div className="aspect-[3/2] animate-pulse bg-line" />
                  <div className="space-y-3 p-6">
                    <div className="h-6 w-2/3 animate-pulse rounded bg-line" />
                    <div className="h-4 w-full animate-pulse rounded bg-line" />
                    <div className="h-5 w-1/3 animate-pulse rounded bg-line" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
