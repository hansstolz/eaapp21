"use client";

import { TArticleOptions } from "@/app/data_types/articles/article_result";
import { EaArticles } from "@/app/schemas/article_schema";
import { EaArticlesSchema } from "@/app/schemas/articles/article_schema";
import DetailButtons from "@/components/app/DetailButtons";
import { FormSelect } from "@/components/app/form_select";
import { FormSwitch } from "@/components/app/form_switch";
import { LabeledInput } from "@/components/app/LabeledInput";
import LineLR from "@/components/app/LineLR";
import LineRow from "@/components/app/LineRow";
import Section from "@/components/app/Section";
import { PageColumns } from "@/components/app/TwoPageColumns";
import { Card } from "@/components/ui/card";
import useAutoFocus from "@/lib/hooks/autofocus";
import { onlyDigits, onlyDigitsPoint } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  _createArticle,
  _getArticleById,
  _getArticleOptions,
  _updateArticle,
} from "@/app/api/articles/articles_crud";

type ArticleDetailParams = {
  id: string;
  isNew: string;
};

export default function ArticleDetailPage() {
  const { id, isNew } = useParams<ArticleDetailParams>();
  const [options, setOptions] = useState<TArticleOptions>();
  const firstInput = useAutoFocus();
  const [isNewState, setIsNew] = useState(isNew === "true");

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<EaArticles>({
    resolver: zodResolver(EaArticlesSchema),
    defaultValues: EaArticlesSchema.parse({}),
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (isNew === "true") {
        const opts = await _getArticleOptions();
        if (!active) return;
        setOptions(opts);
        reset(EaArticlesSchema.parse({}), { keepDefaultValues: false });
      } else {
        const result = await _getArticleById(Number(id));
        if (!active) return;
        setOptions(result);
        reset(result);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, isNew, reset]);

  const submitArticle = async (article: EaArticles) => {
    if (!isDirty) {
      //toast.error("No changes to save.");
      return;
    }
    const result = isNewState
      ? await _createArticle(article)
      : await _updateArticle(article);

    if (result === null) {
      toast.error("An error occurred while saving the article.");
      return;
    }
    toast.success("Article saved successfully.");
    reset(result);
    setIsNew(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitArticle)}>
        <LineLR>
          <DetailButtons isDisabled={!isDirty} handler={() => {}} />
        </LineLR>
        <PageColumns className="grid-cols-2">
          <Card>
            <Section no={1} title="Article">
              <div className="flex flex-col gap-5">
                <LabeledInput
                  disabled={true}
                  control={control}
                  name={"article_no"}
                  label={"Article No"}
                  className="w-25"
                />
                <LineRow>
                  <FormSelect
                    placeholder=""
                    control={control}
                    label={"article group"}
                    name={"article_group"}
                    error={errors.article_group?.message}
                    options={(options && options.groups) ?? []}
                  />

                  <FormSelect
                    placeholder=""
                    control={control}
                    label={"Categories"}
                    name={"category_article"}
                    error={errors.category_article?.message}
                    options={(options && options.categories) ?? []}
                  />

                  <FormSelect
                    placeholder=""
                    control={control}
                    name={"active"}
                    label={"Status"}
                    options={(options && options.stati) ?? []}
                  />
                </LineRow>
                <LabeledInput
                  ref={firstInput}
                  control={control}
                  name={"articlecode"}
                  label={"Article Code"}
                />
                <LabeledInput
                  name={"articlecharacter"}
                  label={"Article Character"}
                  control={control}
                />
                <LabeledInput
                  name={"manufacturer"}
                  label={"manufacturer"}
                  control={control}
                />
              </div>
            </Section>
          </Card>
          <Card>
            <Section no={2} title="Items">
              <div className="flex flex-col gap-5">
                <LabeledInput
                  control={control}
                  name={"company_article_no"}
                  label={"Item No"}
                />

                <LabeledInput
                  control={control}
                  className="w-25"
                  name={"quantity"}
                  label={"quantity"}
                  onKeyDown={onlyDigits}
                />
                <LineRow gap="gap-2">
                  <LabeledInput
                    control={control}
                    name={"cost_price"}
                    label={"cost_price"}
                    onKeyDown={onlyDigitsPoint}
                  />
                  <LabeledInput
                    control={control}
                    name={"price_netto_categ2"}
                    label={"Price Private"}
                    onKeyDown={onlyDigitsPoint}
                  />
                  <LabeledInput
                    control={control}
                    name={"price_netto_categ1"}
                    label={"Price Dealer"}
                    onKeyDown={onlyDigitsPoint}
                  />
                  <LabeledInput
                    control={control}
                    name={"price_netto_categ3"}
                    label={"Price Warranty"}
                    onKeyDown={onlyDigitsPoint}
                  />
                </LineRow>
                <div>
                  <FormSwitch
                    name="core_item"
                    label="Core Item"
                    control={control}
                  />
                </div>
              </div>
            </Section>
          </Card>
          <Card>
            <Section no={3} title="Notes">
              <div className="flex flex-col gap-5">
                <LabeledInput
                  control={control}
                  type="textarea"
                  name={"memo"}
                  label={"Notes"}
                />
              </div>
            </Section>
          </Card>
        </PageColumns>
      </form>
    </>
  );
}
