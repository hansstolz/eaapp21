import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { EaFormsItems } from "@/app/data_types/forms/ea_forms";
import Detail from "./detail";
import { getAuthSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 0) notFound();

  const data = id === 0
    ? null
    : await prisma.ea_forms_items.findFirst({
        where: { uid_forms_item: id, user_group: session.userGroup },
      });
  if (id !== 0 && !data) notFound();

  return <Detail data={data as EaFormsItems | null} />;
}
