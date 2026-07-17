import React from "react";
import { z } from "zod";

export const forkSchema = z.object({
  uid_fork: z.number().optional(),
  uid_customer: z.number().optional(),
  uid_client: z.number().optional(),
  client_name: z.string().nullable(),

  customer: z.string().nullable(),

  cartridge: z.string().nullable().default(""),

  setting: z.string().nullable().default(""),

  user_group: z.string().nullable().default(""),

  url: z.string().nullable().default(""),

  bike: z.string().nullable().default(""),
  customer_no: z.number().nullable().default(0),

  year_construction: z.number().nullable().default(0),

  fork_no: z.number().nullable().default(0),
  fork_model: z.string().nullable().default(""),

  customer_name: z.string().nullable().default(""),

  brakemount: z.string().nullable().default(""),

  colour: z.string().nullable().default(""),

  order_no: z.string().nullable().default(""),

  wheelsize: z.string().nullable().default(""),

  category_fork: z.string().nullable().default(""),

  memo: z.string().nullable().default(""),
  uid_ref_fork: z.number().nullable(),
});

export type EaForkSchema = z.input<typeof forkSchema>;
