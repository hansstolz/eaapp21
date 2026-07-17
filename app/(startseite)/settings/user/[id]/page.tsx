import type { EaUser } from "@/app/data_types/user/ea_user";
import { UserRights } from "@/app/data_types/user/rights";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Detail from "./detail";

function newUser(): EaUser {
  return {
    uid_user: 0,
    mail_work: "",
    country: "",
    user_name: "",
    user_rights: UserRights.user,
    user_password: "",
    user_group: "",
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
  const id = Number((await params).id);

  if (!Number.isInteger(id) || id < 0) notFound();

  const data =
    id === 0
      ? newUser()
      : await prisma.ea_user.findUnique({ where: { uid_user: id } });

  if (!data) notFound();

  return <Detail data={data as EaUser} />;
}
