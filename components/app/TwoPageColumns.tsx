import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function PageColumns({ children, className }: Props) {
  return (
    <div
      className={twMerge(
        "grid grid-flow-row-dense gap-2 grid-cols-4 grid-rows-1  mr-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function OnePageColumn({ children }: Props) {
  return (
    <div className="grid grid-flow-row-dense gap-3 grid-cols-1 grid-rows-1 p-2 mr-4">
      {children}
    </div>
  );
}
