import z from "zod";

export const valueSchema = z.object({
  uid_value: z.number().optional(),
  type: z.string(),
  value: z.string().min(1, "Value is required"),
  value_two: z.string().default(""),
});
