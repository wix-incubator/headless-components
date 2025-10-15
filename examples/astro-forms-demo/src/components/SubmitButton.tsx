import { Form, type SubmitButtonProps } from '@wix/headless-forms/react';

export default function SubmitButton({
  id,
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
  // @ts-expect-error
  layout,
}: SubmitButtonProps) {
  return (
    <Form.Field id={id} layout={layout}>
      <Form.Field.Input asChild>
        <div className="flex gap-3 mt-8">
          {showPreviousButton && (
            <button
              type="button"
              onClick={() => onPreviousClick()}
              className="px-6 py-3 bg-secondary text-secondary-foreground font-paragraph font-semibold rounded-lg hover:opacity-90 transition-opacity"
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
              className="px-6 py-3 bg-primary text-primary-foreground font-paragraph font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {nextText}
            </button>
          )}
          {showSubmitButton && (
            <button
              type="submit"
              onClick={() => onSubmitClick()}
              disabled={isSubmitInProgress}
              className="px-6 py-3 bg-primary text-primary-foreground font-paragraph font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitInProgress ? 'Submitting...' : submitText}
            </button>
          )}
        </div>
      </Form.Field.Input>
    </Form.Field>
  );
}
