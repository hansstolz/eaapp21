"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/app/input";
import CalcRadioGroup from "./CalcRadioGroup";

type Props = { isOpen: boolean; setIsOpen: (open: boolean) => void };

export default function CalculationDialog({ isOpen, setIsOpen }: Props) {
  const [inout, setInOut] = useState("in");
  const [values, setValues] = useState({ steeringOuter: 0, steeringInner: 0, negativeSpring: 0, outerRaceA: 0, outerRaceB: 0 });
  const result = useMemo(
    () => (values.steeringOuter - values.steeringInner - values.negativeSpring - values.outerRaceA - values.outerRaceB) / 2,
    [values],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Worksheet calculation</DialogTitle></DialogHeader>
        <CalcRadioGroup inout={inout} setInOut={setInOut} />
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(values).map(([key, value]) => (
            <label key={key} className="grid gap-1 text-xs">
              {key.replace(/([A-Z])/g, " $1")}
              <Input type="number" value={value} onChange={(event) => setValues((current) => ({ ...current, [key]: Number(event.target.value) }))} />
            </label>
          ))}
        </div>
        <p className="text-sm font-medium">Inner race ({inout}): {result}</p>
      </DialogContent>
    </Dialog>
  );
}
