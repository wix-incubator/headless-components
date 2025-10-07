import React from 'react';
import { Price } from '@wix/headless-components';

// Sample data for different price scenarios
const samplePrices = {
  regular: {
    current: {
      amount: 2999, // $29.99 in cents
      currency: 'USD',
      symbol: '$',
      formatted: '$29.99',
    },
    locale: 'en-US',
    precision: 2,
  },

  onSale: {
    current: {
      amount: 1999, // $19.99 in cents
      currency: 'USD',
      symbol: '$',
      formatted: '$19.99',
    },
    compareAt: {
      amount: 2999, // $29.99 in cents
      currency: 'USD',
      symbol: '$',
      formatted: '$29.99',
    },
    discount: {
      amount: {
        amount: 1000, // $10.00 discount
        currency: 'USD',
        symbol: '$',
        formatted: '$10.00',
      },
      percentage: 33.33,
    },
    isOnSale: true,
    locale: 'en-US',
    precision: 2,
  },

  priceRange: {
    current: {
      amount: 1500, // $15.00 in cents
      currency: 'USD',
      symbol: '$',
      formatted: '$15.00',
    },
    range: {
      min: {
        amount: 1500, // $15.00 in cents
        currency: 'USD',
        symbol: '$',
        formatted: '$15.00',
      },
      max: {
        amount: 4500, // $45.00 in cents
        currency: 'USD',
        symbol: '$',
        formatted: '$45.00',
      },
    },
    locale: 'en-US',
    precision: 2,
  },

  euroPrice: {
    current: {
      amount: 2550, // €25.50 in cents
      currency: 'EUR',
      symbol: '€',
      formatted: '€25.50',
    },
    locale: 'de-DE',
    precision: 2,
  },
};

function CodeBlock({ children }) {
  return (
    <pre className="bg-secondary text-secondary-foreground p-4 rounded-lg text-sm overflow-x-auto font-paragraph">
      <code>{children}</code>
    </pre>
  );
}

function ExampleSection({ title, description, price, children, code }) {
  return (
    <div className="mb-12 border-b border-foreground pb-8 last:border-b-0">
      <div className="mb-6">
        <h3 className="text-2xl font-heading text-foreground mb-2">{title}</h3>
        <p className="text-secondary-foreground font-paragraph">
          {description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-heading text-foreground mb-4">Result:</h4>
          <div className="bg-background border border-foreground rounded-lg p-6">
            <Price.Root price={price}>{children}</Price.Root>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-heading text-foreground mb-4">Code:</h4>
          <CodeBlock>{code}</CodeBlock>
        </div>
      </div>
    </div>
  );
}

function PriceExamples() {
  return (
    <div className="bg-background min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading text-foreground mb-4">
            Price Component Examples
          </h2>
          <p className="text-lg text-secondary-foreground font-paragraph">
            Explore different ways to use the Price component for various
            scenarios
          </p>
        </div>

        <div className="space-y-12">
          {/* Basic Price Display */}
          <ExampleSection
            title="Basic Price Display"
            description="Simple price display using the formatted price"
            price={samplePrices.regular}
            code={`const regularPrice = {
  current: {
    amount: 2999, // $29.99 in cents
    currency: 'USD',
    symbol: '$',
    formatted: '$29.99',
  },
  locale: 'en-US',
  precision: 2,
};

<Price.Root price={regularPrice}>
  <Price.Formatted className="text-2xl font-bold" />
</Price.Root>`}
          >
            <Price.Formatted className="text-2xl font-heading text-foreground" />
          </ExampleSection>

          {/* Detailed Price Breakdown */}
          <ExampleSection
            title="Detailed Price Breakdown"
            description="Display individual price components separately"
            price={samplePrices.regular}
            code={`const regularPrice = {
  current: {
    amount: 2999, // $29.99 in cents
    currency: 'USD',
    symbol: '$',
    formatted: '$29.99',
  },
  locale: 'en-US',
  precision: 2,
};

<Price.Root price={regularPrice}>
  <div className="flex items-center gap-2">
    <span>
      <Price.Symbol className="text-xl font-paragraph" />
      <Price.Amount className="text-xl font-heading text-foreground" />
    </span>
    <Price.Currency className="text-sm text-gray-500" />
  </div>
</Price.Root>`}
          >
            <div className="flex items-center gap-2">
              <span>
                <Price.Symbol className="text-xl font-paragraph" />
                <Price.Amount className="text-xl font-heading text-foreground" />
              </span>
              <Price.Currency className="text-sm text-secondary-foreground font-paragraph" />
            </div>
          </ExampleSection>

          {/* Sale Price with Discount */}
          <ExampleSection
            title="Sale Price with Discount"
            description="Show current price, original price, and discount information"
            price={samplePrices.onSale}
            code={`const salePrice = {
  current: {
    amount: 1999, // $19.99 in cents
    currency: 'USD',
    symbol: '$',
    formatted: '$19.99',
  },
  compareAt: {
    amount: 2999, // $29.99 in cents
    currency: 'USD',
    symbol: '$',
    formatted: '$29.99',
  },
  discount: {
    amount: {
      amount: 1000, // $10.00 discount
      currency: 'USD',
      symbol: '$',
      formatted: '$10.00',
    },
    percentage: 33.33,
  },
  isOnSale: true,
  locale: 'en-US',
  precision: 2,
};

<Price.Root price={salePrice}>
  <div className="flex items-center gap-3">
    <Price.Formatted className="text-2xl font-bold text-green-500" />
    <Price.CompareAt className="text-lg line-through text-gray-500" />
    <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
      <Price.DiscountPercentage /> OFF
    </div>
  </div>
  <div className="mt-2 text-sm text-gray-600">
    You save <Price.Discount className="font-bold" />
  </div>
</Price.Root>`}
          >
            <div className="flex items-center gap-3">
              <Price.Formatted className="text-2xl font-heading text-green-500" />
              <Price.CompareAt className="text-lg line-through text-secondary-foreground font-paragraph" />
              <div className="bg-destructive text-primary-foreground px-2 py-1 rounded text-sm font-paragraph">
                <Price.DiscountPercentage /> OFF
              </div>
            </div>
            <div className="mt-2 text-sm text-secondary-foreground font-paragraph">
              You save <Price.Discount className="font-heading" />
            </div>
          </ExampleSection>

          {/* Price Range Display */}
          <ExampleSection
            title="Price Range Display"
            description="Show price ranges with minimum and maximum values"
            price={samplePrices.priceRange}
            code={`const rangePrice = {
  current: {
    amount: 1500, // $15.00 in cents
    currency: 'USD',
    symbol: '$',
    formatted: '$15.00',
  },
  range: {
    min: {
      amount: 1500, // $15.00 in cents
      currency: 'USD',
      symbol: '$',
      formatted: '$15.00',
    },
    max: {
      amount: 4500, // $45.00 in cents
      currency: 'USD',
      symbol: '$',
      formatted: '$45.00',
    },
  },
  locale: 'en-US',
  precision: 2,
};

<Price.Root price={rangePrice}>
  <Price.Range>
    <div className="flex items-center gap-2">
      <Price.Min className="font-bold" />
      <span>-</span>
      <Price.Max className="font-bold" />
    </div>
  </Price.Range>
</Price.Root>`}
          >
            <Price.Range>
              <div className="flex items-center gap-2">
                <Price.Min className="font-heading text-foreground" />
                <span className="text-foreground font-paragraph">-</span>
                <Price.Max className="font-heading text-foreground" />
              </div>
            </Price.Range>
          </ExampleSection>

          {/* International Currency */}
          <ExampleSection
            title="International Currency"
            description="Price display with European formatting and currency"
            price={samplePrices.euroPrice}
            code={`const euroPrice = {
  current: {
    amount: 2550, // €25.50 in cents
    currency: 'EUR',
    symbol: '€',
    formatted: '€25.50',
  },
  locale: 'de-DE',
  precision: 2,
};

<Price.Root price={euroPrice}>
  <div className="text-center">
    <Price.Formatted className="text-3xl font-bold" />
    <div className="mt-1 text-sm text-gray-500">
      Formatted for German locale (de-DE)
    </div>
  </div>
</Price.Root>`}
          >
            <div className="text-center">
              <Price.Formatted className="text-3xl font-heading text-foreground" />
              <div className="mt-1 text-sm text-secondary-foreground font-paragraph">
                Formatted for German locale (de-DE)
              </div>
            </div>
          </ExampleSection>

          {/* Product Card Example */}
          <ExampleSection
            title="Product Card Example"
            description="Complete product card with price on sale"
            price={samplePrices.onSale}
            code={`const salePrice = {
  current: {
    amount: 1999, // $19.99 in cents
    currency: 'USD',
    symbol: '$',
    formatted: '$19.99',
  },
  compareAt: {
    amount: 2999, // $29.99 in cents
    currency: 'USD',
    symbol: '$',
    formatted: '$29.99',
  },
  discount: {
    amount: {
      amount: 1000, // $10.00 discount
      currency: 'USD',
      symbol: '$',
      formatted: '$10.00',
    },
    percentage: 33.33,
  },
  isOnSale: true,
  locale: 'en-US',
  precision: 2,
};

<Price.Root price={salePrice}>
  <div className="border rounded-lg p-4 max-w-sm">
    <div className="h-32 bg-gray-200 rounded mb-4"></div>
    <h3 className="font-bold text-lg mb-2">Sample Product</h3>
    <div className="flex justify-between items-end">
      <div>
        <Price.Formatted className="text-2xl font-bold text-green-600" />
        <Price.CompareAt className="text-sm line-through text-gray-500 block" />
      </div>
      <Price.DiscountPercentage className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm" />
    </div>
  </div>
</Price.Root>`}
          >
            <div className="border border-foreground rounded-lg p-4 max-w-sm bg-background">
              <div className="h-32 bg-secondary rounded mb-4"></div>
              <h3 className="font-heading text-lg text-foreground mb-2">
                Sample Product
              </h3>
              <div className="flex justify-between items-end">
                <div>
                  <Price.Formatted className="text-2xl font-heading text-green-500" />
                  <Price.CompareAt className="text-sm line-through text-secondary-foreground block font-paragraph" />
                </div>
                <Price.DiscountPercentage className="bg-destructive text-primary-foreground px-2 py-1 rounded text-sm font-paragraph" />
              </div>
            </div>
          </ExampleSection>
        </div>

        {/* API Reference */}
        <div className="mt-16 p-8 bg-secondary rounded-lg">
          <h3 className="text-2xl font-heading text-foreground mb-4">
            Available Components
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-heading text-foreground mb-2">
                Basic Components:
              </h4>
              <ul className="space-y-1 text-secondary-foreground font-paragraph text-sm">
                <li>
                  • <code>Price.Root</code> - Context provider
                </li>
                <li>
                  • <code>Price.Formatted</code> - Complete formatted price
                </li>
                <li>
                  • <code>Price.Amount</code> - Price amount only
                </li>
                <li>
                  • <code>Price.Symbol</code> - Currency symbol
                </li>
                <li>
                  • <code>Price.Currency</code> - Currency code
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-foreground mb-2">
                Sale Components:
              </h4>
              <ul className="space-y-1 text-secondary-foreground font-paragraph text-sm">
                <li>
                  • <code>Price.CompareAt</code> - Original price
                </li>
                <li>
                  • <code>Price.Discount</code> - Discount amount
                </li>
                <li>
                  • <code>Price.DiscountPercentage</code> - Discount %
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-heading text-foreground mb-2">
              Range Components:
            </h4>
            <ul className="space-y-1 text-secondary-foreground font-paragraph text-sm">
              <li>
                • <code>Price.Range</code> - Range context provider
              </li>
              <li>
                • <code>Price.Min</code> - Minimum price
              </li>
              <li>
                • <code>Price.Max</code> - Maximum price
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceExamples;
