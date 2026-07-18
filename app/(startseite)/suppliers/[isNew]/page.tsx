"use client";

import useAutoFocus from "@/lib/hooks/autofocus";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FiCopy } from "react-icons/fi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  companiesSchema,
  EaCompanies,
} from "@/app/schemas/companies/company_schema";
import LineLR from "@/components/app/LineLR";
import DetailButtons from "@/components/app/DetailButtons";
import { PageColumns } from "@/components/app/TwoPageColumns";
import { Card } from "@/components/ui/card";
import Section from "@/components/app/Section";
import { LabeledInput } from "@/components/app/LabeledInput";
import LineRow from "@/components/app/LineRow";
import ContactsPanel from "@/components/app/contacts/contact_panel";
import PurchasesPanel from "@/components/app/purchases/purchases_panel";
import MailsPanel from "@/components/app/mails/mail_panel";
import {
  useBoundStore,
  useUpdateBoundStore,
} from "@/app/stores/suppliers/suppliers_store";
import {
  _createCompany,
  _updateCompany,
} from "@/app/api/companies/companies_crud";

type SupplierDetailParams = {
  id: string;
  isNew: string;
};

export default function SupplierDetailPage() {
  const { id, isNew } = useParams<SupplierDetailParams>();
  const firstInput = useAutoFocus();
  const [isNewState, setIsNew] = useState(isNew === "true");

  const {
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<EaCompanies>({
    resolver: zodResolver(companiesSchema),
    defaultValues: companiesSchema.parse({}),
  });

  const company = useUpdateBoundStore(Number(id));
  const tabs = useBoundStore((state) => state.tabs);

  useEffect(() => {
    if (isNew === "true") {
      const data = companiesSchema.parse({});
      data.uid_company = undefined;
      reset(data, { keepDefaultValues: false });
    } else if (company) {
      reset(company);
    }
  }, [company, isNew, reset]);

  const submit = async (data: EaCompanies) => {
    if (!isDirty) {
      //toast.error("No changes to save.");
      return;
    }

    data.uid_company = Number(id);
    const result = isNewState
      ? await _createCompany(data)
      : await _updateCompany(data);

    if (result === null) {
      toast.error("An error occurred while saving the supplier.");
      return;
    }
    toast.success("Supplier saved successfully.");
    reset(result);
    setIsNew(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <LineLR>
          <DetailButtons isDisabled={!isDirty} handler={() => {}} />
        </LineLR>
        <PageColumns className="grid-cols-2">
          <Card>
            <Section no={1} title="Name/Address">
              <div className="flex flex-col gap-5">
                <LabeledInput
                  disabled={true}
                  control={control}
                  name={"company_no"}
                  label={"Company No"}
                  className="w-25"
                />
                <LabeledInput
                  ref={firstInput}
                  control={control}
                  name={"first_name"}
                  label={"First name"}
                />
                <LabeledInput
                  control={control}
                  name={"last_name"}
                  label={"last name"}
                />
                <LabeledInput
                  control={control}
                  name={"company"}
                  label={"company"}
                />
                <LabeledInput
                  control={control}
                  name={"street_address"}
                  label={"street address"}
                />
                <LineRow>
                  <LabeledInput
                    control={control}
                    name={"zip_postal_code"}
                    label={"postalcode"}
                  />
                  <LabeledInput
                    control={control}
                    name={"city"}
                    label={"city"}
                  />
                  <LabeledInput
                    control={control}
                    name={"country"}
                    label={"country"}
                  />
                </LineRow>
              </div>
            </Section>
          </Card>
          <Card>
            <Section no={2} title="Communication">
              <div className="flex flex-col gap-5">
                <LabeledInput
                  control={control}
                  name={"company_customer_no"}
                  label={"Our customer no"}
                  className="w-25"
                />
                <LineRow>
                  <LabeledInput control={control} name={"fon"} label={"fon"} />
                  <LabeledInput control={control} name={"fax"} label={"fax"} />
                </LineRow>
                <LineRow>
                  <LabeledInput
                    control={control}
                    name={"mobile"}
                    label={"mobile"}
                  />
                  <LabeledInput
                    control={control}
                    name={"email"}
                    label={"e-mail"}
                  />
                </LineRow>
                <LabeledInput
                  control={control}
                  name={"internet"}
                  label={"internet"}
                />
                <LabeledInput
                  type="textarea"
                  control={control}
                  name={"notes"}
                  label={"notes"}
                />
              </div>
            </Section>
          </Card>
        </PageColumns>
      </form>
      <div className="h-5" />
      <PageColumns className="grid-cols-2">
        <Card>
          <Section no={3} title="Address">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(getValues("cal_address") ?? "");
                toast.success("Address copied to clipboard.");
              }}
              className="mb-3"
              size={"sm"}
            >
              <FiCopy />
              Copy
            </Button>
            <div className="flex flex-col gap-5">
              <LabeledInput
                disabled={true}
                type="textarea"
                control={control}
                name={"cal_address"}
                label={"address"}
              />
            </div>
          </Section>
        </Card>
        <Card>
          <Section no={4} title="More">
            <Tabs defaultValue={tabs[0]?.value.toString() || "contact"}>
              <TabsList className="flex gap-3">
                {tabs.map((tab) => (
                  <TabsTrigger
                    className="tab-trigger"
                    key={tab.label}
                    value={tab.value.toString()}
                  >
                    {tab.icon && <tab.icon className="mr-2 inline-block" />}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="contact">
                <ContactsPanel />
              </TabsContent>
              <TabsContent value="purchases">
                <PurchasesPanel />
              </TabsContent>
              <TabsContent value="mail">
                <MailsPanel />
              </TabsContent>
            </Tabs>
          </Section>
        </Card>
      </PageColumns>
    </>
  );
}
