"use client";

import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-line bg-cream px-4 py-2.5 text-body text-ink placeholder:text-ink-muted/60 focus:border-brand focus:outline-none";

export function MemorialForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("图片需小于 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      petName: formData.get("petName"),
      petType: formData.get("petType"),
      birthDate: formData.get("birthDate"),
      passedDate: formData.get("passedDate"),
      story: formData.get("story"),
      ownerName: formData.get("ownerName"),
      imageUrl,
    };

    try {
      const res = await fetch("/api/memorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "提交失败，请稍后重试");
      }
      setStatus("success");
      setImageUrl(null);
      setImageName("");
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
            htmlFor="petName"
            className="mb-1.5 block text-small font-medium text-ink"
          >
            它的名字 *
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
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="birthDate"
            className="mb-1.5 block text-small font-medium text-ink"
          >
            出生日期（选填）
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="passedDate"
            className="mb-1.5 block text-small font-medium text-ink"
          >
            离世日期（选填）
          </label>
          <input
            id="passedDate"
            name="passedDate"
            type="date"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="story"
          className="mb-1.5 block text-small font-medium text-ink"
        >
          纪念故事 *
        </label>
        <textarea
          id="story"
          name="story"
          rows={5}
          required
          placeholder="写下你们的故事，那些值得被记住的瞬间…"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="ownerName"
          className="mb-1.5 block text-small font-medium text-ink"
        >
          您的名字（选填）
        </label>
        <input
          id="ownerName"
          name="ownerName"
          type="text"
          placeholder="如何称呼您"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="photo"
          className="mb-1.5 block text-small font-medium text-ink"
        >
          它的照片（选填，2MB 以内）
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-small text-ink-muted file:mr-4 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-small file:text-cream hover:file:bg-brand-dark"
        />
        {imageName && (
          <p className="mt-2 text-small text-ink-muted">已选择：{imageName}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-brand px-8 py-3 text-base text-cream transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "正在提交…" : "提交纪念"}
        </button>
      </div>

      {status === "success" && (
        <p className="rounded-lg border border-sage/40 bg-sage/10 px-4 py-3 text-small text-ink">
          纪念页已保存。默认私密，经我们温柔审核后会在纪念墙公开。
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
