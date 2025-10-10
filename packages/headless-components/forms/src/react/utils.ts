import { forms } from '@wix/forms';
import { Layout } from './core/Form';

export function findFieldLayout(
  form: forms.Form,
  fieldId: string,
): Layout | undefined {
  if (!form.steps) {
    return undefined;
  }

  for (const step of form.steps) {
    if (step.layout?.large?.items) {
      const layoutItem = step.layout.large.items.find(
        (item) => item.fieldId === fieldId,
      );

      if (
        layoutItem &&
        typeof layoutItem.column === 'number' &&
        typeof layoutItem.width === 'number'
      ) {
        return {
          column: layoutItem.column,
          width: layoutItem.width,
        };
      }
    }
  }

  return undefined;
}
