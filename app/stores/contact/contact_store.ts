import {
  _createContact,
  _deleteContact,
  _updateContact,
} from "@/app/api/contact/crud_contact";
import { addOrUpdateArray, removeFromArray } from "@/lib/utils";
import { EaContacts } from "@/schemas/contacts/contact_schema";
import { toast } from "sonner";
import { create } from "zustand";
import { createTypeSlice, TypeSlice } from "../common/type_slice";

export interface ContactStore {
  contacts: EaContacts[];

  setNew: (isNew: boolean) => void;
  setContacts: (data: EaContacts[]) => void;
  createContact: (contact: EaContacts) => Promise<void>;
  updateContact: (contact: EaContacts) => Promise<void>;
  deleteContact: (uid_contact: number) => Promise<void>;
  saveContact: (contact: EaContacts) => Promise<void>;
}

export const useContactStore = create<ContactStore & TypeSlice>(
  (set, get, ...a) => ({
    ...createTypeSlice(set, get, ...a),
    contacts: [],

    setContacts: (data: EaContacts[]) => set({ contacts: data }),
    createContact: async (contact: EaContacts) => {
      contact.uid_contact = 0; // Sicherstellen, dass es als neu behandelt wird
      const newContact = await _createContact(contact);

      toast.success("Contact created");

      set((state) => ({
        contacts: [...state.contacts, newContact],
        isNew: false,
      }));
    },
    updateContact: async (contact: EaContacts) => {
      const updatetContact = await _updateContact(contact);
      toast.success("Contact updated");
      const contacts = get().contacts;
      const compare = (f: EaContacts) => f.uid_contact === contact.uid_contact;
      const updatedContacts = addOrUpdateArray(
        updatetContact,
        contacts,
        compare,
      );

      set(() => ({
        contacts: [...updatedContacts],
      }));
    },

    deleteContact: async (uid_contact: number) => {
      await _deleteContact(uid_contact);
      toast.success("Contact deleted");
      const contacts = get().contacts;
      const compare = (f: EaContacts) => f.uid_contact === Number(uid_contact);
      const updatedContacts = removeFromArray(contacts, compare);

      set((state) => ({
        contacts: [...updatedContacts],
      }));
    },

    saveContact: async (data: EaContacts) => {
      const uid_customer_or_supplier = get().uid_customer_or_supplier;
      const contactType = get().contactType;

      contactType === "customer"
        ? (data.uid_customer = uid_customer_or_supplier ?? 0)
        : (data.uid_company = uid_customer_or_supplier ?? 0);

      get().isNew
        ? await get().createContact(data)
        : await get().updateContact(data);
    },
  }),
);
