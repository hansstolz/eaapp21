import { Suspense } from "react";
import FormsOverview from "./forms_overview";
import { EaFormOverview } from "@/app/data_types/forms/ea_forms";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const data = await prisma.ea_forms_items.findMany({
    where: { user_group: session.userGroup },
    select: {
      uid_forms_item: true,
      user_print_language: true,
      user_group: true,
    },
    orderBy: { uid_forms_item: "asc" },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormsOverview data={data as EaFormOverview[]} />
    </Suspense>
  );
}
