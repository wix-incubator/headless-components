import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as CMSCrud from './CMSCrud.js';

// Mock the services manager
vi.mock('@wix/services-manager-react', () => ({
  useService: vi.fn(() => ({
    loadingSignal: { get: () => false },
    errorSignal: { get: () => null },
    itemsSignal: { get: () => [] },
    itemSignal: { get: () => null },
    currentCollectionSignal: { get: () => 'test-collection' },
    create: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setCollection: vi.fn(),
  })),
  WixServices: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@wix/services-manager', () => ({
  createServicesMap: vi.fn(() => ({
    addService: vi.fn(() => ({})),
  })),
}));

describe('CMSCrud Components', () => {
  it('should render without crashing', () => {
    render(
      <CMSCrud.Root cmsCrudServiceConfig={{ collectionId: 'test' }}>
        <CMSCrud.CMSCrud>
          {() => <div>Test Content</div>}
        </CMSCrud.CMSCrud>
      </CMSCrud.Root>
    );
  });
});
