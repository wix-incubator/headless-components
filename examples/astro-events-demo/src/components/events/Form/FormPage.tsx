import {
  type EventServiceConfig,
  loadEventServiceConfig,
} from '@wix/events/services';
import React from 'react';
import {
  Await,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router-dom';
import { Form } from './Form';

interface FormPageLoaderData {
  eventServiceConfig: EventServiceConfig;
}

interface FormPageProps {}

export function formPageLoader({ params: { slug } }: LoaderFunctionArgs): {
  slug: string;
  data: Promise<FormPageLoaderData>;
} {
  if (!slug) {
    throw new Error('Event slug is required');
  }

  const data = new Promise<FormPageLoaderData>(async resolve => {
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

export function FormPage({}: FormPageProps) {
  const { slug, data } = useLoaderData<typeof formPageLoader>();

  return (
    <React.Suspense key={slug} fallback={null}>
      <Await resolve={data}>
        {({ eventServiceConfig }) => (
          <div className="wix-verticals-container">
            <Form
              eventServiceConfig={eventServiceConfig}
              formServiceConfig={{ postFlowUrl: '' }}
            />
          </div>
        )}
      </Await>
    </React.Suspense>
  );
}
