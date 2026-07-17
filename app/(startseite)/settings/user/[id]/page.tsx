import type { EaUser } from "@/app/data_types/user/ea_user";
import { UserRights } from "@/app/data_types/user/rights";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Detail from "./detail";
import { getAuthSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

function newUser(userGroup: string): EaUser {
  return {
    uid_user: 0,
    mail_work: "",
    country: "",
    user_name: "",
    user_rights: UserRights.user,
    user_password: "",
    user_group: userGroup,
    notes: "",
    salutation: "",
    suid_user: "",
    mail_home: "",
    name: "",
    firstname: "",
    titel: "",
    company_name: "",
    street_no: "",
    postal_zip: "",
    city: "",
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const id = Number((await params).id);

  if (!Number.isInteger(id) || id < 0) notFound();

  const data =
    id === 0
      ? newUser(session.userGroup)
      : await prisma.ea_user.findFirst({
          where: { uid_user: id, user_group: session.userGroup },
        });

  if (!data) notFound();

  return <Detail data={data as EaUser} />;
}
