"use client";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = {
  isDisabled: boolean;
  overviewPath: string;
  handler?: () => void;
};

export default function DetailButtons({ isDisabled, overviewPath }: Props) {
  const router = useRouter();
  const goBack = () => {
    router.push(overviewPath);
  };

  return (
    <div className="flex flex-row gap-3">
      <Button type="button" size="sm" onClick={goBack}>
        <FiArrowLeft /> List
      </Button>

      <Button size="sm" disabled={isDisabled} type="submit">
        <FiSave /> Save
      </Button>
    </div>
  );
}
