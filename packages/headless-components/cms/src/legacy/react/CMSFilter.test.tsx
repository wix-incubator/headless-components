import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as CMSFilter from './CMSFilter.js';

// Mock the services manager
vi.mock('@wix/services-manager-react', () => ({
  useService: vi.fn(() => ({
    filterSignal: { get: () => ({}) },
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
    clearFilters: vi.fn(),
  })),
}));

describe('CMSFilter Components', () => {
  it('should render without crashing', () => {
    render(
      <CMSFilter.CMSFilter>
        {() => (
          <div>
            <CMSFilter.Field fieldName="title">
              {() => <div>Field Content</div>}
            </CMSFilter.Field>
            <CMSFilter.Condition fieldName="title" operator="$eq" value="test">
              {() => <div>Condition Content</div>}
            </CMSFilter.Condition>
          </div>
        )}
      </CMSFilter.CMSFilter>
    );
  });
});
