import React from 'react';
export { WixMediaImage } from '@wix/headless-media/react';
// eslint-disable-next-line import/named
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import {
  PlanDuration,
  PlanRecurrence,
  PlanServiceConfig,
  PlanServiceDefinition,
} from '../services/PlanService.js';
import {
  Root as CoreRoot,
  Container as CoreContainer,
  ContainerRenderProps,
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
} from './core/Plan.js';
import { WixMediaImage } from '@wix/headless-media/react';
import { Commerce } from '@wix/headless-ecom/react';
import { useService } from '@wix/services-manager-react';

enum PlanTestId {
  Container = 'plan-container',
  Image = 'plan-image',
  Name = 'plan-name',
  Description = 'plan-description',
  Price = 'plan-price',
  AdditionalFees = 'plan-additional-fees',
  AdditionalFeeName = 'plan-additional-fee-name',
  AdditionalFeeAmount = 'plan-additional-fee-amount',
  Recurrence = 'plan-recurrence',
  Duration = 'plan-duration',
}

type WithAsChild<Props, RenderProps> = Props &
  (
    | { asChild?: false; children?: React.ReactNode }
    | { asChild: true; children: AsChildChildren<RenderProps> }
  );

type RootProps = WithAsChild<
  {
    planServiceConfig: PlanServiceConfig;
    loadingState?: React.ReactNode;
    errorState?: React.ReactNode;
    className?: string;
  },
  ContainerRenderProps
>;

export const Root = React.forwardRef<HTMLElement, RootProps>(
  (
    {
      planServiceConfig,
      children,
      asChild,
      className,
      loadingState,
      errorState,
    }: RootProps,
    ref,
  ) => {
    return (
      <CoreRoot planServiceConfig={planServiceConfig}>
        <CoreContainer>
          {(renderProps) => (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={PlanTestId.Container}
              data-is-loading={renderProps.isLoading}
              data-has-error={renderProps.error !== null}
              customElement={children}
              customElementProps={{
                isLoading: renderProps.isLoading,
                error: renderProps.error,
                plan: renderProps.plan,
              }}
            >
              <div>
                {renderProps.isLoading
                  ? loadingState
                  : renderProps.error
                    ? errorState
                    : (children as React.ReactNode)}
              </div>
            </AsChildSlot>
          )}
        </CoreContainer>
      </CoreRoot>
    );
  },
);

type ImageProps = Omit<
  React.ComponentProps<typeof WixMediaImage>,
  'src' | 'media'
>;

// interface ImageProps {
//   asChild?: boolean;
//   children?: AsChildChildren<{ image: string }> | React.ReactNode;
//   className?: string;
// }

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (props, ref) => {
    return (
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
    );
  },
);

interface NameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }> | React.ReactNode;
  className?: string;
}

export const Name = React.forwardRef<HTMLElement, NameProps>(
  ({ children, asChild, className }, ref) => {
    return (
      <CoreName>
        {(renderProps) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={renderProps}
            className={className}
            data-testid={PlanTestId.Name}
          >
            <span>{renderProps.name}</span>
          </AsChildSlot>
        )}
      </CoreName>
    );
  },
);

interface DescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: string }> | React.ReactNode;
  className?: string;
}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ children, asChild, className }, ref) => {
    return (
      <CoreDescription>
        {(renderProps) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={renderProps}
            className={className}
            data-testid={PlanTestId.Description}
          >
            <span>{renderProps.description}</span>
          </AsChildSlot>
        )}
      </CoreDescription>
    );
  },
);

interface PriceProps {
  asChild?: boolean;
  children?:
    | AsChildChildren<{ price: { amount: number; currency: string } }>
    | React.ReactNode;
  className?: string;
}

export const Price = React.forwardRef<HTMLElement, PriceProps>(
  ({ children, asChild, className }, ref) => {
    return (
      <CorePrice>
        {(renderProps) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={renderProps}
            className={className}
            data-testid={PlanTestId.Price}
          >
            {/* TODO: Use a generic price formatting component when available */}
            <span>{renderProps.price.formattedPrice}</span>
          </AsChildSlot>
        )}
      </CorePrice>
    );
  },
);

interface AdditionalFeesProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    additionalFees: {
      name: string;
      amount: number;
      currency: string;
      formattedPrice: string;
    }[];
  }>;
  className?: string;
}

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
          <span>{children as React.ReactNode}</span>
        </AsChildSlot>
      )}
    </CoreAdditionalFees>
  );
});

interface AdditionalFeesRepeaterProps {
  children: React.ReactNode;
}

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

interface AdditionalFeeNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }> | React.ReactNode;
  className?: string;
}

export const AdditionalFeeName = React.forwardRef<
  HTMLElement,
  AdditionalFeeNameProps
>(({ children, asChild, className }, ref) => {
  return (
    <CoreAdditionalFeeName>
      {({ name }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={{ name }}
          className={className}
          data-testid={PlanTestId.AdditionalFeeName}
        >
          <span>{name}</span>
        </AsChildSlot>
      )}
    </CoreAdditionalFeeName>
  );
});

interface AdditionalFeeAmountProps {
  asChild?: boolean;
  children?: AsChildChildren<{ amount: string }> | React.ReactNode;
  className?: string;
}

export const AdditionalFeeAmount = React.forwardRef<
  HTMLElement,
  AdditionalFeeAmountProps
>(({ children, asChild, className }, ref) => {
  return (
    <CoreAdditionalFeeAmount>
      {({ amount }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={{ amount }}
          className={className}
          data-testid={PlanTestId.AdditionalFeeAmount}
        >
          <span>{amount}</span>
        </AsChildSlot>
      )}
    </CoreAdditionalFeeAmount>
  );
});

interface RecurrenceProps {
  // TODO: Is this the correct way to accept children that has to be a component?
  children: React.ForwardRefRenderFunction<
    HTMLElement,
    { recurrence: PlanRecurrence | null }
  >;
}

// TODO: forwardRef seems kind of unnecessary - consumer could just assign ref to the children manually (in which case children shouldn't be forward ref function)
export const Recurrence = React.forwardRef<HTMLElement, RecurrenceProps>(
  ({ children }, ref) => {
    return (
      <CoreRecurrence>
        {({ recurrence }) => children({ recurrence }, ref)}
      </CoreRecurrence>
    );
  },
);

interface DurationProps {
  children: React.ForwardRefRenderFunction<
    HTMLElement,
    { duration: PlanDuration | null }
  >;
}

export const Duration = React.forwardRef<HTMLElement, DurationProps>(
  ({ children }, ref) => {
    return (
      <CoreDuration>
        {({ duration }) => children({ duration }, ref)}
      </CoreDuration>
    );
  },
);

type ActionBuyNowProps = Omit<Commerce.ActionAddToCartProps, 'lineItems'>;

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
      />
    );
  },
);

export const Action = {
  BuyNow: ActionBuyNow,
};
