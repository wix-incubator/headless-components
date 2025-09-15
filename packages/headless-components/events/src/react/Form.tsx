import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  EventService,
  EventServiceDefinition,
  type EventServiceConfig,
} from '../services/event-service.js';
import {
  FormService,
  FormServiceDefinition,
  type FormServiceConfig,
} from '../services/form-service.js';
import { flattenFormControls } from '../utils/form.js';
import * as Control from './Control.js';

enum TestIds {
  formControls = 'form-controls',
  formSubmit = 'form-submit',
  formError = 'form-error',
}

export interface RootProps {
  eventServiceConfig: EventServiceConfig;
  formServiceConfig: FormServiceConfig;
  children: React.ReactNode;
}

export const Root = (props: RootProps): React.ReactNode => {
  const { eventServiceConfig, formServiceConfig, children } = props;

  return (
    <WixServices
      servicesMap={createServicesMap()
        .addService(EventServiceDefinition, EventService, eventServiceConfig)
        .addService(FormServiceDefinition, FormService, formServiceConfig)}
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

    const eventService = useService(EventServiceDefinition);
    const formService = useService(FormServiceDefinition);
    const event = eventService.event.get();
    const hasControls = !!event.form?.controls?.length;

    if (!hasControls) {
      return null;
    }

    const attributes = {
      className,
      'data-testid': TestIds.formControls,
      onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formService.submit(new FormData(e.currentTarget));
      },
    };

    return (
      <form {...attributes} ref={ref as React.Ref<HTMLFormElement>}>
        {children}
      </form>
    );
  },
);

export interface ControlRepeaterProps {
  children: React.ReactNode;
}

export const ControlRepeater = (props: ControlRepeaterProps) => {
  const { children } = props;

  const eventService = useService(EventServiceDefinition);
  const event = eventService.event.get();
  const hasControls = !!event.form?.controls?.length;

  if (!hasControls) {
    return null;
  }

  const controls = flattenFormControls(event.form!.controls!);

  return (
    <>
      {controls.map((control, index) => (
        <Control.Root key={index} control={control}>
          {children}
        </Control.Root>
      ))}
    </>
  );
};

export interface SubmitTriggerProps {
  asChild?: boolean;
  children?: AsChildChildren<{ isSubmitting: boolean }>;
  className?: string;
  label?: string;
}

export const SubmitTrigger = React.forwardRef<HTMLElement, SubmitTriggerProps>(
  (props, ref) => {
    const { asChild, children, className, label } = props;

    const formService = useService(FormServiceDefinition);
    const isSubmitting = formService.isSubmitting.get();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.formSubmit}
        customElement={children}
        customElementProps={{ isSubmitting }}
        disabled={isSubmitting}
        type="submit"
      >
        <button>{label}</button>
      </AsChildSlot>
    );
  },
);

export interface ErrorProps {
  asChild?: boolean;
  children?: AsChildChildren<{ error: string }>;
  className?: string;
}

export const Error = React.forwardRef<HTMLElement, ErrorProps>((props, ref) => {
  const { asChild, children, className } = props;

  const formService = useService(FormServiceDefinition);
  const error = formService.error.get();

  if (!error) {
    return null;
  }

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.formError}
      customElement={children}
      customElementProps={{ error }}
      content={error}
    >
      <span>{error}</span>
    </AsChildSlot>
  );
});
