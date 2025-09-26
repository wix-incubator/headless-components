import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import * as Category from './Category';

vi.mock('./core/ProductListFilters.js', () => ({
  CategoryFilter: vi.fn(({ children }) => {
    const mockRenderProps = {
      selectedCategory: null,
      setSelectedCategory: vi.fn(),
    };
    return children(mockRenderProps);
  }),
}));

const mockCategory = {
  id: 'test-category-id',
  name: 'Test Category',
  slug: 'test-category',
};

describe('Category', () => {
  describe('Root', () => {
    it('renders data-component-tag attribute on first DOM element', () => {
      render(
        <Category.Root category={mockCategory}>
          <div>Content</div>
        </Category.Root>,
      );

      const rootElement = screen.getByTestId('category-root');
      expect(rootElement).toHaveAttribute(
        'data-component-tag',
        'stores.category-root',
      );
    });
  });
});
