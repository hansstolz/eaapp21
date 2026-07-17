export enum UserRights {
  admin = "Administrator",
  root = "Root",
  user = "User",
}

export const roleOptions: Array<{ value: UserRights; label: string }> = [
  { value: UserRights.user, label: "User" },
  { value: UserRights.admin, label: "Admin" },
  { value: UserRights.root, label: "Root" },
];
