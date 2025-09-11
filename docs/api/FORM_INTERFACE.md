# Form Interface Documentation

A comprehensive form component system built with composable primitives, similar to Radix UI architecture. The Form component provides a headless, flexible way to render and manage forms with custom field components.

## Architecture

The Form component follows a compound component pattern where each part can be composed together to create flexible form experiences. It uses a service-based architecture to manage form state and provides a field mapping system for custom field renderers.

## Components

### Form.Root

The root container that provides form service context to all child components. This component sets up the Form service and provides context to child components.

**Props**

```tsx
interface RootProps {
  children: React.ReactNode;
  /** Form service configuration */
  formServiceConfig: FormServiceConfig;
  /** CSS classes to apply to the root element */
  className?: string;
}
```

**Example**

```tsx
<Form.Root formServiceConfig={formServiceConfig}>
  {/* All form components */}
</Form.Root>
```

### Form.LoadingError

Component that renders content when there's an error loading the form. Only displays its children when an error has occurred. Provides error data to custom render functions.

**Props**

```tsx
import { AsChildChildren } from '@wix/headless-utils/react';

interface LoadingErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display during error state (can be a render function or ReactNode) */
  children?: AsChildChildren<LoadingErrorRenderProps>;
  /** CSS classes to apply to the default element */
  className?: string;
}

interface LoadingErrorRenderProps {
  /** Error message */
  error: string | null;
  /** Whether there's an error */
  hasError: boolean;
}
```

**Example**

```tsx
// Default usage
<Form.LoadingError className="error-message" />

// Custom rendering with forwardRef
<Form.LoadingError asChild>
  {React.forwardRef(({ error, hasError }, ref) => (
    <div
      ref={ref}
      className="custom-error-container"
    >
      <h3>Error loading form</h3>
      <p>{error}</p>
    </div>
  ))}
</Form.LoadingError>
```

### Form.Submitted

Component that renders content after successful form submission. Only displays its children when the form has been successfully submitted. Provides submission data to custom render functions.

**Props**

```tsx
import { AsChildChildren } from '@wix/headless-utils/react';

interface SubmittedProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display after successful submission (can be a render function or ReactNode) */
  children?: AsChildChildren<SubmittedRenderProps>;
  /** CSS classes to apply to the default element */
  className?: string;
}

interface SubmittedRenderProps {
  /** Whether the form has been submitted */
  isSubmitted: boolean;
}
```

**Example**

```tsx
// Default usage
<Form.Submitted className="bg-background border-foreground text-foreground p-6 rounded-lg" />

// Custom rendering with forwardRef
<Form.Submitted asChild>
  {React.forwardRef(({ isSubmitted }, ref) => (
    <div
      ref={ref}
      className="custom-success-container"
    >
      <h2>Thank You!</h2>
      <p>Your form has been submitted successfully.</p>
    </div>
  ))}
</Form.Submitted>
```

### Form.Error

Component that renders content when there's an error during form submission. Only displays its children when a submission error has occurred. Provides error data to custom render functions.

**Props**

```tsx
import { AsChildChildren } from '@wix/headless-utils/react';

interface ErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display during submit error state (can be a render function or ReactNode) */
  children?: AsChildChildren<ErrorRenderProps>;
  /** CSS classes to apply to the default element */
  className?: string;
}

interface ErrorRenderProps {
  /** Error message */
  error: string | null;
  /** Whether there's an error */
  hasError: boolean;
}
```

**Example**

```tsx
// Default usage
<Form.Error className="error-message" />

// Custom rendering with forwardRef
<Form.Error asChild>
  {React.forwardRef(({ error, hasError }, ref) => (
    <div
      ref={ref}
      className="custom-error-container"
    >
      <h3>Submission Failed</h3>
      <p>{error}</p>
    </div>
  ))}
</Form.Error>
```

### Form.Fields

Fields component for rendering a form with custom field renderers. This component handles the rendering of form fields based on the provided fieldMap and displays them in the configured form grid layout.

**Props**

```tsx
interface FieldsProps {
  fieldMap: FieldMap;
}
```

**Behavior**

The Fields component:

- Renders form fields in the order and layout defined by the form configuration
- Maps each field type to its corresponding React component using the provided fieldMap
- Handles form validation

**Example**

```tsx
<Form.Fields fieldMap={FIELD_MAP} />
```

## Field Mapping System

The Form component uses a field mapping system that allows you to specify which React component should be used to render each type of form field. This provides complete flexibility in how form fields are rendered.

### FieldMap Interface

```tsx
interface FieldMap {
  TEXT_INPUT: React.ComponentType<TextInputProps>;
  TEXT_AREA: React.ComponentType<TextAreaProps>;
  PHONE_INPUT: React.ComponentType<PhoneInputProps>;
  MULTILINE_ADDRESS: React.ComponentType<MultilineAddressProps>;
  DATE_INPUT: React.ComponentType<DateInputProps>;
  DATE_PICKER: React.ComponentType<DatePickerProps>;
  DATE_TIME_INPUT: React.ComponentType<DateTimeInputProps>;
  FILE_UPLOAD: React.ComponentType<FileUploadProps>;
  NUMBER_INPUT: React.ComponentType<NumberInputProps>;
  CHECKBOX: React.ComponentType<CheckboxProps>;
  SIGNATURE: React.ComponentType<SignatureProps>;
  RATING_INPUT: React.ComponentType<RatingInputProps>;
  RADIO_GROUP: React.ComponentType<RadioGroupProps>;
  CHECKBOX_GROUP: React.ComponentType<CheckboxGroupProps>;
  DROPDOWN: React.ComponentType<DropdownProps>;
  TAGS: React.ComponentType<TagsProps>;
  TIME_INPUT: React.ComponentType<TimeInputProps>;
  TEXT: React.ComponentType<RichTextProps>;
  SUBMIT_BUTTON: React.ComponentType<SubmitButtonProps>;
  PRODUCT_LIST: React.ComponentType<ProductListProps>;
  FIXED_PAYMENT: React.ComponentType<FixedPaymentProps>;
  PAYMENT_INPUT: React.ComponentType<PaymentInputProps>;
  DONATION: React.ComponentType<DonationProps>;
  APPOINTMENT: React.ComponentType<AppointmentProps>;
  IMAGE_CHOICE: React.ComponentType<ImageChoiceProps>;
}
```

## Supported Field Types

The Form component supports a comprehensive set of field types:

### Text Input Fields

- **TEXT_INPUT**: Single-line text input
- **TEXT_AREA**: Multi-line text input
- **NUMBER_INPUT**: Numerical input
- **PHONE_INPUT**: Phone number input with country code support
- **MULTILINE_ADDRESS**: Complex address input with multiple fields

### Date and Time Fields

- **DATE_INPUT**: Date input with separate day/month/year fields
- **DATE_PICKER**: Calendar-based date selection
- **DATE_TIME_INPUT**: Combined date and time input
- **TIME_INPUT**: Time-only input

### Choice Fields

- **RADIO_GROUP**: Single selection from multiple options
- **CHECKBOX_GROUP**: Multiple selection from multiple options
- **DROPDOWN**: Dropdown selection
- **TAGS**: Tag-based selection
- **IMAGE_CHOICE**: Image-based selection (single or multiple)

### Specialized Fields

- **CHECKBOX**: Boolean checkbox
- **FILE_UPLOAD**: File upload with format restrictions
- **SIGNATURE**: Digital signature capture
- **RATING_INPUT**: 1-5 star rating input

### Payment Fields

- **FIXED_PAYMENT**: Display fixed payment amount
- **PAYMENT_INPUT**: Custom payment amount input
- **DONATION**: Donation amount selection
- **PRODUCT_LIST**: Product selection with quantities

### Other Fields

- **TEXT**: Rich text display (headers, descriptions)
- **SUBMIT_BUTTON**: Form submission button
- **APPOINTMENT**: Appointment scheduling

## FieldMap Component Examples

Here are examples of custom components that can be passed to the fieldMap:

```tsx
// Basic input components
const TextInput = ({ value, onChange, label, error, ...props }) => (
  <div className="form-field">
    <label className="text-foreground font-paragraph">{label}</label>
    <input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="bg-background border-foreground text-foreground"
      {...props}
    />
    {error && <span className="text-destructive">{error}</span>}
  </div>
);

const TextArea = ({ value, onChange, label, error, ...props }) => (
  <div className="form-field">
    <label className="text-foreground font-paragraph">{label}</label>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="bg-background border-foreground text-foreground"
      {...props}
    />
    {error && <span className="text-destructive">{error}</span>}
  </div>
);

const Checkbox = ({ value, onChange, label, error, ...props }) => (
  <div className="form-field">
    <label className="flex items-center text-foreground font-paragraph">
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-2"
        {...props}
      />
      {label}
    </label>
    {error && <span className="text-destructive">{error}</span>}
  </div>
);

const RadioGroup = ({ value, onChange, options, label, error, ...props }) => (
  <div className="form-field">
    <fieldset>
      <legend className="text-foreground font-paragraph">{label}</legend>
      {options.map((option) => (
        <label
          key={option.id}
          className="flex items-center text-foreground font-paragraph"
        >
          <input
            type="radio"
            name={props.name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="mr-2"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
    {error && <span className="text-destructive">{error}</span>}
  </div>
);

// Define your fieldMap with custom components
const FIELD_MAP = {
  TEXT_INPUT: TextInput,
  TEXT_AREA: TextArea,
  CHECKBOX: Checkbox,
  RADIO_GROUP: RadioGroup,
  NUMBER_INPUT: NumberInput,
  PHONE_INPUT: PhoneInput,
  DATE_PICKER: DatePicker,
  // ... other field components
};
```

## Complete Example

### Server-Side Loading (Astro/SSR)

```tsx
// pages/form.astro
---
import { loadFormServiceConfig } from '@wix/headless-forms/services';
import FormPage from '../components/FormPage';

const formServiceConfigResult = await loadFormServiceConfig('form-id');

if (formServiceConfigResult.type === 'notFound') {
  return Astro.redirect('/404');
}

const formServiceConfig = formServiceConfigResult.config;
---

<FormPage formServiceConfig={formServiceConfig} />
```

### React Component

```tsx
// components/FormPage.tsx
import { Form } from '@wix/headless-forms/react';

// Define your custom field components
const FIELD_MAP = {
  TEXT_INPUT: TextInput,
  TEXT_AREA: TextArea,
  CHECKBOX: Checkbox,
  RADIO_GROUP: RadioGroup,
  // ... other field components
};

function FormPage({ formServiceConfig }) {
  return (
    <Form.Root formServiceConfig={formServiceConfig}>
      <Form.LoadingError className="text-foreground px-4 py-3 rounded mb-4" />
      <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
      <Form.Submitted className="bg-background border-foreground text-foreground p-6 rounded-lg mb-4" />
      <Form.Fields fieldMap={FIELD_MAP} />
    </Form.Root>
  );
}
```

## Service Integration

The Form component integrates with Wix services through the `FormService` which provides:

- **Form data management**: Access to form configuration and field definitions
- **Error handling**: Signal for form loading errors
- **Submit error handling**: Signal for form submission errors
- **Submission state**: Signal for form submission status
- **State management**: Reactive state updates using signals

The service can be loaded using the `loadFormServiceConfig` function which handles form fetching and error cases.
