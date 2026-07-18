import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  gap?: string;
  children: React.ReactNode;
  className?: string;
};

export default function VStack({ children, className }: Props) {
  return (
    <div className={twMerge(`flex flex-col w-full gap-3`, className)}>
      {children}
    </div>
  );
}
