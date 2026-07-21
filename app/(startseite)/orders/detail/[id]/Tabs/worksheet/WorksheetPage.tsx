"use client";

import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
import WorksheetController from "./WorksheetController";

import "../../../order.css";
import { Button } from "@/components/ui/button";
import { InputDate } from "@/components/app/inputdate";
import HLine from "@/components/app/hline";
import { PageColumns } from "@/components/app/TwoPageColumns";
import SmallText from "@/components/app/Texts";
import SubSection from "@/components/app/SubSection";
import CalculationDialog from "@/app/dialogs/worksheet/CalculationDialog";
import {
  InfoLabel,
  InputMenu,
  WorksheetInfoRow,
  WorksheetInput as LabeledInput,
  WorksheetReadonlyField,
} from "./WorksheetFields";
export default function WorksheetPage() {
  const [showCalcDialog, setShowCalcDialog] = useState(false);
  const {
    register,
    errors,
    control,
    compr_in,
    neg_spring,
    oil_viscosity,
    coil_spring,
    air_pressure,
    diagnosis,
    warranty,
    isConfirmed,
    handleSubmit,
    isDirty,
    submitHandler,
    copyToCal,
  } = WorksheetController();
  const actions = (
    <div className="flex flex-row gap-3">
      <Button disabled={!isDirty} type="submit" size="xs">
        Save
      </Button>
      <Button type="button" onClick={copyToCal} size="xs">
        Cal
      </Button>
    </div>
  );

  if (isConfirmed) {
    return (
      <form onSubmit={handleSubmit(submitHandler)}>
        <SubSection icon={FiSettings} title={"Worksheet"} actions={actions}>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-3">
              <Button
                type="button"
                onClick={() => setShowCalcDialog(true)}
                className="mt-6"
                size="xs"
              >
                Calculation
              </Button>
            </div>
            <div className="flex flex-row gap-3">
              <LabeledInput
                register={register("worker_worksheet")}
                label={"Worker"}
                error={errors.worker_worksheet?.message}
              />
              <InputDate
                name="work_worksheet_date"
                control={control}
                label={"Workdate"}
                className={"w-1/2"}
              />
            </div>
          </div>
          <HLine />
          <PageColumns className="grid-cols-2">
            <div>
              <div className="ws-values">
                <div className="ws-first">
                  <SmallText className="font-bold">Cartridge</SmallText>
                  <SmallText className="text-right">Compression</SmallText>
                </div>
                <div className="ws-second">
                  <PageColumns className="grid-cols-2">
                    <div>
                      <SmallText className="text-center">in</SmallText>
                      <div className="flex flex-col gap-3">
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_comp_measure_1"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_comp_measure_2"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_comp_measure_3"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_comp_measure_4"}
                        />
                      </div>
                    </div>
                    <div>
                      <SmallText className="text-center">out</SmallText>
                      <div className="flex flex-col gap-3">
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_comp_ship_1"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_comp_ship_2"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_comp_ship_3"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_comp_ship_4"}
                        />
                      </div>
                    </div>
                  </PageColumns>
                </div>
                <div className="ws-third">
                  <div className="mt-4 flex flex-col gap-3 ">
                    <InputMenu
                      labelStyle="flex flex-row gap-1 w-full items-center"
                      label="neg. Spring"
                      options={neg_spring}
                      control={control}
                      name={"ns_negspring"}
                    />
                    <InputMenu
                      labelStyle="flex flex-row gap-1 w-full items-center"
                      label="Oilviscosity"
                      options={oil_viscosity}
                      control={control}
                      name={"ov_oilviscosity"}
                    />
                    <InputMenu
                      labelStyle="flex flex-row gap-1 w-full items-center"
                      label="Coil Spring"
                      options={coil_spring}
                      control={control}
                      name={"cs_coilspring"}
                    />
                    <InputMenu
                      labelStyle="flex flex-row gap-1 w-full items-center"
                      label="Airpressure"
                      options={air_pressure}
                      control={control}
                      name={"ap_airpreasure"}
                    />
                  </div>
                </div>
              </div>
              <div className="ws-values">
                <div className="ws-first">
                  <SmallText className="mt-10 text-right">Rebound</SmallText>
                </div>
                <div className="ws-second">
                  <PageColumns className="mt-8 grid-cols-2">
                    <div>
                      <div className="flex flex-col gap-3">
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_reb_measure_1"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_reb_measure_2"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_reb_measure_3"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_reb_measure_4"}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mt-0 flex flex-col gap-3">
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_reb_ship_1"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_reb_ship_2"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_reb_ship_3"}
                        />
                        <InputMenu
                          options={compr_in}
                          control={control}
                          name={"cart_reb_ship_4"}
                        />
                      </div>
                    </div>
                  </PageColumns>
                </div>
                <div className="ws-third">
                  <div className="mt-8 flex flex-col gap-3 ">
                    <InfoLabel
                      labelStyle="flex flex-row text-right gap-1 items-center"
                      label={"Height Client"}
                    >
                      {diagnosis && diagnosis.customer_height === ""
                        ? "--"
                        : diagnosis?.customer_height}
                    </InfoLabel>
                    <InfoLabel
                      labelStyle="flex flex-row text-right gap-1 items-center"
                      label={"Weight Client"}
                    >
                      {diagnosis?.customer_weight === ""
                        ? "--"
                        : diagnosis?.customer_weight}
                    </InfoLabel>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="ws-values">
                <div className="ws-first">
                  <SmallText className="font-bold ml-6">Telescope</SmallText>
                  <div className="mt-5 flex flex-col gap-7">
                    <SmallText className="text-right">SI</SmallText>
                    <SmallText className=" text-right">SI</SmallText>
                    <SmallText className="text-right">SI</SmallText>
                  </div>
                  <div className="mt-16 flex flex-col gap-7">
                    <SmallText className="text-right">SO</SmallText>
                    <SmallText className=" text-right">SO</SmallText>
                    <SmallText className="text-right">S0</SmallText>
                  </div>
                </div>
                <div className="ws-second">
                  <PageColumns className="grid-cols-2">
                    <div>
                      <SmallText className="text-center">1+3</SmallText>
                      <div className="flex flex-col gap-3">
                        <LabeledInput
                          register={register("steeringinner_si13_1", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringinner_si13_1?.message}
                        />

                        <LabeledInput
                          register={register("steeringinner_si13_2", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringinner_si13_2?.message}
                        />
                        <LabeledInput
                          register={register("steeringinner_si13_3", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringinner_si13_3?.message}
                        />
                      </div>
                    </div>
                    <div>
                      <SmallText className="text-center">2+4</SmallText>
                      <div className="flex flex-col gap-3">
                        <LabeledInput
                          register={register("steeringinner_si24_1", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringinner_si24_1?.message}
                        />

                        <LabeledInput
                          register={register("steeringinner_si24_2", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringinner_si24_2?.message}
                        />
                        <LabeledInput
                          register={register("steeringinner_si24_3", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringinner_si24_3?.message}
                        />
                      </div>
                    </div>
                  </PageColumns>
                  <PageColumns className="mt-16.5 grid-cols-2">
                    <div>
                      <div className="flex flex-col gap-3">
                        <LabeledInput
                          register={register("steeringouter_so13_1", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringouter_so13_1?.message}
                        />

                        <LabeledInput
                          register={register("steeringouter_so13_2", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringouter_so13_2?.message}
                        />
                        <LabeledInput
                          register={register("steeringouter_so13_3", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringouter_so13_3?.message}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col gap-3">
                        <LabeledInput
                          register={register("steeringouter_so24_1", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringouter_so24_1?.message}
                        />

                        <LabeledInput
                          register={register("steeringouter_so24_2", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringouter_so24_2?.message}
                        />
                        <LabeledInput
                          register={register("steeringouter_so24_3", {
                            valueAsNumber: true,
                          })}
                          label={""}
                          error={errors.steeringouter_so24_3?.message}
                        />
                      </div>
                    </div>
                  </PageColumns>
                </div>
                <div className="ws-third">
                  <PageColumns className="grid grid-cols-2">
                    <div>
                      <SmallText className="text-center">in</SmallText>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-1 items-center">
                          <SmallText className="text-right">IR1</SmallText>
                          <LabeledInput
                            register={register("innerraces_1_in", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.innerraces_1_in?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <SmallText className="text-right">IR2</SmallText>
                          <LabeledInput
                            register={register("innerraces_2_in", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.innerraces_2_in?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <SmallText className="text-right">IR3</SmallText>
                          <LabeledInput
                            register={register("innerraces_3_in", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.innerraces_3_in?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <SmallText className="text-right">IR4</SmallText>
                          <LabeledInput
                            register={register("innerraces_4_in", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.innerraces_4_in?.message}
                          />
                        </div>

                        <div className="mt-3 flex flex-row gap-1 items-center">
                          <SmallText className="mt-2 text-right">OR1</SmallText>
                          <LabeledInput
                            register={register("outerraces_1_in", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.outerraces_1_in?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <SmallText className="mt-2 text-right">OR2</SmallText>
                          <LabeledInput
                            register={register("outerraces_2_in", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.outerraces_2_in?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <SmallText className="mt-2 text-right">OR3</SmallText>
                          <LabeledInput
                            register={register("outerraces_3_in", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.outerraces_3_in?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <SmallText className="mt-2 text-right">OR4</SmallText>
                          <LabeledInput
                            register={register("outerraces_4_in", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.outerraces_4_in?.message}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <SmallText className="text-center">out</SmallText>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-1 items-center">
                          <LabeledInput
                            register={register("innerraces_1_out", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.innerraces_1_out?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <LabeledInput
                            register={register("innerraces_2_out", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.innerraces_2_out?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <LabeledInput
                            register={register("innerraces_3_out", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.innerraces_3_out?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <LabeledInput
                            register={register("innerraces_4_out", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.innerraces_4_out?.message}
                          />
                        </div>

                        <div className="mt-3 flex flex-row gap-1 items-center">
                          <LabeledInput
                            register={register("outerraces_1_out", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.outerraces_1_out?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <LabeledInput
                            register={register("outerraces_2_out", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.outerraces_2_out?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <LabeledInput
                            register={register("outerraces_3_out", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.outerraces_3_out?.message}
                          />
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <LabeledInput
                            register={register("outerraces_4_out", {
                              valueAsNumber: true,
                            })}
                            label={""}
                            error={errors.outerraces_4_out?.message}
                          />
                        </div>
                      </div>
                    </div>
                  </PageColumns>
                </div>
              </div>
            </div>
          </PageColumns>
          <HLine />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr_1fr]">
            <div className="flex min-w-0 flex-col gap-3">
              <LabeledInput
                type="textarea"
                rows={2}
                register={register("notes_intern_worksheet")}
                label={"Internal Notes for Worksheet"}
                error={errors.notes_intern_worksheet?.message}
              />
              <WorksheetReadonlyField
                label="Warranty Reason"
                value={warranty?.warranty_reason}
              />
              <WorksheetReadonlyField
                label="Internal Notes for Diagnosis"
                value={diagnosis?.notes_intern}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-3">
                <WorksheetInfoRow
                  label="Height Cust."
                  value={diagnosis?.customer_height ?? "--"}
                />
                <WorksheetInfoRow
                  label="Weight Cust."
                  value={diagnosis?.customer_weight ?? "--"}
                />
                <WorksheetInfoRow
                  label="Use for"
                  value={diagnosis === null ? "--" : diagnosis?.uses.join(", ")}
                />
                <WorksheetInfoRow
                  label="Settings"
                  value={
                    diagnosis === null ? "--" : diagnosis?.settings.join(", ")
                  }
                />
                <WorksheetInfoRow
                  label="Extras"
                  value={diagnosis?.check_extras ?? "--"}
                />
            </div>
            <div className="flex min-w-0 flex-col gap-3">
                <WorksheetInfoRow
                  label="Shockboot"
                  value={diagnosis?.check_shockboot ?? "--"}
                />
                <WorksheetInfoRow
                  label="Headset"
                  value={diagnosis?.check_headset ?? "--"}
                />
                <WorksheetInfoRow label="Dial" value={diagnosis?.check_dial ?? "--"} />
                <WorksheetInfoRow
                  label="Telescope"
                  value={diagnosis?.check_telescope ?? "--"}
                />
                <WorksheetInfoRow
                  label="Cartridge"
                  value={diagnosis?.check_cartridge ?? "--"}
                />
                <WorksheetInfoRow label="Air" value={diagnosis?.check_air ?? "--"} />
                <WorksheetInfoRow
                  label="Warranty Request"
                  value={warranty?.warranty_request ?? "--"}
                />
            </div>
          </div>
          {showCalcDialog && (
            <CalculationDialog
              isOpen={showCalcDialog}
              setIsOpen={setShowCalcDialog}
            />
          )}
        </SubSection>
      </form>
    );
  }

  return (
    <div className="text-xl p-12 text-primary-700">Confirm Costestimate!</div>
  );
}

//<pre>{JSON.stringify(watch(), null, 2)}</pre>
