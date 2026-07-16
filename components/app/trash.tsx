import { Trash2 } from "lucide-react";
import React from "react";

export default function Trash() {
  return (
    <div className="flex justify-end pr-4">
      <Trash2 className="h-4 w-4 text-brand-600 hover:bg-brand-200 hover:border-brand-400" />
    </div>
  );
}
