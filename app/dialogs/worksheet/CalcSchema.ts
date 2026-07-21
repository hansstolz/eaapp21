import { z } from "zod";

export const calcSchema = z.object({
  so13: z.number().int().default(0),
  si13: z.number().int().default(0),
  sum1: z.number().int().default(0),
  nb13: z.number().int().default(0),
  sum2: z.number().int().default(0),

  or1: z.number().int().default(0),
  or3: z.number().int().default(0),
  sum3: z.number().int().default(0),

  ir13: z.number().int().default(0),

  so24: z.number().int().default(0),
  si24: z.number().int().default(0),
  sum1r: z.number().int().default(0),
  nb24: z.number().int().default(0),
  sum2r: z.number().int().default(0),

  or2: z.number().int().default(0),
  or4: z.number().int().default(0),
  sum3r: z.number().int().default(0),

  ir24: z.number().int().default(0),
});

export type EaCalc = z.infer<typeof calcSchema>;
