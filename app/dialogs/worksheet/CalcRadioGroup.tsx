import { Button } from "@/components/ui/button";

type Props = { inout: string; setInOut: (value: string) => void };

export default function CalcRadioGroup({ inout, setInOut }: Props) {
  return (
    <div className="flex gap-2" role="group" aria-label="Calculation direction">
      {(["in", "out"] as const).map((value) => (
        <Button key={value} type="button" variant={inout === value ? "default" : "outline"} onClick={() => setInOut(value)}>
          {value === "in" ? "In" : "Out"}
        </Button>
      ))}
    </div>
  );
}
