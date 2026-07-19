import Section from "@/components/app/Section";
import { Card } from "@/components/ui/card";
import React from "react";

export default function ArticleSales() {
  return (
    <Card className="h-125">
      <Section no={2} title={"ArticleSales"}>
        <div className="w-full flex flex-col gap-3">
          <div>No Fork</div>
        </div>
      </Section>
    </Card>
  );
}
