import { type DateInputProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';
import { useState, useEffect } from 'react';

const DateInput = ({
  id,
  value,
  label,
  showLabel,
  showPlaceholder,
  firstDayOfWeek = 'SUNDAY',
  acceptedDates = 'all',
  required,
  readOnly,
  description,
  onChange,
  onBlur,
  onFocus,
}: DateInputProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  // Parse the initial date value
  const parseDate = (dateString: string | undefined) => {
    if (!dateString) return { day: '', month: '', year: '' };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: '', month: '', year: '' };
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      year: date.getFullYear().toString(),
    };
  };

  const [dateParts, setDateParts] = useState(() =>
    parseDate(value || undefined)
  );

  // Update local state when external value changes
  useEffect(() => {
    setDateParts(parseDate(value || undefined));
  }, [value]);

  // Check if a date is accepted based on acceptedDates prop
  const isDateAccepted = (date: Date) => {
    if (acceptedDates === 'all') return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    if (acceptedDates === 'past') {
      return date < today;
    } else if (acceptedDates === 'future') {
      return date > today;
    }

    return true;
  };

  const handleDateChange = (
    field: 'day' | 'month' | 'year',
    newValue: string
  ) => {
    const updatedParts = { ...dateParts, [field]: newValue };
    setDateParts(updatedParts);

    // Only call onChange if we have all three parts and they form a valid date
    if (updatedParts.day && updatedParts.month && updatedParts.year) {
      const year = parseInt(updatedParts.year);
      const month = parseInt(updatedParts.month) - 1; // JavaScript months are 0-indexed
      const day = parseInt(updatedParts.day);

      const date = new Date(year, month, day);

      const isoString = date.toISOString().split('T')[0];
      onChange(isoString);
    } else if (!updatedParts.day && !updatedParts.month && !updatedParts.year) {
      // All fields are empty, clear the value
      onChange('');
    }
  };

  const handleBlur = () => {
    onBlur();
  };

  const handleFocus = () => {
    onFocus();
  };

  // Get the day of the week for the current date
  const getDayOfWeek = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const dayNames =
      firstDayOfWeek === 'MONDAY'
        ? [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ]
        : [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ];

    return dayNames[date.getDay()];
  };

  const dayOfWeek = getDayOfWeek(value);

  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}
      {dayOfWeek && (
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          {dayOfWeek}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          id={`${id}-day`}
          type="number"
          min="1"
          max="31"
          value={dateParts.day}
          required={required}
          readOnly={readOnly}
          placeholder={showPlaceholder ? 'DD' : undefined}
          aria-label="Day"
          onChange={e => handleDateChange('day', e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{ width: '60px' }}
        />
        <span>/</span>
        <input
          id={`${id}-month`}
          type="number"
          min="1"
          max="12"
          value={dateParts.month}
          required={required}
          readOnly={readOnly}
          placeholder={showPlaceholder ? 'MM' : undefined}
          aria-label="Month"
          onChange={e => handleDateChange('month', e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{ width: '60px' }}
        />
        <span>/</span>
        <input
          id={`${id}-year`}
          type="number"
          min="1900"
          max="2100"
          value={dateParts.year}
          required={required}
          readOnly={readOnly}
          placeholder={showPlaceholder ? 'YYYY' : undefined}
          aria-label="Year"
          onChange={e => handleDateChange('year', e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{ width: '80px' }}
        />
      </div>
      {description && (
        <div id={descriptionId}>
          <RicosViewer
            content={description as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
