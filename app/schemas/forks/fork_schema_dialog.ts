import z from "zod";

export const forkSchemaDialog = z.object({
  uid_fork: z.number().optional(),

  client_name: z.string().optional().nullable(),

  fork_no: z.number().optional().nullable(),

  fork_model: z.string().optional().nullable(),

  colour: z.string().optional().nullable(),

  wheelsize: z.string().optional().nullable(),

  category_fork: z.string().optional().nullable(),

  fork_in_date: z.string().optional(),
  fork_in_carrier: z.string().optional(),
});

export type EaForkDialog = z.input<typeof forkSchemaDialog>;
