import { Form } from '@wix/headless-forms/react';
import { type FormServiceConfig } from '@wix/headless-forms/services';

import '../styles/theme-1.css';
import TextInput from '../components/TextInput';
import ContactsBirthdate from '../components/ContactsBirthdate';
import ContactsEmail from '../components/ContactsEmail';
import ContactsFirstName from '../components/ContactsFirstName';
import ContactsLastName from '../components/ContactsLastName';
import ContactsTaxId from '../components/ContactsTaxId';
import ContactsSubscribe from '../components/ContactsSubscribe';
import TextArea from '../components/TextArea';
import NumberInput from '../components/NumberInput';
import Checkbox from '../components/Checkbox';

interface FormsPageProps {
  formServiceConfig: FormServiceConfig;
}

const FIELD_MAP = {
  TEXT_INPUT: TextInput,
  CONTACTS_BIRTHDATE: ContactsBirthdate,
  CONTACTS_EMAIL: ContactsEmail,
  CONTACTS_FIRST_NAME: ContactsFirstName,
  CONTACTS_LAST_NAME: ContactsLastName,
  CONTACTS_TAX_ID: ContactsTaxId,
  CONTACTS_SUBSCRIBE: ContactsSubscribe,
  TEXT_AREA: TextArea,
  NUMBER_INPUT: NumberInput,
  CHECKBOX: Checkbox,
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
