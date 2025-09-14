import React from 'react';
export { WixMediaImage } from '@wix/headless-media/react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { PlanServiceConfig, PlanServiceDefinition } from '../services/index.js';
import {
  Root as CoreRoot,
  Plan as CorePlan,
  PlanData,
  Image as CoreImage,
  Name as CoreName,
  Description as CoreDescription,
  Price as CorePrice,
  AdditionalFees as CoreAdditionalFees,
  AdditionalFeesRepeater as CoreAdditionalFeesRepeater,
  AdditionalFeeName as CoreAdditionalFeeName,
  AdditionalFeeAmount as CoreAdditionalFeeAmount,
  AdditionalFeeRoot as CoreAdditionalFeeRoot,
  Recurrence as CoreRecurrence,
  Duration as CoreDuration,
  NameData,
  DescriptionData,
  PriceData,
  AdditionalFeesData,
  AdditionalFeeNameData,
  AdditionalFeeAmountData,
  RecurrenceData,
  DurationData,
  Perks as CorePerks,
  PerksData,
  PerksRepeater as CorePerksRepeater,
  PerkItemContext,
  PerkItemData,
  PerkItem as CorePerkItem,
} from './core/Plan.js';
import { WixMediaImage } from '@wix/headless-media/react';
import { Commerce } from '@wix/headless-ecom/react';
import { useService } from '@wix/services-manager-react';

enum PlanTestId {
  Plan = 'plan-plan',
  Image = 'plan-image',
  Name = 'plan-name',
  Description = 'plan-description',
  Price = 'plan-price',
  AdditionalFees = 'plan-additional-fees',
  AdditionalFeeName = 'plan-additional-fee-name',
  AdditionalFeeAmount = 'plan-additional-fee-amount',
  Perks = 'plan-perks',
  PerkItem = 'plan-perk-item',
  ActionBuyNow = 'plan-action-buy-now',
}

interface RootProps {
  planServiceConfig: PlanServiceConfig;
  children: React.ReactNode;
}

/**
 * The root container that provides plan context to child components
 *
 * @component
 * @example
 * ```tsx
 * <Plan.Root planServiceConfig={planServiceConfig}>
 *   <Plan.Plan>
 *     <Plan.Image />
 *     <Plan.Name />
 *     <Plan.Price />
 *     <Plan.AdditionalFees />
 *     <Plan.Recurrence />
 *     <Plan.Duration />
 *     <Plan.Action.BuyNow label="Select Plan" />
 *   </Plan.Plan>
 * </Plan.Root>
 * ```
 */
export const Root = ({ planServiceConfig, children }: RootProps) => (
  <CoreRoot planServiceConfig={planServiceConfig}>{children}</CoreRoot>
);

interface PlanProps {
  asChild?: boolean;
  children: AsChildChildren<PlanData> | React.ReactNode;
  className?: string;
  loadingState?: React.ReactNode;
}

/**
 * Displays the plan data with support for loading state
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.Plan className="flex flex-col gap-4" loadingState={<div>Loading...</div>}>
 *   <Plan.Image />
 *   <Plan.Name />
 * </Plan.Plan>
 *
 * // With asChild
 * <Plan.Plan asChild>
 *   {React.forwardRef(({isLoading, error, plan}, ref) => {
 *     if (isLoading) {
 *       return <div>Loading...</div>;
 *     }
 *     if (error) {
 *       return <div>Error!</div>;
 *     }
 *     return (
 *       <div ref={ref} className="flex flex-col gap-4">
 *         Plan {plan.name}
 *       </div>
 *     );
 *   })}
 * </Plan.Plan>
 *
 */
export const Plan = React.forwardRef<HTMLElement, PlanProps>(
  ({ children, asChild, className, loadingState }, ref) => {
    return (
      <CorePlan>
        {(planData) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={PlanTestId.Plan}
            data-is-loading={planData.isLoading}
            data-has-error={planData.error !== null}
            customElement={children}
            customElementProps={planData}
          >
            <div>
              {planData.isLoading
                ? loadingState
                : (children as React.ReactNode)}
            </div>
          </AsChildSlot>
        )}
      </CorePlan>
    );
  },
);

type ImageProps = Omit<
  React.ComponentProps<typeof WixMediaImage>,
  'src' | 'media'
>;

/**
 * Displays the plan image using WixMediaImage
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.Image className="w-full h-full object-cover" />
 *
 * // asChild with primitive
 * <Plan.Image asChild>
 *   <img className="w-full h-full object-cover" />
 * </Plan.Image>
 *
 * // asChild with react component
 * <Plan.Image asChild>
 *   {React.forwardRef(({src, ...props}, ref) => (
 *     <img ref={ref} {...props} src={src} className="w-full h-full object-cover" />
 *   ))}
 * </Plan.Image>
 * ```
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (props, ref) => (
    <CoreImage>
      {(renderProps) => (
        <WixMediaImage
          {...props}
          ref={ref}
          media={{ image: renderProps.image }}
          data-testid={PlanTestId.Image}
        />
      )}
    </CoreImage>
  ),
);

export type PlanNameData = NameData;

interface NameProps {
  asChild?: boolean;
  children?: AsChildChildren<PlanNameData>;
  className?: string;
}

/**
 * Displays the plan name.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.Name className="text-2xl font-bold" />
 *
 * // asChild with primitive
 * <Plan.Name asChild>
 *   <h1 className="text-2xl font-bold" />
 * </Plan.Name>
 *
 * // asChild with react component
 * <Plan.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h1 ref={ref} {...props} className="text-2xl font-bold">
 *       {name}
 *     </h1>
 *   ))}
 * </Plan.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>(
  ({ children, asChild, className }, ref) => {
    return (
      <CoreName>
        {(nameData) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={nameData}
            className={className}
            data-testid={PlanTestId.Name}
          >
            <span>{nameData.name}</span>
          </AsChildSlot>
        )}
      </CoreName>
    );
  },
);

export type PlanDescriptionData = DescriptionData;

interface DescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<PlanDescriptionData>;
  className?: string;
}

/**
 * Displays the plan description.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.Description className="text-sm" />
 *
 * // asChild with primitive
 * <Plan.Description asChild>
 *   <p className="text-sm" />
 * </Plan.Description>
 *
 * // asChild with react component
 * <Plan.Description asChild>
 *   {React.forwardRef(({description, ...props}, ref) => (
 *     <p ref={ref} {...props} className="text-sm">
 *       {description}
 *     </p>
 *   ))}
 * </Plan.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ children, asChild, className }, ref) => {
    return (
      <CoreDescription>
        {(descriptionData) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={descriptionData}
            className={className}
            data-testid={PlanTestId.Description}
          >
            <span>{descriptionData.description}</span>
          </AsChildSlot>
        )}
      </CoreDescription>
    );
  },
);

export type PlanPriceData = PriceData;

interface PriceProps {
  asChild?: boolean;
  children?: AsChildChildren<PlanPriceData>;
  className?: string;
}

/**
 * Displays the plan price.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.Price className="text-2xl font-bold" />
 *
 * // asChild with primitive
 * <Plan.Price asChild>
 *   <span className="text-2xl font-bold" />
 * </Plan.Price>
 *
 * // asChild with react component
 * <Plan.Price asChild>
 *   {React.forwardRef(({price, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-2xl font-bold">
 *       {price.formattedPrice}
 *       <br />
 *       <br />
 *       {price.amount} {price.currency}
 *     </span>
 *   ))}
 * </Plan.Price>
 * ```
 */
export const Price = React.forwardRef<HTMLElement, PriceProps>(
  ({ children, asChild, className }, ref) => {
    return (
      <CorePrice>
        {(priceData) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={priceData}
            className={className}
            data-testid={PlanTestId.Price}
          >
            {/* TODO: Use a generic price formatting component when available */}
            <span>{priceData.price.formattedPrice}</span>
          </AsChildSlot>
        )}
      </CorePrice>
    );
  },
);

export type PlanAdditionalFeesData = AdditionalFeesData;

interface AdditionalFeesProps {
  asChild?: boolean;
  children: AsChildChildren<PlanAdditionalFeesData>;
  className?: string;
}

/**
 * Container for plan additional fees.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.AdditionalFees className="flex flex-col gap-2">
 *   <Plan.AdditionalFeesRepeater>
 *     <Plan.AdditionalFeeName />
 *     <Plan.AdditionalFeeAmount />
 *   </Plan.AdditionalFeesRepeater>
 * </Plan.AdditionalFees>
 *
 * // asChild with react component
 * <Plan.AdditionalFees asChild>
 *   {React.forwardRef(({additionalFees, ...props}, ref) => (
 *     <div ref={ref} {...props} className="fees-container">
 *       {additionalFees.length > 0 && 'Additional fees apply'}
 *     </div>
 *   ))}
 * </Plan.AdditionalFees>
 * ```
 */
export const AdditionalFees = React.forwardRef<
  HTMLElement,
  AdditionalFeesProps
>(({ children, asChild, className }, ref) => {
  return (
    <CoreAdditionalFees>
      {(renderProps) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={renderProps}
          className={className}
          data-testid={PlanTestId.AdditionalFees}
        >
          <div>{children as React.ReactNode}</div>
        </AsChildSlot>
      )}
    </CoreAdditionalFees>
  );
});

interface AdditionalFeesRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders children for each additional fee with the additional fee context.
 *
 * @component
 * @example
 * ```tsx
 * <Plan.AdditionalFeesRepeater>
 *   <Plan.AdditionalFeeName />
 *   <Plan.AdditionalFeeAmount />
 * </Plan.AdditionalFeesRepeater>
 * ```
 */
export const AdditionalFeesRepeater = ({
  children,
}: AdditionalFeesRepeaterProps) => {
  return (
    <CoreAdditionalFeesRepeater>
      {({ additionalFees }) => (
        <>
          {additionalFees.map((fee, i) => (
            <CoreAdditionalFeeRoot key={i} fee={fee}>
              {children}
            </CoreAdditionalFeeRoot>
          ))}
        </>
      )}
    </CoreAdditionalFeesRepeater>
  );
};

export type PlanAdditionalFeeNameData = AdditionalFeeNameData;

interface AdditionalFeeNameProps {
  asChild?: boolean;
  children?: AsChildChildren<PlanAdditionalFeeNameData>;
  className?: string;
}

/**
 * Displays the additional fee name. Must be used within an AdditionalFeesRepeater.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.AdditionalFeeName className="text-sm" />
 *
 * // asChild with primitive
 * <Plan.AdditionalFeeName asChild>
 *   <span className="text-sm" />
 * </Plan.AdditionalFeeName>
 *
 * // asChild with react component
 * <Plan.AdditionalFeeName asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-sm">
 *       {name}
 *     </span>
 *   ))}
 * </Plan.AdditionalFeeName>
 * ```
 */
export const AdditionalFeeName = React.forwardRef<
  HTMLElement,
  AdditionalFeeNameProps
>(({ children, asChild, className }, ref) => {
  return (
    <CoreAdditionalFeeName>
      {(additionalFeeNameData) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={additionalFeeNameData}
          className={className}
          data-testid={PlanTestId.AdditionalFeeName}
        >
          <span>{additionalFeeNameData.name}</span>
        </AsChildSlot>
      )}
    </CoreAdditionalFeeName>
  );
});

export type PlanAdditionalFeeAmountData = AdditionalFeeAmountData;

interface AdditionalFeeAmountProps {
  asChild?: boolean;
  children?: AsChildChildren<PlanAdditionalFeeAmountData>;
  className?: string;
}

/**
 * Displays the additional fee amount. Must be used within an AdditionalFeesRepeater.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.AdditionalFeeAmount className="text-sm" />
 *
 * // asChild with primitive
 * <Plan.AdditionalFeeAmount asChild>
 *   <span className="text-sm" />
 * </Plan.AdditionalFeeAmount>
 *
 * // asChild with react component
 * <Plan.AdditionalFeeAmount asChild>
 *   {React.forwardRef(({amount, currency, formattedFee, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-sm">
 *       {amount} {currency}
 *       <br />
 *       <br />
 *       {formattedFee}
 *     </span>
 *   ))}
 * </Plan.AdditionalFeeAmount>
 * ```
 */
export const AdditionalFeeAmount = React.forwardRef<
  HTMLElement,
  AdditionalFeeAmountProps
>(({ children, asChild, className }, ref) => {
  return (
    <CoreAdditionalFeeAmount>
      {(additionalFeeAmountData) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={additionalFeeAmountData}
          className={className}
          data-testid={PlanTestId.AdditionalFeeAmount}
        >
          <span>{additionalFeeAmountData.formattedFee}</span>
        </AsChildSlot>
      )}
    </CoreAdditionalFeeAmount>
  );
});

export type PlanRecurrenceData = RecurrenceData;

interface RecurrenceProps {
  children: React.ForwardRefRenderFunction<HTMLElement, PlanRecurrenceData>;
}

/**
 * Provides the child component with the recurrence data. It will be null for one-time plans.
 *
 * @component
 * @example
 * ```tsx
 * <Plan.Recurrence>
 *   {({ recurrence }, ref) => {
 *     if (!recurrence) return null;
 *
 *     return <span ref={ref} className="text-content-secondary" data-testid="plan-recurrence">
 *       Renews every {recurrence.count} {recurrence.period}(s)
 *     </span>
 *   }}
 * </Plan.Recurrence>
 * ```
 * @todo: Decide if forwardRef is necessary here
 * @todo: Decide if there's a better way to design a component that will only work with a provided child component
 */
export const Recurrence = React.forwardRef<HTMLElement, RecurrenceProps>(
  ({ children }, ref) => (
    <CoreRecurrence>
      {({ recurrence }) => children({ recurrence }, ref)}
    </CoreRecurrence>
  ),
);

export type PlanDurationData = DurationData;

interface DurationProps {
  children: React.ForwardRefRenderFunction<HTMLElement, PlanDurationData>;
}

/**
 * Provides the child component with the duration data. It will be null for unlimited plans.
 *
 * @component
 * @example
 * ```tsx
 * <Plan.Duration>
 *   {({ duration }, ref) => {
 *     if (!duration) return <span>Valid until canceled</span>;
 *
 *     return <span ref={ref} className="text-sm" data-testid="plan-duration">
 *       Valid for {duration.count} {duration.period}(s)
 *     </span>
 *   }}
 * </Plan.Duration>
 * ```
 */
export const Duration = React.forwardRef<HTMLElement, DurationProps>(
  ({ children }, ref) => (
    <CoreDuration>{({ duration }) => children({ duration }, ref)}</CoreDuration>
  ),
);

export type PlanPerksData = PerksData;

interface PerksProps {
  asChild?: boolean;
  children: AsChildChildren<PlanPerksData>;
  className?: string;
}

/**
 * Container for plan perks.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.Perks className="flex flex-col gap-2">
 *   <Plan.PerksRepeater>
 *     <Plan.PerkItem className="text-sm" />
 *   </Plan.PerksRepeater>
 * </Plan.Perks>
 *
 * // asChild with react component
 * <Plan.Perks asChild>
 *   {React.forwardRef(({perks, ...props}, ref) => (
 *     <div ref={ref} {...props} className="flex flex-col gap-2">
 *       {perks.map((perk) => <span key={perk}> 🎉 {perk}</span>)}
 *     </div>
 *   ))}
 * </Plan.Perks>
 * ```
 */
export const Perks = React.forwardRef<HTMLElement, PerksProps>(
  ({ children, asChild, className }, ref) => {
    return (
      <CorePerks>
        {(perksData) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={perksData}
            className={className}
            data-testid={PlanTestId.Perks}
          >
            <div>{children as React.ReactNode}</div>
          </AsChildSlot>
        )}
      </CorePerks>
    );
  },
);

interface PerksRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders children for each perk with the perk item context.
 *
 * @component
 * @example
 * ```tsx
 * <Plan.PerksRepeater>
 *   <Plan.PerkItem className="text-sm" />
 * </Plan.PerksRepeater>
 * ```
 */
export const PerksRepeater = ({ children }: PerksRepeaterProps) => {
  return (
    <CorePerksRepeater>
      {(perksData) => (
        <>
          {perksData.perks.map((perk) => (
            <PerkItemContext.Provider value={{ perk: perk }} key={perk}>
              {children}
            </PerkItemContext.Provider>
          ))}
        </>
      )}
    </CorePerksRepeater>
  );
};

export type PlanPerkItemData = PerkItemData;

interface PerkItemProps {
  asChild?: boolean;
  children?: AsChildChildren<PlanPerkItemData>;
  className?: string;
}

/**
 * Displays the perk item. Must be used within a PerksRepeater.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.PerkItem className="text-sm" />
 *
 * // asChild with primitive
 * <Plan.PerkItem asChild>
 *   <span className="text-sm" />
 * </Plan.PerkItem>
 *
 * // asChild with react component
 * <Plan.PerkItem asChild>
 *   {React.forwardRef(({perk, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-sm">
 *       {perk}
 *     </span>
 *   ))}
 * </Plan.PerkItem>
 * ```
 */
export const PerkItem = React.forwardRef<HTMLElement, PerkItemProps>(
  ({ children, asChild, className }, ref) => (
    <CorePerkItem>
      {(perkItemData) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={perkItemData}
          className={className}
          data-testid={PlanTestId.PerkItem}
        >
          <span>{perkItemData.perk}</span>
        </AsChildSlot>
      )}
    </CorePerkItem>
  ),
);

type ActionBuyNowProps = Omit<Commerce.ActionAddToCartProps, 'lineItems'>;

/**
 * @todo: Check that examples work as expected
 * @todo: Perhaps implement with `asChild` for fine tuning for plan purchases?
 *
 * Initiates the plan purchase flow.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Plan.Action.BuyNow className="btn-primary" label="Buy Now" loadingState="Processing..." />
 *
 * // With custom button
 * <Plan.Action.BuyNow className="btn-primary" label="Buy Now" loadingState="Processing..." asChild>
 *   <button>Buy Now</button>
 * </Plan.Action.BuyNow>
 *
 * // With custom button with forwardRef
 * <Plan.Action.BuyNow className="btn-primary" label="Buy Now" loadingState="Processing..." asChild>
 *   {React.forwardRef(({disabled, isLoading, onClick, ...props}, ref) => (
 *     <button ref={ref} {...props} disabled={disabled} onClick={onClick} className="btn-primary">
 *       {isLoading ? 'Processing...' : 'Buy Now'}
 *     </button>
 *   ))}
 * </Plan.Action.BuyNow>
 * ```
 */
const ActionBuyNow = React.forwardRef<HTMLButtonElement, ActionBuyNowProps>(
  (props, ref) => {
    const { planSignal } = useService(PlanServiceDefinition);

    return (
      <Commerce.Actions.BuyNow
        {...props}
        lineItems={[
          {
            quantity: 1,
            catalogReference: {
              // TODO: Move to a constant
              appId: '1522827f-c56c-a5c9-2ac9-00f9e6ae12d3',
              catalogItemId: planSignal.get()!._id!,
              options: {
                type: 'PLAN',
                // TODO: planOptions will be needed once start date or forms can be supported
              },
            },
          },
        ]}
        ref={ref}
        // TODO: Check that this is not overwritten
        data-testid={PlanTestId.ActionBuyNow}
      />
    );
  },
);

export const Action = {
  BuyNow: ActionBuyNow,
};
