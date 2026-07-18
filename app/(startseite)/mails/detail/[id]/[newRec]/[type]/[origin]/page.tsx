"use client";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import { useParams, useRouter } from "next/navigation";
import MailButtons from "../../../../MailButtons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mailSchema, type TMailSchema } from "@/app/schemas/mail/MailSchema";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import Section from "@/components/app/Section";
import { LabeledInput } from "@/components/app/LabeledInput";
import { FormSwitch } from "@/components/app/form_switch";
import { Input } from "@/components/app/input";
import { Label } from "@/components/ui/label";
import "./mail.css";
import { useEffect, useState } from "react";
import { TCustSup, TPrintMail } from "@/app/data_types/mails/cust_sup";
import MailAddress from "@/app/data_types/mails/MailAddress";
import { useAuthStore } from "@/lib/stores/auth-store";
import { _createMail, _getMailById } from "@/app/api/mails/mails_crud";
import CustSupSearch from "./CustSupSearch";
import { toast } from "sonner";
import useEmailValidator from "@/lib/hooks/useEmailValidator";

export type TMailParam = {
  id: number;
  newRec: boolean;
  type: "show" | "search" | "other" | "new";
  origin: "mail" | "supplier" | "customer";
};

type TMailParamIn = {
  id: string;
  newRec: string;
  type: string;
  origin: string;
};

export default function Detail() {
  const user = useAuthStore((state) => state.user);
  const { type, id, newRec } = useParams<TMailParamIn>();
  const [sendType, setSendType] = useState<TPrintMail>("print");
  const isNew = newRec === "true";
  const { validateEmails } = useEmailValidator();
  const router = useRouter();

  const form = useForm<
    z.input<typeof mailSchema>,
    unknown,
    z.output<typeof mailSchema>
  >({
    resolver: zodResolver(mailSchema),

    defaultValues: {
      user_group: "",
      customer: "",
      address: "",
      customer_no: 0,
      mail_date: new Date(),
      email_address: "",
      sender_email_address: user?.userEmail ?? "",
      subject_yes_no: 1,
      subject: "",
      message_text: "",
      mail_status: "mail",
    },
  });

  useEffect(() => {
    if (isNew) return;
    let active = true;
    _getMailById(Number(id)).then((mail) => {
      if (!active) return;
      form.reset({
        ...mail,
        mail_date: mail.mail_date ? new Date(mail.mail_date) : new Date(),
      } as z.input<typeof mailSchema>);
    });
    return () => {
      active = false;
    };
  }, [form, id, isNew]);

  const submitPDF = async (data: TMailSchema) => {
    const { email_address } = data;
    if (email_address && validateEmails(email_address) === true) {
      createMail(data, "email");
    }
  };

  const submitEMail = async (data: TMailSchema) => {
    const { email_address } = data;
    if (email_address && validateEmails(email_address) === true) {
      createMail(data, "email");
    }
  };

  const addAddress = (customer: TCustSup) => {
    const address = new MailAddress(customer);
    const def = {
      sender_email_address: user?.userEmail ?? "",
      subject_yes_no: 1,
      mail_date: new Date(),
      customer: address.getName(),
      customer_no: customer.customerNo ?? 0,
      address: address.getAddress(),
      email_address: address.getEMail(),
    };

    form.reset(def, { keepDefaultValues: false });
  };

  const createMail = async (value: TMailSchema, type: TPrintMail) => {
    const result = await _createMail({
      value: {
        ...value,
        uid_customer: 0,
        uid_company: 0,
        mail_status: sendType,
      },
      type,
    });

    if (result === null) {
      toast.error("Mail could not be saved.");
      return null;
    }
    const message = type === "email" ? "E-Mail saved." : "Letter saved.";
    toast.success(message);
    form.reset({}, { keepDefaultValues: true });
    router.replace("/mails");
    return result;
  };

  const onSubmit = async (data: TMailSchema) => {
    if (sendType === "email") await submitEMail(data);
    else await submitPDF(data);
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <LineLR>
          <LineRow>
            <MailButtons
              isDisabled={!form.formState.isDirty}
              setSendType={setSendType}
            />
            {type === "search" && (
              <CustSupSearch handleSelection={addAddress} />
            )}
          </LineRow>
        </LineLR>
        <div className="mail-grid">
          <div className="mail-address">
            <Card>
              <Section no={1} title="Address">
                <div className="flex flex-col gap-5">
                  <LabeledInput
                    disabled={true}
                    name={"customer_no"}
                    control={form.control}
                    label={"Customer No."}
                  />
                  <LabeledInput
                    disabled={!isNew}
                    name={"customer"}
                    control={form.control}
                    label={"Customer/Supplier"}
                  />
                  <LabeledInput
                    disabled={!isNew}
                    type="textarea"
                    control={form.control}
                    name={"address"}
                    label={"address"}
                    rows={4}
                  />
                </div>
              </Section>
            </Card>
          </div>
          <div className="mail-comm">
            <Card>
              <Section no={2} title="Communication">
                <div className="flex flex-col gap-5">
                  <Controller
                    name="mail_date"
                    control={form.control}
                    render={({ field }) => (
                      <div className="grid gap-2">
                        <Label htmlFor="mail-date">MAIL SEND</Label>
                        <Input
                          id="mail-date"
                          type="date"
                          disabled={!isNew}
                          value={toDateInputValue(field.value)}
                          onChange={(event) => field.onChange(new Date(`${event.target.value}T00:00:00`))}
                        />
                      </div>
                    )}
                  />

                  <LabeledInput
                    disabled={!isNew}
                    control={form.control}
                    name={"email_address"}
                    label={"E-Mail"}
                  />
                  <LabeledInput
                    disabled={!isNew}
                    control={form.control}
                    name={"sender_email_address"}
                    label={"sender_email_address"}
                  />
                </div>
              </Section>
            </Card>
          </div>
          <div className="mail-content">
            <Card>
              <Section no={3} title="Content">
                <div className="flex flex-col gap-5">
                  <LabeledInput
                    disabled={!isNew}
                    control={form.control}
                    name={"subject"}
                    label={"subject"}
                  />
                  <FormSwitch
                    name="subject_yes_no"
                    control={form.control}
                    disabled={!isNew}
                    label="Print Subject"
                  />
                  <LabeledInput
                    disabled={!isNew}
                    type="textarea"
                    control={form.control}
                    name={"message_text"}
                    label={"Message"}
                    rows={28}
                  />
                </div>
              </Section>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}

function toDateInputValue(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}
