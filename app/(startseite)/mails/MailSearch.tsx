import Searchbar from "@/components/app/Searchbar";
import useSearchOnTyping from "@/lib/hooks/useSearch";

type Props = {
  updateQuery: (val: string) => void;
};

export default function MailSearch({ updateQuery }: Props) {
  const { placeHolder, onChange, typing } = useSearchOnTyping({
    updateQuery: updateQuery,
    placeHolderText: "Search customer/subject",
  });
  return (
    <>
      <Searchbar value={typing} placeHolder={placeHolder} setQuery={onChange} />
    </>
  );
}
