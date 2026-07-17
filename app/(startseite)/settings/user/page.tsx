import { Suspense } from "react";
import { EaUser } from "@/app/data_types/user/ea_user";
import { prisma } from "@/lib/prisma";
import UserOverview from "./user_overview";

export default async function Page() {
  const users = await prisma.ea_user.findMany({
    orderBy: { uid_user: "asc" },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserOverview data={users as EaUser[]} />
    </Suspense>
  );
}
