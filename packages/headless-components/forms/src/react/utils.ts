import { forms } from '@wix/forms';
import { Layout } from './core/Form';

export function calculateGridStyles(layout: Layout) {
  const rows = [1, 2];
  const gridRow = `1 / span ${rows.length}`;
  const gridColumn = `${layout.column + 1} / span ${layout.width}`;
  const labelRow = `${rows[0]} / span 1`;
  const inputRow = `${rows[1]} / span 1`;

  return {
    container: { gridRow, gridColumn },
    label: {
      gridRow: labelRow,
      gridColumn,
      display: 'flex',
      alignItems: 'flex-end',
    },
    input: { gridRow: inputRow, gridColumn },
  };
}

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
