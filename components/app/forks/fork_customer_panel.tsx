import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import TwoColumn from "@/components/app/TwoColumn";
import LabeledInfo from "@/components/app/labeled_info";
import { useForkStore } from "@/app/stores/forks/fork_store";

export default function ForkCustomerPanel() {
  const customer = useForkStore((state) => state.customerFork);
  const fork = useForkStore((state) => state.fork);
  const getCustomerForkByIds = useForkStore(
    (state) => state.getCustomerForkByIds,
  );

  useEffect(() => {
    if (fork) getCustomerForkByIds();
  }, [fork, getCustomerForkByIds]);
  return (
    <Card>
      <TwoColumn align="items-start">
        <div className="w-1/2 m-3 flex flex-col gap-3">
          <LabeledInfo label={"Customer"}>
            {customer?.company ?? ""}
          </LabeledInfo>
          <LabeledInfo label={"Client"}>
            {customer?.client_name ?? ""}
          </LabeledInfo>
        </div>
        <div className="w-1/2 m-3">
          <LabeledInfo label={"Address"}>
            <span className="whitespace-pre-line">{customer?.cal_address ?? ""}</span>
          </LabeledInfo>
        </div>
      </TwoColumn>
    </Card>
  );
}
