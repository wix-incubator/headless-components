import React, { useState } from 'react';
import type { ServicesListServiceConfig } from '@wix/headless-services/services';
import { List, Options, ServiceRepeater, Error as ServiceError, Service } from '@wix/headless-services/react';
import type { services } from '@wix/bookings';

interface ServicesPageProps {
  servicesConfig: ServicesListServiceConfig;
}

export default function ServicesPage({ servicesConfig }: ServicesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  return (
    <List servicesListConfig={servicesConfig}>
      {({ services: servicesList }: { services: services.Service[] }) => (
        <div className="min-h-screen bg-[#f8f9fa]">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 text-sm rounded-full transition-all ${
                      selectedCategory === null
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Services
                  </button>
                  {Array.from(new Set(servicesList.map(s => s.category?.name))).filter(Boolean).map((category) => (
                    <button
                      key={category as string}
                      onClick={() => setSelectedCategory(category as string)}
                      className={`px-4 py-2 text-sm rounded-full transition-all ${
                        selectedCategory === category
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
                    className="text-sm bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Error State */}
            <ServiceError>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error Loading Services</h3>
                    <p className="mt-2 text-sm text-red-700">Failed to load services. Please try again later.</p>
                  </div>
                </div>
              </div>
            </ServiceError>

            {/* Services Grid */}
            <Options emptyState={
              <div className="text-center py-16">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-light text-gray-900">No Services Found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters or check back later.</p>
              </div>
            }>
              {({ services: optionsServices }: { services: services.Service[] }) => {
                const filteredServices = optionsServices
                  .filter(service => !selectedCategory || service.category?.name === selectedCategory)
                  .sort((a: services.Service, b: services.Service) => {
                    if (sortBy === 'name') {
                      return (a.name || '').localeCompare(b.name || '');
                    } else {
                      const priceA = Number(a.payment?.fixed?.price?.value || 0);
                      const priceB = Number(b.payment?.fixed?.price?.value || 0);
                      return priceA - priceB;
                    }
                  });

                return (
                  <>
                    <p className="text-sm text-gray-500 mb-6">
                      Showing {filteredServices.length} design services
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <ServiceRepeater>
                        {({ service }: { service: services.Service }) => {
                          if (!selectedCategory || service.category?.name === selectedCategory) {
                            return (
                              <Service.Root service={service}>
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                  {/* Service Image */}
                                  <div className="aspect-w-16 aspect-h-9 relative">
                                    <Service.Image className="w-full h-full object-cover" />
                                    {service.category?.name && (
                                      <div className="absolute top-4 left-4">
                                        <Service.Category className="bg-white/90 backdrop-blur-sm text-xs text-gray-700 px-3 py-1 rounded-full font-medium" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Service Content */}
                                  <div className="p-6">
                                    <Service.Name className="text-xl font-medium text-gray-900 mb-2" />
                                    <Service.Description className="text-gray-600 text-sm mb-4 line-clamp-2" />

                                    {/* Service Details */}
                                    <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                                      <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <Service.Duration className="text-gray-600" />
                                      </div>
                                      <Service.Price className="font-medium text-gray-900" />
                                    </div>

                                    {/* Learn More Link */}
                                    <div className="mt-6">
                                      <a href="#" className="block w-full bg-gray-100 text-gray-900 text-center px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                        Learn more
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </Service.Root>
                            );
                          }
                          return null;
                        }}
                      </ServiceRepeater>
                    </div>
                  </>
                );
              }}
            </Options>
          </div>
        </div>
      )}
    </List>
  );
}
