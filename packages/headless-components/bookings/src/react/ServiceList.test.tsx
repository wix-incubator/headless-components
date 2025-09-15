import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestIds } from './test-ids.js';
import { ServiceList } from './index.js';
import { Service } from './core/Service.js';
import {
  Root as CoreServiceListRoot,
  Error as CoreServiceListError,
  ItemContent as CoreServiceListItemContent,
} from './core/ServiceList.js';
import { services } from '@wix/bookings';
import { useService, WixServices } from '@wix/services-manager-react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServicesListServiceDefinition } from '../services/services-list-service.js';
import { ServiceServiceDefinition } from '../services/service-service.js';

// Mock modules
vi.mock('@wix/services-manager-react', () => ({
  useService: vi.fn(),
  WixServices: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@wix/bookings', () => ({
  services: {
    queryServices: vi.fn().mockReturnValue({
      limit: vi.fn().mockReturnThis(),
      find: vi.fn().mockResolvedValue({
        items: [],
        totalCount: 0,
        hasNext: () => false,
      }),
    }),
  },
}));

// Mock service data
const mockDuration = {
  name: '60 minutes',
  minutes: 60,
};

const mockServices: services.Service[] = [
  {
    _id: 'service1',
    name: 'Test Service 1',
    description: 'Service 1 Description',
    payment: {
      fixed: {
        price: {
          value: '100',
          currency: 'USD',
        },
      },
    },
    schedule: {
      availabilityConstraints: {
        durations: [mockDuration],
      },
    },
    category: {
      name: 'Test Category',
    },
  },
  {
    _id: 'service2',
    name: 'Test Service 2',
    description: 'Service 2 Description',
    payment: {
      fixed: {
        price: {
          value: '200',
          currency: 'USD',
        },
      },
    },
    schedule: {
      availabilityConstraints: {
        durations: [{ ...mockDuration, durationInMinutes: 90 }],
      },
    },
    category: {
      name: 'Test Category 2',
    },
  },
] as services.Service[];

// Mock service list config
const mockServiceListConfig = {
  services: mockServices,
  searchOptions: {
    cursorPaging: { limit: 10 },
  },
  pagingMetadata: {
    count: mockServices.length,
    cursors: {
      next: null,
      prev: null,
    },
    hasNext: false,
  },
  aggregations: {
    results: [],
  },
  customizations: [],
};

// Create a mock service value factory
const createMockServicesListServiceValue = (overrides = {}) => ({
  services: {
    get: () => mockServices,
    peek: () => mockServices,
    set: () => mockServices,
  },
  pagingMetadata: {
    get: () => ({ count: mockServices.length }),
    peek: () => ({ count: mockServices.length }),
    set: () => ({ count: mockServices.length }),
  },
  filters: {
    get: () => ({}),
    peek: () => ({}),
    set: () => ({}),
  },
  error: {
    get: () => null,
    peek: () => null,
    set: () => null,
  },
  isLoading: {
    get: () => false,
    peek: () => false,
    set: () => false,
  },
  sort: {
    get: () => [],
    peek: () => [],
    set: () => [],
  },
  setSort: vi.fn(),
  setFilter: vi.fn(),
  resetFilter: vi.fn(),
  isFiltered: () => false,
  loadMore: vi.fn(),
  hasMoreServices: false,
  ...overrides,
});

const createMockServiceValue = (overrides = {}) => ({
  service: {
    get: () => mockServices[0],
    peek: () => mockServices[0],
    set: () => mockServices[0],
  },
  ...overrides,
});

describe('ServiceList Components', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Default mock implementation
    (useService as ReturnType<typeof vi.fn>).mockImplementation((service) => {
      if (service === ServicesListServiceDefinition) {
        return createMockServicesListServiceValue();
      }
      if (service === ServiceServiceDefinition) {
        return createMockServiceValue();
      }
      return {};
    });
  });

  describe('List Component', () => {
    it('should render list with correct data attributes', () => {
      render(
        <ServiceList.List services={mockServices}>
          <div>Content</div>
        </ServiceList.List>,
      );

      const list = screen.getByTestId(TestIds.servicesList);
      expect(list).toHaveAttribute('data-total-services', '2');
      expect(list).toHaveAttribute('data-displayed-services', '2');
      expect(list).toHaveAttribute('data-filtered', 'false');
    });
  });

  describe('Options Component', () => {
    it('should render options with correct data attributes', () => {
      render(
        <ServiceList.List services={mockServices}>
          <ServiceList.Options>
            <div>Content</div>
          </ServiceList.Options>
        </ServiceList.List>,
      );

      const options = screen.getByTestId(TestIds.servicesOptions);
      expect(options).toHaveAttribute('data-empty', 'false');
      expect(options).toHaveAttribute('data-infinite-scroll', 'true');
      expect(options).toHaveAttribute('data-page-size', '0');
    });

    it('should render empty state when no services', () => {
      (useService as ReturnType<typeof vi.fn>).mockImplementation((service) => {
        if (service === ServicesListServiceDefinition) {
          return createMockServicesListServiceValue({
            services: {
              get: () => [],
              peek: () => [],
              set: () => [],
            },
          });
        }
        return {};
      });

      render(
        <ServiceList.List services={[]}>
          <ServiceList.Options
            emptyState={<div data-testid="empty-state">No services</div>}
          >
            <div>Content</div>
          </ServiceList.Options>
        </ServiceList.List>,
      );

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('ServiceRepeater Component', () => {
    it('should render service repeater for each service', () => {
      render(
        <ServiceList.List services={mockServices}>
          <ServiceList.Options>
            <CoreServiceListItemContent>
              {({ service }) => (
                <Service.Root key={service._id} serviceConfig={{ service }}>
                  <div>Service Content</div>
                </Service.Root>
              )}
            </CoreServiceListItemContent>
          </ServiceList.Options>
        </ServiceList.List>,
      );

      const services = screen.getAllByText('Service Content');
      expect(services).toHaveLength(2);
    });

    it('should render children as function with service data', () => {
      render(
        <ServiceList.List services={mockServices}>
          <ServiceList.Options>
            <CoreServiceListItemContent>
              {({ service }) => (
                <div data-testid={`service-name-${service._id}`}>
                  {service.name}
                </div>
              )}
            </CoreServiceListItemContent>
          </ServiceList.Options>
        </ServiceList.List>,
      );

      expect(screen.getByTestId('service-name-service1')).toHaveTextContent(
        'Test Service 1',
      );
      expect(screen.getByTestId('service-name-service2')).toHaveTextContent(
        'Test Service 2',
      );
    });
  });

  describe('Service Components', () => {
    it('should render Service.Name correctly', () => {
      render(
        <Service.Root serviceConfig={{ service: mockServices[0] }}>
          <Service.Name>
            {({ name }) => <div data-testid={TestIds.serviceName}>{name}</div>}
          </Service.Name>
        </Service.Root>,
      );
      expect(screen.getByTestId(TestIds.serviceName)).toHaveTextContent(
        'Test Service 1',
      );
    });

    it('should render Service.Description correctly', () => {
      render(
        <Service.Root serviceConfig={{ service: mockServices[0] }}>
          <Service.Description>
            {({ description }) => (
              <div data-testid={TestIds.serviceDescription}>{description}</div>
            )}
          </Service.Description>
        </Service.Root>,
      );
      expect(screen.getByTestId(TestIds.serviceDescription)).toHaveTextContent(
        'Service 1 Description',
      );
    });

    it('should render Service.Price correctly', () => {
      render(
        <Service.Root serviceConfig={{ service: mockServices[0] }}>
          <Service.Price>
            {({ price }) => (
              <div data-testid={TestIds.servicePrice}>
                {price?.value} {price?.currency}
              </div>
            )}
          </Service.Price>
        </Service.Root>,
      );
      expect(screen.getByTestId(TestIds.servicePrice)).toHaveTextContent(
        '100 USD',
      );
    });
  });

  describe('Error Component', () => {
    it('should not render when there is no error', () => {
      render(
        <ServiceList.List services={mockServices}>
          <ServiceList.Error>Error occurred</ServiceList.Error>
        </ServiceList.List>,
      );

      expect(
        screen.queryByTestId(TestIds.serviceError),
      ).not.toBeInTheDocument();
    });

    it('should render error message when there is an error', () => {
      (useService as ReturnType<typeof vi.fn>).mockImplementation((service) => {
        if (service === ServicesListServiceDefinition) {
          return createMockServicesListServiceValue({
            error: {
              get: () => 'Test error message',
              peek: () => 'Test error message',
            },
          });
        }
        return {};
      });

      render(
        <ServiceList.List services={mockServices}>
          <ServiceList.Error>
            <div data-testid="custom-error">Test error message</div>
          </ServiceList.Error>
        </ServiceList.List>,
      );

      expect(screen.getByTestId(TestIds.serviceError)).toBeInTheDocument();
      expect(screen.getByTestId(TestIds.serviceError)).toHaveAttribute(
        'data-error',
        'Test error message',
      );
    });
  });
});
