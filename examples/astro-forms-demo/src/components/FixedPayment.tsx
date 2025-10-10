import React from 'react';
import { type FixedPaymentProps } from '@wix/headless-forms/react';
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
}: FixedPaymentProps) {
  return (
    <div className="mb-6">
      {showLabel && (
        <label className="block text-foreground font-paragraph mb-2">
          {label}
        </label>
      )}

      <div className="text-2xl font-paragraph font-bold text-foreground">
        {currency}
        {amount.toFixed(2)}
      </div>
      {description && (
        <div className="mt-2 text-foreground/70 text-sm">
          <RicosViewer
            content={description as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      )}
    </div>
  );
}
