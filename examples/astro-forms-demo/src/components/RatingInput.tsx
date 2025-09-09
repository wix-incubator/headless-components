import { type RatingInputProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';
import { useState } from 'react';

const RatingInput = ({
  id,
  value,
  defaultValue,
  label,
  showLabel,
  description,
  required,
  readOnly,
  onChange,
  onBlur,
  onFocus,
}: RatingInputProps) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const descriptionId = description ? `${id}-description` : undefined;

  const currentRating = hoveredRating || value || defaultValue || 0;
  const totalRatings = 5; // Fixed 5-star rating

  const handleRatingClick = (rating: number) => {
    if (readOnly) return;
    onChange(rating);
    onBlur();
  };

  const isInvalid = required && !value;

  const handleMouseEnter = (rating: number) => {
    if (readOnly) return;
    setHoveredRating(rating);
    onFocus();
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoveredRating(null);
  };

  const getRatingIcon = (rating: number) => {
    const isActive = rating <= currentRating;

    return (
      <span
        style={{
          fontSize: '24px',
          color: isActive ? '#ffc107' : isInvalid ? '#ff6b6b' : '#ddd',
          cursor: readOnly ? 'default' : 'pointer',
          transition: 'color 0.2s ease',
        }}
      >
        ★
      </span>
    );
  };

  const getRatingLabel = (rating: number) => {
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    const index = rating - 1; // Convert 1-5 to 0-4 array index
    return labels[index] || `${rating}`;
  };

  return (
    <div>
      {showLabel && (
        <label htmlFor={id}>
          {label}
          {required && (
            <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: '4px',
        }}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: totalRatings }, (_, index) => {
          const rating = index + 1; // 1-5 range
          return (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: readOnly ? 'default' : 'pointer',
              }}
              aria-label={`Rate ${rating} out of 5`}
              aria-pressed={value === rating}
              disabled={readOnly}
            >
              {getRatingIcon(rating)}
            </button>
          );
        })}

        {currentRating > 0 && (
          <span
            style={{
              marginLeft: '8px',
              fontSize: '14px',
              color: '#666',
              fontWeight: '500',
            }}
          >
            {getRatingLabel(currentRating)}
          </span>
        )}
      </div>

      {description && (
        <div id={descriptionId} style={{ marginTop: '8px' }}>
          <RicosViewer
            content={description as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      )}
    </div>
  );
};

export default RatingInput;
