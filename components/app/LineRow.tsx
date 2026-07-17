import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  gap?: string;
  children: React.ReactNode;
  className?: string;
};

export default function LineRow({ children, gap = "gap-8", className }: Props) {
  return (
    <div
      className={twMerge(`flex flex-row w-full ${gap} items-center`, className)}
    >
      {children}
    </div>
  );
}
