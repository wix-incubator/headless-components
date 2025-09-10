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
  formServiceConfig: FormServiceConfig;
}
```

**Example**

```tsx
<Form.Root formServiceConfig={formServiceConfig}>
  {/* All form components */}
</Form.Root>
```

### Form.Loading

Component that renders content during loading state. Only displays its children when the form is currently loading.

**Props**

```tsx
interface LoadingProps {
  children: ((props: LoadingRenderProps) => React.ReactNode) | React.ReactNode;
}
```

**Example**

```tsx
<Form.Loading>
  {() => (
    <div className="loading-spinner">
      <div>Loading form...</div>
    </div>
  )}
</Form.Loading>
```

### Form.Error

Component that renders content when there's an error loading the form. Only displays its children when an error has occurred.

**Props**

```tsx
interface ErrorProps {
  children: ((props: ErrorRenderProps) => React.ReactNode) | React.ReactNode;
}

interface ErrorRenderProps {
  error: string | null;
}
```

**Example**

```tsx
<Form.Error>
  {({ error }) => (
    <div className="bg-background border-foreground text-foreground">
      <h3>Error loading form</h3>
      <p>{error}</p>
    </div>
  )}
</Form.Error>
```

### Form.Container

Container component for rendering a form with custom field renderers. This component handles the rendering of form fields based on the provided fieldMap and displays them in the configured form grid layout.

**Props**

```tsx
interface ContainerProps {
  formId: string;
  fieldMap: FieldMap;
}
```

**Behavior**

The Container component:
- Renders form fields in the order and layout defined by the form configuration
- Maps each field type to its corresponding React component using the provided fieldMap
- Handles form validation

**Example**

```tsx
<Form.Container
  formId="491ce063-931e-47c9-aad9-4845d9271c30"
  fieldMap={FIELD_MAP}
/>
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
        <label key={option.id} className="flex items-center text-foreground font-paragraph">
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

```tsx
import { Form } from '@wix/headless-forms/react';
import { loadFormServiceConfig } from '@wix/headless-forms/services';

// Define your custom field components
const FIELD_MAP = {
  TEXT_INPUT: TextInput,
  TEXT_AREA: TextArea,
  CHECKBOX: Checkbox,
  RADIO_GROUP: RadioGroup,
  // ... other field components
};

function FormPage({ formId }) {
  const [formServiceConfig, setFormServiceConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFormServiceConfig(formId).then(result => {
      if (result.type === 'success') {
        setFormServiceConfig(result.config);
      } else {
        console.error('Form not found');
      }
      setIsLoading(false);
    });
  }, [formId]);

  if (isLoading) return <div>Loading...</div>;
  if (!formServiceConfig) return <div>Form not found</div>;

  return (
    <Form.Root formServiceConfig={formServiceConfig}>
      <Form.Loading>
        {() => (
          <div className="flex justify-center p-4">
            <div>Loading form...</div>
          </div>
        )}
      </Form.Loading>
      <Form.Error>
        {({ error }) => (
          <div className="bg-background border-foreground text-foreground px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </Form.Error>
      <Form.Container fieldMap={FIELD_MAP} />
    </Form.Root>
  );
}
```

## Service Integration

The Form component integrates with Wix services through the `FormService` which provides:

- **Form data management**: Access to form configuration and field definitions
- **Loading state**: Signal for form loading status
- **Error handling**: Signal for form errors
- **State management**: Reactive state updates using signals

The service can be loaded using the `loadFormServiceConfig` function which handles form fetching and error cases.
