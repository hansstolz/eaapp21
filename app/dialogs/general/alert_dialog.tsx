import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FiAlertCircle } from "react-icons/fi";

type AlertDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm?: (bool: boolean) => void;
  title?: string;
  description?: string;
};
export function AlertDialog({
  open,
  setOpen,
  onConfirm,
  title = "Caution",
  description = "Are you sure you want to delete this item?",
}: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-h-40 bg-red-100">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl text-red-900">
            <div className="flex items-center gap-2">
              <FiAlertCircle />
              <div>{title}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="text-red-900 text-lg">{description}</div>
        <DialogFooter className="px-4 bg-stone-200">
          <DialogClose
            render={<Button className="min-w-24" variant="outline" />}
          >
            No
          </DialogClose>
          <Button
            onClick={() => onConfirm?.(true)}
            variant="destructive"
            className="min-w-24"
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
