// components/Greeting.tsx
"use client";
import { useTranslations } from "next-intl";

export default function Greeting({ name }: { name: string }) {
  const t = useTranslations("common");
  return <p>{t("welcome", { name })}</p>;
}
