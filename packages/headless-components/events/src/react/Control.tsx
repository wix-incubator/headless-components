import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
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
      {/* TODO: check if * should be controlled with prop */}
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

  const [guestCount, setGuestCount] = React.useState<number>(0);

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
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
        data-testid={TestIds.controlField}
      >
        <select id={input.name} name={input.name}>
          {!input.mandatory && <option value="" />}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (control.type === 'TEXTAREA') {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
        data-testid={TestIds.controlField}
      >
        <textarea
          id={input.name}
          name={input.name}
          maxLength={input.maxLength}
          required={input.mandatory}
        />
      </div>
    );
  }

  if (control.type === 'GUEST_CONTROL') {
    const guestCountInput = control.inputs![0]!;
    const guestNamesInput = control.inputs![1]!;

    const guestCountOptions = guestCountInput.options ?? [];
    const singleGuest = guestCountOptions.length === 2;

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
        data-testid={TestIds.controlField}
        data-type="guest-control"
      >
        {singleGuest ? (
          <div data-type="checkbox-option">
            <input
              type="checkbox"
              name={guestCountInput.name}
              id={guestCountInput.name}
              value="1"
              onChange={(event) => setGuestCount(event.target.checked ? 1 : 0)}
            />
            <label htmlFor={guestCountInput.name}>
              {guestCountInput.label}
            </label>
          </div>
        ) : (
          <select
            id={guestCountInput.name}
            name={guestCountInput.name}
            value={guestCount}
            onChange={(event) => setGuestCount(Number(event.target.value))}
          >
            {guestCountOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        {guestNamesInput.mandatory && !!guestCount
          ? Array.from({ length: guestCount }).map((_, index) => (
              <React.Fragment key={index}>
                <label htmlFor={`${guestNamesInput.name}_${index}_firstName`}>
                  {guestNamesInput.additionalLabels?.['firstName'] ?? ''}
                </label>
                <input
                  required
                  type="text"
                  name={`${guestNamesInput.name}_${index}_firstName`}
                  id={`${guestNamesInput.name}_${index}_firstName`}
                  maxLength={guestNamesInput.maxLength}
                />
                <label htmlFor={`${guestNamesInput.name}_${index}_lastName`}>
                  {guestNamesInput.additionalLabels?.['lastName'] ?? ''}
                </label>
                <input
                  required
                  type="text"
                  name={`${guestNamesInput.name}_${index}_lastName`}
                  id={`${guestNamesInput.name}_${index}_lastName`}
                  maxLength={guestNamesInput.maxLength}
                />
              </React.Fragment>
            ))
          : null}
      </div>
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      data-testid={TestIds.controlField}
    >
      <input
        id={input.name}
        name={input.name}
        maxLength={input.maxLength}
        required={input.mandatory}
        type={getInputType(control)}
      />
    </div>
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
