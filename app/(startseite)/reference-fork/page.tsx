// Server Component
import { prisma } from "@/lib/prisma";
import RefforkClient from "./refforkclient";

export default async function Page() {
  const refForks = await prisma.ea_ref_forks.findMany();

  return <RefforkClient refForks={refForks} />;
}
