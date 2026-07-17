import React from "react";
import { twJoin, twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  align?: string;
  className?: string;
};

export default function TwoColumn({
  children,
  className,
  align = "items-center",
}: Props) {
  return (
    <div className={twMerge(`flex flex-row gap-6 ${align}`, className)}>
      {children}
    </div>
  );
}
