"use client";

import React from "react";
import ValueDetail from "./value_detail";
import { valueMap } from "@/app/data_types/data/values_data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function List() {
  const [category, setCategory] = React.useState("Forks");
  const options = valueMap.get(category) ?? [];

  return (
    <div className="flex w-full  flex-col gap-6">
      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="flex gap-3">
          {Array.from(valueMap.keys()).map((category) => (
            <TabsTrigger
              className="tab-trigger"
              key={category}
              value={category}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={category}>
          <ValueDetail key={category} optionsIn={options} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
