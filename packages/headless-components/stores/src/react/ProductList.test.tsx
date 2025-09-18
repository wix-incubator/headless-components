import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import * as ProductList from './ProductList';
import { GenericList } from '@wix/headless-components/react';

vi.mock('@wix/headless-components/react', () => ({
  GenericList: {
    Root: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  },
}));

vi.mock('@wix/services-manager-react', () => ({
  useService: vi.fn(() => ({
    products: {
      get: () => [],
    },
    isLoading: {
      get: () => false,
    },
    total: {
      get: () => 0,
    },
    hasMoreProducts: {
      get: () => false,
    },
    loadMore: vi.fn(),
  })),
  WixServices: vi.fn(({ children }) => <div>{children}</div>),
}));

const mockProducts = [
  {
    id: 'test-product-1',
    name: 'Test Product 1',
    slug: 'test-product-1',
  },
  {
    id: 'test-product-2',
    name: 'Test Product 2',
    slug: 'test-product-2',
  },
];

describe('ProductList', () => {
  describe('Root', () => {
    it('renders data-component-tag attribute on first DOM element', () => {
      render(
        <ProductList.Root products={mockProducts}>
          <div>Content</div>
        </ProductList.Root>,
      );

      const rootElement = screen.getByTestId('product-list-root');
      expect(rootElement).toHaveAttribute(
        'data-component-tag',
        'stores.product-list-root',
      );
    });
  });
});
