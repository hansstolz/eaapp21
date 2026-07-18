import PeriodFilter from "../_components/period-filter";
import Section from "@/components/app/Section";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth-session";
import { getOpenItems, getStatisticPeriod } from "@/lib/statistics-data";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<{ year?: string; startMonth?: string; endMonth?: string }> }) {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const period = getStatisticPeriod(await searchParams);
  const items = await getOpenItems(session.userGroup, period);

  return <div className="space-y-3 pr-6">
    <Card className="h-32.5 w-100"><CardContent><Section no={1} title="Dates"><PeriodFilter period={period} /></Section></CardContent></Card>
    <Card><CardContent><Section no={2} title="OpenItems"><div className="overflow-auto rounded-lg border"><table className="w-full text-sm"><thead className="bg-muted"><tr>{["Date", "InNo", "Customer", "Cust No", "Sum", "Open", "Days"].map((title) => <th key={title} className="px-3 py-2 text-left">{title}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item.uidOrder} className="border-t"><td className="px-3 py-2 text-right">{item.invoiceDate?.toLocaleDateString("de-DE")}</td><td className="px-3 py-2 text-right">{item.invoiceNo}</td><td className="px-3 py-2">{item.customerAddress}</td><td className="px-3 py-2 text-right">{item.customerNo}</td><td className="px-3 py-2 text-right">{currency(item.calAmountPrice)}</td><td className="px-3 py-2 text-right">{currency(item.calOutstandingMoney)}</td><td className="px-3 py-2 text-right">{item.days}</td></tr>)}</tbody></table></div></Section></CardContent></Card>
  </div>;
}

const formatter = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const currency = (value: number) => formatter.format(value);
