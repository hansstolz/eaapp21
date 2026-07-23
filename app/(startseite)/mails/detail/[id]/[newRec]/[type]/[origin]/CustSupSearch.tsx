import { DropdownItem } from "@/app/data_types/data/values_data";
import { TCustSup } from "@/app/data_types/mails/cust_sup";
import _searchCustSup from "@/app/api/mails/mails_crud";
import AutoSearch from "@/components/app/autosearch";
import DropDown from "@/components/app/DropDown";
import useDebounce from "@/lib/hooks/useDebounce";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  handleSelection: (cust: TCustSup) => void;
};

export default function CustSupSearch({ handleSelection }: Props) {
  const options: DropdownItem[] = useMemo(
    () => [
      { value: 0, label: "Customer" },
      { value: 1, label: "Supplier" },
    ],
    [],
  );

  const [typing, setTyping] = useState("");
  const [option, setOption] = useState<DropdownItem>(options[0]);
  const [filteredData, setFilteredData] = useState<TCustSup[]>([]);
  const debouncedValue = useDebounce(typing, 100);
  const query = debouncedValue ?? "";

  const showLabel = (item: TCustSup, full = true) => {
    return full
      ? `<b>${item.lastName}</b>, ${item.firstName}<br>${item.streetAddress}<br>${item.zipPostalCode} ${item.city}`
      : `${item.lastName} ${item.firstName}`;
  };
  const getId = (item: TCustSup): number => {
    return item.id;
  };

  const dropDownHandler = (option: DropdownItem) => {
    setOption(option);
    setTyping("");
  };

  useEffect(() => {
    const queryCustSup = async () => {
      if (query.length > 1) {
        const data: TCustSup[] = await _searchCustSup(
          query,
          option.value as number,
        );
        setFilteredData(data);
      } else {
        setFilteredData([]);
      }
    };

    queryCustSup();

    return () => {};
  }, [query, option.value]);

  return (
    <div className="flex flex-row gap-3">
      <div className="w-62.5">
        <AutoSearch
          getId={getId}
          showLabel={showLabel}
          placeholder={option.label}
          data={filteredData}
          setQuery={setTyping}
          handleSelection={handleSelection}
        />
      </div>
      <DropDown valuesIn={options} handler={dropDownHandler} />
    </div>
  );
}
