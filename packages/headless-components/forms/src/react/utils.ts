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
