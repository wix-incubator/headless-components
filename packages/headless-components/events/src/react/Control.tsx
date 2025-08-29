import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React, { HTMLInputTypeAttribute } from 'react';
import {
  FormControlService,
  FormControlServiceDefinition,
  type FormControlServiceConfig,
  type FormControl,
  type FormInput,
} from '../services/form-control-service.js';

enum TestIds {
  controlLabel = 'control-label',
  controlField = 'control-field',
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
  children?: AsChildChildren<{ label: string; required: boolean }>;
  className?: string;
}

export const Label = React.forwardRef<HTMLElement, LabelProps>((props, ref) => {
  const { asChild, children, className } = props;

  const formControlService = useService(FormControlServiceDefinition);
  const control = formControlService.control.get();
  const input = control.inputs![0]!;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.controlLabel}
      customElement={children}
      customElementProps={{ label: input.label, required: input.mandatory }}
      content={input.label}
    >
      <label htmlFor={input.name}>
        {input.label}
        {input.mandatory ? ' *' : ''}
      </label>
    </AsChildSlot>
  );
});

export interface FieldProps {
  asChild?: boolean;
  children?: AsChildChildren<{ control: FormControl; input: FormInput }>;
  className?: string;
}

export const Field = React.forwardRef<HTMLElement, FieldProps>((props, ref) => {
  const { asChild, children, className } = props;

  const formControlService = useService(FormControlServiceDefinition);
  const control = formControlService.control.get();
  const input = control.inputs![0]!;
  const options = input.options ?? [];

  if (asChild) {
    return (
      <AsChildSlot
        asChild
        ref={ref}
        className={className}
        data-testid={TestIds.controlField}
        customElement={children}
        customElementProps={{ control, input }}
      >
        {children}
      </AsChildSlot>
    );
  }

  if (control.type === 'CHECKBOX') {
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const form = e.target.form;

      if (!form) {
        return;
      }

      const checkboxes = form.querySelectorAll<HTMLInputElement>(
        `input[name="${input.name}"]`,
      );
      const anyChecked = Array.from(checkboxes).some(
        (checkbox) => checkbox.checked,
      );

      checkboxes.forEach((checkbox) => (checkbox.required = !anyChecked));
    };

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
        data-testid={TestIds.controlField}
        data-type="checkbox"
      >
        {options.map((option) => (
          <div key={option} data-type="checkbox-option">
            <input
              type="checkbox"
              name={input.name}
              id={`${input.name}-${option}`}
              value={option}
              required={input.mandatory}
              onChange={input.mandatory ? handleCheckboxChange : undefined}
            />
            <label htmlFor={`${input.name}-${option}`}>{option}</label>
          </div>
        ))}
      </div>
    );
  }

  if (control.type === 'RADIO') {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
        data-testid={TestIds.controlField}
        data-type="radio"
      >
        {options.map((option) => (
          <div key={option} data-type="radio-option">
            <input
              type="radio"
              name={input.name}
              id={`${input.name}-${option}`}
              value={option}
              required={input.mandatory}
            />
            <label htmlFor={`${input.name}-${option}`}>{option}</label>
          </div>
        ))}
      </div>
    );
  }

  if (control.type === 'DROPDOWN') {
    return (
      <select
        ref={ref as React.Ref<HTMLSelectElement>}
        className={className}
        data-testid={TestIds.controlField}
        id={input.name}
        name={input.name}
      >
        {!input.mandatory && <option value="" />}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (control.type === 'TEXTAREA') {
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={className}
        data-testid={TestIds.controlField}
        id={input.name}
        name={input.name}
        maxLength={input.maxLength}
        required={input.mandatory}
      />
    );
  }

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      className={className}
      data-testid={TestIds.controlField}
      id={input.name}
      name={input.name}
      maxLength={input.maxLength}
      required={input.mandatory}
      type={getInputType(control)}
    />
  );
});

const getInputType = (control: FormControl) => {
  if (control._id!.includes('email')) {
    return 'email';
  }

  if (control._id!.includes('phone')) {
    return 'tel';
  }

  if (control.type === 'DATE') {
    return 'date';
  }

  return 'text';
};
