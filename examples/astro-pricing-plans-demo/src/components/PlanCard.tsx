import React from 'react';
import { PricingPlans } from '@wix/headless-pricing-plans/react';
import type { PlanServiceConfig } from '@wix/headless-pricing-plans/services';

interface PlanCardContentProps {
  isPopular?: boolean;
  buttonText?: string;
  showButton?: boolean;
}

export const PlanCardContent: React.FC<PlanCardContentProps> = ({
  isPopular = false,
  buttonText = 'Select Plan',
  showButton = true,
}) => {
  const { Plan } = PricingPlans;

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isPopular
          ? 'ring-2 ring-blue-500/20 border-blue-200 lg:scale-105'
          : 'hover:border-gray-300'
      }`}
    >
      <div className="mb-5 -mx-6 -mt-6">
        <Plan.Image className="w-full h-32 object-cover object-center rounded-t-2xl" />
      </div>

      {isPopular && (
        <div className="bg-blue-500 text-white text-center py-1.5 px-3 rounded-lg mb-4 text-sm font-medium">
          Most Popular
        </div>
      )}

      <div className="text-center space-y-4">
        <Plan.Name asChild>
          <h3 className="text-xl font-semibold text-gray-900" />
        </Plan.Name>

        <Plan.Description asChild>
          <p className="text-gray-600 text-sm leading-relaxed" />
        </Plan.Description>

        <div className="py-3">
          <div className="flex items-baseline justify-center gap-1">
            <Plan.Price className="text-2xl font-bold text-gray-900" />
            <Plan.Recurrence>
              {({ recurrence }, ref) => {
                if (!recurrence) return null;

                const periodText = recurrence.period.toLowerCase();
                const displayText =
                  recurrence.count === 1
                    ? ` / ${periodText}`
                    : ` every ${recurrence.count} ${periodText}s`;

                return (
                  <span ref={ref} className="text-sm text-gray-500">
                    {displayText}
                  </span>
                );
              }}
            </Plan.Recurrence>
          </div>
        </div>

        <Plan.Perks className="space-y-2 py-2">
          <Plan.PerksRepeater>
            <div className="flex items-center justify-center text-sm text-gray-600">
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
              <Plan.PerkItem />
            </div>
          </Plan.PerksRepeater>
        </Plan.Perks>
      </div>

      {showButton && (
        <Plan.Action.BuyNow
          className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
            isPopular
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
          }`}
          label={buttonText}
          loadingState={
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Processing...</span>
            </div>
          }
        />
      )}
    </div>
  );
};

interface PlanCardProps extends PlanCardContentProps {
  planServiceConfig: PlanServiceConfig;
  loadingState?: React.ReactNode;
  className?: string;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  planServiceConfig,
  isPopular = false,
  buttonText = 'Select Plan',
  showButton = true,
  className = '',
  loadingState = <div>Loading...</div>,
}) => {
  const { Plan } = PricingPlans;

  return (
    <Plan.Root planServiceConfig={planServiceConfig}>
      <Plan.Plan loadingState={loadingState} className={className}>
        <PlanCardContent
          isPopular={isPopular}
          buttonText={buttonText}
          showButton={showButton}
        />
      </Plan.Plan>
    </Plan.Root>
  );
};
