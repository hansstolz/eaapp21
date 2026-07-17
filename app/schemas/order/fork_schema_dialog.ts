import z from "zod";

export const forkSchema = z.object({
  uid_fork: z.number().optional(),

  client_name: z.string().optional(),

  customer: z.string().optional(),

  cartridge: z.string().optional().default(""),

  setting: z.string().optional().default(""),

  user_group: z.string().default(""),

  url: z.string().optional().default(""),

  bike: z.string().optional().default(""),

  customer_no: z.number().optional().default(0),

  year_construction: z.number().optional().default(0),

  fork_no: z.number().optional().default(0),

  fork_model: z.string().optional(),

  customer_name: z.string().optional().default(""),

  brakemount: z.string().optional().default(""),

  colour: z.string().optional().default(""),

  order_no: z.string().optional().default(""),

  wheelsize: z.string().optional().default(""),

  category_fork: z.string().optional().default(""),

  memo: z.string().optional().default(""),
  uid_ref_fork: z.number().optional(),
  fork_in_date: z.date().optional(),
  fork_in_carrier: z.string().optional(),
});

export const forkSchemaDialog = z.object({
  uid_fork: z.number().optional(),

  client_name: z.string().optional().nullable(),

  fork_no: z.number().optional().nullable(),

  fork_model: z.string().optional().nullable(),

  colour: z.string().optional().nullable(),

  wheelsize: z.string().optional().nullable(),

  category_fork: z.string().optional().nullable(),

  fork_in_date: z.date().optional(),
  fork_in_carrier: z.string().optional(),
});

export type EaForkDialog = z.infer<typeof forkSchemaDialog>;
