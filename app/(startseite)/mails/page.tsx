"use client";

import { Button } from "@/components/ui/button";
import usePaginatedActions from "@/lib/hooks/usePaginatedActions";
import { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import MailSearch from "./MailSearch";
import { toast } from "sonner";
import { TMailParam } from "./detail/[id]/[newRec]/[type]/[origin]/page";
import { createRouteString } from "@/lib/hooks/useCreateQueryString";
import { useRouter } from "next/navigation";
import MailColumns from "@/app/columns/mail/mail_columns";
import { EaMailOverview } from "@/app/data_types/mails/mail_overview";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { AlertDialog } from "@/app/dialogs/general/alert_dialog";
import PaginatedContainer from "@/components/app/paging/PaginatedContainer";
import NewMailDialog from "@/app/dialogs/mail/NewMailDialog";
import { _deleteMail, _getMailsOverview } from "@/app/api/mails/mails_crud";

export default function MailsPage() {
  const [showDialog, setShowDialog] = useState(false);

  const router = useRouter();
  const columns = MailColumns();
  const [open, setOpen] = useState(false);
  const [uid_mail, setUid_mail] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const { actions, paginated, setPaginated } =
    usePaginatedActions<EaMailOverview>({
      defPaginated: {
        total_items: 0,
        per_page: 15,
        total_pages: 1,
        page: 1,
        items: [],
      },
    });
  const currentPage = paginated.page;
  const perPage = paginated.per_page;

  useEffect(() => {
    const getMails = async () => {
      const result = await _getMailsOverview({
        paginated: {
          page: currentPage,
          per_page: perPage,
          total_items: 0,
          total_pages: 0,
          items: [],
        },
        search,
      });
      setPaginated(result);
    };

    getMails();
  }, [currentPage, perPage, search, setPaginated, uid_mail]);

  const dblClick = (row: Row<EaMailOverview>) => {
    const params: TMailParam = {
      id: row.original.uid_mail,
      newRec: false,
      type: "show",
      origin: "mail",
    };

    const urlParams = createRouteString(params);
    const route = `/mails/detail/${urlParams}`;
    router.push(route);
  };

  const updateQuery = (val: string) => {
    setSearch(val);
    actions.start();
  };

  const newHandler = () => {
    setShowDialog(true);
  };

  const deleteMail = async () => {
    if (uid_mail === null) return;

    const result = await _deleteMail(uid_mail);
    if (result) {
      toast.success("Mail deleted successfully");
    } else {
      toast.error("Failed to delete mail");
    }

    setOpen(false);
    setUid_mail(null);
  };

  return (
    <>
      <LineLR>
        <LineRow>
          <MailSearch updateQuery={updateQuery} />
          <Button onClick={newHandler}>
            <FiFilePlus /> New Mail
          </Button>
        </LineRow>
      </LineLR>
      <DataTable
        onDoubleClick={dblClick}
        columns={columns}
        data={paginated.items}
        tableClassName="table-fixed"
        onCellClick={(row: Row<EaMailOverview>) => {
          setOpen(true);
          setUid_mail(row.original.uid_mail);
        }}
      />
      <PaginatedContainer paginated={paginated} actions={actions} />
      <AlertDialog
        open={open}
        setOpen={setOpen}
        onConfirm={() => {
          deleteMail();
        }}
      />
      <NewMailDialog isOpen={showDialog} setIsOpen={setShowDialog} />
    </>
  );
}
