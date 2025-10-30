interface RelativeDateProps {
  date: string;
  locale: Intl.LocalesArgument;
  className?: string;
}

export const RelativeDate = ({
  date,
  locale,
  className,
  ...props
}: RelativeDateProps) => {
  return (
    <time dateTime={date} className={className} {...props}>
      {formatRelativeDate(new Date(date), locale)}
    </time>
  );
};

function formatRelativeDate(date: Date, locale: Intl.LocalesArgument) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const now = new Date();
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000;

  const divisions = [
    { amount: 60, unit: "second" as const },
    { amount: 60, unit: "minute" as const },
    { amount: 24, unit: "hour" as const },
    { amount: 7, unit: "day" as const },
    { amount: 4.34524, unit: "week" as const },
    { amount: 12, unit: "month" as const },
    { amount: Number.POSITIVE_INFINITY, unit: "year" as const },
  ];

  if (Math.abs(diffInSeconds) < 60) return "just now";

  let duration = diffInSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
}
