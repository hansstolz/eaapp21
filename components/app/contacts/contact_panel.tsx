import { FiPlus } from "react-icons/fi";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { useContactStore } from "@/app/stores/contact/contact_store";
import ContactsColumns from "@/app/columns/contacts/contact_columns";
import { useDeleteStore } from "@/app/stores/delete/delete_slice";
import { EaContacts } from "@/app/schemas/contacts/contact_schema";
import { Button } from "@/components/ui/button";
import { DataTable } from "../tanstack_table/data_table";
import NewContactDialog from "@/app/dialogs/contacts/NewContactDialog";
import AskFor from "../ask_for";

export default function ContactsPanel() {
  const contacts = useContactStore((state) => state.contacts);
  const columns = ContactsColumns();
  const [contact, setContact] = useState<EaContacts | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const deleteContact = useContactStore((state) => state.deleteContact);
  const openDeleteDialog = useDeleteStore((state) => state.openDeleteDialog);

  const onNewContact = () => {
    setContact(null);
    setOpenDialog(true);
  };

  const dblClick = (row: Row<EaContacts>) => {
    setContact(
      contacts.find((c) => c.uid_contact === row.original.uid_contact) || null,
    );
    setOpenDialog(true);
  };

  const askDelete = (row: Row<EaContacts>) => {
    row.original.uid_contact &&
      openDeleteDialog({
        uid: row.original.uid_contact,
        label: row.original.cal_last_first_name ?? "",
        title: "Delete",
        delete: async (uid: number) => await deleteContact(uid),
      });
  };
  return (
    <>
      <Button
        onClick={onNewContact}
        className="my-3 h-6"
        size="sm"
        title={"New"}
      >
        <FiPlus />
        New Contact
      </Button>
      <DataTable
        onCellClick={askDelete}
        onDoubleClick={dblClick}
        columns={columns}
        data={contacts}
      />
      <NewContactDialog
        isOpen={openDialog}
        setIsOpen={setOpenDialog}
        contact={contact}
      />
      <AskFor />
    </>
  );
}
