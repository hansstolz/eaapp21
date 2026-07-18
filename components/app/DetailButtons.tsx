"use client";
import React, { useEffect } from "react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = {
  isDisabled: boolean;
  handler?: () => void;
};

export default function DetailButtons({ isDisabled, handler }: Props) {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-row gap-3">
      <Button size="sm" onClick={goBack}>
        <FiArrowLeft /> List
      </Button>

      <Button size="sm" disabled={isDisabled} type="submit">
        <FiSave /> Save
      </Button>
    </div>
  );
}
