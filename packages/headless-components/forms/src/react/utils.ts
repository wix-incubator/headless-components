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

export function getFieldsByRow(fields: any[]): any[][] {
  const fieldsByRow = fields.reduce<any[][]>((result, item) => {
    const row = item.layout.row;

    if (result[row]) {
      result[row].push(item);
    } else {
      result[row] = [item];
    }
    return result;
  }, []);

  return fieldsByRow;
}

export const getRowGridStyle = ({ layout }: { layout: any }) => {
  return {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
    gridAutoRows: 'minmax(min-content, max-content) 1fr',
  };
};
