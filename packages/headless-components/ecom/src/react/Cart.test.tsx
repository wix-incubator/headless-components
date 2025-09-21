import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import * as Cart from './Cart';

describe('Cart', () => {
  describe('Root', () => {
    it('renders data-component-tag attribute on first DOM element', () => {
      render(
        <Cart.Root>
          <div>Content</div>
        </Cart.Root>,
      );

      const rootElement = screen.getByTestId('cart-root');
      expect(rootElement).toHaveAttribute(
        'data-component-tag',
        'ecom.cart-root',
      );
    });
  });
});
