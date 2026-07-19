"use client";

import { customerSchema } from "@/app/schemas/customer/customer_schema";
import {
  useUpdateCustomerBoundStore,
  useCustomerBoundStore,
} from "@/app/stores/customer/CustomerStore";
import ClientPanel from "@/components/app/clients/client_panel";
import ContactsPanel from "@/components/app/contacts/contact_panel";
import DetailButtons from "@/components/app/DetailButtons";
import ForksPanel from "@/components/app/forks/fork_panel";
import { FormSelect } from "@/components/app/form_select";
import { LabeledInput } from "@/components/app/LabeledInput";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import MailsPanel from "@/components/app/mails/mail_panel";
import OrdersPanel from "@/components/app/orders/orders_panel";
import Section from "@/components/app/Section";
import TwoColumn from "@/components/app/TwoColumn";
import { OnePageColumn, PageColumns } from "@/components/app/TwoPageColumns";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAutoFocus from "@/lib/hooks/autofocus";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  _createCustomer,
  _updateCustomer,
} from "@/app/api/customers/customers_crud";

type CustomerDetailParams = {
  id: string;
  isNew: string;
};

export default function CustomerDetailPage() {
  const { id, isNew: inIsNew } = useParams<CustomerDetailParams>();
  const [isNew, setIsNew] = useState(inIsNew === "true");
  const firstInput = useAutoFocus();
  const customer = useUpdateCustomerBoundStore(Number(id));
  const payments = useCustomerBoundStore((state) => state.payments);
  const categories = useCustomerBoundStore((state) => state.categories);
  const get_payments = useCustomerBoundStore((state) => state.get_payments);
  const tabs = useCustomerBoundStore((state) => state.tabs);
  const [uid_customer, setUidCustomer] = useState<number | null>(Number(id));

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<
    z.input<typeof customerSchema>,
    unknown,
    z.output<typeof customerSchema>
  >({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (inIsNew === "true") get_payments();
    else if (customer) reset(customer);
  }, [customer, get_payments, inIsNew, reset]);

  const submit = async (data: z.output<typeof customerSchema>) => {
    if (!isDirty) {
      return;
    }
    data.uid_customer = uid_customer || 0;
    const result = isNew
      ? await _createCustomer(data)
      : await _updateCustomer(data);

    if (result === null) {
      toast.error(
        isNew ? "Error creating customer" : "Error updating customer",
      );
      return;
    }
    toast.success(isNew ? "Customer created" : "Customer updated");
    reset(result);
    setIsNew(false);
    setUidCustomer(result.uid_customer);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <LineLR>
          <DetailButtons isDisabled={!isDirty} />
        </LineLR>
        <PageColumns className="grid-cols-2">
          <Card>
            <Section no={1} title="Name/Dealer">
              <div className="flex flex-col gap-5">
                <LabeledInput
                  disabled={true}
                  control={control}
                  name={"customer_no"}
                  label={"Company No"}
                  className="w-25"
                />
                <FormSelect
                  placeholder=""
                  control={control}
                  label={"Category"}
                  name={"category_customer"}
                  options={categories}
                />
                <LabeledInput
                  ref={firstInput}
                  control={control}
                  name={"first_name"}
                  label={"first name"}
                />
                <LabeledInput
                  name={"last_name"}
                  label={"last name"}
                  control={control}
                />
                <LabeledInput
                  type="textarea"
                  name={"company"}
                  label={"company"}
                  control={control}
                  rows={4}
                />
                <LabeledInput
                  name={"mail_salut"}
                  label={"mail salutation"}
                  control={control}
                />
              </div>
            </Section>
          </Card>
          <Card>
            <Section no={2} title="Address">
              <div className="flex flex-col gap-5">
                <LabeledInput
                  control={control}
                  name={"street_address"}
                  label={"street address"}
                />
                <LineRow>
                  <LabeledInput
                    control={control}
                    name={"zip_postal_code"}
                    label={"Postal code"}
                    className="w-22.5"
                  />
                  <LabeledInput
                    control={control}
                    name={"city"}
                    label={"city"}
                  />
                </LineRow>
                <LabeledInput
                  control={control}
                  name={"region"}
                  label={"region"}
                />
                <LabeledInput
                  control={control}
                  name={"country"}
                  label={"county"}
                />
                <TwoColumn>
                  <div className="w-1/2">
                    <LabeledInput
                      type="textarea"
                      rows={6}
                      control={control}
                      name={"delivery_address"}
                      label={"Invoice address"}
                    />
                  </div>
                  <div className="w-1/2">
                    <LabeledInput
                      type="textarea"
                      disabled={true}
                      rows={6}
                      control={control}
                      name={"cal_address"}
                      label={"Address"}
                    />
                  </div>
                </TwoColumn>
              </div>
            </Section>
          </Card>
          <Card>
            <Section no={3} title="Communication">
              <div className="flex flex-col gap-5">
                <TwoColumn>
                  <LabeledInput
                    control={control}
                    name={"fon"}
                    label={"Phone"}
                  />
                  <LabeledInput control={control} name={"fax"} label={"Fax"} />
                  <LabeledInput
                    control={control}
                    name={"mobile"}
                    label={"Mobile"}
                  />
                </TwoColumn>

                <LabeledInput
                  control={control}
                  name={"mail1"}
                  label={"E-Mail-1"}
                />
                <LabeledInput
                  control={control}
                  name={"mail2"}
                  label={"E-Mail-2"}
                />
                <LabeledInput
                  control={control}
                  name={"mail3"}
                  label={"E-Mail-3"}
                />
                <LabeledInput
                  control={control}
                  name={"internet"}
                  label={"internet"}
                />

                <LabeledInput
                  type="textarea"
                  control={control}
                  name={"memo"}
                  label={"Notes"}
                  rows={4}
                />
              </div>
            </Section>
          </Card>
          <Card>
            <Section no={4} title="Bank">
              <div className="flex flex-col gap-5">
                <LabeledInput
                  control={control}
                  name={"bank_name"}
                  label={"bank name"}
                />
                <LabeledInput
                  control={control}
                  name={"bank_id"}
                  label={"bank id"}
                />
                <LabeledInput
                  control={control}
                  name={"bank_account"}
                  label={"bank account"}
                />

                <LabeledInput
                  control={control}
                  name={"vat_no"}
                  label={"vat no"}
                />
                <FormSelect
                  placeholder=""
                  options={payments}
                  control={control}
                  name={"bank_payment"}
                  label={"default payment"}
                />
              </div>
            </Section>
          </Card>
        </PageColumns>
      </form>
      <OnePageColumn>
        <Card>
          <Section no={5} title="More">
            {isNew === false && (
              <Tabs defaultValue={"Contact"}>
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
                <div className="min-h-100 max-h-125 overflow-y-scroll">
                  <TabsContent value="Contact">
                    <ContactsPanel />
                  </TabsContent>
                  <TabsContent value="Clients">
                    <ClientPanel />
                  </TabsContent>
                  <TabsContent value="Forks">
                    <ForksPanel />
                  </TabsContent>
                  <TabsContent value="Orders">
                    <OrdersPanel />
                  </TabsContent>
                  <TabsContent value="Mails">
                    <MailsPanel />
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </Section>
        </Card>
      </OnePageColumn>
    </>
  );
}
