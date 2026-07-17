import type {
  ea_valuesCreateInput,
  ea_valuesUpdateInput,
} from "@/generated/prisma/models/ea_values";

export const VALUE_FIELDS = ["type", "value", "value_two"] as const satisfies readonly (
  keyof ea_valuesCreateInput
)[];

export const VALUE_UPDATE_FIELDS =
  VALUE_FIELDS satisfies readonly (keyof ea_valuesUpdateInput)[];
