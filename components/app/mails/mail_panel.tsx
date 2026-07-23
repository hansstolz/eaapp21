"use client";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import MailsColumns from "@/app/columns/mail/panel_mail_columns";
import { TMailParam } from "@/app/(startseite)/mails/detail/[id]/[newRec]/[type]/[origin]/page";
import { createRouteString } from "@/lib/hooks/useCreateQueryString";
import { useRouter } from "next/navigation";
import useMailStore from "@/app/stores/mails/mail_store";

export default function MailsPanel() {
  const columns = MailsColumns();
  const mails = useMailStore((state) => state.mails);
  const uid_customer_or_supplier = useMailStore(
    (state) => state.uid_customer_or_supplier,
  );
  const contactType = useMailStore((state) => state.contactType);
  const router = useRouter();
  const onNew = () => {
    const params: TMailParam = {
      id: uid_customer_or_supplier ?? -1,
      newRec: true,
      type: "other",
      origin: contactType,
    };

    const urlParams = createRouteString(params);
    const route = `/mails/detail/${urlParams}`;
    router.push(route);
  };
  return (
    <>
      <Button onClick={onNew} className="my-3 h-6">
        <FiPlus /> New Mail
      </Button>
      <DataTable columns={columns} data={mails} />
    </>
  );
}
