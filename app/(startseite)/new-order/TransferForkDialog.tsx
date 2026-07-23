"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { NewOrderCustomer, NewOrderFork } from "./types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/app/input";
import { Label } from "@/components/ui/label";

export default function TransferForkDialog({
  open,
  setOpen,
  customer,
  onTransferred,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  customer: NewOrderCustomer;
  onTransferred: (fork: NewOrderFork) => void;
}) {
  const [forkNo, setForkNo] = useState("");
  const [fork, setFork] = useState<NewOrderFork | null>(null);
  const search = async () => {
    const response = await fetch(`/new-order/transfer-fork?fork_no=${encodeURIComponent(forkNo)}`);
    if (!response.ok) return setFork(null);
    const found = await response.json() as NewOrderFork | null;
    setFork(found);
    if (!found) toast.error("Fork not found");
  };
  const transfer = async () => {
    if (!fork) return;
    const response = await fetch("/new-order/transfer-fork", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid_fork: fork.uid_fork, uid_customer: customer.uid_customer }),
    });
    if (!response.ok) return toast.error("Fork could not be transferred");
    const updated = await response.json() as NewOrderFork;
    onTransferred(updated);
    toast.success("Fork transferred");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader><DialogTitle>Fork Transfer</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="transfer-fork-no">FORK NO</Label>
            <div className="flex gap-2">
              <Input id="transfer-fork-no" inputMode="numeric" value={forkNo} onChange={(event) => setForkNo(event.target.value)} />
              <Button type="button" onClick={search}>Search</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-md border bg-muted/30 p-4 text-sm">
            <div><div className="font-medium">Transfer from</div><p>{fork ? `#${fork.fork_no} ${fork.fork_model ?? ""}` : "No fork selected"}</p><p>{fork?.customer_name}</p></div>
            <div><div className="font-medium">Transfer to</div><p>#{customer.customer_no} {customer.cal_name_list}</p><p>{customer.street_address} {customer.city}</p></div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button disabled={!fork} type="button" onClick={transfer}>Transfer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
