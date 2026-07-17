import React from "react";
import { toast } from "sonner";
import { z } from "zod";
export default function useEmailValidator() {
  const emailSchema = z.email();

  const validateEmails = (mailStr: string): boolean => {
    const mails = mailStr.split(";");
    let isValid = true;

    for (const mail of mails) {
      try {
        if (mail.length === 0) continue; // Skip empty strings
        emailSchema.parse(mail);
      } catch (error) {
        isValid = false;
        toast.error(`E-Mail ${mail} is invalid!`);
      }
    }
    return isValid;
  };

  return { validateEmails };
}
