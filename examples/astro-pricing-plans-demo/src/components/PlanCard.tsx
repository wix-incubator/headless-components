import React from 'react';
import { WixMediaImage } from '@wix/headless-media/react';
import type { PlanData } from '../utils/types';

interface PlanCardProps {
  planData: PlanData;
  isPopular?: boolean;
  onSelectPlan?: (planId: string) => void;
  buttonText?: string;
  showButton?: boolean;
  className?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
  planData,
  isPopular = false,
  onSelectPlan,
  buttonText = 'Select Plan',
  showButton = true,
  className = '',
}) => {
  const handleSelectPlan = () => {
    if (onSelectPlan && planData.id) {
      onSelectPlan(planData.id);
    }
  };

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isPopular
          ? 'ring-2 ring-blue-500/20 border-blue-200 lg:scale-105'
          : 'hover:border-gray-300'
      } ${className}`}
    >
      {planData.image && (
        <div className="mb-5 -mx-6 -mt-6">
          <WixMediaImage
            media={{ image: planData.image }}
            className="w-full h-32 object-cover object-center rounded-t-2xl"
          />
        </div>
      )}

      {isPopular && (
        <div className="bg-blue-500 text-white text-center py-1.5 px-3 rounded-lg mb-4 text-sm font-medium">
          Most Popular
        </div>
      )}

      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{planData.name}</h3>

        {planData.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {planData.description}
          </p>
        )}

        <div className="py-3">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {planData.currency}
              {planData.price}
            </span>
            {planData.recurrence && (
              <span className="text-sm text-gray-500">
                /{planData.recurrence.cycleDuration.count}
                {planData.recurrence.cycleDuration.period.toLowerCase()}
              </span>
            )}
          </div>
        </div>

        {/* Plan Details */}
        {planData.perks.length > 0 && (
          <div className="space-y-2 py-2">
            {planData.perks.map((detail, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-sm text-gray-600"
              >
                <svg
                  className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {detail}
              </div>
            ))}
          </div>
        )}
      </div>

      {showButton && (
        <button
          id={`plan-button-${planData.id}`}
          onClick={handleSelectPlan}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
            isPopular
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
              : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
          }`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default PlanCard;
