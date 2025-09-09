import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as CmsCrudSort from './CmsCrudSort.js';

// Mock the services manager
vi.mock('@wix/services-manager-react', () => ({
  useService: vi.fn(() => ({
    sortSignal: { get: () => [] },
    setSort: vi.fn(),
  })),
}));

describe('CmsCrudSort Components', () => {
  it('should render without crashing', () => {
    render(
      <CmsCrudSort.CmsCrudSort>
        {() => (
          <div>
            <CmsCrudSort.Field fieldName="title">
              {() => <div>Field Content</div>}
            </CmsCrudSort.Field>
            <CmsCrudSort.MultiField>
              {() => <div>MultiField Content</div>}
            </CmsCrudSort.MultiField>
          </div>
        )}
      </CmsCrudSort.CmsCrudSort>
    );
  });
});
