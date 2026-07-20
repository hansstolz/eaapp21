import { PageColumns } from "@/components/app/TwoPageColumns";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import MovableDialog from "@/components/app/movable_dialog";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { useOrderStore } from "@/app/stores/order/order_store";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function AddCostDialog({ isOpen, setIsOpen }: Props) {
  const { user } = useAuthStore();
  const { order } = useOrderStore();
  const { addCostestimate } = useCostestimateStore();

  return (
    <MovableDialog
      className="min-w-1/4"
      open={isOpen}
      setOpen={setIsOpen}
      title={"Confirm Costestimate"}
    >
      <form>
        <div className="dialog-header rounded-t-lg">
          <div
            className={
              "flex flex-row justify-between text-xl font-semibold text-textcolor-light"
            }
          >
            Costestimate
          </div>
        </div>
        <div className="dialog-main bg-white">
          <PageColumns className="grid-cols-1">
            <div className="flex flex-col gap-3 text-lg">
              <div>Create a new costestimate?</div>
            </div>
          </PageColumns>
        </div>
        <DialogFooter className="h-12 p-4">
          <div className="flex gap-12 justify-end mr-4">
            <Button
              size="sm"
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (order) void addCostestimate(order, user?.username || "unknown");
                setIsOpen(false);
              }}
            >
              Yes
            </Button>
          </div>
        </DialogFooter>
      </form>
    </MovableDialog>
  );
}
