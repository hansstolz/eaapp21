export const GLOBAL_VALUE_TYPE = "ea_ref_forks_parts";

export function isGlobalValueType(type: unknown): type is string {
  return type === GLOBAL_VALUE_TYPE;
}

export function valueAccessWhere(uidValue: number, userGroup: string) {
  return {
    uid_value: uidValue,
    OR: [{ user_group: userGroup }, { type: GLOBAL_VALUE_TYPE }],
  };
}
