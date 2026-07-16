import React from "react";
import "./number.css";
import { twMerge } from "tailwind-merge";
type Props = {
  no: number;
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  top?: string;
};
export default function Section({
  no,
  title,
  children,
  className = "",
  actions,
  top = "mt-4",
}: Props) {
  return (
    <div className={twMerge("mb-8", top)}>
      <div className="flex gap-2 text-lg text-alternate mx-2  mb-4 font-medium">
        <div className="number">
          <span>{no}</span>
        </div>
        <div className="w-full flex flex-row justify-between">
          <div>{title}</div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
      <div className={twMerge("ml-11 mr-2", className)}>{children}</div>
    </div>
  );
}
