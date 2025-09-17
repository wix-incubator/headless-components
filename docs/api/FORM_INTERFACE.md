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
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the root element */
  className?: string;
}
```

**FormServiceConfig**

The `FormServiceConfig` supports two distinct patterns for providing form data:

- **Pre-loaded Form Data (SSR/SSG)**: Use when you have form data available at service initialization
- **Lazy Loading with Form ID (Client-side)**: Use when you only have a form ID and need to load form data asynchronously

```tsx
interface FormServiceConfig {
  /** Pre-loaded form data. When provided, the service uses this data immediately without any network requests. Recommended for SSR/SSG scenarios. */
  form?: forms.Form;
  /** Form ID for lazy loading. When provided (and no form data), the service will fetch form data asynchronously from the Wix Forms API. Ideal for client-side routing. */
  formId?: string;
}
```

**Examples**

```tsx
// Pattern 1: Pre-loaded form data (SSR/SSG)
<Form.Root formServiceConfig={{ form: myForm }}>
  {/* All form components */}
</Form.Root>

// Pattern 2: Lazy loading with formId (Client-side)
<Form.Root formServiceConfig={{ formId: 'form-123' }}>
  <Form.Loading className="flex justify-center p-4" />
  <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
  {/* All form components */}
</Form.Root>
```

### Form.Loading

Component that renders content during loading state. Only displays its children when the form is currently loading.

**Props**

```tsx
interface LoadingProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display during loading state (can be a ReactNode) */
  children?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Form.Loading className="flex justify-center p-4" />

// Custom content
<Form.Loading>
  <div className="flex items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2 text-foreground font-paragraph">Loading form...</span>
  </div>
</Form.Loading>

// With asChild for custom components
<Form.Loading asChild>
  <div className="custom-loading-container">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2 text-foreground font-paragraph">Loading form...</span>
  </div>
</Form.Loading>
```

### Form.LoadingError

Component that renders content when there's an error loading the form. Only displays its children when an error has occurred.

**Props**

```tsx
interface LoadingErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display during error state (can be a ReactNode) */
  children?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Form.LoadingError className="error-message" />

// Custom content
<Form.LoadingError>
  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
    <h3 className="font-heading font-semibold">Error loading form</h3>
    <p className="font-paragraph">Something went wrong. Please try again.</p>
  </div>
</Form.LoadingError>

// With asChild for custom components
<Form.LoadingError asChild>
  {React.forwardRef<HTMLDivElement, { error: string | null; hasError: boolean }>(
    ({ error }, ref) => (
      <div ref={ref} className="custom-error-container">
        <h3 className="font-heading">Error Loading Form</h3>
        <p className="font-paragraph">{error}</p>
      </div>
    )
  )}
</Form.LoadingError>
```

### Form.Submitted

Component that renders content after successful form submission. Only displays its children when the form has been successfully submitted.

**Important**: The component automatically handles conditional rendering for regular usage. When using `asChild`, you can use `isSubmitted` to customize the success state behavior and `message` to display the success message.

**Props**

```tsx
interface SubmittedProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display after successful submission (can be a ReactNode) */
  children?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Form.Submitted className="bg-background border-foreground text-foreground p-6 rounded-lg" />

// Custom content
<Form.Submitted>
  <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg">
    <h2 className="font-heading text-xl mb-2">Thank You!</h2>
    <p className="font-paragraph">Your form has been submitted successfully.</p>
  </div>
</Form.Submitted>

// With asChild for custom components
<Form.Submitted asChild>
  {React.forwardRef<HTMLDivElement, { isSubmitted: boolean; message: string }>(
    ({ message }, ref) => (
      <div ref={ref} className="custom-success-container">
        <h2 className="font-heading">Thank You!</h2>
        <p className="font-paragraph">{message}</p>
      </div>
    )
  )}
</Form.Submitted>
```

### Form.Error

Component that renders content when there's an error during form submission. Only displays its children when a submission error has occurred.

**Props**

```tsx
interface ErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display during submit error state (can be a ReactNode) */
  children?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Form.Error className="error-message" />

// Custom content
<Form.Error>
  <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
    <h3 className="font-heading text-lg">Submission Failed</h3>
    <p className="font-paragraph">Please check your input and try again.</p>
  </div>
</Form.Error>

// With asChild for custom components
<Form.Error asChild>
  {React.forwardRef<HTMLDivElement, { error: string | null; hasError: boolean }>(
    ({ error }, ref) => (
      <div ref={ref} className="custom-error-container">
        <h3 className="font-heading">Submission Failed</h3>
        <p className="font-paragraph">{error}</p>
      </div>
    )
  )}
</Form.Error>
```

### Form.Fields

Fields component for rendering a form with custom field renderers. It maps each field type from the form configuration to its corresponding React component and renders them in the order and layout defined by the form structure.

The component automatically handles:
- Field validation and error display
- Form state management
- Field value updates

Must be used within Form.Root to access form context.

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
- Handles form validation and error display
- Manages form state and field value updates

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
  PHONE_INPUT: PhoneInput,
  MULTILINE_ADDRESS: MultilineAddress,
  DATE_INPUT: DateInput,
  DATE_PICKER: DatePicker,
  DATE_TIME_INPUT: DateTimeInput,
  FILE_UPLOAD: FileUpload,
  NUMBER_INPUT: NumberInput,
  CHECKBOX: Checkbox,
  SIGNATURE: Signature,
  RATING_INPUT: RatingInput,
  RADIO_GROUP: RadioGroup,
  CHECKBOX_GROUP: CheckboxGroup,
  DROPDOWN: Dropdown,
  TAGS: Tags,
  TIME_INPUT: TimeInput,
  TEXT: RichText,
  SUBMIT_BUTTON: SubmitButton,
  PRODUCT_LIST: ProductList,
  FIXED_PAYMENT: FixedPayment,
  PAYMENT_INPUT: PaymentInput,
  DONATION: Donation,
  APPOINTMENT: Appointment,
  IMAGE_CHOICE: ImageChoice,
};
```

## Complete Examples

### Pattern 1: Server-Side Loading (Astro/SSR)

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

### Pattern 2: Client-Side Loading

```tsx
// pages/dynamic-form.astro
---
import DynamicFormPage from '../components/DynamicFormPage';
const formId = 'form-123';
---

<DynamicFormPage formId={formId} />
```

### React Components

```tsx
// components/FormPage.tsx (Pattern 1: Pre-loaded form data)
import { Form } from '@wix/headless-forms/react';
import {
  TextInput,
  TextArea,
  PhoneInput,
  MultilineAddress,
  DateInput,
  DatePicker,
  DateTimeInput,
  FileUpload,
  NumberInput,
  Checkbox,
  Signature,
  RatingInput,
  RadioGroup,
  CheckboxGroup,
  Dropdown,
  Tags,
  TimeInput,
  RichText,
  SubmitButton,
  ProductList,
  FixedPayment,
  PaymentInput,
  Donation,
  Appointment,
  ImageChoice
} from './components';

// Define your field mapping - this tells the Fields component which React component to use for each field type
const FIELD_MAP = {
  TEXT_INPUT: TextInput,
  TEXT_AREA: TextArea,
  PHONE_INPUT: PhoneInput,
  MULTILINE_ADDRESS: MultilineAddress,
  DATE_INPUT: DateInput,
  DATE_PICKER: DatePicker,
  DATE_TIME_INPUT: DateTimeInput,
  FILE_UPLOAD: FileUpload,
  NUMBER_INPUT: NumberInput,
  CHECKBOX: Checkbox,
  SIGNATURE: Signature,
  RATING_INPUT: RatingInput,
  RADIO_GROUP: RadioGroup,
  CHECKBOX_GROUP: CheckboxGroup,
  DROPDOWN: Dropdown,
  TAGS: Tags,
  TIME_INPUT: TimeInput,
  TEXT: RichText,
  SUBMIT_BUTTON: SubmitButton,
  PRODUCT_LIST: ProductList,
  FIXED_PAYMENT: FixedPayment,
  PAYMENT_INPUT: PaymentInput,
  DONATION: Donation,
  APPOINTMENT: Appointment,
  IMAGE_CHOICE: ImageChoice,
};

// Pattern 1: Pre-loaded form data (SSR/SSG)
function FormPage({ formServiceConfig }) {
  return (
    <Form.Root formServiceConfig={formServiceConfig}>
      <Form.Loading className="flex justify-center p-4" />
      <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
      <Form.Fields fieldMap={FIELD_MAP} />
      <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
      <Form.Submitted className="text-green-500 p-4 rounded-lg mb-4" />
    </Form.Root>
  );
}

// Pattern 2: Lazy loading with formId (Client-side)
function DynamicFormPage({ formId }) {
  return (
    <Form.Root formServiceConfig={{ formId }}>
      <Form.Loading className="flex justify-center p-4" />
      <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
      <Form.Fields fieldMap={FIELD_MAP} />
      <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
      <Form.Submitted className="text-green-500 p-4 rounded-lg mb-4" />
    </Form.Root>
  );
}
```

## FormServiceConfig Interface

The `FormServiceConfig` interface defines how form data is provided to the Form service. It supports two distinct patterns:

```tsx
interface FormServiceConfig {
  /** Pre-loaded form data. When provided, the service uses this data immediately without any network requests. Recommended for SSR/SSG scenarios. */
  form?: forms.Form;
  /** Form ID for lazy loading. When provided (and no form data), the service will fetch form data asynchronously from the Wix Forms API. Ideal for client-side routing. */
  formId?: string;
}
```

## Service Integration

The Form component integrates with Wix services through the `FormService` which provides:

- **Form data management**: Access to form configuration and field definitions
- **Dual loading patterns**: Support for both pre-loaded form data and lazy loading with form IDs
- **Error handling**: Signal for form loading errors
- **Submit response handling**: Signal for form submission responses (success/error)
- **Submission state**: Signal for form submission status
- **State management**: Reactive state updates using signals
- **Loading states**: Built-in loading indicators for async form loading

