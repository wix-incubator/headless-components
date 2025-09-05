import { rsvpV2 } from '@wix/events';
import { Event } from '../services/event-service.js';
import { FormControl } from '../services/form-control-service.js';

export const flattenFormControls = (controls: FormControl[]): FormControl[] =>
  controls.flatMap((control) =>
    control.type === 'GUEST_CONTROL'
      ? [control]
      : control.inputs!.flatMap((input) => {
          const labels = input.labels?.length
            ? input.labels
            : [{ name: input.name, label: input.label }];

          return labels.map((label) => ({
            ...control,
            inputs: [
              {
                ...input,
                label: label.label,
                name:
                  control.type === 'ADDRESS_FULL'
                    ? `${control._id}_${label.name}`
                    : label.name,
              },
            ],
          }));
        }),
  );

export const getRequiredRsvpData = (
  event: Event,
  formData: FormData,
): Pick<
  rsvpV2.Rsvp,
  'firstName' | 'lastName' | 'email' | 'additionalGuestDetails'
> => {
  const guestControl = event.form?.controls?.find(
    (control) => control.type === 'GUEST_CONTROL',
  );
  const guestCountInput = guestControl?.inputs?.[0];
  const guestNamesInput = guestControl?.inputs?.[1];

  const guestCount = guestCountInput
    ? Number(formData.get(guestCountInput.name!)) || 0
    : 0;
  const guestNames = guestNamesInput?.mandatory
    ? Array.from({ length: guestCount }).map(
        (_, index) =>
          `${formData.get(`${guestNamesInput.name}_${index}_firstName`)} ${formData.get(`${guestNamesInput.name}_${index}_lastName`)}`,
      )
    : [];

  return {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    additionalGuestDetails: {
      guestCount,
      guestNames,
    },
  };
};

export const getFormResponse = (
  event: Event,
  formData: FormData,
): rsvpV2.FormResponse => {
  const guestControl = event.form?.controls?.find(
    (control) => control.type === 'GUEST_CONTROL',
  );
  const guestCountInputName = guestControl?.inputs?.[0]?.name ?? '';
  const guestNamesInputName = guestControl?.inputs?.[1]?.name ?? '';

  const data: Record<string, string[]> = {};
  const uniqueKeys = new Set(formData.keys());

  for (const key of uniqueKeys) {
    const controlId = key.split('_')[0]!;
    const values = formData.getAll(key) as string[];

    if (
      [
        'firstName',
        'lastName',
        'email',
        guestCountInputName,
        guestNamesInputName,
      ].includes(controlId)
    ) {
      continue;
    }

    if (data[controlId]) {
      data[controlId].push(...values);
    } else {
      data[controlId] = values;
    }
  }

  return {
    inputValues: Object.entries(data)
      .filter(([, values]) => values.some((value) => !!value))
      .map(([inputName, values]) => {
        const controlType = event.form?.controls?.find(
          (control) => control._id === inputName,
        )?.type;

        const inputValue: rsvpV2.InputValue = {
          inputName,
        };

        if (
          values.length > 1 ||
          controlType === 'ADDRESS_FULL' ||
          controlType === 'ADDRESS_SHORT' ||
          controlType === 'CHECKBOX'
        ) {
          inputValue.values = values;
        } else {
          inputValue.value = values[0];
        }

        return inputValue;
      }),
  };
};
