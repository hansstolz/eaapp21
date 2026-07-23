"use client";
import RefArticlesColumns from "@/app/columns/refforks/refarticles_columns";
import RefFeaturesColumns from "@/app/columns/refforks/reffeature_columns";
import useRefColumns from "@/app/columns/refforks/refforks_columns";
import {
  EaRefForks,
  ForkFeature,
  RefArticle,
} from "@/app/data_types/ref_forks/ref_forks";
import ForkFeatureDialog from "@/app/dialogs/refforks/forkfeature_dialog";
import RefforkDialog from "@/app/dialogs/refforks/reffork_dialog";
import { AlertDialog } from "@/app/dialogs/general/alert_dialog";
import Section from "@/components/app/Section";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Row } from "@tanstack/react-table";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type RefforkClientProps = {
  refForks: EaRefForks[];
};

type DeleteRequest =
  | { type: "refFork"; item: EaRefForks }
  | { type: "forkFeature"; item: ForkFeature };

async function getRelatedData(uidRefFork: number, signal?: AbortSignal) {
  const [featuresResponse, articlesResponse] = await Promise.all([
    fetch(`/ref_parts/get_ref_parts/${uidRefFork}`, { signal }),
    fetch(`/article_ref_forks/get_ref_articles/${uidRefFork}`, { signal }),
  ]);

  if (!featuresResponse.ok || !articlesResponse.ok) {
    throw new Error("Zugehörige Daten konnten nicht geladen werden.");
  }

  const [features, articles] = await Promise.all([
    featuresResponse.json() as Promise<ForkFeature[]>,
    articlesResponse.json() as Promise<RefArticle[]>,
  ]);

  return { features, articles };
}

export default function RefforkClient({ refForks }: RefforkClientProps) {
  const columns = useRefColumns();
  const refFeatureColumns = RefFeaturesColumns();
  const refArticlesColumns = RefArticlesColumns();
  const [selectedRefFork, setSelectedRefFork] = useState(
    null as EaRefForks | null,
  );
  const [refForkRows, setRefForkRows] = useState(refForks);
  const [refForkDialogMode, setRefForkDialogMode] = useState<"create" | "edit">(
    "create",
  );
  const [isRefForkDialogOpen, setIsRefForkDialogOpen] = useState(false);

  const [forkFeatures, setForkFeatures] = useState([] as ForkFeature[]);
  const [refArticles, setRefArticles] = useState([] as RefArticle[]);
  const [isLoadingRelatedData, setIsLoadingRelatedData] = useState(false);
  const [relatedDataError, setRelatedDataError] = useState<string | null>(null);
  const [selectedForkFeature, setSelectedForkFeature] =
    useState<ForkFeature | null>(null);
  const [forkFeatureDialogMode, setForkFeatureDialogMode] = useState<
    "create" | "edit"
  >("create");
  const [isForkFeatureDialogOpen, setIsForkFeatureDialogOpen] = useState(false);
  const [deleteRequest, setDeleteRequest] = useState<DeleteRequest | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const refreshRelatedData = useCallback(async (uidRefFork: number) => {
    setIsLoadingRelatedData(true);
    setRelatedDataError(null);

    try {
      const { features, articles } = await getRelatedData(uidRefFork);

      setForkFeatures(features);
      setRefArticles(articles);
    } catch (error) {
      setRelatedDataError(
        error instanceof Error
          ? error.message
          : "Zugehörige Daten konnten nicht geladen werden.",
      );
    } finally {
      setIsLoadingRelatedData(false);
    }
  }, []);

  const refreshRefForks = useCallback(async (selectedRefForkId: number) => {
    const response = await fetch("/ref_forks/all_ref_forks");
    if (!response.ok) throw new Error("Reference Forks could not be loaded");

    const rows = (await response.json()) as EaRefForks[];
    setRefForkRows(rows);
    setSelectedRefFork(
      rows.find((row) => row.uid_ref_fork === selectedRefForkId) ?? null,
    );
  }, []);

  useEffect(() => {
    if (!selectedRefFork) {
      return;
    }

    const controller = new AbortController();
    const uidRefFork = selectedRefFork.uid_ref_fork;

    void getRelatedData(uidRefFork, controller.signal)
      .then(({ features, articles }) => {
        setForkFeatures(features);
        setRefArticles(articles);
      })
      .catch((error: unknown) => {
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
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingRelatedData(false);
        }
      });

    return () => controller.abort();
  }, [selectedRefFork]);

  const openCreateForkFeature = () => {
    if (!selectedRefFork) return;

    setSelectedForkFeature(null);
    setForkFeatureDialogMode("create");
    setIsForkFeatureDialogOpen(true);
  };

  const openCreateRefFork = () => {
    setRefForkDialogMode("create");
    setIsRefForkDialogOpen(true);
  };

  const openEditRefFork = (row: Row<EaRefForks>) => {
    setSelectedRefFork(row.original);
    setRefForkDialogMode("edit");
    setIsRefForkDialogOpen(true);
  };

  const closeRefForkDialog = () => setIsRefForkDialogOpen(false);

  const onFeatureDoubleClick = (row: Row<ForkFeature>) => {
    setSelectedForkFeature(row.original);
    setForkFeatureDialogMode("edit");
    setIsForkFeatureDialogOpen(true);
  };

  const closeForkFeatureDialog = () => {
    setIsForkFeatureDialogOpen(false);
    setSelectedForkFeature(null);
  };

  const requestDeleteRefFork = (row: Row<EaRefForks>) => {
    setDeleteRequest({ type: "refFork", item: row.original });
    setIsDeleteDialogOpen(true);
  };

  const requestDeleteForkFeature = (row: Row<ForkFeature>) => {
    setDeleteRequest({ type: "forkFeature", item: row.original });
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteRequest(null);
  };

  const confirmDelete = async () => {
    if (!deleteRequest) return;

    try {
      if (deleteRequest.type === "refFork") {
        const uidRefFork = deleteRequest.item.uid_ref_fork;
        const response = await fetch(
          `/ref_forks/delete_ref_fork/${uidRefFork}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok)
          throw new Error("Reference Fork could not be deleted");

        setRefForkRows((rows) =>
          rows.filter((row) => row.uid_ref_fork !== uidRefFork),
        );
        if (selectedRefFork?.uid_ref_fork === uidRefFork) {
          setSelectedRefFork(null);
          setForkFeatures([]);
          setRefArticles([]);
          setRelatedDataError(null);
        }
        toast.success("Reference Fork deleted successfully");
      } else {
        const uidRefPart = deleteRequest.item.uid_ref_part;
        const response = await fetch(
          `/ref_parts/delete_ref_part/${uidRefPart}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) throw new Error("Fork Feature could not be deleted");

        setForkFeatures((features) =>
          features.filter((feature) => feature.uid_ref_part !== uidRefPart),
        );
        if (selectedForkFeature?.uid_ref_part === uidRefPart) {
          closeForkFeatureDialog();
        }
        toast.success("Fork Feature deleted successfully");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Item could not be deleted",
      );
    } finally {
      closeDeleteDialog();
    }
  };

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
                <Button onClick={openCreateRefFork}>New Reference Fork</Button>
              </div>
              <div className="max-h-250 overflow-y-scroll">
                <DataTable
                  onDoubleClick={openEditRefFork}
                  onRowClick={(row) => {
                    closeForkFeatureDialog();
                    setIsLoadingRelatedData(true);
                    setRelatedDataError(null);
                    setSelectedRefFork(row.original);
                  }}
                  columns={columns}
                  data={refForkRows}
                  onCellClick={requestDeleteRefFork}
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
                    onCellClick={requestDeleteForkFeature}
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
      <ForkFeatureDialog
        selectedRefFork={selectedRefFork}
        selectedForkFeature={selectedForkFeature}
        selectedRefForkId={selectedRefFork?.uid_ref_fork ?? null}
        isForkFeatureDialogOpen={isForkFeatureDialogOpen}
        setIsForkFeatureDialogOpen={setIsForkFeatureDialogOpen}
        selectRefFork={refreshRelatedData}
        closeForkFeatureDialog={closeForkFeatureDialog}
        title="Fork Feature"
        mode={forkFeatureDialogMode}
      />
      <RefforkDialog
        selectedRefFork={selectedRefFork}
        isRefForkDialogOpen={isRefForkDialogOpen}
        setIsRefForkDialogOpen={setIsRefForkDialogOpen}
        refreshRefForks={refreshRefForks}
        closeRefForkDialog={closeRefForkDialog}
        title="Reference Fork"
        mode={refForkDialogMode}
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        setOpen={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setDeleteRequest(null);
        }}
        onConfirm={() => void confirmDelete()}
        title="Confirm deletion"
        description={
          deleteRequest?.type === "refFork"
            ? `Do you really want to delete the Reference Fork “${deleteRequest.item.fork_model ?? ""}”?`
            : `Do you really want to delete the Fork Feature “${deleteRequest?.item.ref_part_name ?? ""}”?`
        }
      />
    </>
  );
}
