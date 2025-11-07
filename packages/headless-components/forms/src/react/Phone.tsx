import React from 'react';
import { Form, PhoneInputProps } from '@wix/headless-forms/react';
// import { useFieldsProps } from './context/FieldsPropsContext.js';
import { useFieldProps } from '@wix/form-public';

export interface PhoneFieldProps {
  id: string;
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

const Root = React.forwardRef<HTMLDivElement, PhoneFieldProps>((props, ref) => {
  const { id, children, asChild, className } = props;
  const fieldProps = useFieldProps<PhoneInputProps>();
  // const fieldProps = fieldsProps[id];
  console.log('fieldProps', fieldProps);

  return (
    // <PhoneFieldContext.Provider value={fieldProps}>
      <Form.Field ref={ref} id={id} asChild={asChild} className={className}>
        <Form.Field.InputWrapper>
          <Form.Field.Input description={'fieldProps?.description'}>
            {children}
          </Form.Field.Input>
        </Form.Field.InputWrapper>
      </Form.Field>
    // </PhoneFieldContext.Provider>
  );
});

Root.displayName = 'PhoneField';

export interface PhoneLabelProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

const LabelRoot = React.forwardRef<HTMLDivElement, PhoneLabelProps>(
  (props, ref) => {
    const { asChild, className, children } = props;
    const { id, label, showLabel } = useFieldProps();

    if (!showLabel) {
      return null;
    }

    return (
      <Form.Field.Label ref={ref} asChild={asChild} className={className}>
        <label htmlFor={id}>
          {label}
          {children}
        </label>
      </Form.Field.Label>
    );
  },
);

LabelRoot.displayName = 'PhoneField.Label';

export interface PhoneLabelRequiredProps {
  required?: boolean;
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export const Required = React.forwardRef<
  HTMLSpanElement,
  PhoneLabelRequiredProps
>((props, ref) => {
  const { required } = useFieldProps();

  return <Form.Field.Label.Required {...props} ref={ref} required={required} />;
});

Required.displayName = 'PhoneField.Label.Required';

interface PhoneLabelComponent
  extends React.ForwardRefExoticComponent<
    PhoneLabelProps & React.RefAttributes<HTMLDivElement>
  > {
  Required: typeof Required;
}

export const Label = LabelRoot as PhoneLabelComponent;
Label.Required = Required;

export interface PhoneErrorProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

const Error = React.forwardRef<HTMLDivElement, PhoneErrorProps>(
  (props, ref) => {
    const { children, ...rest } = props;
    const { error } = useFieldProps();

    return (
      <Form.Field.Error ref={ref} {...rest}>
        {error}
      </Form.Field.Error>
    );
  },
);

Error.displayName = 'PhoneField.Error';

export interface CountryCodeProps {
  asChild?: boolean;
  className?: string;
}

const CountryCode = React.forwardRef<HTMLDivElement, CountryCodeProps>(
  (props, ref) => {
    const { asChild, className, ...rest } = props;
    const {
      id,
      // countryCodes,
      defaultCountryCode,
      readOnly,
      onChange,
      onBlur,
      onFocus,
    } = useFieldProps();

    return (
      <Form.Field.Input
        ref={ref}
        asChild={asChild}
        className={className}
        {...rest}
      >
        <select
          id={`${id}-country`}
          defaultValue={defaultCountryCode || ''}
          disabled={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={() => onBlur?.()}
          onFocus={() => onFocus?.()}
        >
          {/* {countryCodes?.map((code: string) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))} */}
        </select>
      </Form.Field.Input>
    );
  },
);

CountryCode.displayName = 'PhoneField.CountryCode';

export interface PhoneFieldInputProps {
  asChild?: boolean;
  className?: string;
}

const Input = React.forwardRef<HTMLDivElement, PhoneFieldInputProps>(
  (props, ref) => {
    const { asChild, className, ...rest } = props;
    const {
      id,
      value,
      required,
      readOnly,
      placeholder,
      onChange,
      onBlur,
      onFocus,
      description,
    } = useFieldProps();

    const descriptionId = description ? `${id}-description` : undefined;

    return (
      <Form.Field.Input
        ref={ref}
        asChild={asChild}
        className={className}
        {...rest}
      >
        <input
          id={id}
          type="tel"
          value={value || ''}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-describedby={descriptionId}
          aria-invalid={!!(required && !value)}
          aria-required={required}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={() => onBlur?.()}
          onFocus={() => onFocus?.()}
        />
      </Form.Field.Input>
    );
  },
);

Input.displayName = 'PhoneField.Input';

interface PhoneFieldComponent
  extends React.ForwardRefExoticComponent<
    PhoneFieldProps & React.RefAttributes<HTMLDivElement>
  > {
  Label: typeof Label;
  Error: typeof Error;
  Input: typeof Input;
  CountryCode: typeof CountryCode;
}

export const PhoneField = Root as PhoneFieldComponent;
PhoneField.Label = Label;
PhoneField.Error = Error;
PhoneField.Input = Input;
PhoneField.CountryCode = CountryCode;
