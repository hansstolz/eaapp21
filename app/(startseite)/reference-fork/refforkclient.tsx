"use client";
import RefArticlesColumns from "@/app/columns/refforks/refarticles_columns";
import RefFeaturesColumns from "@/app/columns/refforks/reffeature_columns";
import useRefColumns from "@/app/columns/refforks/refforks_columns";
import {
  EaRefForks,
  ForkFeature,
  RefArticle,
} from "@/app/data_types/ref_forks/ref_forks";
import Section from "@/components/app/Section";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

type RefforkClientProps = {
  refForks: EaRefForks[];
};

const openCreateRefFork = () => {};
const openCreateForkFeature = () => {};
const onFeatureDoubleClick = () => {};
const deleteForkFeatureAction = () => {};

export default function RefforkClient({ refForks }: RefforkClientProps) {
  const columns = useRefColumns();
  const refFeatureColumns = RefFeaturesColumns();
  const refArticlesColumns = RefArticlesColumns();
  const [selectedRefFork, setSelectedRefFork] = useState(
    null as EaRefForks | null,
  );

  const [forkFeatures, setForkFeatures] = useState([] as ForkFeature[]);
  const [refArticles, setRefArticles] = useState([] as RefArticle[]);
  const [isLoadingRelatedData, setIsLoadingRelatedData] = useState(false);
  const [relatedDataError, setRelatedDataError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedRefFork) {
      return;
    }

    const controller = new AbortController();
    const uidRefFork = selectedRefFork.uid_ref_fork;

    async function loadRelatedData() {
      setIsLoadingRelatedData(true);
      setRelatedDataError(null);

      try {
        const [featuresResponse, articlesResponse] = await Promise.all([
          fetch(`/ref_parts/get_ref_parts/${uidRefFork}`, {
            signal: controller.signal,
          }),
          fetch(`/article_ref_forks/get_ref_articles/${uidRefFork}`, {
            signal: controller.signal,
          }),
        ]);

        if (!featuresResponse.ok || !articlesResponse.ok) {
          throw new Error("Zugehörige Daten konnten nicht geladen werden.");
        }

        const [features, articles] = await Promise.all([
          featuresResponse.json() as Promise<ForkFeature[]>,
          articlesResponse.json() as Promise<RefArticle[]>,
        ]);

        setForkFeatures(features);
        setRefArticles(articles);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setForkFeatures([]);
        setRefArticles([]);
        setRelatedDataError(
          error instanceof Error
            ? error.message
            : "Zugehörige Daten konnten nicht geladen werden.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingRelatedData(false);
        }
      }
    }

    void loadRelatedData();

    return () => controller.abort();
  }, [selectedRefFork]);

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
        <div>
          <Card>
            <CardContent>
              <Section no={2} title={"Fork Feature"}>
                <div className="flex flex-row mb-3">
                  <Button
                    onClick={openCreateForkFeature}
                    variant="destructive"
                    size={"sm"}
                    disabled={!selectedRefFork || isLoadingRelatedData}
                  >
                    New Fork Feature
                  </Button>
                </div>
                {relatedDataError ? (
                  <p className="mb-3 text-sm text-destructive">
                    {relatedDataError}
                  </p>
                ) : null}
                <div className="max-h-125 overflow-y-scroll">
                  <DataTable
                    onDoubleClick={onFeatureDoubleClick}
                    columns={refFeatureColumns}
                    data={forkFeatures}
                    onCellClick={deleteForkFeatureAction}
                  />
                </div>
              </Section>
            </CardContent>
          </Card>
          <div className="h-3" />
          <Card>
            <CardContent>
              <Section
                no={3}
                title={
                  isLoadingRelatedData
                    ? "Reference Article [lädt …]"
                    : `Reference Article [${refArticles.length}]`
                }
              >
                <div className="max-h-125 overflow-y-scroll">
                  <DataTable columns={refArticlesColumns} data={refArticles} />
                </div>
              </Section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
