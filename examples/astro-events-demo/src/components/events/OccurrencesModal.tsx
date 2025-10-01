import {
  type EventServiceConfig,
  type OccurrenceListServiceConfig,
} from '@wix/events/services';
import { useState } from 'react';
import {
  Event,
  EventSlug,
  EventDate,
  EventLocation,
  EventOccurrences,
  EventOccurrenceRepeater,
} from '@/components/ui/events';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

interface OccurrencesModalProps {
  currentOccurrenceSlug: string;
  eventServiceConfig: EventServiceConfig;
  occurrenceListServiceConfig?: OccurrenceListServiceConfig;
  eventDetailsPagePath: string;
  onClose: () => void;
}

export function OccurrencesModal({
  currentOccurrenceSlug,
  eventServiceConfig,
  occurrenceListServiceConfig,
  eventDetailsPagePath,
  onClose,
}: OccurrencesModalProps) {
  const [selectedOccurenceSlug, setSelectedOccurenceSlug] = useState<string>(
    currentOccurrenceSlug
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Time & Location</DialogTitle>
        <Event
          event={eventServiceConfig.event}
          occurrenceListServiceConfig={occurrenceListServiceConfig}
        >
          <EventOccurrences className="space-y-3">
            <EventOccurrenceRepeater>
              <EventSlug asChild>
                {({ slug }) => (
                  <button
                    data-selected={slug === selectedOccurenceSlug}
                    className="border border-foreground/10 data-[selected=true]:border-primary p-4 w-full text-left"
                    onClick={() => setSelectedOccurenceSlug(slug)}
                  >
                    <EventDate format="full" />
                    <EventLocation format="short" />
                  </button>
                )}
              </EventSlug>
            </EventOccurrenceRepeater>
          </EventOccurrences>
        </Event>
        <DialogFooter className="gap-2 sm:gap-0">
          <button
            className="bg-background border border-foreground/10 text-foreground font-paragraph text-base py-2 px-4 min-w-[100px] hover:underline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primary text-primary-foreground font-paragraph text-base py-2 px-4 min-w-[100px] hover:underline"
            onClick={() => {
              window.location.href = eventDetailsPagePath.replace(
                ':slug',
                selectedOccurenceSlug
              );
            }}
          >
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
