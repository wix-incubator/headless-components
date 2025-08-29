import { FormControl } from '../services/form-control-service.js';
import { rsvpV2 } from '@wix/events';

export const flattenFormControls = (controls: FormControl[]): FormControl[] =>
  controls!.flatMap((control) =>
    control.inputs!.flatMap((input) => {
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
                ? `${control._id!}_${label.name}`
                : label.name,
          },
        ],
      }));
    }),
  );

export const getFormResponse = (formData: FormData): rsvpV2.FormResponse => {
  const data: Record<string, string[]> = {};

  const uniqueKeys = new Set(formData.keys());

  for (const key of uniqueKeys) {
    const controlId = key.split('_')[0]!;
    const values = formData.getAll(key) as string[];

    if (data[controlId]) {
      data[controlId].push(...values);
    } else {
      data[controlId] = values;
    }
  }

  return {
    inputValues: Object.entries(data).map(([inputName, value]) => {
      const inputValue: rsvpV2.InputValue = {
        inputName,
      };

      // TODO: backend issue with address
      if (value.length > 1 || inputName.includes('address')) {
        inputValue.values = value;
      } else {
        inputValue.value = value[0];
      }

      return inputValue;
    }),
  };
};
