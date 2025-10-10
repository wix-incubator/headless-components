import React, { type ReactNode, type FC } from 'react';

interface FormView {
  fields: Field[];
}

interface Layout {
  column: number;
  width: number;
}

interface Field {
  id: string;
  layout: Layout;
}

type Props =
  | {
      form: FormView;
      fieldId: string;
      renderLabel: () => ReactNode;
      renderInput: () => ReactNode;
      renderDescription: () => ReactNode;
    }
  | {
      form: FormView;
      fieldId: string;
      children: ReactNode;
    };

export const DefaultFieldLayout: FC<Props> = ({ form, fieldId, ...rest }) => {
  const fieldView = form.fields.find((field) => field.id === fieldId);
  if (!fieldView) {
    return null;
  }

  const { layout } = fieldView;

  const rows = [1, 2];
  const gridRow = `1 / span ${rows.length}`;
  const gridColumn = `${layout.column + 1} / span ${layout.width}`;
  const [labelRow, inputRow] = rows.map(
    (currentRow) => `${currentRow} / span 1`,
  );

  if ('children' in rest) {
    return <div style={{ gridRow, gridColumn }}>{rest.children}</div>;
  }

  const { renderLabel, renderInput, renderDescription } = rest;

  return (
    <>
      <div
        style={{
          gridRow: labelRow,
          gridColumn,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {renderLabel()}
      </div>
      <div style={{ gridRow: inputRow, gridColumn }}>
        {renderInput()}
        {renderDescription()}
      </div>
    </>
  );
};
