import {
  type EventServiceConfig,
  type OrderServiceConfig,
  loadEventServiceConfig,
  loadOrderServiceConfig,
} from '@wix/events/services';
import React from 'react';
import {
  Await,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router-dom';
import { ThankYou } from './ThankYou';

interface ThankYouPageLoaderData {
  eventServiceConfig: EventServiceConfig;
  orderServiceConfig?: OrderServiceConfig;
}

interface ThankYouPageProps {
  eventDetailsPagePath: string;
}

export function thankYouPageLoader({
  params: { slug },
  request,
}: LoaderFunctionArgs): {
  slug: string;
  data: Promise<ThankYouPageLoaderData>;
} {
  if (!slug) {
    throw new Error('Event slug is required');
  }

  const data = new Promise<ThankYouPageLoaderData>(async resolve => {
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

    resolve({
      eventServiceConfig: eventServiceConfigResult.config,
      orderServiceConfig,
    });
  });

  return {
    slug,
    data,
  };
}

export function ThankYouPage({ eventDetailsPagePath }: ThankYouPageProps) {
  const { slug, data } = useLoaderData<typeof thankYouPageLoader>();

  return (
    <React.Suspense key={slug} fallback={null}>
      <Await resolve={data}>
        {({ eventServiceConfig, orderServiceConfig }) => (
          <div className="wix-verticals-container">
            <ThankYou
              eventServiceConfig={eventServiceConfig}
              orderServiceConfig={orderServiceConfig}
              eventPageUrl={`${window.location.origin}${eventDetailsPagePath.replace(':slug', slug)}`}
            />
          </div>
        )}
      </Await>
    </React.Suspense>
  );
}
