import z from "zod";

export const forkPartSchema = z.object({
  forks_part_name: z.string().min(3),
  forks_part_quality: z.string().optional(),
});

export type EaForksPartsNew = z.infer<typeof forkPartSchema>;
