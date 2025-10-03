export const formatShortDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

export const formatFullDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateMonthDayYear = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const formatTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatTimeRange = (
  startTime: string | Date,
  endTime: string | Date,
) => `${formatTime(startTime)} - ${formatTime(endTime)}`;

export const getDurationInMinutes = (
  startTime: string | Date,
  endTime: string | Date,
) =>
  Math.round(
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60),
  );
