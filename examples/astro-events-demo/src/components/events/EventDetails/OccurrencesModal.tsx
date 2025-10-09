import { type OccurrenceListServiceConfig } from '@wix/events/services';
import { useState } from 'react';
import {
  EventSlug,
  EventDate,
  EventLocation,
  OccurrenceList,
  Occurrences,
  OccurrenceRepeater,
  OccurrenceListLoadMoreTrigger,
  OccurrenceListError,
} from '@/components/ui/events';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

interface OccurrencesModalProps {
  currentOccurrenceSlug: string;
  occurrenceListServiceConfig: OccurrenceListServiceConfig;
  onDone: (slug: string) => void;
  onClose: () => void;
}

export function OccurrencesModal({
  currentOccurrenceSlug,
  occurrenceListServiceConfig,
  onDone,
  onClose,
}: OccurrencesModalProps) {
  const [selectedOccurenceSlug, setSelectedOccurenceSlug] = useState<string>(
    currentOccurrenceSlug
  );

  const handleDone = () => {
    if (currentOccurrenceSlug !== selectedOccurenceSlug) {
      onDone(selectedOccurenceSlug);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="pl-6 pr-3" aria-describedby={undefined}>
        <DialogTitle>Time & Location</DialogTitle>
        <OccurrenceList
          occurrenceListServiceConfig={occurrenceListServiceConfig}
        >
          <div className="max-h-[50vh] overflow-y-auto pr-3">
            <Occurrences className="space-y-3">
              <OccurrenceRepeater>
                <EventSlug asChild>
                  {({ slug }) => (
                    <button
                      data-selected={slug === selectedOccurenceSlug}
                      className="border border-foreground/10 data-[selected=true]:border-primary rounded-xl p-4 w-full text-left"
                      onClick={() => setSelectedOccurenceSlug(slug)}
                    >
                      <EventDate format="full" />
                      <EventLocation format="short" />
                    </button>
                  )}
                </EventSlug>
              </OccurrenceRepeater>
            </Occurrences>
            <OccurrenceListLoadMoreTrigger
              className="block mx-auto mt-5"
              label="Load More"
              loadingState="Loading..."
            />
            <OccurrenceListError className="mt-4" />
          </div>
        </OccurrenceList>
        <DialogFooter className="gap-2 sm:gap-0 pr-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleDone}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
