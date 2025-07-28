import React, { useState, useEffect } from 'react';

interface DualRangeSliderProps {
  sliderMinValue: number;
  sliderMaxValue: number;
  userFilterMinPrice: number;
  userFilterMaxPrice: number;
  setUserFilterMinPrice: (price: number) => void;
  setUserFilterMaxPrice: (price: number) => void;
  debounceMs?: number; // Debounce delay in milliseconds
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  sliderMinValue,
  sliderMaxValue,
  userFilterMinPrice,
  userFilterMaxPrice,
  setUserFilterMinPrice,
  setUserFilterMaxPrice,
  debounceMs = 300,
}) => {
  // Local state for immediate UI updates
  const [localMinPrice, setLocalMinPrice] = useState(userFilterMinPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(userFilterMaxPrice);

  // Update local state when props change (e.g., from external reset)
  useEffect(() => {
    setLocalMinPrice(userFilterMinPrice);
  }, [userFilterMinPrice]);

  useEffect(() => {
    setLocalMaxPrice(userFilterMaxPrice);
  }, [userFilterMaxPrice]);

  // Debounced effect for min price
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localMinPrice !== userFilterMinPrice) {
        setUserFilterMinPrice(localMinPrice);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localMinPrice, debounceMs, setUserFilterMinPrice, userFilterMinPrice]);

  // Debounced effect for max price
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localMaxPrice !== userFilterMaxPrice) {
        setUserFilterMaxPrice(localMaxPrice);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localMaxPrice, debounceMs, setUserFilterMaxPrice, userFilterMaxPrice]);
  return (
    <div>
      <div className="space-y-4">
        {/* Dual Range Slider */}
        <div className="relative h-6">
          <div className="absolute top-2 left-0 right-0 h-2 bg-brand-medium rounded-full">
            <div
              className="absolute h-2 rounded-full bg-gradient-primary"
              style={{
                left: `${
                  ((localMinPrice - sliderMinValue) /
                    (sliderMaxValue - sliderMinValue)) *
                  100
                }%`,
                width: `${
                  ((localMaxPrice - sliderMinValue) /
                    (sliderMaxValue - sliderMinValue)) *
                    100 -
                  ((localMinPrice - sliderMinValue) /
                    (sliderMaxValue - sliderMinValue)) *
                    100
                }%`,
              }}
            />
          </div>

          {/* Min Range Input */}
          <input
            type="range"
            min={sliderMinValue}
            max={sliderMaxValue}
            value={localMinPrice}
            onChange={e => setLocalMinPrice(Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-6 bg-transparent appearance-none cursor-pointer range-slider range-slider-min"
            style={{
              zIndex:
                localMinPrice >
                sliderMinValue + (sliderMaxValue - sliderMinValue) * 0.5
                  ? 2
                  : 1,
            }}
          />

          {/* Max Range Input */}
          <input
            type="range"
            min={sliderMinValue}
            max={sliderMaxValue}
            value={localMaxPrice}
            onChange={e => setLocalMaxPrice(Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-6 bg-transparent appearance-none cursor-pointer range-slider range-slider-max"
            style={{
              zIndex:
                localMaxPrice <
                sliderMinValue + (sliderMaxValue - sliderMinValue) * 0.5
                  ? 2
                  : 1,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DualRangeSlider;
