import {
  _getCustomerById,
  _updateCustomer,
} from "@/app/api/customers/customers_crud";
import {
  customerSchema,
  EaCustomerMails,
} from "@/app/schemas/customer/customer_schema";
import { useOrderStore } from "@/app/stores/order/order_store";
import { _updateOrderCustomer } from "@/app/api/orders/orders_crud";
import type { EaCustomer } from "@/app/data_types/customer/ea_customer";
import { ValueTypes } from "@/app/data_types/values/value_types";
import DisabledInput from "@/components/app/DisabledInput";
import { FormSelect } from "@/components/app/form_select";
import { FormSwitch } from "@/components/app/form_switch";
import { FormSelectOption } from "@/components/app/FormSelect";
import { LabeledInput } from "@/components/app/LabeledInput";
import MovableDialog from "@/components/app/movable_dialog";
import Section from "@/components/app/Section";
import { PageColumns } from "@/components/app/TwoPageColumns";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import useAutoFocus from "@/lib/hooks/autofocus";

import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function OrderCustomerDialog({ isOpen, setIsOpen }: Props) {
  const inputRef = useAutoFocus();

  const { order, updateOrder } = useOrderStore();
  const [categories, setCategories] = useState<FormSelectOption[]>([]);
  const [payments, setPayments] = useState<FormSelectOption[]>([]);

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isDirty },
  } = useForm<EaCustomerMails>({
    resolver: zodResolver(customerSchema),
  });

  const vat_no = watch("vat_no");
  const showVat = Boolean(vat_no && vat_no.length > 3);

  useEffect(() => {
    const getCustomer = async () => {
      if (order) {
        const full_customer = await _getCustomerById(order.uid_customer!);
        if (full_customer.customer) reset(full_customer.customer);
      }
    };

    setCategories([
      { label: "Dealer", value: "Dealer" },
      { label: "Private", value: "Private" },
    ]);

    const get_payments = async () => {
      const response = await fetch(
        `/values/get_values_label/${encodeURIComponent(ValueTypes.ea_customer_payment)}`,
      );
      if (response.ok) setPayments(await response.json());
    };
    getCustomer();
    get_payments();
  }, [order, reset]);

  const submitCustomer = async (data: EaCustomerMails) => {
    const customer = await _updateCustomer(data);

    if (customer && order) {
      order.updateCustomer(customer as unknown as EaCustomer);
      await _updateOrderCustomer(order.orderCustomerUpdate);
      updateOrder();
      toast.success("Customer updated");
    }
  };

  const onSubmit = (data: EaCustomerMails) => {
    if (isDirty) {
      submitCustomer(data);
      setIsOpen(false);
    }
  };

  return (
    <>
      <MovableDialog
        className="min-w-250 max-w-[90vw]"
        open={isOpen}
        setOpen={setIsOpen}
        title={"Edit Customer"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="dialog-main bg-white">
            <PageColumns className="grid-cols-4">
              <Card className="">
                <Section no={1} title={"Name/Company"}>
                  <div className="flex flex-col gap-5">
                    <DisabledInput label={"Customer No"}>
                      {order?.customer_no}
                    </DisabledInput>
                    <FormSelect
                      name={"category_customer"}
                      label={"Category"}
                      options={categories}
                      control={control}
                      placeholder="Select category"
                    />
                    <LabeledInput
                      ref={inputRef}
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
                      rows={4}
                      name={"company"}
                      label={"company"}
                      control={control}
                    />
                  </div>
                </Section>
              </Card>
              <Card>
                <Section no={2} title={"Adress"}>
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      name={"street_address"}
                      label={"street address"}
                      control={control}
                    />
                    <LabeledInput
                      name={"zip_postal_code"}
                      label={"zip / Postal code"}
                      control={control}
                    />
                    <LabeledInput
                      name={"city"}
                      label={"City"}
                      control={control}
                    />
                    <LabeledInput
                      name={"region"}
                      label={"Region"}
                      control={control}
                    />
                    <LabeledInput
                      name={"country"}
                      label={"country"}
                      control={control}
                    />
                    <LabeledInput
                      type="textarea"
                      rows={4}
                      name={"delivery_address"}
                      label={"invoice address"}
                      control={control}
                    />
                  </div>
                </Section>
              </Card>
              <Card className="">
                <Section no={3} title={"Bank"}>
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      name={"bank_name"}
                      label={"bankname"}
                      control={control}
                    />
                    <LabeledInput
                      name={"bank_id"}
                      label={"bank id"}
                      control={control}
                    />
                    <LabeledInput
                      name={"bank_account"}
                      label={"bank account"}
                      control={control}
                    />
                    <LabeledInput
                      name={"bank_payment"}
                      label={"bank payment"}
                      control={control}
                    />

                    <FormSelect
                      options={payments}
                      control={control}
                      name={"bank_payment"}
                      label={"default payment"}
                      placeholder="Select payment"
                    />
                    <LabeledInput
                      name={"vat_no"}
                      label={"vat_no"}
                      control={control}
                    />
                    {showVat && (
                      <FormSwitch
                        name={"no_vat"}
                        label={"No Value Tax"}
                        control={control}
                      />
                    )}
                  </div>
                </Section>
              </Card>
              <Card className="">
                <Section no={4} title={"Communication"}>
                  <div className="flex flex-col gap-5">
                    <LabeledInput
                      name={"fon"}
                      label={"fon"}
                      control={control}
                    />

                    <LabeledInput
                      name={"mobile"}
                      label={"mobile"}
                      control={control}
                    />
                    <LabeledInput
                      name={"mail1"}
                      label={"E-Mail"}
                      control={control}
                    />
                    <LabeledInput
                      name={"mail2"}
                      label={"E-Mail"}
                      control={control}
                    />
                    <LabeledInput
                      name={"mail3"}
                      label={"E-Mail"}
                      control={control}
                    />

                    <LabeledInput
                      name={"internet"}
                      label={"internet"}
                      control={control}
                    />
                  </div>
                </Section>
              </Card>
            </PageColumns>
          </div>
          <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
            <Button
              size="sm"
              onClick={() => {
                setIsOpen(false);
              }}
              title={"Close"}
            >
              Close
            </Button>
            <Button
              className="mr-8"
              disabled={!isDirty}
              type="submit"
              size="sm"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </MovableDialog>
    </>
  );
}
