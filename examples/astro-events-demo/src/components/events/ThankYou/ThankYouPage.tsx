import {
  type EventServiceConfig,
  loadEventServiceConfig,
} from '@wix/events/services';
import React from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { ThankYou } from './ThankYou';

interface ThankYouPageLoaderParams {
  params: {
    slug?: string;
  };
}

interface ThankYouPageLoaderData {
  eventServiceConfig: EventServiceConfig;
}

interface ThankYouPageProps {
  eventDetailsPagePath: string;
}

export function thankYouPageLoader({
  params: { slug },
}: ThankYouPageLoaderParams): {
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

    resolve({
      eventServiceConfig: eventServiceConfigResult.config,
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
        {({ eventServiceConfig }) => (
          <div className="wix-verticals-container">
            <ThankYou
              eventServiceConfig={eventServiceConfig}
              eventPageUrl={`${window.location.origin}${eventDetailsPagePath.replace(':slug', slug)}`}
            />
          </div>
        )}
      </Await>
    </React.Suspense>
  );
}
