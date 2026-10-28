"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, cartTotalCents } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function CartPage() {
  const items = useCart();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          customerEmail: email || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "创建支付会话失败");
      }
      window.location.href = data.url;
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof Error ? err.message : "创建支付会话失败，请稍后重试"
      );
    }
  }

  const totalCents = cartTotalCents(items);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <header className="border-b border-line">
          <div className="mx-auto max-w-4xl px-6 py-12 text-center">
            <h1 className="font-serif text-h1 text-ink">购物车</h1>
          </div>
        </header>

        <section className="border-b border-line">
          <div className="mx-auto max-w-4xl px-6 py-section">
            {items.length === 0 ? (
              <div className="text-center">
                <p className="text-body text-ink-muted">购物车还是空的。</p>
                <Link
                  href="/products"
                  className="mt-6 inline-block rounded-full bg-brand px-8 py-3 text-base text-cream transition-colors hover:bg-brand-dark"
                >
                  去挑选纪念用品
                </Link>
              </div>
            ) : (
              <div>
                <ul className="divide-y divide-line border-y border-line">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center gap-4 py-4"
                    >
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-cream">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-ink-muted">
                            图
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-ink">{item.name}</p>
                        <p className="text-small text-ink-muted">
                          {formatPrice(item.priceCents)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-serif text-brand">
                        {formatPrice(item.priceCents * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center justify-between">
                  <p className="font-serif text-h3 text-ink">合计</p>
                  <p className="font-serif text-h3 text-brand">
                    {formatPrice(totalCents)}
                  </p>
                </div>

                <div className="mt-8">
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-small font-medium text-ink"
                  >
                    联系邮箱（用于接收订单确认，选填）
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-line bg-cream px-4 py-2.5 text-body text-ink placeholder:text-ink-muted/60 focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={submitting}
                    className="w-full rounded-full bg-brand px-8 py-3 text-base text-cream transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "正在跳转支付…"
                      : `去支付（${formatPrice(totalCents)}）`}
                  </button>
                </div>

                {error && (
                  <p className="mt-4 rounded-lg border border-brand/40 bg-brand/10 px-4 py-3 text-small text-ink">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
