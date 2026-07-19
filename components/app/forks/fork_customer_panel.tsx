import React from "react";
import { Card } from "../ui/card";
import TwoColumn from "../general/TwoColumn";
import DisabledTextArea from "../general/DisabledTextArea";
import DisabledInput from "../general/DisabledInput";
import { useForkStore } from "@/lib/stores/forks/fork_store";

export default function ForkCustomerPanel() {
  const customer = useForkStore((state) => state.customerFork);
  const fork = useForkStore((state) => state.fork);
  const getCustomerForkByIds = useForkStore(
    (state) => state.getCustomerForkByIds,
  );

  React.useEffect(() => {
    fork && getCustomerForkByIds();
  }, [fork]);
  return (
    <Card>
      <TwoColumn align="items-start">
        <div className="w-1/2 m-3 flex flex-col gap-3">
          <DisabledInput label={"Customer"}>
            {customer?.company ?? ""}
          </DisabledInput>
          <DisabledInput label={"Client"}>
            {customer?.client_name ?? ""}
          </DisabledInput>
        </div>
        <div className="w-1/2 m-3">
          <DisabledTextArea
            label={"address"}
            disabled={true}
            value={customer?.cal_address ?? ""}
          />
        </div>
      </TwoColumn>
    </Card>
  );
}
