import {
  _getCustomerById,
  _createCustomer,
  _updateCustomer,
} from "@/app/api/customers/customers_crud";
import {
  customerSchema,
  customerDefault,
  EaCustomerMails,
} from "@/app/schemas/customer/customer_schema";
import { useOrderStore } from "@/app/stores/order/order_store";
import type { EaCustomer } from "@/app/data_types/customer/ea_customer";
import { ValueTypes } from "@/app/data_types/values/value_types";
import DisabledInput from "@/components/app/DisabledInput";
import { FormSelect } from "@/components/app/form_select";
import { FormSwitch } from "@/components/app/form_switch";
import { FormSelectOption } from "@/components/app/FormSelect";
import { LabeledInput } from "@/components/app/LabeledInput";
import MovableDialog from "@/components/app/movable_dialog";
import Section from "@/components/app/Section";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import useAutoFocus from "@/lib/hooks/autofocus";

import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mode?: "edit" | "create";
  onCreated?: (customer: EaCustomerMails) => void;
};

const categories: FormSelectOption[] = [
  { label: "Dealer", value: "Dealer" },
  { label: "Private", value: "Private" },
];

export default function OrderCustomerDialog({ isOpen, setIsOpen, mode = "edit", onCreated }: Props) {
  const inputRef = useAutoFocus();

  const { order, updateOrder } = useOrderStore();
  const [payments, setPayments] = useState<FormSelectOption[]>([]);

  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isSubmitting },
  } = useForm<EaCustomerMails>({
    resolver: zodResolver(customerSchema),
    defaultValues: mode === "create" ? { ...customerDefault, category_customer: "Private", bank_payment: "COD" } : undefined,
  });

  const vat_no = useWatch({ control, name: "vat_no" });
  const showVat = Boolean(vat_no && vat_no.length > 3);

  useEffect(() => {
    const getCustomer = async () => {
      if (mode === "edit" && order) {
        const full_customer = await _getCustomerById(order.uid_customer!);
        if (full_customer.customer) reset(full_customer.customer);
      }
    };

    const get_payments = async () => {
      const response = await fetch(
        `/values/get_values_label/${encodeURIComponent(ValueTypes.ea_customer_payment)}`,
      );
      if (response.ok) setPayments(await response.json());
    };
    getCustomer();
    get_payments();
  }, [mode, order, reset]);

  const submitCustomer = async (data: EaCustomerMails) => {
    if (mode === "edit" && !order) return;
    try {
      if (mode === "create") {
        const customer = await _createCustomer(data);
        onCreated?.(customer);
        toast.success("Customer created");
        setIsOpen(false);
        return;
      }
      if (!order) return;
      const customer = await _updateCustomer({ ...data, uid_order: order.uid_order });
      order.updateCustomer(customer as unknown as EaCustomer);
      updateOrder();
      toast.success("Customer updated");
      setIsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Customer could not be saved.");
    }
  };

  const onSubmit = async (data: EaCustomerMails) => {
    if (isDirty) {
      await submitCustomer(data);
    }
  };

  return (
    <>
      <MovableDialog
        className="min-w-0 w-[95vw] max-w-7xl sm:max-w-7xl"
        open={isOpen}
        setOpen={(open) => { if (!isSubmitting) setIsOpen(open); }}
        title={mode === "create" ? "New Customer" : "Edit Customer"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="dialog-main max-h-[70vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4">
              <Card className="">
                <Section no={1} title={"Name/Company"} className="ml-4 mr-4">
                  <div className="flex flex-col gap-5">
                    <DisabledInput label={"Customer No"}>
                      {mode === "create" ? "Assigned on save" : order?.customer_no}
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
                <Section no={2} title={"Address"} className="ml-4 mr-4">
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
                <Section no={3} title={"Bank"} className="ml-4 mr-4">
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
                <Section no={4} title={"Communication"} className="ml-4 mr-4">
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
                    <LabeledInput name="fax" label="Fax" control={control} />
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
            </div>
          </div>
          <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
            <Button
              type="button"
              disabled={isSubmitting}
              size="sm"
              onClick={() => {
                setIsOpen(false);
              }}
              title={"Close"}
            >
              {mode === "create" ? "Cancel" : "Close"}
            </Button>
            <Button
              className="mr-8"
              disabled={!isDirty || isSubmitting}
              type="submit"
              size="sm"
            >
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </MovableDialog>
    </>
  );
}
