"use client";

// 客户端购物车：暂用 localStorage 存储（轻量、无需登录）。
// 通过 useSyncExternalStore 暴露响应式的 useCart()，避免在 effect 里同步 setState。

import { useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string | null;
};

const STORAGE_KEY = "guixi:cart";
const EMPTY: CartItem[] = [];

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function saveStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// —— 外部 store（供 useSyncExternalStore 订阅）——
const listeners = new Set<() => void>();
let cached: CartItem[] | null = null;

function emitChange() {
  cached = readStorage();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // 跨标签页同步：其他标签页改动 localStorage 时触发
  const onStorage = () => emitChange();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CartItem[] {
  if (cached === null) cached = readStorage();
  return cached;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getCart(): CartItem[] {
  return readStorage();
}

export function addToCart(item: CartItem) {
  const items = readStorage();
  const existing = items.find((i) => i.productId === item.productId);
  const next = existing
    ? items.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
    : [...items, item];
  saveStorage(next);
  emitChange();
}

export function updateCartQuantity(productId: string, quantity: number) {
  const items = readStorage();
  const next =
    quantity <= 0
      ? items.filter((i) => i.productId !== productId)
      : items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
  saveStorage(next);
  emitChange();
}

export function removeFromCart(productId: string) {
  saveStorage(readStorage().filter((i) => i.productId !== productId));
  emitChange();
}

export function clearCart() {
  saveStorage(EMPTY);
  emitChange();
}

export function cartTotalCents(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}
