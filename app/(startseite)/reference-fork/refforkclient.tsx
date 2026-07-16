"use client";
import useRefColumns from "@/app/columns/refforks/refforks_columns";
import { EaRefForks } from "@/app/data_types/ref_forks/ref_forks";
import Section from "@/components/app/Section";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

type RefforkClientProps = {
  refForks: EaRefForks[];
};

export default function RefforkClient({ refForks }: RefforkClientProps) {
  const columns = useRefColumns();
  const [selectedRefFork, setSelectedRefFork] = useState(
    null as EaRefForks | null,
  );

  const openCreateRefFork = () => {};
  return (
    <>
      <div className="text-2xl mb-2 ml-2 text-blue-900 font-semibold self-center">
        {selectedRefFork?.fork_model ?? ""}
      </div>
      <div className="grid grid-cols-2 gap-3 mr-4">
        <Card className="">
          <CardContent>
            <Section no={1} title={"Reference Fork"}>
              <div className="flex flex-row mb-3">
                <Button
                  onClick={openCreateRefFork}
                  size={"sm"}
                  variant="destructive"
                >
                  New Reference Fork
                </Button>
              </div>
              <div className="max-h-250 overflow-y-scroll">
                <DataTable
                  onRowClick={(row) => {
                    setSelectedRefFork(row.original);
                  }}
                  columns={columns}
                  data={refForks}
                />
              </div>
            </Section>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
