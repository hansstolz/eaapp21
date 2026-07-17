import { z } from "zod";

export const confirmSchema = z.object({
  confirmed_how: z.string().nullable(),
  confirmed_by: z.string().nullable(),
  costestimate_confirm_check: z.string().nullable(),
  confirmed_when: z
    .string()
    .nullable()
    .transform((str) =>
      str ? new Date(str).toISOString().replace("Z", "").slice(0, 19) : null,
    ),
});
