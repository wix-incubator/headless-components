import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import * as LineItem from './LineItem';

const mockLineItem = {
  id: 'test-line-item-id',
  productName: 'Test Product',
  quantity: 1,
  price: { amount: '29.99', currency: 'USD' },
};

describe('LineItem', () => {
  describe('Root', () => {
    it('renders data-component-tag attribute on first DOM element', () => {
      const { container } = render(
        <LineItem.Root item={mockLineItem}>
          <div>Product: {mockLineItem.productName}</div>
        </LineItem.Root>,
      );

      const rootElement = container.firstElementChild;
      expect(rootElement).toHaveAttribute(
        'data-component-tag',
        'ecom.line-item-root',
      );
    });

    it('renders data-component-tag attribute on custom element when asChild=true', () => {
      const { container } = render(
        <LineItem.Root item={mockLineItem} asChild={true}>
          <div>Product: {mockLineItem.productName}</div>
        </LineItem.Root>,
      );

      const rootElement = container.firstElementChild;
      expect(rootElement).toHaveAttribute(
        'data-component-tag',
        'ecom.line-item-root',
      );
      expect(rootElement).toHaveTextContent('Product: Test Product');
    });
  });
});
