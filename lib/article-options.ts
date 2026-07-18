import { prisma } from "@/lib/prisma";

const stati = [
  { uid: 0, label: "active", value: "1" },
  { uid: 0, label: "inactive", value: "0" },
];

const groups = ["Freight", "Labor", "Material"].map((value) => ({
  uid: 0,
  label: value,
  value,
}));

export async function getArticleOptions(userGroup: string) {
  const values = await prisma.ea_values.findMany({
    where: { type: "ea_articles_category", user_group: userGroup },
    select: { uid_value: true, value: true },
    orderBy: { value: "asc" },
  });

  return {
    stati,
    groups,
    categories: values.map(({ uid_value, value }) => {
      const [label, optionValue = label] = (value ?? "missing").split("|||");
      return { uid: uid_value, label, value: optionValue };
    }),
  };
}
