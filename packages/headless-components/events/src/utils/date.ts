export const formatShortDate = (
  date: string | Date,
  timeZone: string,
  locale: Intl.LocalesArgument,
) =>
  new Date(date).toLocaleDateString(locale, {
    timeZone,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

export const formatFullDate = (
  date: string | Date,
  timeZone: string,
  showTimeZone: boolean,
  locale: Intl.LocalesArgument,
) =>
  new Date(date).toLocaleDateString(locale, {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: showTimeZone ? 'short' : undefined,
  });

export const formatMonthDayYear = (
  date: string | Date,
  timeZone: string | undefined,
  locale: Intl.LocalesArgument,
) =>
  new Date(date).toLocaleDateString(locale, {
    timeZone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const formatTime = (
  date: string | Date,
  timeZone: string,
  locale: Intl.LocalesArgument,
) =>
  new Date(date).toLocaleTimeString(locale, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatTimeRange = (
  startDate: string | Date,
  endDate: string | Date,
  timeZone: string,
  locale: Intl.LocalesArgument,
) =>
  `${formatTime(startDate, timeZone, locale)} - ${formatTime(endDate, timeZone, locale)}`;

export const getDurationInMinutes = (
  startDate: string | Date,
  endDate: string | Date,
) =>
  Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60),
  );
