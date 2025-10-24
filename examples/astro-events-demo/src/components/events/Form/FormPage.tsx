import {
  type EventServiceConfig,
  loadEventServiceConfig,
} from '@wix/events/services';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { Form } from './Form';

interface FormPageLoaderData {
  slug: string;
  eventServiceConfig: EventServiceConfig;
}

interface FormPageProps {
  thankYouPagePath: string;
}

export async function formPageLoader({
  params: { slug },
}: LoaderFunctionArgs): Promise<FormPageLoaderData> {
  if (!slug) {
    throw new Error('Event slug is required');
  }

  const eventServiceConfigResult = await loadEventServiceConfig({ slug });

  if (eventServiceConfigResult.type === 'notFound') {
    throw new Response('Not Found', { status: 404 });
  }

  return {
    slug,
    eventServiceConfig: eventServiceConfigResult.config,
  };
}

export function FormPage({ thankYouPagePath }: FormPageProps) {
  const { slug, eventServiceConfig } = useLoaderData<typeof formPageLoader>();

  return (
    <Form
      key={slug}
      eventServiceConfig={eventServiceConfig}
      thankYouPageUrl={
        typeof window !== 'undefined'
          ? `${window.location.origin}${thankYouPagePath.replace(':slug', slug)}`
          : ''
      }
    />
  );
}
