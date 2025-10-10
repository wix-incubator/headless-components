import { type SubmitButtonProps } from '@wix/headless-forms/react';

export default function SubmitButton({
  submitText,
  previousText,
  nextText,
  onSubmitClick,
  onPreviousClick,
  onNextClick,
  showPreviousButton,
  showNextButton,
  showSubmitButton,
  isSubmitInProgress,
}: SubmitButtonProps) {
  return (
    <div>
      {showPreviousButton && (
        <button
          type="button"
          onClick={() => onPreviousClick()}
          className="bg-secondary text-secondary-foreground"
        >
          {previousText}
        </button>
      )}
      {showNextButton && (
        <button
          type="button"
          onClick={() => {
            onNextClick();
          }}
          className="bg-primary text-primary-foreground"
        >
          {nextText}
        </button>
      )}
      {showSubmitButton && (
        <button
          type="submit"
          onClick={() => onSubmitClick()}
          disabled={isSubmitInProgress}
          className="bg-primary text-primary-foreground"
        >
          {isSubmitInProgress ? 'Submitting...' : submitText}
        </button>
      )}
    </div>
  );
}
