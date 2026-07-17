import { ArrowLeft, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = {
  path: string;
  isDirty: boolean;
};
export default function ListSave({ path, isDirty }: Props) {
  const router = useRouter();
  return (
    <div className="flex gap-3">
      <Button
        type="button"
        onClick={() => {
          router.push(path);
        }}
        size={"sm"}
        variant="default"
      >
        <ArrowLeft className="h-4 w-4" /> List
      </Button>

      <Button
        size={"sm"}
        variant={"destructive"}
        disabled={!isDirty}
        type="submit"
      >
        <SaveIcon className="h-4 w-4" /> Save
      </Button>
    </div>
  );
}
