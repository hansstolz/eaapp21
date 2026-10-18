"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Item = {
  id: number; no: number | null; date: string; customer: string;
  forkNo: number | null; fork: string; labor: number; material: number; freight: number; sum: number;
};
const money = (value: number) => value.toFixed(2);

export default function WarrantyDraft({ address, items }: { address: string; items: Item[] }) {
  const [warrantyAddress, setWarrantyAddress] = useState(address);
  const [greetings, setGreetings] = useState("Hi Thibaut,\nhere is the invoice for the warranty of");
  const totals = items.reduce((total, item) => ({
    labor: total.labor + Math.round(item.labor * 100),
    material: total.material + Math.round(item.material * 100),
    freight: total.freight + Math.round(item.freight * 100),
    sum: total.sum + Math.round(item.sum * 100),
  }), { labor: 0, material: 0, freight: 0, sum: 0 });

  return <div className="warranty-draft space-y-4 text-[#555]">
    <div className="flex items-center justify-between border-b bg-[#eee] p-2">
      <Link href="/warranty" className={`${buttonVariants()} print:hidden`}>List</Link>
      <h1 className="ml-auto pr-4 text-2xl font-bold">WARRANTY</h1>
    </div>
    <div className="grid items-stretch gap-3 lg:grid-cols-3">
      <section className="overflow-hidden rounded-md border">
        <h2 className="border-b bg-[#eee] px-5 py-3 font-semibold">Address</h2>
        <div className="space-y-2 p-4 pt-7">
          <Label htmlFor="warranty-address" className="font-semibold italic">Warranty Address</Label>
          <Textarea id="warranty-address" value={warrantyAddress} onChange={event => setWarrantyAddress(event.target.value)} className="h-28 resize-none bg-white" />
        </div>
      </section>
      <section className="overflow-hidden rounded-md border">
        <h2 className="border-b bg-[#eee] px-5 py-3 font-semibold">Sender</h2>
        <div className="space-y-2 p-4 pt-7">
          <Label htmlFor="warranty-greetings" className="font-semibold italic">Greetings</Label>
          <Textarea id="warranty-greetings" value={greetings} onChange={event => setGreetings(event.target.value)} className="h-28 resize-none bg-white" />
        </div>
      </section>
    <section className="overflow-hidden rounded-md border">
      <div className="flex min-h-[49px] items-center justify-between gap-2 border-b bg-[#eee] px-5 py-2">
        <h2 className="font-semibold">Warranty</h2>
        <div className="flex gap-2 print:hidden">
          <a className={buttonVariants()} href={`mailto:?subject=${encodeURIComponent("Warranty")}&body=${encodeURIComponent(`${greetings}\n\n${warrantyAddress}`)}`}>Mail</a>
          <Button onClick={() => window.print()}>Print</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 items-start gap-3 p-4 pt-7">
        <div className="space-y-2"><Label htmlFor="warranty-invoice-date" className="font-semibold italic">Warranty Invoice Date</Label>
          <Input id="warranty-invoice-date" value="" readOnly className="bg-[#eee]" /></div>
        <div className="space-y-2"><Label htmlFor="warranty-invoice-number" className="font-semibold italic">Warranty Invoice Number</Label>
          <Input id="warranty-invoice-number" value="0" readOnly className="bg-[#eee]" /></div>
      </div>
    </section>
    </div>
    <div className="min-h-[50vh] overflow-x-auto border border-[#777]">
      <table className="w-full min-w-[1050px] table-fixed border-collapse text-sm [&_th]:border [&_th]:border-[#777] [&_th]:px-2 [&_th]:py-2 [&_td]:border [&_td]:border-[#777] [&_td]:px-2 [&_td]:py-1">
        <caption className="sr-only">Unbilled warranty items</caption>
        <colgroup><col className="w-20" /><col className="w-28" /><col /><col className="w-20" /><col className="w-[18%]" />{["labor", "material", "freight", "sum"].map(key => <col key={key} className="w-24" />)}</colgroup>
        <thead className="bg-[#e8e9eb]"><tr>
          {["No", "Date", "Customer", "ForkNo", "Fork"].map(title => <th key={title} scope="col" className="text-left font-normal">{title}</th>)}
          {(["labor", "material", "freight", "sum"] as const).map(key => <th key={key} scope="col" className="text-right font-normal">
            <span className="capitalize">{key}</span><div className="font-bold">{money(totals[key] / 100)}</div>
          </th>)}
        </tr></thead>
        <tbody>{items.map(item => <tr key={item.id} className="odd:bg-white even:bg-[#f2f2f2]">
          <td>{item.no ?? ""}</td><td>{item.date}</td><td className="truncate" title={item.customer}>{item.customer.replace(/\r?\n/g, " ")}</td>
          <td>{item.forkNo || ""}</td><td className="truncate" title={item.fork}>{item.fork}</td>
          <td className="text-right">{money(item.labor)}</td><td className="text-right">{money(item.material)}</td>
          <td className="text-right">{money(item.freight)}</td><td className="text-right">{money(item.sum)}</td>
        </tr>)}</tbody>
      </table>
      {items.length === 0 && <p role="status" className="p-4">No unbilled warranty items found.</p>}
    </div>
    <style>{`@media print {
      body * { visibility: hidden; }
      .warranty-draft, .warranty-draft * { visibility: visible; }
      .warranty-draft { position: absolute; inset: 0; padding: 12px; background: white; }
      .warranty-draft table { min-width: 0; font-size: 10px; }
      .warranty-draft textarea { field-sizing: content; }
      @page { size: landscape; margin: 10mm; }
    }`}</style>
  </div>;
}
