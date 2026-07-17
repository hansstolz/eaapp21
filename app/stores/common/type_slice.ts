import { StateCreator } from "zustand";

export type ContactType = "customer" | "supplier";

export interface TypeSlice {
  isNew: boolean;
  contactType: ContactType;
  uid_customer_or_supplier: number | null;

  setNew: (isNew: boolean) => void;
  setContactType: (type: ContactType) => void;
  setUidCustomerOrSupplier: (uid: number | null) => void;
}

export const createTypeSlice: StateCreator<TypeSlice, [], [], TypeSlice> = (
  set,
  get,
) => ({
  isNew: false,
  contactType: "customer",
  uid_customer_or_supplier: null,

  setNew: (isNew: boolean) => set({ isNew: isNew }),
  setContactType: (type: ContactType) => set({ contactType: type }),
  setUidCustomerOrSupplier: (uid: number | null) =>
    set({ uid_customer_or_supplier: uid }),
});
