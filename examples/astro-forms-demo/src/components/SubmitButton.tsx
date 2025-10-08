import { type SubmitButtonProps } from '@wix/headless-forms/react';

export default function SubmitButton({
  id,
  text,
  onClick,
}: SubmitButtonProps) {
  return (
    <button type="submit" id={id} onClick={onClick}>
      {text}
    </button>
  );
}
