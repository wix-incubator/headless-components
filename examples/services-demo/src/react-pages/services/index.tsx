import React from 'react';
import type { ServicesListServiceConfig } from '@wix/headless-services/services';
import { List, Options, ServiceRepeater, Error, Service } from '@wix/headless-services/react';
import type { services } from '@wix/bookings';

interface ServicesPageProps {
  servicesConfig: ServicesListServiceConfig;
}

export default function ServicesPage({ servicesConfig }: ServicesPageProps) {
  return (
    <List servicesListConfig={servicesConfig}>
      {({ services: servicesList }: { services: services.Service[] }) => (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900">
                  Services Demo
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/services" className="text-gray-600 hover:text-gray-900">
                  All Services
                </a>
                <a href="/bookings" className="text-gray-600 hover:text-gray-900">
                  My Bookings
                </a>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Page Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
                <p className="mt-4 text-lg text-gray-600">
                  Browse our range of professional services and book your appointment today
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {servicesList.length} services available
                </p>
              </div>

              {/* Error State */}
              <Error>
                {({ error }: { error: string | null }) => (
                  <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-6">
                    <h3 className="font-semibold">Error Loading Services</h3>
                    <p>{error || 'An unknown error occurred'}</p>
                  </div>
                )}
              </Error>

              {/* Services Grid */}
              <Options emptyState={
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Found</h3>
                  <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                </div>
              }>
                {({ services: optionsServices }: { services: services.Service[] }) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ServiceRepeater>
                      {({ service }: { service: services.Service }) => (
                        <Service.Root service={service}>
                          {({ service: rootService }: { service: services.Service }) => (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                              {/* Service Image */}
                              <div className="aspect-video w-full overflow-hidden">
                                <Service.Image className="w-full h-full object-cover" />
                              </div>

                              {/* Service Content */}
                              <div className="p-6">
                                {/* Service Category */}
                                <Service.Category className="text-xs font-semibold text-blue-600 uppercase tracking-wide block mb-2" />

                                {/* Service Name */}
                                <Service.Name className="text-xl font-semibold text-gray-900 mt-2 block" />

                                {/* Service Description */}
                                <Service.Description className="mt-2 text-gray-600 line-clamp-2 block" />

                                {/* Service Details */}
                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    {/* Duration */}
                                    <div className="flex items-center text-gray-500">
                                      <Service.Duration className="flex items-center text-gray-500" />
                                    </div>
                                  </div>

                                  {/* Price */}
                                  <Service.Price className="text-lg font-semibold text-gray-900" />
                                </div>

                                {/* Book Now Button */}
                                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                                  Book Now
                                </button>
                              </div>
                            </div>
                          )}
                        </Service.Root>
                      )}
                    </ServiceRepeater>
                  </div>
                )}
              </Options>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-500">
                © {new Date().getFullYear()} Services Demo. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      )}
    </List>
  );
}
