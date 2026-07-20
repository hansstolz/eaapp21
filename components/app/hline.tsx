import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
};

export default function HLine({ className }: Props) {
  return (
    <hr
      className={twMerge("w-full h-0.5 my-4 bg-secondary-200", className)}
    ></hr>
  );
}
