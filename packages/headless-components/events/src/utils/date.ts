export const formatCompactDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

export const formatLongDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    day: 'numeric',
    month: 'long',
  });

export const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

export const formatTimeRange = (startTime: Date, endTime: Date) =>
  `${formatTime(startTime)} - ${formatTime(endTime)}`;

export const getDurationInMinutes = (startTime: Date, endTime: Date) =>
  Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
