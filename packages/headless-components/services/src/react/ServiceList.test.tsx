import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from './test-ids.js';
import { List, Options, ServiceRepeater, Service, Error } from './ServiceList.tsx';
import { services } from '@wix/bookings';
import { useService, WixServices } from '@wix/services-manager-react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServicesListServiceDefinition } from '../services/services-list-service.js';

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
const createMockServiceValue = (overrides = {}) => ({
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

describe('ServiceList Components', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Default mock implementation
    (useService as ReturnType<typeof vi.fn>).mockImplementation((service) => {
      if (service === ServicesListServiceDefinition) {
        return createMockServiceValue();
      }
      return {};
    });
  });

  describe('List Component', () => {
    it('should render list with correct data attributes', () => {
      render(
        <List services={mockServices}>
          <div>Content</div>
        </List>,
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
        <List services={mockServices}>
          <Options>
            <div>Content</div>
          </Options>
        </List>,
      );

      const options = screen.getByTestId(TestIds.servicesOptions);
      expect(options).toHaveAttribute('data-empty', 'false');
      expect(options).toHaveAttribute('data-infinite-scroll', 'true');
      expect(options).toHaveAttribute('data-page-size', '0');
    });

    it('should render empty state when no services', () => {
      (useService as ReturnType<typeof vi.fn>).mockImplementation((service) => {
        if (service === ServicesListServiceDefinition) {
          return createMockServiceValue({
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
        <List services={[]}>
          <Options
            emptyState={<div data-testid="empty-state">No services</div>}
          >
            <div>Content</div>
          </Options>
        </List>,
      );

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('ServiceRepeater Component', () => {
    it('should render service repeater for each service', () => {
      render(
        <List services={mockServices}>
          <Options>
            <ServiceRepeater>
              <div>Service Content</div>
            </ServiceRepeater>
          </Options>
        </List>,
      );

      const repeaters = screen.getAllByTestId(TestIds.serviceRepeater);
      expect(repeaters).toHaveLength(2);
      expect(repeaters[0]).toHaveAttribute('data-service-id', 'service1');
      expect(repeaters[1]).toHaveAttribute('data-service-id', 'service2');
    });

    it('should render children as function with service data', () => {
      render(
        <List services={mockServices}>
          <Options>
            <ServiceRepeater>
              {({ service }) => (
                <div data-testid={`service-name-${service._id}`}>
                  {service.name}
                </div>
              )}
            </ServiceRepeater>
          </Options>
        </List>,
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
    const renderServiceComponent = (Component: React.ComponentType<any>) => {
      render(
        <Service.Root service={mockServices[0]}>
          <Component />
        </Service.Root>,
      );
    };

    it('should render Service.Name correctly', () => {
      renderServiceComponent(Service.Name);
      expect(screen.getByTestId(TestIds.serviceName)).toHaveTextContent(
        'Test Service 1',
      );
    });

    it('should render Service.Description correctly', () => {
      renderServiceComponent(Service.Description);
      expect(screen.getByTestId(TestIds.serviceDescription)).toHaveTextContent(
        'Service 1 Description',
      );
    });

    it('should render Service.Price correctly', () => {
      renderServiceComponent(Service.Price);
      expect(screen.getByTestId(TestIds.servicePrice)).toHaveTextContent(
        '100 USD',
      );
    });

    it('should render Service.Duration correctly', () => {
      renderServiceComponent(Service.Duration);
      expect(screen.getByTestId(TestIds.serviceDuration)).toHaveTextContent(
        '60 minutes',
      );
    });
  });

  describe('Error Component', () => {
    it('should not render when there is no error', () => {
      render(
        <List services={mockServices}>
          <Error>Error occurred</Error>
        </List>,
      );

      expect(
        screen.queryByTestId(TestIds.serviceError),
      ).not.toBeInTheDocument();
    });

    it('should render error message when there is an error', () => {
      (useService as ReturnType<typeof vi.fn>).mockImplementation((service) => {
        if (service === ServicesListServiceDefinition) {
          return createMockServiceValue({
            error: {
              get: () => 'Test error message',
              peek: () => 'Test error message',
            },
          });
        }
        return {};
      });

      render(
        <List services={mockServices}>
          <Error>
            <div data-testid="custom-error">Test error message</div>
          </Error>
        </List>,
      );

      expect(screen.getByTestId(TestIds.serviceError)).toBeInTheDocument();
      expect(screen.getByTestId(TestIds.serviceError)).toHaveAttribute(
        'data-error',
        'Test error message',
      );
    });
  });
});
