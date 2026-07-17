import React from "react";
import { Label } from "@/components/ui/label";
type Props = {
  label: string;
  children: React.ReactNode;
};

export default function LabeledInfo(props: Props) {
  const { label, children } = props;
  return (
    <div className="flex flex-col gap-1">
      <Label className="label-text">{label}</Label>
      <Label className="border-2 border-blue-900 rounded-md p-2 bg-gray-100 text-blue-900">
        {children}
      </Label>
    </div>
  );
}
