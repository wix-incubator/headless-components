import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import * as CartCoupon from './CartCoupon';

describe('CartCoupon', () => {
  describe('Root', () => {
    it('renders data-component-tag attribute on first DOM element', () => {
      const { container } = render(
        <CartCoupon.Root>
          <div>Content</div>
        </CartCoupon.Root>,
      );

      const rootElement = container.querySelector(
        '[data-component-tag="ecom.cart-coupon-root"]',
      )!;
      expect(rootElement).toHaveAttribute(
        'data-component-tag',
        'ecom.cart-coupon-root',
      );
    });
  });
});
