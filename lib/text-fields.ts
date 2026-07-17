import type {
  ea_textsCreateInput,
  ea_textsUpdateInput,
} from "@/generated/prisma/models/ea_texts";

export const TEXT_FIELDS = [
  "text_value",
  "text_code",
  "text_no",
] as const satisfies readonly (keyof ea_textsCreateInput)[];

export const TEXT_UPDATE_FIELDS =
  TEXT_FIELDS satisfies readonly (keyof ea_textsUpdateInput)[];
