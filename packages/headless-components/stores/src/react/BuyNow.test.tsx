import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { BuyNow } from './BuyNow'; // This is the component under test

vi.mock('@wix/ecom', () => ({
  checkout: {
    createCheckout: vi.fn(), // Define vi.fn() directly here
    ChannelType: { WEB: 'WEB' },
  },
}));

vi.mock('@wix/redirects', () => ({
  redirects: {
    createRedirectSession: vi.fn(), // Define vi.fn() directly here
  },
}));

const originalLocation = window.location;
let ecomCheckoutMock: any;
let redirectsMock: any;

beforeEach(async () => {
  // Dynamically import the mocked modules to get the mock functions
  const ecom = await import('@wix/ecom');
  ecomCheckoutMock = ecom.checkout;
  const redirectsModule = await import('@wix/redirects');
  redirectsMock = redirectsModule.redirects;

  vi.clearAllMocks(); // This will clear all vi.fn() instances, including those above

  delete (window as any).location;
  (window as any).location = { ...originalLocation, href: '' };

  // Default successful responses
  ecomCheckoutMock.createCheckout.mockResolvedValue({ _id: 'test-checkout-id' });
  redirectsMock.createRedirectSession.mockResolvedValue({
    redirectSession: { fullUrl: 'http://mocked-redirect-url.com' },
  });
});

afterEach(() => {
  window.location = originalLocation;
});

describe('BuyNow Component from @wix/headless-stores/react', () => {
  const testProductId = 'test-product-123';
  const testVariant = { color: 'blue' };

  // Updated to capture the redirectToCheckout function for direct invocation in rejection tests
  const renderComponent = (props = {}) => {
    let capturedRedirectToCheckout: () => Promise<void> = async () => {};
    const renderOutput = render(
      <BuyNow
        productId={testProductId}
        variant={testVariant}
        {...props}
      >
        {({ isLoading, redirectToCheckout }) => {
          capturedRedirectToCheckout = redirectToCheckout as () => Promise<void>;
          if (isLoading) return <div>Loading...</div>;
          return <button onClick={redirectToCheckout}>Buy Product Now</button>;
        }}
      </BuyNow>
    );
    return { ...renderOutput, redirectToCheckoutDirectly: capturedRedirectToCheckout };
  };

  test('should render the button with children render prop', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /Buy Product Now/i })).toBeInTheDocument();
  });

  test('should show loading state and call checkout and redirect services on click', async () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /Buy Product Now/i });
    fireEvent.click(button);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(ecomCheckoutMock.createCheckout).toHaveBeenCalledTimes(1);
    });
    expect(ecomCheckoutMock.createCheckout).toHaveBeenCalledWith({
      lineItems: [{
        catalogReference: {
          catalogItemId: testProductId,
          appId: '215238eb-22a5-4c36-9e7b-e7c08025e04e',
          options: {
            options: testVariant,
          }
        },
        quantity: 1
      }],
      channelType: 'WEB',
    });

    await waitFor(() => {
      expect(redirectsMock.createRedirectSession).toHaveBeenCalledTimes(1);
    });
    expect(redirectsMock.createRedirectSession).toHaveBeenCalledWith({
      ecomCheckout: { checkoutId: 'test-checkout-id' },
      callbacks: {
        postFlowUrl: expect.any(String),
      },
    });

    await waitFor(() => {
      expect(window.location.href).toBe('http://mocked-redirect-url.com');
    });

    expect(screen.getByRole('button', { name: /Buy Product Now/i })).toBeInTheDocument();
  });

  test('should handle checkout creation failure and reject', async () => {
    ecomCheckoutMock.createCheckout.mockResolvedValueOnce({ _id: null });

    const { redirectToCheckoutDirectly } = renderComponent();
    await act(async () => {
      await expect(redirectToCheckoutDirectly()).rejects.toThrow('Failed to create checkout');
    });

    expect(screen.getByRole('button', { name: /Buy Product Now/i })).toBeInTheDocument();
    expect(ecomCheckoutMock.createCheckout).toHaveBeenCalledTimes(1);
    expect(redirectsMock.createRedirectSession).not.toHaveBeenCalled();
  });

   test('should set isLoading to false and reject if redirects.createRedirectSession throws', async () => {
    redirectsMock.createRedirectSession.mockRejectedValueOnce(new Error('Redirect failed'));

    const { redirectToCheckoutDirectly } = renderComponent();
    await act(async () => {
      await expect(redirectToCheckoutDirectly()).rejects.toThrow('Redirect failed');
    });

    expect(screen.getByRole('button', { name: /Buy Product Now/i })).toBeInTheDocument();
    expect(redirectsMock.createRedirectSession).toHaveBeenCalledTimes(1);
    expect(window.location.href).not.toBe('http://mocked-redirect-url.com');
  });
});
