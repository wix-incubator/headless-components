import { type Event } from '../services/event-service.js';

export const hasDescription = (event: Event) => {
  return !!event.description?.nodes?.length;
};
