"use client";

import { useState } from "react";
import { motion, useDragControls } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerAltAddressSchema,
  type CustomerAltAddress,
} from "@/app/schemas/customer/customer_schema";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { LabeledInput } from "./LabeledInput";

const labels = {
  alt_company: "Company",
  alt_first_name: "First name",
  alt_last_name: "Last name",
  alt_street_address: "Street address",
  alt_postal_code: "Postal code",
  alt_city: "City",
} satisfies Record<keyof CustomerAltAddress, string>;

export function CustomerAltAddressDialog({
  disabled,
  readAddress,
  onApply,
}: {
  disabled?: boolean;
  readAddress: () => CustomerAltAddress;
  onApply: (address: CustomerAltAddress) => void;
}) {
  const [open, setOpen] = useState(false);
  const dragControls = useDragControls();
  const { control, handleSubmit, reset } = useForm<CustomerAltAddress>({
    resolver: zodResolver(customerAltAddressSchema),
  });

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (nextOpen) reset(customerAltAddressSchema.parse(readAddress()));
      setOpen(nextOpen);
    }}>
      <DialogTrigger disabled={disabled} render={<Button type="button" size="sm" />}>
        Different Invoice Adress
      </DialogTrigger>
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto sm:max-w-lg [&>[data-slot=dialog-close]]:text-white [&>[data-slot=dialog-close]:hover]:bg-white/20"
        render={<motion.div drag dragControls={dragControls} dragListener={false} dragMomentum={false} />}
      >
        <DialogHeader
          className="-mx-4 -mt-4 cursor-move touch-none select-none rounded-t-xl bg-blue-900 px-4 py-4 pr-12 text-white"
          onPointerDown={(event) => dragControls.start(event)}
        >
          <DialogTitle>Different Invoice Adress</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={(event) => {
          event.stopPropagation();
          void handleSubmit((address) => {
            onApply(address);
            setOpen(false);
          })(event);
        }}>
          {customerAltAddressSchema.keyof().options.map((name) => (
            <LabeledInput key={name} id={name} name={name} control={control} label={labels[name]} />
          ))}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit">Apply</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
