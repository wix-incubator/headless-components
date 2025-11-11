import { Form, type FormValues } from '@wix/headless-forms/react';
import { submissions } from '@wix/forms';
import {
  type FormServiceConfig,
  type SubmitResponse,
} from '@wix/headless-forms/services';

import TextInput from '../components/TextInput';
import TextArea from '../components/TextArea';
import Phone from '../components/Phone';
import MultilineAddress from '../components/MultilineAddress';
import DateInput from '../components/DateInput';
import DatePicker from '../components/DatePicker';
import DateTimeInput from '../components/DateTimeInput';
import FileUpload from '../components/FileUpload';
import NumberInput from '../components/NumberInput';
import Checkbox from '../components/Checkbox';
import Signature from '../components/Signature';
import RatingInput from '../components/RatingInput';
import RadioGroup from '../components/RadioGroup';
import CheckboxGroup from '../components/CheckboxGroup';
import Dropdown from '../components/Dropdown';
import Tags from '../components/Tags';
import TimeInput from '../components/TimeInput';
import RichText from '../components/RichText';
import SubmitButton from '../components/SubmitButton';
import ProductList from '../components/ProductList';
import FixedPayment from '../components/FixedPayment';
import PaymentInput from '../components/PaymentInput';
import Donation from '../components/Donation';
import Appointment from '../components/Appointment';
import ImageChoice from '../components/ImageChoice';

interface FormsPageProps {
  formServiceConfig: FormServiceConfig;
}

const FIELD_MAP = {
  TEXT_INPUT: TextInput,
  TEXT_AREA: TextArea,
  PHONE_INPUT: Phone,
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

export default function FormsPage({ formServiceConfig }: FormsPageProps) {
  const handleCustomSubmit = async (
    formId: string,
    formValues: FormValues
  ): Promise<SubmitResponse> => {
    try {
      const response = await submissions.createSubmission({
        formId,
        submissions: formValues,
      });

      if (!response) {
        return { type: 'error', message: 'Failed to submit form' };
      }

      return { type: 'success', message: 'Form submitted successfully!' };
    } catch (error) {
      console.error('Submission error:', error);
      return { type: 'error', message: 'An error occurred during submission' };
    }
  };

  const configWithFetchOptions = {
    ...formServiceConfig,
    onSubmit: handleCustomSubmit,
    fetchOptions: {
      namespace: 'wix.bookings.v2.bookings',
      additionalMetadata: {
        serviceIds: ['456f4037-e4f9-4aa0-801f-9ed6080d57e0'],
      },
    },
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Form.Root formServiceConfig={configWithFetchOptions}>
          <div className="bg-background/50 backdrop-blur-sm p-8 rounded-xl border border-foreground/10 shadow-lg">
            <Form.Fields
              fieldMap={FIELD_MAP}
              rowGapClassname="gap-y-6"
              columnGapClassname="gap-x-4"
            />
            <Form.Loading className="mt-4 flex justify-center p-8 text-foreground font-paragraph" />
            <Form.LoadingError className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg mb-6 font-paragraph" />
            <Form.Error className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg mb-6 font-paragraph" />
            <Form.Submitted className="mt-4 bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-4 rounded-lg mb-6 font-paragraph font-semibold" />
          </div>
        </Form.Root>
      </div>
    </div>
  );
}
