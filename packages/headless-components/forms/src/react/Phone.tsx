import { Form } from '@wix/headless-forms/react';
import React from 'react';

export interface PhoneFieldProps {
  id: string;
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  description?: React.ReactNode;
}

const Root = React.forwardRef<HTMLDivElement, PhoneFieldProps>((props, ref) => {
  const { id, children, asChild, className, description } = props;

  return (
    <Form.Field ref={ref} id={id} asChild={asChild} className={className}>
      <Form.Field.InputWrapper>
        <Form.Field.Input description={description}>
          {children}
        </Form.Field.Input>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
});

Root.displayName = 'PhoneField';

export interface PhoneLabelProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  id: string;
  label: string;
  required: boolean;
  showLabel: boolean;
}

const LabelRoot = React.forwardRef<HTMLDivElement, PhoneLabelProps>(
  (props, ref) => {
    const { id, label, required, showLabel, asChild, className } = props;

    if (!showLabel) {
      return null;
    }

    return (
      <Form.Field.Label ref={ref} asChild={asChild} className={className}>
        <label htmlFor={id}>
          {label}
          <Form.Field.Label.Required required={required} />
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
  return <Form.Field.Label.Required ref={ref} {...props} />;
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
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

const Error = React.forwardRef<HTMLDivElement, PhoneErrorProps>(
  (props, ref) => {
    return <Form.Field.Error ref={ref} {...props} />;
  },
);

Error.displayName = 'PhoneField.Error';

export interface CountryCodeProps {
  asChild?: boolean;
  className?: string;
  id: string;
  value: string | null | undefined;
  required: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  allowedCountryCodes: string[];
  defaultCountryCode: string | null | undefined;
  readOnly: boolean;
}

const CountryCode = React.forwardRef<HTMLDivElement, CountryCodeProps>(
  (
    {
      id,
      value,
      required,
      onChange,
      onBlur,
      onFocus,
      allowedCountryCodes,
      defaultCountryCode,
      readOnly,
      ...rest
    },
    ref,
  ) => {
    return (
      <Form.Field.Input ref={ref} {...rest} asChild>
        <select
          id={`${id}-country`}
          defaultValue={defaultCountryCode || ''}
          disabled={readOnly}
        >
          {allowedCountryCodes?.map((code: string) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </Form.Field.Input>
    );
  },
);

CountryCode.displayName = 'PhoneField.CountryCode';

export interface PhoneFieldInputProps {
  asChild?: boolean;
  className?: string;
  id: string;
  value: string | null | undefined;
  required: boolean;
  readOnly: boolean;
  placeholder?: string;
  descriptionId?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
}

const Input = React.forwardRef<HTMLDivElement, PhoneFieldInputProps>(
  (
    {
      id,
      value,
      required,
      readOnly,
      placeholder,
      descriptionId,
      onChange,
      onBlur,
      onFocus,
      ...rest
    },
    ref,
  ) => {
    return (
      <Form.Field.Input ref={ref} {...rest} asChild>
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
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
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

// const Phone = ({
//   id,
//   value,
//   label,
//   showLabel,
//   placeholder,
//   description,
//   required,
//   readOnly,
//   allowedCountryCodes,
//   defaultCountryCode,
//   onChange,
//   onBlur,
//   onFocus,
//   error,
// }: PhoneInputProps) => {
//   const descriptionId = description ? `${id}-description` : undefined;

//   return (
//       <Form.Field.InputWrapper>
//         <Form.Field.Input
//           description={
//             description ? (
//               <div
//                 id={descriptionId}
//                 className="mt-2 text-foreground/70 text-sm"
//               >
//                 <RicosViewer
//                   content={description as RichContent}
//                   plugins={quickStartViewerPlugins()}
//                 />
//               </div>
//             ) : undefined
//           }
//         >
//           <div className="flex gap-2">
//             <select
//               id={`${id}-country`}
//               defaultValue={defaultCountryCode}
//               disabled={readOnly}
//               className="px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {allowedCountryCodes?.map((code: string) => (
//                 <option key={code} value={code}>
//                   {code}
//                 </option>
//               ))}
//             </select>
//             <input
//               id={id}
//               type="tel"
//               value={value || ''}
//               required={required}
//               readOnly={readOnly}
//               placeholder={placeholder}
//               aria-describedby={descriptionId}
//               aria-invalid={!!(required && !value)}
//               aria-required={required}
//               onChange={e => onChange(e.target.value)}
//               onBlur={() => onBlur()}
//               onFocus={() => onFocus()}
//               className="flex-1 px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
//             />
//           </div>
//         </Form.Field.Input>
//         <Form.Field.Error className="text-destructive text-sm font-paragraph">
//           {error}
//         </Form.Field.Error>
//   );
// };

// export default Phone;
