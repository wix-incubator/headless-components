import React from 'react';
export { WixMediaImage } from '@wix/headless-media/react';
// eslint-disable-next-line import/named
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import {
  PlanDuration,
  PlanRecurrence,
  PlanServiceConfig,
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

interface RootProps {
  planServiceConfig: PlanServiceConfig;
  children: React.ReactNode;
}

export function Root({ planServiceConfig, children }: RootProps) {
  return <CoreRoot planServiceConfig={planServiceConfig}>{children}</CoreRoot>;
}

interface ContainerProps {
  asChild?: boolean;
  children?: AsChildChildren<ContainerRenderProps>;
  loadingState?: React.ReactNode;
  errorState?: React.ReactNode;
  className?: string;
}

export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ children, loadingState, errorState, className }, ref) => {
    return (
      <CoreContainer>
        {(renderProps) => (
          <AsChildSlot
            ref={ref}
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
              <ContainerContent
                {...renderProps}
                loadingState={loadingState}
                // TODO: Pass error data to the error state
                errorState={errorState}
              >
                {children}
              </ContainerContent>
            </div>
          </AsChildSlot>
        )}
      </CoreContainer>
    );
  },
);

function ContainerContent(
  props: ContainerRenderProps &
    Pick<ContainerProps, 'loadingState' | 'errorState' | 'children'>,
) {
  if (props.isLoading) {
    return <>{props.loadingState}</>;
  }

  if (props.error) {
    return <>props.errorState</>;
  }

  return <>{props.children as React.ReactNode}</>;
}

interface ImageProps {
  asChild?: boolean;
  children?: AsChildChildren<{ image: string }>;
  className?: string;
}

export const Image = React.forwardRef<HTMLElement, ImageProps>(
  ({ children, asChild, className }, ref) => {
    return (
      <CoreImage>
        {(renderProps) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={renderProps}
            className={className}
            data-testid={PlanTestId.Image}
          >
            <WixMediaImage media={{ image: renderProps.image }} />
          </AsChildSlot>
        )}
      </CoreImage>
    );
  },
);

interface NameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
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
  children?: AsChildChildren<{ description: string }>;
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
  children?: AsChildChildren<{ price: { amount: number; currency: string } }>;
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
  children?: AsChildChildren<{ name: string }>;
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
  children?: AsChildChildren<{ amount: string }>;
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
