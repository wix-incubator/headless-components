import React from 'react';
import { SubmitButtonProps } from '@wix/headless-forms/react';

export default function SubmitButton({ id, text }: SubmitButtonProps) {
  return (
    <button type="submit" id={id} className="submit-button">
      {text}
    </button>
  );
}
