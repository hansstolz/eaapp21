import { text } from "stream/consumers";
import z from "zod";

export const textSchema = z.object({
  uid_text: z.number().optional(),
  text_no: z.number().optional(),
  text_code: z.string().min(2, "Text code is required"),
  text_value: z.string().min(1, "Text value is required"),
});
