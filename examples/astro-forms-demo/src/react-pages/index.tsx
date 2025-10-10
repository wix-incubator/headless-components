import { Form, type FormValues } from '@wix/headless-forms/react';
import { submissions } from '@wix/forms';
import {
  type FormServiceConfig,
  type SubmitResponse,
} from '@wix/headless-forms/services';

import TextInput from '../components/TextInput';
import TextArea from '../components/TextArea';
import ContactsPhone from '../components/ContactsPhone';
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
  PHONE_INPUT: ContactsPhone,
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
        ...formValues,
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

  return (
    <>
      <h1>
        Form{' '}
        {'formId' in formServiceConfig
          ? formServiceConfig.formId
          : formServiceConfig?.form?._id}
      </h1>
      <Form.Root
        formServiceConfig={{
          ...formServiceConfig,
          onSubmit: handleCustomSubmit,
        }}
      >
        <Form.Loading className="flex justify-center p-4" />
        <Form.LoadingError className="bg-background border-foreground text-foreground px-4 py-3 rounded mb-4" />
        <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
        <Form.Submitted className="bg-background border-foreground text-foreground p-6 rounded-lg mb-4" />
        <Form.Fields fieldMap={FIELD_MAP} />
      </Form.Root>
    </>
  );
}
