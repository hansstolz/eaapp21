import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function LineLR({ children, className }: Props) {
  return (
    <div
      className={twMerge(
        "flex flex-row justify-between items-center mb-3",
        className
      )}
    >
      {children}
    </div>
  );
}
