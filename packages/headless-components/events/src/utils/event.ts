import { isRichContentEmpty, type RichContent } from '@wix/ricos';
import { type Event } from '../services/event-service.js';

export const hasDescription = (event: Event) => {
  const description = event.description as RichContent | undefined;

  return !!description && !isRichContentEmpty(description);
};
