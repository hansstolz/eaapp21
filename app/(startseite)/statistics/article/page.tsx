import PeriodFilter from "../_components/period-filter";
import Section from "@/components/app/Section";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth-session";
import { getArticleStatistics, getStatisticPeriod } from "@/lib/statistics-data";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<{ year?: string; startMonth?: string; endMonth?: string; article?: string }> }) {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const params = await searchParams;
  const period = getStatisticPeriod(params);
  const result = (await getArticleStatistics(session.userGroup, period)).filter(
    (item) => item.count > 1,
  );
  const filtered = params.article ? result.filter((item) => item.articlecode === params.article) : result;
  const articleOptions = [...new Set(result.map((item) => item.articlecode))];

  return <div className="space-y-3 pr-6">
    <Card className="h-55"><CardContent><Section no={1} title="Dates"><PeriodFilter period={period} articleOptions={articleOptions} selectedArticle={params.article} /></Section></CardContent></Card>
    <Card><CardContent><Section no={2} title="Articles"><div className="overflow-auto rounded-lg border"><table className="w-full text-sm"><thead className="bg-muted"><tr><th className="px-3 py-2 text-left">Article</th><th className="px-3 py-2 text-left">Description</th><th className="px-3 py-2 text-right">Count</th></tr></thead><tbody>{filtered.map((item, index) => <tr key={`${item.articlecode}-${item.articlecharacter}-${index}`} className="border-t"><td className="px-3 py-2">{item.articlecode}</td><td className="px-3 py-2">{item.articlecharacter}</td><td className="px-3 py-2 text-right">{item.count}</td></tr>)}</tbody></table></div></Section></CardContent></Card>
  </div>;
}
