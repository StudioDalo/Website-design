"use client";
import Image from "next/image";
import { useSite } from "./site-provider";
import { Mark } from "./icons";
export function BrandMark({ className = "" }: { className?: string }) {
  const { logos } = useSite();
  if (!logos.light && !logos.dark) return <Mark className={className} />;
  return (
    <span className={`custom-brand-mark ${className}`} aria-hidden="true">
      <Image
        className="logo-on-paper"
        src={(logos.dark || logos.light)!.src}
        alt=""
        width={46}
        height={46}
        sizes="46px"
      />
      <Image
        className="logo-on-ink"
        src={(logos.light || logos.dark)!.src}
        alt=""
        width={46}
        height={46}
        sizes="46px"
      />
    </span>
  );
}
