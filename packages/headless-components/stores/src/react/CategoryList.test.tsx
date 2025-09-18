import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import * as CategoryList from './CategoryList';

vi.mock('./core/CategoryList.js', () => ({
  Root: vi.fn(({ children }) => (
    <div data-testid="core-category-list-root">{children}</div>
  )),
  EmptyState: vi.fn(({ children }) => (
    <div data-testid="core-empty-state">{children}</div>
  )),
}));

const mockCategories = [
  {
    id: 'test-category-1',
    name: 'Test Category 1',
    slug: 'test-category-1',
  },
  {
    id: 'test-category-2',
    name: 'Test Category 2',
    slug: 'test-category-2',
  },
];

describe('CategoryList', () => {
  describe('Root', () => {
    it('renders data-component-tag attribute on first DOM element', () => {
      const { container } = render(
        <CategoryList.Root categories={mockCategories}>
          <div>Content</div>
        </CategoryList.Root>,
      );

      const rootElement = container.querySelector(
        '[data-component-tag="stores.category-list-root"]',
      )!;
      expect(rootElement).toHaveAttribute(
        'data-component-tag',
        'stores.category-list-root',
      );
    });
  });
});
