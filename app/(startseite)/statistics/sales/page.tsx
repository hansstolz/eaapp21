import PeriodFilter from "../_components/period-filter";
import LineLR from "@/components/app/LineLR";
import Section from "@/components/app/Section";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth-session";
import { getSalesStatistics, getStatisticPeriod } from "@/lib/statistics-data";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<{ year?: string; startMonth?: string; endMonth?: string }> }) {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const period = getStatisticPeriod(await searchParams);
  const result = await getSalesStatistics(session.userGroup, period);
  const invoiceTotal = result.revenue.sumDealer + result.revenue.sumPrivate;

  return <div className="grid grid-cols-2 gap-3 pr-6">
    <Card className="h-45"><CardContent><Section no={1} title="Revenue(netto)"><Metric label="Invoices Sum" value={currency(invoiceTotal)} /><Metric label="Warranties Sum" value={currency(result.warranty.sum)} /><HLine /><Metric label="Total Sum" value={currency(invoiceTotal + result.warranty.sum)} /></Section></CardContent></Card>
    <Card className="h-45"><CardContent><Section no={2} title="Dates"><PeriodFilter period={period} /></Section></CardContent></Card>

    <div className="col-span-2 space-y-3">
      <Card className="h-50"><CardContent><Section no={3} title="Invoices without Warranties(netto)"><div className="grid grid-cols-2">
        <div className="mr-12.5 grid grid-cols-2 gap-6"><div><Metric label="Invoices Dealer" value={String(result.revenue.countDealer)} /><Metric label="Invoices Private" value={String(result.revenue.countPrivate)} /><HLine /><Metric label="Invoices Sum" value={currency(invoiceTotal)} /></div><div><Metric label="Dealer billed" value={currency(result.revenue.sumDealer)} /><Metric label="Private billed" value={currency(result.revenue.sumPrivate)} /><HLine /><Metric label="Sum billed" value={currency(invoiceTotal)} /></div></div>
        <div className="mr-12.5 grid grid-cols-2 gap-6"><div><Metric label="Invoices Direct Sale" value={currency(result.revenue.directSalesSum)} /><Metric label="-" value="" /><HLine /><Metric label="Sum Direct Sales" value={currency(result.revenue.directSalesSum)} /></div><div><Metric label="Dealer paid" value={currency(result.revenue.sumDealerPaid)} /><Metric label="Private paid" value={currency(result.revenue.sumPrivatePaid)} /><HLine /><Metric label="Sum paid" value={currency(result.revenue.sumPaid)} /></div></div>
      </div></Section></CardContent></Card>

      <Card className="h-50"><CardContent><Section no={4} title="Warranties(netto)"><div className="grid grid-cols-2"><div><Metric label="Warranties" value={String(result.warranty.count)} /><Metric label="Warranties Sum" value={currency(result.warranty.sum)} /></div><div><Metric label="Labor" value={currency(result.warranty.labour)} /><Metric label="Material" value={currency(result.warranty.material)} /><Metric label="Freight" value={currency(result.warranty.freight)} /></div></div></Section></CardContent></Card>

      <Card><CardContent><Section no={4} title="Forks"><LineLR><div className="flex gap-6"><span>Forks total</span><strong>{result.forks.reduce((sum, fork) => sum + fork.count, 0)}</strong></div><div className="mr-4 flex gap-6"><span>Warranty <strong>{currency(result.warranty.sum)}</strong></span><span>Revenue <strong>{currency(invoiceTotal)}</strong></span></div></LineLR><div className="overflow-auto rounded-lg border"><table className="w-full text-sm"><thead className="bg-muted"><tr>{["Count", "Fork Model", "Invoice", "Warranty", "W+I", "Dealer+Private", "Warranty", "Sum"].map((title) => <th key={title} className="px-3 py-2 text-left">{title}</th>)}</tr></thead><tbody>{result.forks.map((fork) => <tr key={fork.forkModel} className="border-t"><td className="px-3 py-2 text-right">{fork.count}</td><td className="px-3 py-2">{fork.forkModel}</td><td className="px-3 py-2 text-right">{fork.invoices}</td><td className="px-3 py-2 text-right">{fork.warranties}</td><td className="px-3 py-2 text-right">0</td><td className="px-3 py-2 text-right">{currency(fork.invoiceRevenue)}</td><td className="px-3 py-2 text-right">{currency(fork.warrantyRevenue)}</td><td className="px-3 py-2 text-right">{currency(fork.revenue)}</td></tr>)}</tbody></table></div></Section></CardContent></Card>

      <Card><CardContent><Section no={5} title="Reference Forks"><LineLR><div className="flex gap-6"><span>Forks total</span><strong>{result.models.reduce((sum, row) => sum + row.count, 0)}</strong></div><div /></LineLR><div className="grid grid-cols-2"><CountTable header="Fork Category" rows={result.categories} /><CountTable header="Fork Model" rows={result.models} /></div></Section></CardContent></Card>
    </div>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <LineLR className="mb-1"><span className="text-base text-secondary-800">{label}</span><strong className="text-base text-secondary-800">{value}</strong></LineLR>; }
function HLine() { return <div className="my-1 h-px bg-secondary-800" />; }
function CountTable({ header, rows }: { header: string; rows: { name: string; count: number }[] }) { return <div className="max-h-150 overflow-auto"><table className="w-full text-sm"><thead className="bg-muted"><tr><th className="px-3 py-2 text-left">{header}</th><th className="px-3 py-2 text-right">Count</th></tr></thead><tbody>{[...rows].sort((a, b) => b.count - a.count).map((row) => <tr key={row.name} className="border-t"><td className="px-3 py-2">{row.name}</td><td className="px-3 py-2 text-right">{row.count}</td></tr>)}</tbody></table></div>; }
const formatter = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const currency = (value: number) => formatter.format(value);
