"use client";
import Image from "next/image";

interface LogoDignaLearnProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  darkBackground?: boolean;
}

export default function LogoDignaLearn({
  size = 48,
  className = "",
  showWordmark = false,
  darkBackground = false,
}: LogoDignaLearnProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo-isotipo.svg"
        alt="DignaLearn"
        width={size}
        height={size}
        priority
      />
      {showWordmark && (
        <span
          style={{ fontFamily: "var(--font-heading)" }}
          className="text-xl font-semibold tracking-tight leading-none"
        >
          <span className={darkBackground ? "text-white" : "text-[#160B24] dark:text-white"}>Digna</span>
          <span className="text-[#F0A8B6]">Learn</span>
        </span>
      )}
    </div>
  );
}
