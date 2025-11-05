import { Form } from '@wix/headless-forms/react';
import React from 'react';

export interface PhoneFieldProps {
  id: string;
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

const PhoneFieldRoot = React.forwardRef<HTMLDivElement, PhoneFieldProps>(
  (props, ref) => {
    const { id, children, asChild, className } = props;

    return (
      <Form.Field ref={ref} id={id} asChild={asChild} className={className}>
        {children}
      </Form.Field>
    );
  },
);

PhoneFieldRoot.displayName = 'PhoneField';

export interface PhoneLabelProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  id: string;
  label: string;
  required: boolean;
  showLabel: boolean;
}

const PhoneLabelRoot = React.forwardRef<HTMLDivElement, PhoneLabelProps>(
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

PhoneLabelRoot.displayName = 'PhoneField.Label';

export interface PhoneLabelRequiredProps {
  required?: boolean;
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export const PhoneLabelRequired = React.forwardRef<
  HTMLSpanElement,
  PhoneLabelRequiredProps
>((props, ref) => {
  return <Form.Field.Label.Required ref={ref} {...props} />;
});

PhoneLabelRequired.displayName = 'PhoneField.Label.Required';

interface PhoneLabelComponent
  extends React.ForwardRefExoticComponent<
    PhoneLabelProps & React.RefAttributes<HTMLDivElement>
  > {
  Required: typeof PhoneLabelRequired;
}

export const PhoneLabel = PhoneLabelRoot as PhoneLabelComponent;
PhoneLabel.Required = PhoneLabelRequired;

interface PhoneFieldComponent
  extends React.ForwardRefExoticComponent<
    PhoneFieldProps & React.RefAttributes<HTMLDivElement>
  > {
  Label: typeof PhoneLabel;
}

export const PhoneField = PhoneFieldRoot as PhoneFieldComponent;
PhoneField.Label = PhoneLabel;

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
//     <Form.Field id={id}>
//       {showLabel && (
//         <Form.Field.Label>
//           <label htmlFor={id} className="text-foreground font-paragraph mb-2">
//             {label}
//             {required && <span className="text-destructive ml-1">*</span>}
//           </label>
//         </Form.Field.Label>
//       )}
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
//       </Form.Field.InputWrapper>
//     </Form.Field>
//   );
// };

// export default Phone;
