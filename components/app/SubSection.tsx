import React from "react";
import "./number.css";
import { twMerge } from "tailwind-merge";
import { IconType } from "react-icons";
type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  icon?: IconType;
};
export default function SubSection({
  title,
  children,
  className = "",
  actions,
  icon,
}: Props) {
  return (
    <div className={twMerge("mb-8 mt-4", className)}>
      <div className="flex gap-2 text-md text-secondary  mb-4 font-medium">
        <div className="w-full bg-secondary-100 border-solid border border-secondary-300 rounded-md flex flex-row justify-between p-2 ">
          <div className="flex flex-row gap-1 items-center">
            {icon && React.createElement(icon)}
            <div>{title}</div>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
      <div className="ml-2">{children}</div>
    </div>
  );
}
