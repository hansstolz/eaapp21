import { StateCreator, create } from "zustand";
import { use, useEffect } from "react";
import {
  FaBicycle,
  FaEnvelope,
  FaEuroSign,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { EaClients } from "@/data_types/clients/ea_clients";
import { DropdownItem } from "@/components/general/DropDown";
import { _getCustomerById } from "@/app/api/customers/customers_crud";
import { FormSelectOption } from "@/components/ui/FormSelect";
import { EaCustomerMails } from "@/schemas/customer/customer_schema";
import { get_values_label } from "@/app/api/values/crud";
import { ValueTypes } from "@/data_types/values/value_types";
import { EaContacts } from "@/schemas/contacts/contact_schema";
import { useContactStore } from "../contact/contact_store";
import { useShallow } from "zustand/react/shallow";
import { _deleteClient } from "@/app/api/clients/client_crud";
import { toast } from "sonner";
import useMailStore from "../mails/mail_store";

interface ClientSlice {
  clients: EaClients[];
  setClients: (data: EaClients[]) => void;
  deleteClient: (uid_client: number) => void;
}

export const createClientSlice: StateCreator<
  ClientSlice,
  [],
  [],
  ClientSlice
> = (set) => ({
  clients: [],
  setClients: (data: EaClients[]) => set({ clients: data }),

  deleteClient: async (uid_client: number) => {
    // Implement the delete logic here, e.g., call an API to delete the client

    const response = await _deleteClient(uid_client);
    if (!response) {
      toast.error("Failed to delete client.");
      return;
    }
    toast.success("Client deleted successfully.");
    set((state) => ({
      clients: state.clients.filter(
        (client) => client.uid_client !== uid_client,
      ),
    }));
  },
});

interface CustomerSlice {
  customer: EaCustomerMails | null;
  payments: FormSelectOption[];
  categories: FormSelectOption[];
  contacts: EaContacts[];
  tabs: DropdownItem[];
  isNew: boolean;

  setCustomer: (data: EaCustomerMails) => void;
  setNew: (isNew: boolean) => void;
  fetchData: (uid_customer: number) => void;
  get_payments: () => void;
}

const createCustomerSlice: StateCreator<
  ClientSlice & CustomerSlice,
  [],
  [],
  CustomerSlice
> = (set) => ({
  isNew: false,
  customer: null,
  payments: [],
  categories: [
    { label: "Dealer", value: "Dealer" },
    { label: "Private", value: "Private" },
  ],
  tabs: [],
  contacts: [],

  setNew: (isNew: boolean) => set({ isNew: isNew }),
  setCustomer: (data: EaCustomerMails) => set({ customer: data }),
  setPayments: (data: FormSelectOption[]) => set({ payments: data }),

  get_payments: async () => {
    const payments = await get_values_label(ValueTypes.ea_customer_payment);
    set({ payments: payments });
  },

  fetchData: async (uid_customer: number) => {
    const result = await _getCustomerById(uid_customer);
    set({
      customer: result.customer,
      payments: result.payments,
      clients: result.clients,
      contacts: result.contacts,

      tabs: [
        { label: "Contact", value: "Contact", icon: FaUser },
        { label: "Clients", value: "Clients", icon: FaUsers },
        { label: "Forks", value: "Forks", icon: FaBicycle },
        { label: "Orders", value: "Orders", icon: FaEuroSign },
        { label: "Mails", value: "Mails", icon: FaEnvelope },
      ],
    });
  },
});

export const useCustomerBoundStore = create<CustomerSlice & ClientSlice>()(
  (...a) => ({
    ...createCustomerSlice(...a),
    ...createClientSlice(...a),
  }),
);

export const updateCustomerBoundStore = (uid_customer: number | undefined) => {
  const fetchData = useCustomerBoundStore((state) => state.fetchData);
  const contacts = useCustomerBoundStore((state) => state.contacts);
  const customer = useCustomerBoundStore((state) => state.customer);
  const { setContacts, setContactType, setUidCustomerOrSupplier } =
    useContactStore(
      useShallow((s) => ({
        setContacts: s.setContacts,
        setContactType: s.setContactType,
        setUidCustomerOrSupplier: s.setUidCustomerOrSupplier,
      })),
    );

  const getMailsByCustomer = useMailStore((state) => state.getMailsByCustomer);
  const setMails = useMailStore((state) => state.setMails);

  useEffect(() => {
    if (uid_customer) {
      fetchData(uid_customer);
    } else {
      setContacts([]);
    }
  }, [uid_customer]);

  useEffect(() => {
    setContacts(contacts);
    setContactType("customer");
    setUidCustomerOrSupplier(uid_customer ?? null);
    return () => {
      setContacts([]);
    };
  }, [contacts, uid_customer]);

  useEffect(() => {
    uid_customer && getMailsByCustomer(uid_customer);
    return () => {
      setMails([]);
    };
  }, [uid_customer]);

  return customer;
};
