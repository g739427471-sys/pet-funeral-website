"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearCart } from "@/lib/cart";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Status = "loading" | "success" | "error";

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    async function confirm() {
      if (!sessionId) {
        if (!cancelled) setStatus("error");
        return;
      }
      try {
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.paid) {
          clearCart();
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    confirm();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-section text-center">
          {status === "loading" && (
            <p className="text-body text-ink-muted">正在确认支付结果…</p>
          )}

          {status === "success" && (
            <>
              <p className="font-display text-small tracking-[0.35em] text-sage">
                THANK YOU
              </p>
              <h1 className="mt-6 font-serif text-h1 text-ink">感谢您的信任</h1>
              <p className="mt-4 text-body text-ink-muted">
                支付已成功完成，订单状态已更新为「已支付」。
              </p>
              <Link
                href="/products"
                className="mt-8 inline-block rounded-full bg-brand px-8 py-3 text-base text-cream transition-colors hover:bg-brand-dark"
              >
                返回纪念用品
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="font-serif text-h1 text-ink">支付确认未完成</h1>
              <p className="mt-4 text-body text-ink-muted">
                未能确认支付结果，请稍后重试或联系我们协助处理。
              </p>
              <Link
                href="/"
                className="mt-8 inline-block rounded-full border border-line px-8 py-3 text-base text-ink transition-colors hover:border-brand hover:text-brand"
              >
                返回首页
              </Link>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
