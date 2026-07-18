import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
  className?: string;
};

type InfoProps = {
  label: string;
  value: string | number;
  className?: string;
};

export default function SmallText({ children, className }: Props) {
  return (
    <div className={twMerge("text-xs text-black font-light", className)}>
      {children}
    </div>
  );
}

export function MediumText({ children, className }: Props) {
  return (
    <div className={twMerge("text-xl text-secondary font-medium", className)}>
      {children}
    </div>
  );
}

export function LargeText({ children, className }: Props) {
  return (
    <div className={twMerge("text-2xl text-slate-700 font-bold", className)}>
      {children}
    </div>
  );
}

export function InfoText({ label, className, value }: InfoProps) {
  return (
    <div className="flex flex-row gap-3">
      <div
        className={twMerge("text-xs w-24 text-secondary font-light", className)}
      >
        {label}
      </div>
      <div className={twMerge("text-xs text-secondary font-medium", className)}>
        {value}
      </div>
    </div>
  );
}
