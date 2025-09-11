import React from 'react';
import { loadServicesListServiceConfig } from '@wix/headless-services/services';
import { ServicesListDemo } from '../components/ServicesList';

export async function getServerSideProps() {
  try {
    const servicesConfig = await loadServicesListServiceConfig({
      cursorPaging: { limit: 12 },
      sort: [{ fieldName: 'name', order: 'ASC' }]
    });

    return {
      props: {
        servicesConfig
      }
    };
  } catch (error) {
    console.error('Error loading services:', error);
    return {
      props: {
        error: 'Failed to load services'
      }
    };
  }
}

interface ServicesPageProps {
  servicesConfig?: Awaited<ReturnType<typeof loadServicesListServiceConfig>>;
  error?: string;
}

export default function ServicesPage({ servicesConfig, error }: ServicesPageProps) {
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our range of professional services designed to meet your needs.
            Book your appointment today and experience excellence.
          </p>
        </div>

        {/* Services List */}
        <ServicesListDemo initialServices={servicesConfig} />
      </div>
    </div>
  );
}
