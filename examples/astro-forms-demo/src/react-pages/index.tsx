import { Form } from '@wix/headless-forms/react';
import { type FormServiceConfig } from '@wix/headless-forms/services';

import '../styles/theme-1.css';
import TextInput from '../components/TextInput';
import UrlInput from '../components/UrlInput';
import FileUpload from '../components/FileUpload';
import ContactsBirthdate from '../components/ContactsBirthdate';
import ContactsEmail from '../components/ContactsEmail';
import ContactsFirstName from '../components/ContactsFirstName';
import ContactsLastName from '../components/ContactsLastName';
import ContactsPhone from '../components/ContactsPhone';
import ContactsCompany from '../components/ContactsCompany';
import ContactsPosition from '../components/ContactsPosition';
import ContactsAddress from '../components/ContactsAddress';
import MultilineAddress from '../components/MultilineAddress';
import ContactsTaxId from '../components/ContactsTaxId';
import ContactsSubscribe from '../components/ContactsSubscribe';
import TextArea from '../components/TextArea';
import NumberInput from '../components/NumberInput';
import Checkbox from '../components/Checkbox';
import Signature from '../components/Signature';
import RatingInput from '../components/RatingInput';
import RadioGroup from '../components/RadioGroup';
import CheckboxGroup from '../components/CheckboxGroup';
import Dropdown from '../components/Dropdown';
import Tags from '../components/Tags';
import DateInput from '../components/DateInput';
import DatePicker from '../components/DatePicker';
import DateTimeInput from '../components/DateTimeInput';
import TimeInput from '../components/TimeInput';
import Header from '../components/Header';
import RichText from '../components/RichText';
import SubmitButton from '../components/SubmitButton';
import ProductList from '../components/ProductList';

interface FormsPageProps {
  formServiceConfig: FormServiceConfig;
}

// TODO: narrow types, e.g. CONTACTS_FIRST_NAME + CONTACTS_LAST_NAME = both text inputs
const FIELD_MAP = {
  // TODO: inject data attributes like data-field-type, disabled
  TEXT_INPUT: TextInput,
  URL_INPUT: UrlInput,
  FILE_UPLOAD: FileUpload,
  CONTACTS_BIRTHDATE: ContactsBirthdate,
  CONTACTS_EMAIL: ContactsEmail,
  CONTACTS_FIRST_NAME: ContactsFirstName,
  CONTACTS_LAST_NAME: ContactsLastName,
  CONTACTS_PHONE: ContactsPhone,
  CONTACTS_COMPANY: ContactsCompany,
  CONTACTS_POSITION: ContactsPosition,
  CONTACTS_ADDRESS: ContactsAddress,
  MULTILINE_ADDRESS: MultilineAddress,
  CONTACTS_TAX_ID: ContactsTaxId,
  CONTACTS_SUBSCRIBE: ContactsSubscribe,
  TEXT_AREA: TextArea,
  NUMBER_INPUT: NumberInput,
  CHECKBOX: Checkbox,
  SIGNATURE: Signature,
  RATING_INPUT: RatingInput,
  RADIO_GROUP: RadioGroup,
  CHECKBOX_GROUP: CheckboxGroup,
  DROPDOWN: Dropdown,
  TAGS: Tags,
  DATE_INPUT: DateInput,
  DATE_PICKER: DatePicker,
  DATE_TIME_INPUT: DateTimeInput,
  TIME_INPUT: TimeInput,
  HEADER: Header,
  RICH_TEXT: RichText,
  SUBMIT_BUTTON: SubmitButton,
  PRODUCT_LIST: ProductList,
};

export default function FormsPage({ formServiceConfig }: FormsPageProps) {
  return (
    <Form.Root form={formServiceConfig.form}>
      <Form.Container
        formId="491ce063-931e-47c9-aad9-4845d9271c30"
        fieldMap={FIELD_MAP}
      />
    </Form.Root>
  );
}
