"use client";
import { EaFormsItems } from "@/app/data_types/forms/ea_forms";
import FormsSchema from "@/app/schemas/forms/FormsSchema";
import { LabeledInput } from "@/components/app/LabeledInput";
import LineLR from "@/components/app/LineLR";
import ListSave from "@/components/app/list_save";
import Section from "@/components/app/Section";
import { PageColumns } from "@/components/app/TwoPageColumns";
import { Card, CardContent } from "@/components/ui/card";

import useAutoFocus from "@/lib/hooks/autofocus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import z from "zod";

export default function Detail({ data }: { data: EaFormsItems | null }) {
  const router = useRouter();
  const { formsSchema } = FormsSchema();
  const state = data === null ? "New" : "Edit";

  const form = useForm({
    resolver: zodResolver(formsSchema),

    defaultValues: data === null ? {} : data,
  });

  const { isDirty } = form.formState;
  const firstInput = useAutoFocus();

  async function onSubmit(data: z.infer<typeof formsSchema>) {
    if (!isDirty) {
      return;
    }

    const res = await saveForm(
      state === "New" ? "/forms/create_form" : "/forms/update_form",
      state === "New" ? "POST" : "PUT",
      data,
    );

    if (res?.uid_forms_item) {
      form.reset(res);
      toast.success("Form settings updated successfully");
      if (state === "New") router.replace(`/settings/forms/${res.uid_forms_item}`);
    } else {
      toast.error("Failed to update form settings");
    }
  }

  return (
    <>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <LineLR>
            <ListSave isDirty={isDirty} path="/settings/forms" />
          </LineLR>
          <PageColumns className="grid-cols-3">
            <Card className="card-brand">
              <CardContent>
                <Section no={1} title="A-C">
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      ref={firstInput}
                      name={"alternative_costest_text"}
                      control={form.control}
                      label={"ALTERNATIVE COSTEST TEXT"}
                    />
                    <LabeledInput
                      name={"amount_text"}
                      control={form.control}
                      label={"AMOUNT TEXT"}
                    />
                    <LabeledInput
                      name={"articlecharacter_text"}
                      control={form.control}
                      label={"ARTICLECHARACTER TEXT"}
                    />
                    <LabeledInput
                      name={"check_default"}
                      control={form.control}
                      label={"CHECK DEFAULT"}
                    />
                    <LabeledInput
                      name={"commission_text"}
                      control={form.control}
                      label={"COMMISSION TEXT"}
                    />
                    <LabeledInput
                      name={"costestimate_text"}
                      control={form.control}
                      label={"COSTESTIMATE TEXT"}
                    />
                    <LabeledInput
                      name={"costestimateno_text"}
                      control={form.control}
                      label={"COSTESTIMATENO TEXT"}
                    />
                    <LabeledInput
                      name={"creditnote_text"}
                      control={form.control}
                      label={"CREDITNOTE TEXT"}
                    />
                    <LabeledInput
                      name={"creditnoteno_text"}
                      control={form.control}
                      label={"CREDITNOTENO TEXT"}
                    />
                  </div>
                </Section>
              </CardContent>
            </Card>
            <Card className="card-brand">
              <CardContent>
                <Section no={3} title="F-0">
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      name={"foryourcustomer_text"}
                      label={"foryourcustomer_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"freightforward_text"}
                      label={"freightforward_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"invoice_text"}
                      label={"invoice_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"invoice_total"}
                      label={"invoice_total"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"no_text"}
                      label={"no_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"note_text"}
                      label={"note_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"our_article_no"}
                      label={"our_article_no"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"outstanding_money"}
                      label={"outstanding_money"}
                      control={form.control}
                    />
                  </div>
                </Section>
              </CardContent>
            </Card>
            <Card className="card-brand">
              <CardContent>
                <Section no={5} title="S-V">
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      name={"singleprice_text"}
                      label={"singleprice_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"tax_id_text"}
                      label={"tax_id_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"total_text"}
                      label={"total_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"units_text"}
                      label={"units_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      disabled={true}
                      name={"user_group"}
                      label={"user_group"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"user_print_language"}
                      label={"user_print_language"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"user_text"}
                      label={"user_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"value_tax_id_text"}
                      label={"value_tax_id_text"}
                      control={form.control}
                    />
                  </div>
                </Section>
              </CardContent>
            </Card>
            <Card className="card-brand">
              <CardContent>
                <Section no={2} title="C-F">
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      name={"currency_text"}
                      label={"currency_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"customerno_text"}
                      label={"customerno_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"date_text"}
                      label={"date_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"delivery_note"}
                      label={"delivery_note"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"diagnosis_text"}
                      label={"diagnosis_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"fiscal_office_text"}
                      label={"fiscal_office_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"fork_text"}
                      label={"fork_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"forkcolor_text"}
                      label={"forkcolor_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"forkno_text"}
                      label={"forkno_text"}
                      control={form.control}
                    />
                  </div>
                </Section>
              </CardContent>
            </Card>
            <Card className="card-brand">
              <CardContent>
                <Section no={4} title="P-S">
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      name={"page_text"}
                      label={"page_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"payment_text"}
                      label={"payment_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"payments_total"}
                      label={"payments_total"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"preinvoice_text"}
                      label={"preinvoice_text"}
                      control={form.control}
                    />

                    <LabeledInput
                      name={"price_text"}
                      label={"price_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"reminder_text"}
                      label={"reminder_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"remindercategory_text"}
                      label={"remindercategory_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"selforder"}
                      label={"selforder"}
                      control={form.control}
                    />
                  </div>
                </Section>
              </CardContent>
            </Card>
            <Card className="card-brand">
              <CardContent>
                <Section no={6} title="V-Z">
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      name={"valuetax_text"}
                      label={"valuetax_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"vat_no_text"}
                      label={"vat_no_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"warranty_text"}
                      label={"warranty_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"warrantyno_text"}
                      label={"warrantyno_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"worksheet_text"}
                      label={"worksheet_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"worksheetno_text"}
                      label={"worksheetno_text"}
                      control={form.control}
                    />
                    <LabeledInput
                      name={"your_article_no"}
                      label={"your_article_no"}
                      control={form.control}
                    />
                  </div>
                </Section>
              </CardContent>
            </Card>
          </PageColumns>
        </form>
    </>
  );
}

async function saveForm(url: string, method: "POST" | "PUT", data: unknown) {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return (await response.json()) as EaFormsItems;
  } catch {
    return null;
  }
}
