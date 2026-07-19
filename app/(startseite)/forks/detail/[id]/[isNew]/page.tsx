"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAutoFocus from "@/lib/hooks/autofocus";
import { useForkStore } from "@/app/stores/forks/fork_store";
import PartsColumns from "@/app/columns/forks/part_columns";
import { EaForks, RefHandlerTypes } from "@/app/data_types/forks/ea_forks";
import { DropdownItem } from "@/components/app/DropDown";
import { EaForkSchema, forkSchema } from "@/app/schemas/forks/fork_schema";
import LineLR from "@/components/app/LineLR";
import DetailButtons from "@/components/app/DetailButtons";
import { OnePageColumn, PageColumns } from "@/components/app/TwoPageColumns";
import { Card } from "@/components/ui/card";
import Section from "@/components/app/Section";
import { LabeledInput } from "@/components/app/LabeledInput";
import TwoColumn from "@/components/app/TwoColumn";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import ForkCustomerPanel from "@/components/app/forks/fork_customer_panel";
import ForkOrdersPanel from "@/components/app/forks/fork_orders_panel";
import { DropdownMenuItems } from "@/components/app/dropdown_menu";

type ForkDetailParams = {
  id: string;
  isNew: string;
};

export default function ForkDetailPage() {
  const { id } = useParams<ForkDetailParams>();
  const firstInput = useAutoFocus();
  const getForkById = useForkStore((state) => state.getForkById);
  const getForkReferences = useForkStore((state) => state.getForkReferences);
  const updateFork = useForkStore((state) => state.updateFork);
  const fork = useForkStore((state) => state.fork);
  const columns = PartsColumns();
  const {
    ref_forks,
    ref_categories,
    ref_colors,
    ref_wheelsizes,
    ref_parts,
    isNew,
    tabValues,
  } = useForkStore(
    useShallow((state) => ({
      isNew: state.isNew,
      tabValues: state.tabValues,
      ref_forks: state.ref_forks,
      ref_categories: state.ref_categories,
      ref_colors: state.ref_colors,
      ref_wheelsizes: state.ref_wheelsizes,
      ref_parts: state.ref_parts,
    })),
  );

  const refHandler = (value: RefHandlerTypes, item: DropdownItem) => {
    setValue(value, item.label, { shouldDirty: true });
  };

  const refHandlerFork = (value: RefHandlerTypes, item: DropdownItem) => {
    setValue(value, item.label, { shouldDirty: true });
    setValue("uid_ref_fork", Number(item.value));
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<EaForkSchema>({
    resolver: zodResolver(forkSchema),
  });

  useEffect(() => {
    getForkById(Number(id));
    getForkReferences();
  }, [getForkById, getForkReferences, id]);

  useEffect(() => {
    if (fork) {
      reset(fork);
    }
  }, [fork, reset]);

  const submit = async (data: EaForkSchema) => {
    if (isDirty) await updateFork(data as EaForks);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <LineLR>
          <DetailButtons isDisabled={!isDirty} />
        </LineLR>
        <PageColumns className="grid-cols-2">
          <Card>
            <Section no={1} title="Fork">
              <div className="flex flex-col gap-5">
                <LabeledInput
                  disabled={true}
                  control={control}
                  name={"fork_no"}
                  label={"Fork No"}
                  className="w-25"
                />
                <TwoColumn>
                  <div className="w-4/5">
                    <LabeledInput
                      ref={firstInput}
                      disabled={false}
                      control={control}
                      name={"fork_model"}
                      label={"Model"}
                    />
                  </div>
                  <div className="w-1/5 mt-4">
                    {ref_forks && (
                      <DropdownMenuItems
                        onSelect={(menus) =>
                          refHandlerFork("fork_model", menus)
                        }
                        items={ref_forks}
                        title="RefFork"
                      />
                    )}
                  </div>
                </TwoColumn>
                <TwoColumn>
                  <div className="w-4/5">
                    <LabeledInput
                      disabled={false}
                      control={control}
                      name={"category_fork"}
                      label={"Model"}
                    />
                  </div>
                  <div className="w-1/5 mt-4">
                    {ref_categories && (
                      <DropdownMenuItems
                        title="Fork Categories"
                        onSelect={(menus) => refHandler("category_fork", menus)}
                        items={ref_categories}
                      />
                    )}
                  </div>
                </TwoColumn>
                <TwoColumn>
                  <div className="w-4/5">
                    <LabeledInput
                      disabled={false}
                      control={control}
                      name={"colour"}
                      label={"Fork Color"}
                    />
                  </div>
                  <div className="w-1/5 mt-4">
                    {ref_colors && (
                      <DropdownMenuItems
                        title="Fork Colors"
                        onSelect={(menus) => refHandler("colour", menus)}
                        items={ref_colors}
                      />
                    )}
                  </div>
                </TwoColumn>
                <TwoColumn>
                  <div className="w-4/5">
                    <LabeledInput
                      disabled={false}
                      control={control}
                      name={"wheelsize"}
                      label={"Model"}
                    />
                  </div>
                  <div className="w-1/5 mt-4">
                    {ref_wheelsizes && (
                      <DropdownMenuItems
                        onSelect={(menus) => refHandler("wheelsize", menus)}
                        items={ref_wheelsizes}
                        title="Wheelsizes"
                      />
                    )}
                  </div>
                </TwoColumn>
              </div>
            </Section>
          </Card>
          <div className="flex flex-col gap-2">
            <Card>
              <Section no={2} title="Fork Features">
                <div className="flex flex-col gap-5">
                  <DataTable columns={columns} data={ref_parts} />
                </div>
              </Section>
            </Card>
            <Card>
              <Section no={3} title="Notes">
                <div className="flex flex-col gap-5">
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
          </div>
        </PageColumns>
      </form>
      <OnePageColumn>
        <Card>
          <Section className="min-h-30" no={5} title="More">
            {isNew === false && (
              <Tabs defaultValue={"Customer"}>
                <TabsList className="flex gap-3">
                  {tabValues.map((tab) => (
                    <TabsTrigger
                      className="tab-trigger"
                      key={tab.uid}
                      value={tab.value.toString()}
                    >
                      {tab.icon && <tab.icon className="mr-2 inline-block" />}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="min-h-100 max-h-125 overflow-y-scroll">
                  <TabsContent value="Customer">
                    <ForkCustomerPanel />
                  </TabsContent>
                  <TabsContent value="Orders">
                    <ForkOrdersPanel />
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
