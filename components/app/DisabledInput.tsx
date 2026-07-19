import React from "react";

type Props = {
  label: string;
  className?: string;
  width?: string;
  children?: React.ReactNode;
};

export default function DisabledInput(props: Props) {
  const { width = "w-full", label, children, className } = props;
  return (
    <div className="flex flex-col">
      <label
        className="uppercase mb-1 text-xs text-secondary-400"
        htmlFor={label}
      >
        {label}
      </label>
      <div
        className={`${width} bg-gray-100 whitespace-pre-wrap text-sm px-1 py-1 border border-gray-300 rounded-md ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
