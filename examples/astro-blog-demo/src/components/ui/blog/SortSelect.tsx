import { ChevronDownIcon } from "lucide-react";

type SortSelectProps = {
  sortComponent: React.ComponentType<{ className?: string }>;
};

export function SortSelect(props: SortSelectProps) {
  const { sortComponent: SortComponent } = props;

  return (
    <div className="relative flex w-fit">
      <SortComponent className="appearance-none bg-transparent pe-5 text-sm text-foreground" />
      <ChevronDownIcon className="pointer-events-none absolute inset-[auto_0_auto_auto] flex h-full w-4 items-center text-foreground" />
    </div>
  );
}
