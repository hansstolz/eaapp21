import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      <DialogContent className="sm:max-w-106">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>{description}</div>
        <DialogFooter>
          <DialogClose>
            <Button className="min-w-24" variant="outline">
              No
            </Button>
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
