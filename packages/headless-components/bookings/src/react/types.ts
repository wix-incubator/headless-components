import { services } from '@wix/bookings';

export interface ServiceListConfig {
  services: services.Service[];
  searchOptions: {
    cursorPaging: {
      limit: number;
    };
  };
  pagingMetadata: {
    count: number;
  };
  aggregations: {
    results: any[];
  };
  customizations: any[];
}

export interface ServiceContextValue {
  service: services.Service;
}

export interface ServiceListRenderProps {
  services: services.Service[];
}

export interface ServiceRenderProps {
  service: services.Service;
}

export interface ErrorRenderProps {
  error: string | null;
}

export interface ServiceListState {
  services: services.Service[];
  pagingMetadata: {
    count: number;
  };
  filters: Record<string, any>;
  error: string | null;
}

export interface ServiceListServiceValue {
  services: {
    get: () => services.Service[];
  };
  pagingMetadata: {
    get: () => { count: number };
  };
  filters: {
    get: () => Record<string, any>;
  };
  error: {
    get: () => string | null;
  };
}
