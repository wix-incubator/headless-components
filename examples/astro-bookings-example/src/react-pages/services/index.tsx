import React, { useState } from 'react';
import type { ServicesListServiceConfig } from '@wix/headless-bookings/services';
import { ServiceList, Service } from '@wix/headless-bookings/react';
import type { services } from '@wix/bookings';
import { Sort } from '../../components/styled-components/Sort';

interface ServicesPageProps {
  servicesConfig: ServicesListServiceConfig;
}

export default function ServicesPage({ servicesConfig }: ServicesPageProps) {
  return (
    <ServiceList.List servicesListConfig={servicesConfig}>
      {({ services: servicesList }: { services: services.Service[] }) => (
        <div className="min-h-screen bg-surface-primary">
          {/* Header */}
          <div className="bg-surface-card shadow-sm border-surface-primary mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Sort */}
                <Sort className="w-48" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Error State */}
            <ServiceList.Error>
              <div className="bg-status-danger-light border border-status-danger rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-status-danger"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-status-danger">
                      Error Loading Services
                    </h3>
                    <p className="mt-2 text-sm text-status-danger">
                      Failed to load services. Please try again later.
                    </p>
                  </div>
                </div>
              </div>
            </ServiceList.Error>

            {/* Services Grid */}
            <ServiceList.Options
              emptyState={
                <div className="text-center py-16">
                  <div className="mx-auto h-12 w-12 text-content-muted">
                    <svg
                      className="h-full w-full"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-light text-content-primary">
                    No Services Found
                  </h3>
                  <p className="mt-2 text-content-secondary">
                    Try adjusting your filters or check back later.
                  </p>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ServiceList.ServiceRepeater>
                  <div className="bg-surface-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* Service Image */}
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <Service.Image />
                    </div>

                    {/* Service Content */}
                    <div className="p-6">
                      <Service.Name>
                        {({ name }) => (
                          <h3 className="text-xl font-medium text-content-primary mb-2">
                            {name}
                          </h3>
                        )}
                      </Service.Name>
                      <Service.Description>
                        {({ description }) =>
                          description && (
                            <p className="text-content-secondary text-sm mb-4 line-clamp-2">
                              {description}
                            </p>
                          )
                        }
                      </Service.Description>

                      {/* Service Details */}
                      <div className="flex items-center justify-between text-sm border-t border-surface-primary pt-4">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-content-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <Service.Price>
                          {({ price }) =>
                            price && (
                              <span className="font-medium text-content-primary">
                                {price.value} {price.currency}
                              </span>
                            )
                          }
                        </Service.Price>
                      </div>

                      {/* Learn More Link */}
                      <div className="mt-6">
                        <a
                          href="#"
                          className="block w-full bg-surface-primary text-content-primary text-center px-4 py-2 rounded-lg font-medium hover:bg-surface-secondary transition-colors"
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                  </div>
                </ServiceList.ServiceRepeater>
              </div>
            </ServiceList.Options>
          </div>
        </div>
      )}
    </ServiceList.List>
  );
}
