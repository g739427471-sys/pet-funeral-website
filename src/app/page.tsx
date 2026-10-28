import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ServiceCards } from "@/components/service-cards";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: { absolute: "归栖 · 宠物殡葬与纪念服务" },
  description:
    "归栖提供温暖、庄重的宠物殡葬服务与纪念用品，涵盖单独火化、温馨告别仪式与 24 小时上门接送，并设有线上纪念空间。让每一次告别，都被温柔以待。",
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ServiceCards />
      </main>
      <SiteFooter />
    </>
  );
}
