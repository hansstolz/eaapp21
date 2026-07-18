"use client";
import React from "react";
import { FiArrowLeft, FiFileText, FiMail } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TPrintMail } from "@/app/data_types/mails/cust_sup";

type Props = {
  isDisabled: boolean;
  setSendType: (type: TPrintMail) => void;
};

export default function MailButtons({ isDisabled, setSendType }: Props) {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <div className="flex flex-row gap-3">
      <Button type="button" size="sm" onClick={goBack} title="List">
        <FiArrowLeft /> List
      </Button>
      <Button
        size="sm"
        disabled={isDisabled}
        onClick={() => setSendType("email")}
        title="Send Mail"
        type="submit"
      >
        <FiMail /> Send Mail
      </Button>
      <Button
        size="sm"
        disabled={isDisabled}
        title="Print Letter"
        onClick={() => setSendType("print")}
        type="submit"
      >
        <FiFileText /> Print Letter
      </Button>
    </div>
  );
}
