"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { SaveIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import useAutoFocus from "@/lib/hooks/autofocus";
import {
  formSchema,
  GeneralSettings,
} from "@/app/schemas/general/general_schmea";
import LineLR from "@/components/app/LineLR";
import { PageColumns } from "@/components/app/TwoPageColumns";
import Section from "@/components/app/Section";
import { LabeledInput } from "@/components/app/LabeledInput";
import TwoColumn from "@/components/app/TwoColumn";
import saveImage from "@/lib/save_image";

export default function General({
  data,
  logo_path,
}: {
  data: GeneralSettings[];
  logo_path: string;
}) {
  const form = useForm<GeneralSettings>({
    resolver: zodResolver(formSchema),

    defaultValues: data[0],
  });
  const { isDirty } = form.formState;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [cacheBust, setCacheBust] = useState("");
  const firstInput = useAutoFocus();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!isDirty) {
      return;
    }
    const res = await updateGeneral(data);
    if (res?.uid_setting) {
      toast.success("General settings updated successfully");
      form.reset(res);
    } else {
      toast.error("Failed to update general settings");
    }
  }

  const refreshImage = () => {
    setCacheBust(`?v=${Date.now()}`);
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <LineLR>
          <Button disabled={!isDirty} type="submit">
            <SaveIcon className="h-4 w-4" /> Save
          </Button>
        </LineLR>
        <PageColumns className="grid-cols-2">
          <Card className="card-brand">
            <CardContent>
              <Section no={1} title="Adress">
                <FieldGroup className="gap-4">
                  <LabeledInput
                    disabled={true}
                    name="user_group"
                    control={form.control}
                    label="User Group"
                  />
                  <LabeledInput
                    ref={firstInput}
                    name="address_header"
                    control={form.control}
                    label="Address Header"
                  />
                  <LabeledInput
                    type="textarea"
                    name="sender"
                    control={form.control}
                    label={"Sender"}
                  />
                  <LabeledInput
                    control={form.control}
                    name="bank_name"
                    label={"Bank name"}
                  />
                  <LabeledInput
                    control={form.control}
                    name="bank_account"
                    label={"Bank account"}
                  />

                  <LabeledInput
                    control={form.control}
                    name="value_tax_id"
                    label={"Value tax id"}
                  />
                  <LabeledInput
                    control={form.control}
                    name="tax_id"
                    label={"tax id"}
                  />
                  <LabeledInput
                    control={form.control}
                    name="fiscal_office"
                    label={"Fiscal office"}
                  />
                </FieldGroup>
              </Section>
              <Section no={2} title="Logo">
                {logo_path && (
                  <img
                    src={`${logo_path}${cacheBust}`}
                    alt="Company Logo"
                    width={200}
                    height={200}
                  />
                )}
                <div className=" flex py-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple={false}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const result = await saveImage(file);
                        toast.info(result);
                        refreshImage();
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="ml-auto"
                  >
                    Upload new logo
                  </Button>
                </div>
              </Section>
            </CardContent>
          </Card>
          <Card className="card-brand">
            <Section no={3} title="Warranty">
              <FieldGroup className="gap-4">
                <LabeledInput
                  type="textarea"
                  control={form.control}
                  name={"address_warranty"}
                  label={"Address Warranty"}
                />
              </FieldGroup>
            </Section>
            <Section no={4} title="E-Mail">
              <LabeledInput
                control={form.control}
                name={"mail_sender_address"}
                label={"E-Mail sender"}
              />
            </Section>

            <Section no={5} title="Units">
              <FieldGroup className="gap-4">
                <TwoColumn>
                  <LabeledInput
                    control={form.control}
                    name={"currency_text"}
                    label={"Currency default"}
                  />
                  <LabeledInput
                    control={form.control}
                    name={"nb13"}
                    label={"NEEDLEBEARING 1-3"}
                  />
                </TwoColumn>
                <TwoColumn>
                  <LabeledInput
                    control={form.control}
                    name={"height_unit_default"}
                    label={"height unit default"}
                  />
                  <LabeledInput
                    control={form.control}
                    name={"nb24"}
                    label={"NEEDLEBEARING 2-4"}
                  />
                </TwoColumn>
                <TwoColumn>
                  <LabeledInput
                    control={form.control}
                    name={"weight_unit_default"}
                    label={"weight unit default"}
                  />
                  <LabeledInput
                    control={form.control}
                    name={"value_tax_default"}
                    label={"value tax default"}
                  />
                </TwoColumn>
                <TwoColumn>
                  <LabeledInput
                    control={form.control}
                    name={"user_print_language"}
                    label={"print language"}
                  />
                </TwoColumn>
              </FieldGroup>
            </Section>
            <Section no={6} title="Footer">
              <FieldGroup className="gap-4">
                <LabeledInput
                  control={form.control}
                  name={"footer_mails"}
                  label={"footer mails"}
                />
                <LabeledInput
                  control={form.control}
                  name={"footer_lists"}
                  label={"footer lists"}
                />
                <LabeledInput
                  type="textarea"
                  control={form.control}
                  name={"hint"}
                  label={"Notes"}
                />
              </FieldGroup>
            </Section>
          </Card>
        </PageColumns>
      </form>
    </>
  );
}

async function updateGeneral(data: GeneralSettings) {
  try {
    const response = await fetch("/settings/update_values", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) return null;

    return (await response.json()) as GeneralSettings;
  } catch {
    return null;
  }
}
