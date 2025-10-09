import { type Event } from '../services/event-service.js';

export const hasDescription = (event: Event) => {
  return !isDescriptionEmpty(event);
};

export const isDescriptionEmpty = (event: Event) => {
  const nodes = event.description?.nodes ?? [];

  if (nodes.length === 1) {
    const { nodes: innerNodes, type, paragraphData } = nodes[0]!;

    return (
      !innerNodes?.length &&
      type === 'PARAGRAPH' &&
      [null, undefined, 0].includes(paragraphData?.indentation)
    );
  }

  return !nodes.length;
};
