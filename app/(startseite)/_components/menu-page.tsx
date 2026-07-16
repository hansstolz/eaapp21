type MenuPageProps = {
  title: string;
};

export default function MenuPage({ title }: MenuPageProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <h1 className="text-3xl font-semibold">{title}</h1>
    </div>
  );
}
