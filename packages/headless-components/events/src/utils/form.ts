import { rsvpV2 } from '@wix/events';
import { type FormValues } from '@wix/headless-forms/react';
import { Event } from '../services/event-service.js';

export const getRequiredRsvpData = (
  _event: Event,
  formValues: FormValues,
): Pick<
  rsvpV2.Rsvp,
  'firstName' | 'lastName' | 'email' | 'additionalGuestDetails'
> => {
  // const guestControl = event.form?.controls?.find(
  //   (control) => control.type === 'GUEST_CONTROL',
  // );
  // const guestCountInput = guestControl?.inputs?.[0];
  // const guestNamesInput = guestControl?.inputs?.[1];

  // const guestCount = guestCountInput
  //   ? Number(formData.get(guestCountInput.name!)) || 0
  //   : 0;
  // const guestNames = guestNamesInput?.mandatory
  //   ? Array.from({ length: guestCount }).map(
  //       (_, index) =>
  //         `${formData.get(`${guestNamesInput.name}_${index}_firstName`)} ${formData.get(`${guestNamesInput.name}_${index}_lastName`)}`,
  //     )
  //   : [];

  return {
    firstName: formValues['first_name'],
    lastName: formValues['last_name'],
    email: formValues['email'],
    // additionalGuestDetails: guestCount
    //   ? {
    //       guestCount,
    //       guestNames,
    //     }
    //   : undefined,
  };
};

export const getFormResponse = (
  event: Event,
  formValues: FormValues,
): rsvpV2.FormResponse => {
  // const guestControl = event.form?.controls?.find(
  //   (control) => control.type === 'GUEST_CONTROL',
  // );
  // const guestCountInputName = guestControl?.inputs?.[0]?.name ?? '';
  // const guestNamesInputName = guestControl?.inputs?.[1]?.name ?? '';

  const { first_name, last_name, email, ...values } = formValues;

  return {
    inputValues: Object.entries(values)
      .filter(([, value]) => !!value)
      .map(([inputName, value]) => {
        const control = event.form!.controls!.find((control) =>
          inputName.endsWith(control._id!.replaceAll('-', '_')),
        );

        const inputValue: rsvpV2.InputValue = {
          inputName: control!._id,
        };

        if (Array.isArray(value)) {
          inputValue.values = value;
        } else {
          inputValue.value = value;
        }

        return inputValue;
      }),
  };
};
