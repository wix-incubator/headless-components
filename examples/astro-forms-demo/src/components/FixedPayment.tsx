import React from 'react';
import { Form, type FixedPaymentProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

export default function FixedPayment({
  label,
  showLabel,
  amount,
  currency,
  description,
  id,
}: FixedPaymentProps) {
  return (
    <Form.Field id={id}>
      {showLabel && (
        <Form.Field.Label asChild>
          <label className="text-foreground font-paragraph mb-2">{label}</label>
        </Form.Field.Label>
      )}
      <Form.Field.Input
        asChild
        description={
          description ? (
            <div className="mt-2 text-foreground/70 text-sm">
              <RicosViewer
                content={description as RichContent}
                plugins={quickStartViewerPlugins()}
              />
            </div>
          ) : undefined
        }
      >
        <div className="text-2xl font-paragraph font-bold text-foreground">
          {currency}
          {amount}
        </div>
      </Form.Field.Input>
    </Form.Field>
  );
}
