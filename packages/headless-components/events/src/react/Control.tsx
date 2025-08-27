import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  FormControlService,
  FormControlServiceDefinition,
  type FormControlServiceConfig,
  type FormControl,
} from '../services/form-control-service.js';

enum TestIds {
  controlLabel = 'control-label',
}

export interface RootProps {
  control: FormControl;
  children: React.ReactNode;
}

export const Root = (props: RootProps): React.ReactNode => {
  const { control, children } = props;

  const formControlServiceConfig: FormControlServiceConfig = {
    control,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        FormControlServiceDefinition,
        FormControlService,
        formControlServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
};

export interface LabelProps {
  asChild?: boolean;
  children?: AsChildChildren<{ label: string }>;
  className?: string;
}

export const Label = React.forwardRef<HTMLElement, LabelProps>((props, ref) => {
  const { asChild, children, className } = props;

  const service = useService(FormControlServiceDefinition);
  const control = service.control.get();
  const label = control.inputs![0]!.label!;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.controlLabel}
      customElement={children}
      customElementProps={{ label }}
      content={label}
    >
      <span>{label}</span>
    </AsChildSlot>
  );
});
