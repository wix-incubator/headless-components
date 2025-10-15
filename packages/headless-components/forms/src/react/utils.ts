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
