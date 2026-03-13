"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

function PhotoSlot({
  src,
  alt,
  badge,
  badgeColor,
}: {
  src: string;
  alt: string;
  badge: string;
  badgeColor: string;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="relative flex-1 overflow-hidden">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-50 to-slate-100">
          <ImageIcon className="h-6 w-6 text-slate-300" />
          <p className="text-[10px] text-slate-400">{badge}</p>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setError(true)}
        />
      )}
      <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow ${badgeColor}`}>
        {badge}
      </span>
    </div>
  );
}

const Divider = () => (
  <div className="relative z-10 w-px bg-white/80 shrink-0 flex items-center justify-center">
    <div className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md border border-slate-200">
      <svg viewBox="0 0 16 16" className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M5 3l-3 5 3 5M11 3l3 5-3 5" />
      </svg>
    </div>
  </div>
);

interface BeforeAfterCardProps {
  label: string;
  leftSrc: string;
  rightSrc: string;
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
}

export function BeforeAfterCard({
  label,
  leftSrc,
  rightSrc,
  leftLabel,
  rightLabel,
  leftColor,
  rightColor,
}: BeforeAfterCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative flex aspect-[16/9]">
        <PhotoSlot src={leftSrc}  alt={`${leftLabel} — ${label}`}  badge={leftLabel}  badgeColor={leftColor} />
        <Divider />
        <PhotoSlot src={rightSrc} alt={`${rightLabel} — ${label}`} badge={rightLabel} badgeColor={rightColor} />
      </div>
      <div className="px-4 py-3 border-t border-slate-100">
        <p className="text-sm font-medium text-gray-700 leading-snug">{label}</p>
      </div>
    </div>
  );
}
