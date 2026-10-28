"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
};

export function AddToCartButton({
  productId,
  name,
  priceCents,
  imageUrl,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({ productId, name, priceCents, quantity: 1, imageUrl });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="w-full rounded-full border border-brand px-4 py-2 text-small text-brand transition-colors hover:bg-brand hover:text-cream"
    >
      {added ? "已加入 ✓" : "加入购物车"}
    </button>
  );
}
