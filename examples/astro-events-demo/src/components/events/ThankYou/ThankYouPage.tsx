import {
  type EventServiceConfig,
  type OrderServiceConfig,
  loadEventServiceConfig,
  loadOrderServiceConfig,
} from '@wix/events/services';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { ThankYou } from './ThankYou';

interface ThankYouPageLoaderData {
  slug: string;
  eventServiceConfig: EventServiceConfig;
  orderServiceConfig?: OrderServiceConfig;
}

interface ThankYouPageProps {
  eventDetailsPagePath: string;
}

export async function thankYouPageLoader({
  params: { slug },
  request,
}: LoaderFunctionArgs): Promise<ThankYouPageLoaderData> {
  if (!slug) {
    throw new Error('Event slug is required');
  }

  const eventServiceConfigResult = await loadEventServiceConfig(slug);

  if (eventServiceConfigResult.type === 'notFound') {
    throw new Response('Not Found', { status: 404 });
  }

  const url = new URL(request.url);
  const orderNumber = url.searchParams.get('orderNumber');
  const eventId = eventServiceConfigResult.config.event._id!;

  const orderServiceConfig = orderNumber
    ? await loadOrderServiceConfig(eventId, orderNumber)
    : undefined;

  return {
    slug,
    eventServiceConfig: eventServiceConfigResult.config,
    orderServiceConfig,
  };
}

export function ThankYouPage({ eventDetailsPagePath }: ThankYouPageProps) {
  const { slug, eventServiceConfig, orderServiceConfig } =
    useLoaderData<typeof thankYouPageLoader>();

  return (
    <ThankYou
      key={slug}
      eventServiceConfig={eventServiceConfig}
      orderServiceConfig={orderServiceConfig}
      eventPageUrl={
        typeof window !== 'undefined'
          ? `${window.location.origin}${eventDetailsPagePath.replace(':slug', slug)}`
          : ''
      }
    />
  );
}
