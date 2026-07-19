import Searchbar from "@/components/app/Searchbar";
import useSearchOnTyping from "@/lib/hooks/useSearch";

type Props = {
  disabled?: boolean;
  updateQuery: (val: string) => void;
};

export default function OrdersSearch({ updateQuery, disabled }: Props) {
  const { placeHolder, onChange, typing } = useSearchOnTyping({
    updateQuery,
    placeHolderText: "Search order/customer",
  });

  return (
    <Searchbar
      disabled={disabled}
      value={typing}
      placeHolder={placeHolder}
      setQuery={onChange}
    />
  );
}
