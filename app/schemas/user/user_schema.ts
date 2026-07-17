import { UserRights } from "@/app/data_types/user/rights";
import { useMemo } from "react";
import { z } from "zod";

const UserEnum = z.enum([UserRights.admin, UserRights.root, UserRights.user]);
type UserEnum = z.infer<typeof UserEnum>;

export default function UserSchema() {
  const userSchema = useMemo(
    () =>
      z.object({
        city: z.string().default(""),
        country: z.string().default(""),
        firstname: z.string().default(""),
        uid_user: z.number().optional(),
        name: z
          .string()
          .min(3, "Name must be at least 3 characters")
          .default(""),
        notes: z.string().default(""),
        postal_zip: z.string().default(""),
        street_no: z.string().default(""),
        user_group: z.string().default(""),
        user_name: z
          .string()
          .min(4, "Username must be at least 4 characters")
          .default(""),
        user_password: z
          .string()
          .min(4, "Password must be at least 4 characters")
          .default(""),
        user_rights: UserEnum.default(UserRights.user),
      }),
    []
  );

  //type UserValues = z.infer<typeof userSchema>;
  //const defaultValues: DefaultValues<UserValues> = {};
  return { userSchema };
}
