"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type ServiceOption = {
  id: string;
  name: string;
  priceLabel: string;
};

type BookingFormProps = {
  services: ServiceOption[];
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-line bg-cream px-4 py-2.5 text-body text-ink placeholder:text-ink-muted/60 focus:border-brand focus:outline-none";

export function BookingForm({ services }: BookingFormProps) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      serviceId: formData.get("serviceId"),
      customerName: formData.get("customerName"),
      customerPhone: formData.get("customerPhone"),
      customerEmail: formData.get("customerEmail"),
      petName: formData.get("petName"),
      petType: formData.get("petType"),
      scheduledAt: formData.get("scheduledAt"),
      address: formData.get("address"),
      note: formData.get("note"),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "提交失败，请稍后重试");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="serviceId"
            className="mb-1.5 block text-small font-medium text-ink"
          >
            服务项目 *
          </label>
          <select id="serviceId" name="serviceId" required className={inputClass}>
            <option value="" disabled>
              请选择服务
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.priceLabel}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="scheduledAt"
            className="mb-1.5 block text-small font-medium text-ink"
          >
            期望时间 *
          </label>
          <input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="customerName"
            className="mb-1.5 block text-small font-medium text-ink"
          >
            您的称呼 *
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            required
            placeholder="如何称呼您"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="customerPhone"
            className="mb-1.5 block text-small font-medium text-ink"
          >
            联系电话 *
          </label>
          <input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            required
            placeholder="方便我们联系您"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="customerEmail"
            className="mb-1.5 block text-small font-medium text-ink"
          >
            邮箱（选填）
          </label>
          <input
            id="customerEmail"
            name="customerEmail"
            type="email"
            placeholder="name@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="petName"
            className="mb-1.5 block text-small font-medium text-ink"
          >
            宠物名字 *
          </label>
          <input
            id="petName"
            name="petName"
            type="text"
            required
            placeholder="它叫什么名字"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="petType"
          className="mb-1.5 block text-small font-medium text-ink"
        >
          宠物类型（选填）
        </label>
        <input
          id="petType"
          name="petType"
          type="text"
          placeholder="猫 / 狗 / 其他"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="mb-1.5 block text-small font-medium text-ink"
        >
          上门地址（选填，接送服务时填写）
        </label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="接送地址"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="note"
          className="mb-1.5 block text-small font-medium text-ink"
        >
          备注（选填）
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="如有特殊需求，请在这里温柔地告诉我们"
          className={inputClass}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-brand px-8 py-3 text-base text-cream transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "正在提交…" : "提交预约"}
        </button>
      </div>

      {status === "success" && (
        <p className="rounded-lg border border-sage/40 bg-sage/10 px-4 py-3 text-small text-ink">
          预约已提交，我们会在 24 小时内与您联系确认，请保持电话畅通。
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg border border-brand/40 bg-brand/10 px-4 py-3 text-small text-ink">
          {error}
        </p>
      )}
    </form>
  );
}
