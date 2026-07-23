"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogTitle } from "@/components/ui/dialog";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useDebounce from "@/lib/hooks/useDebounce";
import { onlyDigits, onlyDigitsPoint } from "@/lib/utils";
import { useWarrantyStore } from "@/app/stores/warranty/warranty_store";
import type { TArticleResult } from "@/app/data_types/articles/article_result";
import { _getArticles } from "@/app/api/articles/articles_crud";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { useOrderStore } from "@/app/stores/order/order_store";
import {
  articlesSchema,
  EaArticlesInp,
} from "@/app/schemas/costestimate/articlesinp_schema";
import { EaOrdersPositions } from "@/app/data_types/positions/ea_orders_positions";
import MovableDialog from "@/components/app/movable_dialog";
import AutoSearch from "@/components/app/autosearch";
import HLine from "@/components/app/hline";
import TwoColumn from "@/components/app/TwoColumn";
import { LabeledInput } from "@/components/app/LabeledInput";
import { FormSwitch } from "@/components/app/form_switch";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addArticle: boolean;
};

const to2DigitStr = (value: number) => value.toFixed(2);

export default function AddArtDialog({ isOpen, setIsOpen, addArticle }: Props) {
  const [typing, setTyping] = useState("");
  const [filteredData, setFilteredData] = useState<TArticleResult[]>([]);
  const debouncedValue = useDebounce(typing, 100);
  const { warranty } = useWarrantyStore();
  const [canSave, setCanSave] = useState(false);
  const [isNew, setIsNew] = useState(addArticle);

  const getId = (item: TArticleResult): number => item.uid_article;

  const showLabel = (item: TArticleResult, full = true) => {
    if (!item) return "";
    return full
      ? `<b>${item.articlecode}</b><br> ${item.articlecharacter}`
      : (item.articlecode ?? "");
  };

  useEffect(() => {
    const queryArticles = async () => {
      if (debouncedValue && debouncedValue.length > 1) {
        const data = await _getArticles(debouncedValue);
        setFilteredData(data);
      } else {
        setFilteredData([]);
      }
    };

    void queryArticles();
  }, [debouncedValue]);

  const {
    position,
    itemOf,
    selectedNumber,
    addPosition,
    savePosition,
  } = useCostestimateStore();
  const { order } = useOrderStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<EaArticlesInp>({
    resolver: zodResolver(articlesSchema),
  });

  const handleArticleSelection = (sel: TArticleResult) => {
    const inp: EaArticlesInp = calcResult(sel, 1);

    //setArticle(sel);
    setCanSave(true);
    reset({ ...inp });
  };

  const onChangeQuantity = (inp: React.FormEvent<HTMLInputElement>) => {
    const quantity = Number(inp.currentTarget.value);
    const safeQuantity = Number.isFinite(quantity) ? quantity : 0;
    const price1 = Number(getValues("price_netto_categ1")) || 0;
    const price2 = Number(getValues("price_netto_categ2")) || 0;
    const price3 = Number(getValues("price_netto_categ3")) || 0;

    setValue("price_netto_categ1", to2DigitStr(price1), { shouldDirty: true });
    setValue("price_netto_categ2", to2DigitStr(price2), { shouldDirty: true });
    setValue("price_netto_categ3", to2DigitStr(price3), { shouldDirty: true });

    setValue("price_sum_categ1", to2DigitStr(price1 * safeQuantity), {
      shouldDirty: true,
    });
    setValue("price_sum_categ2", to2DigitStr(price2 * safeQuantity), {
      shouldDirty: true,
    });
    setValue("price_sum_categ3", to2DigitStr(price3 * safeQuantity), {
      shouldDirty: true,
    });
  };

  const getDefaultOrderPosition = () => {
    const postion: EaOrdersPositions = {
      uid_orders_position: 0,
      article_creditnote_int: 0,
      articlecharacter: null,
      cal_value_tax: 0,
      currency: null,
      order_no: null,
      article_warranty_int: 0,
      amount_price_categ3_labor: 0,
      cal_price: 0,
      price_single_categ2: 0,
      amount_price_categ1: 0,
      customer_category_no: null,
      amount_price_categ3_freight: 0,
      user_print_language: null,
      article_group: null,
      price_single_categ3: 0,
      articlediscription: null,
      amount_price_categ3_material: 0,
      cal_price_categ3: 0,
      customer_no: null,
      cal_price_categ2: 0,
      articlecode: null,
      cal_price_categ1: 0,
      article_no: null,
      customer_no_rel: null,
      fork_no: null,
      user_group: "",
      amount_price_categ2: 0,
      price_single_categ1: 0,
      amount_price_categ3: 0,
      quantity: 1,
      units: 0,
      uid_article: 0,
      uid_customer: 0,
      uid_ref_fork: 0,
      uid_order: 0,
      created_at: null,
      updated_at: null,
      uid_costestimates: null,
      cal_value_tax2: null,
      fork_no_rel: null,
      article_no_rel: null,
      order_no_rel: null,
    };

    return postion;
  };

  const resetDefault = () => {
    const inp: EaArticlesInp = {
      articlecharacter: "",
      article_group: "",
      article_no: 0,
      price_netto_categ1: to2DigitStr(0),
      price_netto_categ2: to2DigitStr(0),
      price_netto_categ3: to2DigitStr(0),
      price_sum_categ1: to2DigitStr(0),
      price_sum_categ2: to2DigitStr(0),
      price_sum_categ3: to2DigitStr(0),
      articlecode: "",
      category_article: "",
      quantity: 1,
      uid_ref_fork: 0,
      uid_article: 0,
      uid_orders_position: null,
      isWarranty: false,
      articledescription: "",
    };
    reset(inp);
  };

  const calcResult = (sel: TArticleResult | null, quantity: number) => {
    if (!sel) {
      return {
        articlecharacter: "",
        article_group: "",
        article_no: 0,
        price_netto_categ1: to2DigitStr(0),
        price_netto_categ2: to2DigitStr(0),
        price_netto_categ3: to2DigitStr(0),
        price_sum_categ1: to2DigitStr(0),
        price_sum_categ2: to2DigitStr(0),
        price_sum_categ3: to2DigitStr(0),
        articlecode: "",
        category_article: "",
        quantity: 1,
        uid_ref_fork: 0,
        uid_article: 0,
        uid_orders_position: null,
        isWarranty: false,
        articledescription: "",
      };
    }
    const inp: EaArticlesInp = {
      articlecharacter: sel.articlecharacter ?? "",
      article_group: sel.article_group ?? "",
      article_no: sel.article_no ?? 0,
      price_netto_categ1: to2DigitStr(Number(sel.price_netto_categ1 ?? 0)),
      price_netto_categ2: to2DigitStr(Number(sel.price_netto_categ2 ?? 0)),
      price_netto_categ3: to2DigitStr(Number(sel.price_netto_categ3 ?? 0)),
      price_sum_categ1: to2DigitStr(
        Number(sel.price_netto_categ1 ?? 0) * quantity,
      ),
      price_sum_categ2: to2DigitStr(
        Number(sel.price_netto_categ2 ?? 0) * quantity,
      ),
      price_sum_categ3: to2DigitStr(
        Number(sel.price_netto_categ3 ?? 0) * quantity,
      ),
      articlecode: sel.articlecode ?? "",
      category_article: sel.category_article ?? "",
      uid_article: sel.uid_article ?? 0,
      uid_ref_fork: sel.uid_ref_fork ?? 0,
      uid_orders_position: null,
      quantity: 1,
      isWarranty: false,
      articledescription: sel.articledescription ?? "",
    };
    return inp;
  };

  const calcResultPos = useCallback((sel: EaOrdersPositions) => {
    const inp: EaArticlesInp = {
      articlecharacter: sel.articlecharacter ?? "",
      article_group: sel.article_group ?? "",
      article_no: sel.article_no ?? 0,
      price_netto_categ1: to2DigitStr(sel.price_single_categ1 ?? 0),
      price_netto_categ2: to2DigitStr(sel.price_single_categ2 ?? 0),
      price_netto_categ3: to2DigitStr(sel.price_single_categ3 ?? 0),
      price_sum_categ1: to2DigitStr(sel.amount_price_categ1 ?? 0),
      price_sum_categ2: to2DigitStr(sel.amount_price_categ2 ?? 0),
      price_sum_categ3: to2DigitStr(sel.amount_price_categ3 ?? 0),
      articlecode: sel.articlecode ?? "",
      category_article: sel.article_group ?? "",
      uid_article: sel.uid_article ?? 0,
      uid_ref_fork: sel.uid_ref_fork ?? 0,
      uid_orders_position: sel.uid_orders_position ?? null,
      quantity: sel.quantity ?? 1,
      isWarranty: sel.customer_category_no === 3 ? true : false,
      articledescription: sel.articlediscription ?? "",
    };
    return inp;
  }, []);

  useEffect(() => {
    if (!isNew && position) reset(calcResultPos(position));
  }, [calcResultPos, isNew, position, reset]);

  const onSubmit = async (
    article: EaArticlesInp,
    event?: React.BaseSyntheticEvent,
  ) => {
    const position = getDefaultOrderPosition();

    position.article_no = article.article_no;
    position.article_group = article.article_group;
    position.articlecharacter = article.articlecharacter;
    position.articlecode = article.articlecode;

    position.price_single_categ1 = Number(article.price_netto_categ1);
    position.price_single_categ2 = Number(article.price_netto_categ2);
    position.price_single_categ3 = Number(article.price_netto_categ3);

    position.amount_price_categ1 = Number(article.price_sum_categ1);
    position.amount_price_categ2 = Number(article.price_sum_categ2);
    position.amount_price_categ3 = Number(article.price_sum_categ3);

    if (article.article_group === "Freight") {
      position.amount_price_categ3_freight = Number(article.price_netto_categ3);
    }
    if (article.article_group === "Labor") {
      position.amount_price_categ3_labor = Number(article.price_netto_categ3);
    }

    if (article.article_group == "Material") {
      position.amount_price_categ3_material = Number(
        article.price_netto_categ3,
      );
    }

    position.quantity = Number(article.quantity) ?? 1;
    position.uid_article = article.uid_article;
    position.uid_ref_fork = article.uid_ref_fork;
    position.uid_orders_position = article.uid_orders_position ?? 0;
    position.uid_costestimates = selectedNumber ?? 0;
    position.uid_order = order?.uid_order ?? 0;
    position.cal_value_tax = order?.value_tax ?? 0;
    position.cal_value_tax2 = order?.value_tax2 ?? null;
    position.articlediscription = article.articledescription ?? "";

    position.customer_category_no = article.isWarranty
      ? 3
      : order!.customer_category_no;

    if (isNew) await addPosition(position);
    else await savePosition(position);

    const submitter = (event?.nativeEvent as SubmitEvent | undefined)
      ?.submitter as HTMLButtonElement | undefined;
    if (submitter?.title === "Add More") {
      setIsNew(true);
      resetDefault();
      setCanSave(false);
    } else {
      setIsNew(false);
    }
  };

  const [placeHolder, setPlaceHolder] = useState("Article Search");

  const submit = (article: EaArticlesInp, event?: React.BaseSyntheticEvent) => {
    setPlaceHolder((current) =>
      current === "Article Search" ? "Add Article" : "Article Search",
    );
    void onSubmit(article, event);
  };

  const getHeader = () => {
    return (
      <DialogTitle className="flex flex-col text-primary-foreground">
        <div className="flex flex-row items-center justify-between">
          <div>Article {isNew ? "New" : "Edit"}</div>
          <span>{itemOf}</span>
        </div>
      </DialogTitle>
    );
  };

  return (
    <MovableDialog
      className="min-w-3/5 bg-gray-100"
      open={isOpen}
      setOpen={setIsOpen}
      title=""
      header={getHeader()}
    >
      <form onSubmit={handleSubmit(submit)}>
        <div className="dialog-main ">
          <div className="h-12.5 py-3">
            {isNew && (
              <div className="w-100">
                <AutoSearch
                  getId={getId}
                  showLabel={showLabel}
                  placeholder={placeHolder}
                  data={filteredData}
                  setQuery={setTyping}
                  handleSelection={handleArticleSelection}
                />
              </div>
            )}
          </div>
          <HLine />
          <div className="grid grid-cols-[1fr_250px] gap-3">
            <div className="flex flex-col gap-5">
              <TwoColumn>
                <LabeledInput
                  disabled={true}
                  name={"article_no"}
                  label={"Article No"}
                  control={control}
                />
                <LabeledInput
                  disabled={true}
                  name={"category_article"}
                  label={"Category"}
                  control={control}
                />
              </TwoColumn>
              <LabeledInput
                name={"articlecode"}
                label={"Code"}
                control={control}
              />
              <LabeledInput
                type="textarea"
                rows={2}
                name={"articlecharacter"}
                label={"Character"}
                control={control}
              />
              {warranty?.warranty_request === "accept" ? (
                <div className="mt-4 text-2xl font-medium text-blue-700">
                  {warranty?.warranty_request.toUpperCase()}
                </div>
              ) : (
                <FormSwitch
                  className="text-xl"
                  name={"isWarranty"}
                  label={"Article for Warranty"}
                  control={control}
                />
              )}
            </div>

            <div className="flex flex-col gap-5">
              <TwoColumn>
                <LabeledInput
                  name={"quantity"}
                  label={"quantity"}
                  control={control}
                  onInput={onChangeQuantity}
                  onKeyDown={onlyDigits}
                />
              </TwoColumn>
              <TwoColumn>
                <LabeledInput
                  name={"price_netto_categ2"}
                  label={"price private"}
                  control={control}
                  className="text-right"
                  onKeyDown={onlyDigitsPoint}
                />
                <LabeledInput
                  disabled={true}
                  name={"price_sum_categ2"}
                  label={"sum private"}
                  control={control}
                  className="text-right"
                />
              </TwoColumn>
              <TwoColumn>
                <LabeledInput
                  name={"price_netto_categ1"}
                  label={"Price dealer"}
                  control={control}
                  className="text-right"
                  onKeyDown={onlyDigitsPoint}
                />
                <LabeledInput
                  disabled={true}
                  name={"price_sum_categ1"}
                  label={"Sum dealer"}
                  control={control}
                  className="text-right"
                />
              </TwoColumn>
              <TwoColumn>
                <LabeledInput
                  name={"price_netto_categ3"}
                  label={"Price warr"}
                  control={control}
                  className="text-right"
                  onKeyDown={onlyDigitsPoint}
                />
                <LabeledInput
                  disabled={true}
                  name={"price_sum_categ3"}
                  label={"sum warr"}
                  control={control}
                  className="text-right"
                />
              </TwoColumn>
            </div>
          </div>
        </div>

        <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
          <div className="flex gap-12 justify-end mr-4">
            <Button
              size="sm"
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button disabled={!canSave && !isDirty} type="submit" size="sm">
              Save
            </Button>
            <Button
              title="Add More"
              disabled={!canSave && !isDirty}
              type="submit"
              size="sm"
            >
              Add More
            </Button>
          </div>
        </DialogFooter>
      </form>
    </MovableDialog>
  );
}
