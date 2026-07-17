import { z } from "zod";

export const mailSchema = z
  .object({
    user_group: z.string().default(""),
    customer: z.string().default(""),
    address: z.string().default(""),
    customer_no: z.number().optional().default(0),
    mail_date: z.date().default(new Date()),

    email_address: z.string().optional(),
    sender_email_address: z.union([z.literal(""), z.email().optional()]),
    subject_yes_no: z.coerce.number().default(1),
    subject: z.string().default(""),
    message_text: z.string(),
    mail_status: z.string().default("mail"),
  })
  .refine(
    (data) => {
      return data.mail_status === "print"
        ? data.customer.length > 0 && data.address.length > 0
        : true;
    },

    { message: "Customer/Supplier name and address needed." },
  );

export type TMailSchema = z.infer<typeof mailSchema>;
