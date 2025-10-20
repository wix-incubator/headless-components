import { Layout } from './core/Form';

export function calculateGridStyles(layout: Layout) {
  // Since each row is now a separate grid, calculate positions relative to the row
  // Each field uses 2 rows within its grid container (label row + input row)
  const labelRow = 1; // Always row 1 within the grid
  const inputRow = 2; // Always row 2 within the grid
  const gridColumn = `${layout.column + 1} / span ${layout.width}`;

  return {
    // TODO: remove container
    container: {},
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
