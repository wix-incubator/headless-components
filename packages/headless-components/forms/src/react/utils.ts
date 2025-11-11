import { Layout } from './core/Form';

export function calculateGridStyles(layout: Layout) {
  const labelRow = 1;
  const inputRow = 2;
  const gridColumn = `${layout.column + 1} / span ${layout.width}`;

  return {
    label: {
      gridRow: `${labelRow} / span 1`,
      gridColumn,
      display: 'flex',
      alignItems: 'flex-end',
    },
    input: {
      gridRow: `${inputRow} / span 1`,
      gridColumn,
    },
  };
}

export function isFormFileField(value: any): boolean {
  if (!value) {
    return false;
  }

  if (!Array.isArray(value)) {
    return false;
  }
  if (value.length === 0) {
    return false;
  }
  const first = value[0];
  return 'fileId' in first;
};
