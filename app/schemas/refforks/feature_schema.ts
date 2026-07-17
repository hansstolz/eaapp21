import z from "zod";

export const featureSchema = z.object({
  category_fork: z.string().optional(),
  uid_ref_part: z.number().optional(),
  ref_part_name: z.string(),
  ref_part_qualitiy: z.string().optional(),
  check_character_int: z.coerce.number().int(),
  uid_ref_fork: z.number(),
  ref_part_notes: z.string().optional(),
});

export type FeatureType = z.infer<typeof featureSchema>;
