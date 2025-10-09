import { type SubmitButtonProps } from '@wix/headless-forms/react';

export default function SubmitButton({
  submitText,
  previousText,
  nextText,
  handleSubmitClick,
  handlePreviousClick,
  handleNextClick,
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
          onClick={() => handlePreviousClick()}
          className="bg-secondary text-secondary-foreground"
        >
          {previousText}
        </button>
      )}
      {showNextButton && (
        <button
          type="button"
          onClick={() => {
            handleNextClick();
          }}
          className="bg-primary text-primary-foreground"
        >
          {nextText}!!!
        </button>
      )}
      {showSubmitButton && (
        <button
          type="submit"
          onClick={() => handleSubmitClick()}
          disabled={isSubmitInProgress}
          className="bg-primary text-primary-foreground"
        >
          {isSubmitInProgress ? 'Submitting...' : submitText}
        </button>
      )}
    </div>
  );
}
