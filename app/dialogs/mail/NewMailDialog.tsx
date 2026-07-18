import React from "react";
import { useRouter } from "next/navigation";
import { createRouteString } from "@/lib/hooks/useCreateQueryString";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AtSign, Users2 } from "lucide-react";
import MovableDialog from "@/components/app/movable_dialog";
import { LargeText } from "@/components/app/Texts";
import { TMailParam } from "@/app/(startseite)/mails/detail/[id]/[newRec]/[type]/[origin]/page";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};
export default function NewMailDialog(props: Props) {
  const { isOpen, setIsOpen } = props;
  const router = useRouter();

  const okSupplier = () => {
    goToPage("search");
  };

  const thirdOther = () => {
    goToPage("other");
  };

  const goToPage = (type: "show" | "search" | "other" | "new") => {
    const params: TMailParam = {
      id: -1,
      newRec: true,
      type: type,
      origin: "mail",
    };

    const urlParams = createRouteString(params);
    const route = `/mails/detail/${urlParams}`;
    router.push(route);

    setIsOpen(false);
  };

  return (
    <MovableDialog open={isOpen} setOpen={setIsOpen} title={"New Mail/Letter"}>
      <div className="flex flex-col gap-2">
        <LargeText>Create a new Mail or Letter.</LargeText>
      </div>
      <DialogFooter className="h-12 p-4">
        <div className="flex justify-end gap-2">
          <Button
            className="bg-blue-100 text-blue-900"
            variant="outline"
            type="button"
            onClick={thirdOther}
          >
            <AtSign />
            Other
          </Button>
          <Button
            className="bg-blue-100 text-blue-900"
            variant="outline"
            type="button"
            onClick={okSupplier}
          >
            <Users2 /> Customer/Supplier
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogFooter>
    </MovableDialog>
  );
}
