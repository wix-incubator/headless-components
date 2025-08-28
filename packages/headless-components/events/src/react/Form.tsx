import { AsChildSlot } from '@wix/headless-utils/react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  EventService,
  EventServiceDefinition,
  type EventServiceConfig,
} from '../services/event-service.js';
import * as Control from './Control.js';

enum TestIds {
  formControls = 'form-controls',
  formSubmit = 'form-submit',
}

export interface RootProps {
  eventServiceConfig: EventServiceConfig;
  children: React.ReactNode;
}

export const Root = (props: RootProps): React.ReactNode => {
  const { eventServiceConfig, children } = props;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        EventServiceDefinition,
        EventService,
        eventServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
};

export interface ControlsProps {
  children: React.ReactNode;
  className?: string;
}

export const Controls = React.forwardRef<HTMLElement, ControlsProps>(
  (props, ref) => {
    const { children, className } = props;

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const hasControls = !!event.form?.controls?.length;

    if (!hasControls) {
      return null;
    }

    const attributes = {
      className,
      'data-testid': TestIds.formControls,
    };

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {children}
      </div>
    );
  },
);

export interface ControlRepeaterProps {
  children: React.ReactNode;
}

export const ControlRepeater = (props: ControlRepeaterProps) => {
  const { children } = props;

  const service = useService(EventServiceDefinition);
  const event = service.event.get();
  const hasControls = !!event.form?.controls?.length;

  if (!hasControls) {
    return null;
  }

  const controls = event.form!.controls!.flatMap((control) =>
    control.inputs!.flatMap((input) => {
      const labels = input.labels?.length
        ? input.labels
        : [{ name: input.name, label: input.label }];

      return labels.map((label) => ({
        ...control,
        inputs: [{ ...input, ...label }],
      }));
    }),
  );

  return (
    <>
      {controls.map((control, index) => (
        // TODO: use correct key
        <Control.Root key={index} control={control}>
          {children}
        </Control.Root>
      ))}
    </>
  );
};

export interface SubmitTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SubmitTrigger = React.forwardRef<HTMLElement, SubmitTriggerProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.formSubmit}
        customElement={children}
        // disabled={isSubmitting}
        onClick={() => console.log('submit')}
      >
        <button>{children}</button>
      </AsChildSlot>
    );
  },
);
