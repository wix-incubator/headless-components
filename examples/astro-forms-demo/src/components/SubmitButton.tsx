import { type SubmitButtonProps } from '@wix/headless-forms/react';

export default function SubmitButton({
  id,
  text,
  submitForm,
}: SubmitButtonProps) {
  return (
    <button type="submit" id={id} onClick={submitForm}>
      {text}
    </button>
  );
}
