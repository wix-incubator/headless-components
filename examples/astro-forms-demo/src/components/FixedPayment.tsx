import React from 'react';
import { type FixedPaymentProps } from '@wix/headless-forms/react';

export default function FixedPayment({
  label,
  showLabel,
  amount,
  currency,
  description,
}: FixedPaymentProps) {
  return (
    <div>
      {showLabel && <label className="field-label">{label}</label>}

      <div className="payment-amount">
        {currency}
        {amount.toFixed(2)}
      </div>
    </div>
  );
}
