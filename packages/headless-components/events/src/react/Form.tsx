import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  EventService,
  EventServiceDefinition,
  type EventServiceConfig,
} from '../services/index.js';
import * as Control from './Control.js';

enum TestIds {
  formControls = 'form-controls',
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

  return (
    <>
      {event.form!.controls!.map((control) => (
        <Control.Root key={control._id} control={control}>
          {children}
        </Control.Root>
      ))}
    </>
  );
};
