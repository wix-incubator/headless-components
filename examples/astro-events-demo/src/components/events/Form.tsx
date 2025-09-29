import {
  Form as FormPrimitive,
  Control as ControlPrimitive,
  Event as EventPrimitive,
} from '@wix/events/components';
import {
  type EventServiceConfig,
  type FormServiceConfig,
} from '@wix/events/services';

interface FormProps {
  eventServiceConfig: EventServiceConfig;
  formServiceConfig: FormServiceConfig;
}

export function Form({ eventServiceConfig, formServiceConfig }: FormProps) {
  return (
    <div className="min-h-screen bg-surface-primary">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-5xl mx-auto p-15">
        <div className="col-span-1 lg:col-span-2">
          <h1 className="text-3xl font-light text-content-primary mb-6">
            Add your details
          </h1>
          <FormPrimitive.Root
            eventServiceConfig={eventServiceConfig}
            formServiceConfig={formServiceConfig}
          >
            <FormPrimitive.Controls className="grid grid-cols-2 gap-6">
              <FormPrimitive.ControlRepeater>
                <div className="col-span-2 [&:nth-child(-n+2)]:col-span-1">
                  <ControlPrimitive.Label className="block text-sm font-light text-content-primary mb-2" />
                  <ControlPrimitive.Field
                    className={`
                  [&>[type="text"]]:w-full [&>[type="text"]]:px-4 [&>[type="text"]]:py-3 [&>[type="text"]]:border [&>[type="text"]]:border-gray-300 [&>[type="text"]]:text-content-primary
                  [&>[type="email"]]:w-full [&>[type="email"]]:px-4 [&>[type="email"]]:py-3 [&>[type="email"]]:border [&>[type="email"]]:border-gray-300 [&>[type="email"]]:text-content-primary
                  [&>[type="tel"]]:w-full [&>[type="tel"]]:px-4 [&>[type="tel"]]:py-3 [&>[type="tel"]]:border [&>[type="tel"]]:border-gray-300 [&>[type="tel"]]:text-content-primary
                  [&>[type="date"]]:w-full [&>[type="date"]]:px-4 [&>[type="date"]]:py-3 [&>[type="date"]]:border [&>[type="date"]]:border-gray-300 [&>[type="date"]]:text-content-primary
                  [&>textarea]:w-full [&>textarea]:px-4 [&>textarea]:py-3 [&>textarea]:border [&>textarea]:border-gray-300 [&>textarea]:text-content-primary
                  [&>select]:w-full [&>select]:px-4 [&>select]:py-3 [&>select]:border [&>select]:border-gray-300 [&>select]:text-content-primary

                  [&[data-type="checkbox"]]:space-y-4
                  [&>[data-type="checkbox-option"]]:flex [&>[data-type="checkbox-option"]]:items-center
                  [&>[data-type="checkbox-option"]_input]:w-5 [&>[data-type="checkbox-option"]_input]:h-5 [&>[data-type="checkbox-option"]_input]:mr-3
                  [&>[data-type="checkbox-option"]_label]:text-sm [&>[data-type="checkbox-option"]_label]:font-light [&>[data-type="checkbox-option"]_label]:text-content-primary

                  [&[data-type="radio"]]:space-y-4
                  [&>[data-type="radio-option"]]:flex [&>[data-type="radio-option"]]:items-center
                  [&>[data-type="radio-option"]_input]:w-5 [&>[data-type="radio-option"]_input]:h-5 [&>[data-type="radio-option"]_input]:mr-3
                  [&>[data-type="radio-option"]_label]:text-sm [&>[data-type="radio-option"]_label]:font-light [&>[data-type="radio-option"]_label]:text-content-primary

                  [&[data-type="guest-control"]]:space-y-6
                  [&[data-type="guest-control"]_label]:block [&[data-type="guest-control"]_label]:text-sm [&[data-type="guest-control"]_label]:font-light [&[data-type="guest-control"]_label]:text-content-primary [&[data-type="guest-control"]_label]:mb-2
                `}
                  />
                </div>
              </FormPrimitive.ControlRepeater>
              <div className="col-span-2 text-center">
                <FormPrimitive.SubmitTrigger
                  className="btn-primary w-full font-light py-3 px-3"
                  label="RSVP"
                />
                <FormPrimitive.Error className="block text-sm font-light text-status-error mt-2" />
              </div>
            </FormPrimitive.Controls>
          </FormPrimitive.Root>
        </div>
        <div className="col-span-1">
          <EventPrimitive.Root event={eventServiceConfig.event}>
            <div className="border border-gray-300 p-8">
              <EventPrimitive.Title className="block text-xl font-light text-content-primary mb-4" />
              <div className="flex gap-1 font-light text-sm text-content-primary mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    fill="currentColor"
                    d="M14.5 16H5.5C5.224 16 5 15.776 5 15.5V9H15V15.5C15 15.776 14.776 16 14.5 16ZM5.5 6H14.5C14.776 6 15 6.224 15 6.5V8H5V6.5C5 6.224 5.224 6 5.5 6ZM14.5 5H14.001V4H13.001V5H7.001V4H6.001V5H5.5C4.673 5 4 5.673 4 6.5V15.5C4 16.327 4.673 17 5.5 17H14.5C15.327 17 16 16.327 16 15.5V6.5C16 5.673 15.327 5 14.5 5Z"
                  />
                </svg>
                <EventPrimitive.Date format="short" />
              </div>
              <div className="flex gap-1 font-light text-sm text-content-primary mb-6">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    fill="currentColor"
                    d="M10.5 3C13.532 3 16 5.468 16 8.5V8.65C16 10.808 14.512 13.455 11.578 16.516C11.292 16.815 10.909 16.979 10.5 16.979C10.09 16.979 9.707 16.815 9.421 16.516C6.487 13.455 5 10.808 5 8.65L5.002 8.5C5 5.468 7.467 3 10.5 3ZM10.5 4C8.018 4 6 6.019 6 8.5V8.601C6 10.515 7.433 12.996 10.143 15.824C10.335 16.024 10.665 16.024 10.856 15.824C13.566 12.996 15 10.515 15 8.65L14.998 8.515C14.999 7.298 14.531 6.168 13.681 5.318C12.832 4.469 11.702 4 10.5 4ZM10.0153 6.0463C10.8453 5.8893 11.6843 6.1473 12.2713 6.7343C12.8543 7.3183 13.1093 8.1573 12.9533 8.9773C12.7653 9.9643 11.9743 10.7533 10.9843 10.9403C10.8253 10.9713 10.6653 10.9853 10.5073 10.9853C9.8423 10.9853 9.2013 10.7273 8.7283 10.2523C8.1443 9.6683 7.8893 8.8303 8.0453 8.0103C8.2333 7.0223 9.0253 6.2333 10.0153 6.0463ZM10.5003 7.0003C10.4013 7.0003 10.3013 7.0093 10.2003 7.0283C9.6203 7.1383 9.1383 7.6193 9.0283 8.1963C8.9323 8.6993 9.0813 9.1903 9.4353 9.5463C9.7933 9.9043 10.2913 10.0543 10.7983 9.9583C11.3793 9.8483 11.8613 9.3683 11.9713 8.7903C12.0673 8.2883 11.9183 7.7963 11.5633 7.4413C11.2773 7.1543 10.9003 7.0003 10.5003 7.0003Z"
                  />
                </svg>
                <EventPrimitive.Location format="short" />
              </div>
              <EventPrimitive.Image
                width={640}
                height={360}
                className="w-full aspect-16/9 object-cover"
              />
            </div>
          </EventPrimitive.Root>
        </div>
      </div>
    </div>
  );
}
