"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { NewOrderCustomer, NewOrderFork } from "./types";
import { LabeledInput } from "@/components/app/LabeledInput";
import { FormSelect, type FormSelectOption } from "@/components/app/FormSelect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const schema = z.object({
  uid_ref_fork: z.string().min(1),
  fork_model: z.string().min(1),
  category_fork: z.string(),
  colour: z.string(),
  wheelsize: z.string(),
  client_name: z.string(),
});
type Form = z.infer<typeof schema>;
type References = {
  ref_forks: FormSelectOption[];
  ref_categories: FormSelectOption[];
  ref_colors: FormSelectOption[];
  ref_wheelsizes: FormSelectOption[];
};

export default function AddForkDialog({
  open,
  setOpen,
  customer,
  onCreated,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  customer: NewOrderCustomer;
  onCreated: (fork: NewOrderFork) => void;
}) {
  const [refs, setRefs] = useState<References | null>(null);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { uid_ref_fork: "", fork_model: "", category_fork: "", colour: "", wheelsize: "", client_name: "" },
  });
  useEffect(() => {
    if (!open) return;
    void fetch("/forks/get_fork_references").then((response) => response.json()).then(setRefs);
    form.reset();
  }, [form, open]);
  const submit = form.handleSubmit(async (data) => {
    const response = await fetch("/new-order/create-fork", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, uid_customer: customer.uid_customer }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.error ?? "Fork could not be created");
      return;
    }
    const fork = await response.json() as NewOrderFork;
    onCreated(fork);
    toast.success("Fork created");
    setOpen(false);
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>New Fork · {customer.customer_no} {customer.cal_name_list}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <FormSelect label="Reference fork" name="uid_ref_fork" control={form.control} options={refs?.ref_forks ?? []} />
          <LabeledInput name="fork_model" label="Model" control={form.control} />
          <FormSelect label="Category" name="category_fork" control={form.control} options={refs?.ref_categories ?? []} />
          <FormSelect label="Color" name="colour" control={form.control} options={refs?.ref_colors ?? []} />
          <FormSelect label="Wheelsize" name="wheelsize" control={form.control} options={refs?.ref_wheelsizes ?? []} />
          <LabeledInput name="client_name" label="Client Name" control={form.control} />
          <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Close</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
