import { Suspense } from "react";
import { EaUser } from "@/app/data_types/user/ea_user";
import { prisma } from "@/lib/prisma";
import UserOverview from "./user_overview";
import { getAuthSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const users = await prisma.ea_user.findMany({
    where: { user_group: session.userGroup },
    orderBy: { uid_user: "asc" },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserOverview data={users as EaUser[]} />
    </Suspense>
  );
}
