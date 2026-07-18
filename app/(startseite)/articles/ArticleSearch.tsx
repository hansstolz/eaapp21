import Searchbar from "@/components/app/Searchbar";
import useSearchOnTyping from "@/lib/hooks/useSearch";

type Props = {
  updateQuery: (val: string) => void;
};

export default function ArticleSearch({ updateQuery }: Props) {
  const { placeHolder, onChange, typing } = useSearchOnTyping({
    updateQuery,
    placeHolderText: "Search article/code",
  });
  return (
    <Searchbar value={typing} placeHolder={placeHolder} setQuery={onChange} />
  );
}
