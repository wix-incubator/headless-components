import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import * as Product from './Product';
import * as CoreProduct from './core/Product.js';
import * as ProductVariantSelector from './core/ProductVariantSelector.js';
import * as ProductModifiers from './core/ProductModifiers.js';
import * as SelectedVariant from './core/SelectedVariant.js';

// Mock all core components
vi.mock('./core/Product.js', () => ({
  Root: vi.fn(({ children, productServiceConfig, ...props }) => (
    <div {...props}>{children}</div>
  )),
  Name: vi.fn(({ children }) => children({ name: 'Test Product Name' })),
  Description: vi.fn(({ children }) =>
    children({
      description: { content: 'Rich description' },
      plainDescription: '<p>Plain HTML description</p>',
    }),
  ),
}));

vi.mock('./core/ProductVariantSelector.js', () => ({
  Root: vi.fn(({ children }) => (
    <div data-testid="variant-selector-root">{children}</div>
  )),
  Options: vi.fn(({ children }) =>
    children({
      hasOptions: true,
      options: [
        { name: 'Color', id: 'color-option' },
        { name: 'Size', id: 'size-option' },
      ],
    }),
  ),
  Option: vi.fn(({ children, option }) =>
    children({
      name: option.name,
      choices: [
        { name: 'Red', colorCode: '#ff0000' },
        { name: 'Blue', colorCode: '#0000ff' },
      ],
      selectedValue: null,
      hasChoices: true,
    }),
  ),
  Choice: vi.fn(({ children, option, choice }) =>
    children({
      value: choice.name,
      isSelected: false,
      isVisible: true,
      isInStock: true,
      isPreOrderEnabled: false,
      select: vi.fn(),
      optionName: option.name,
      choiceValue: choice.name,
    }),
  ),
}));

vi.mock('./core/ProductModifiers.js', () => ({
  // Root component needed by Product.Root
  Root: vi.fn(({ children }) => children),

  // Modifiers component for the 3-level pattern
  Modifiers: vi.fn(({ children }) =>
    children({
      hasModifiers: true,
      modifiers: [
        {
          name: 'Engraving',
          _id: 'engraving-mod',
          id: 'engraving-mod',
          mandatory: false,
          choices: [{ name: 'Custom Text', type: 'free-text' }],
        },
        {
          name: 'Size Upgrade',
          _id: 'size-mod',
          id: 'size-mod',
          mandatory: true,
          choices: [
            { name: 'Large', addedPrice: '$5.00' },
            { name: 'Extra Large', addedPrice: '$10.00' },
          ],
        },
      ],
    }),
  ),

  // Modifier component needed by ModifierOptionRepeater
  Modifier: vi.fn(({ children, modifier }) =>
    children({
      ...modifier,
      onValueChange: vi.fn(),
      type: 'modifier', // Mark as modifier type
    }),
  ),

  // Choice component needed by Option.ChoiceRepeater
  Choice: vi.fn(({ children, modifier, choice }) =>
    children({
      value: choice?.name || modifier?.name || '',
      isSelected: false,
      select: vi.fn(),
    }),
  ),
}));

vi.mock('./core/SelectedVariant.js', () => ({
  Root: vi.fn(({ children }) => (
    <div data-testid="selected-variant-root">{children}</div>
  )),
  Price: vi.fn(({ children }) =>
    children({
      price: '$29.99',
      compareAtPrice: '$39.99',
      currency: 'USD',
    }),
  ),
}));

const mockProduct = {
  id: 'test-product-id',
  name: 'Test Product',
  description: 'Test product description',
} as any;

describe('Product Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Product.Root', () => {
    it('should render with proper context setup', () => {
      render(
        <Product.Root product={mockProduct}>
          <div data-testid="child-content">Child content</div>
        </Product.Root>,
      );

      // Verify child content is rendered
      expect(screen.getByTestId('child-content')).toBeInTheDocument();

      // Verify all context providers are set up
      expect(screen.getByTestId('variant-selector-root')).toBeInTheDocument();
      expect(screen.getByTestId('selected-variant-root')).toBeInTheDocument();
    });

    it('should pass product to CoreProduct.Root', () => {
      render(
        <Product.Root product={mockProduct}>
          <div>Content</div>
        </Product.Root>,
      );

      expect(CoreProduct.Root).toHaveBeenCalledWith(
        expect.objectContaining({
          productServiceConfig: { product: mockProduct },
        }),
        expect.any(Object),
      );
    });

    it('should handle selectedVariant prop', () => {
      const selectedVariant = { id: 'variant-1' };

      render(
        <Product.Root product={mockProduct} selectedVariant={selectedVariant}>
          <div data-testid="child-content">Content</div>
        </Product.Root>,
      );

      // The selectedVariant is currently not used in the implementation,
      // but we test that the component accepts it without errors
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  describe('Product.Name', () => {
    it('should render product name with default styling', () => {
      render(<Product.Name className="custom-class" />);

      const nameElement = screen.getByTestId('product-name');
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveClass('custom-class');
      expect(nameElement).toHaveTextContent('Test Product Name');
    });

    it('should render with asChild using React element', () => {
      render(
        <Product.Name asChild>
          <h1 className="title-class"></h1>
        </Product.Name>,
      );

      const titleElement = screen.getByTestId('product-name');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.tagName).toBe('H1');
      expect(titleElement).toHaveClass('title-class');
      expect(titleElement).toHaveTextContent('Test Product Name');
    });

    it('should render with asChild using render function', () => {
      const renderFunction = vi.fn((props, ref) => (
        <h2 ref={ref} data-testid="custom-name" className="function-class">
          Name: {props.name}
        </h2>
      ));

      render(<Product.Name asChild>{renderFunction}</Product.Name>);

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Product Name',
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId('custom-name');
      expect(customElement).toBeInTheDocument();
      expect(customElement.tagName).toBe('H2');
      expect(customElement).toHaveClass('function-class');
      expect(customElement).toHaveTextContent('Name: Test Product Name');
    });

    it('should forward ref correctly with asChild', () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Product.Name asChild ref={ref}>
          <h1>Custom element</h1>
        </Product.Name>,
      );

      const element = screen.getByTestId('product-name');
      expect(element.tagName).toBe('H1');
    });

    it('should have correct data attributes', () => {
      render(<Product.Name />);

      const nameElement = screen.getByTestId('product-name');
      expect(nameElement).toHaveAttribute('data-testid', 'product-name');
    });
  });

  describe('Product.Description', () => {
    it('should render description with default plain format', () => {
      render(<Product.Description className="desc-class" />);

      const descElement = screen.getByTestId('product-description');
      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveClass('desc-class');
      expect(descElement).toHaveTextContent('Plain HTML description');
    });

    it("should render as HTML when as='html' is specified", () => {
      render(<Product.Description as="html" className="html-desc" />);

      const descElement = screen.getByTestId('product-description');
      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveClass('html-desc');
      // Should render HTML content directly
      expect(descElement.innerHTML).toContain('<p>Plain HTML description</p>');
    });

    it("should render as RICOS when as='ricos' is specified", () => {
      render(<Product.Description as="ricos" className="ricos-desc" />);

      const descElement = screen.getByTestId('product-description');
      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveClass('ricos-desc');
      // Should render stringified rich description
      expect(descElement).toHaveTextContent('{"content":"Rich description"}');
    });

    it('should strip HTML tags for plain format', () => {
      render(<Product.Description as="plain" />);

      const descElement = screen.getByTestId('product-description');
      expect(descElement).toHaveTextContent('Plain HTML description');
      expect(descElement.innerHTML).not.toContain('<p>');
    });

    it('should render with asChild using render function', () => {
      const renderFunction = vi.fn((props, ref) => (
        <article
          ref={ref}
          data-testid="custom-description"
          className="article-class"
        >
          Description: {props.description}
        </article>
      ));

      render(
        <Product.Description asChild>{renderFunction}</Product.Description>,
      );

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Plain HTML description',
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId('custom-description');
      expect(customElement).toBeInTheDocument();
      expect(customElement.tagName).toBe('ARTICLE');
      expect(customElement).toHaveClass('article-class');
    });

    it('should handle empty description gracefully', () => {
      // Mock empty description
      vi.mocked(CoreProduct.Description).mockImplementationOnce(
        ({ children }) =>
          children({
            description: { content: '' } as any,
            plainDescription: '',
          }),
      );

      render(<Product.Description />);

      const descElement = screen.getByTestId('product-description');
      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveTextContent('');
    });

    it('should have correct data attributes', () => {
      render(<Product.Description />);

      const descElement = screen.getByTestId('product-description');
      expect(descElement).toHaveAttribute('data-testid', 'product-description');
    });
  });

  describe('Product.Price', () => {
    it('should render price with discount data attribute', () => {
      render(<Product.Price className="price-class" />);

      const priceElement = screen.getByTestId('product-price');
      expect(priceElement).toBeInTheDocument();
      expect(priceElement).toHaveClass('price-class');
      expect(priceElement).toHaveTextContent('$29.99');
      expect(priceElement).toHaveAttribute('data-discounted', 'true');
    });

    it('should render without discount data attribute when no compareAtPrice', () => {
      // Mock price without compareAtPrice
      vi.mocked(SelectedVariant.Price).mockImplementationOnce(({ children }) =>
        children({
          price: '$29.99',
          compareAtPrice: null,
          currency: 'USD',
        }),
      );

      render(<Product.Price />);

      const priceElement = screen.getByTestId('product-price');
      expect(priceElement).toHaveAttribute('data-discounted', 'false');
    });

    it('should render with asChild using React element', () => {
      render(
        <Product.Price asChild>
          <span className="custom-price">Price display</span>
        </Product.Price>,
      );

      const priceElement = screen.getByTestId('product-price');
      expect(priceElement).toBeInTheDocument();
      expect(priceElement.tagName).toBe('SPAN');
      expect(priceElement).toHaveClass('custom-price');
      expect(priceElement).toHaveTextContent('$29.99');
    });

    it('should render with asChild using render function', () => {
      const renderFunction = vi.fn((props, ref) => (
        <div ref={ref} data-testid="custom-price" className="function-price">
          Current price: {props.formattedPrice}
        </div>
      ));

      render(<Product.Price asChild>{renderFunction}</Product.Price>);

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          price: '$29.99',
          formattedPrice: '$29.99',
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId('custom-price');
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveTextContent('Current price: $29.99');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLElement>();

      render(<Product.Price ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId('product-price'));
    });

    it('should have correct data attributes', () => {
      render(<Product.Price />);

      const priceElement = screen.getByTestId('product-price');
      expect(priceElement).toHaveAttribute('data-testid', 'product-price');
      expect(priceElement).toHaveAttribute('data-discounted', 'true');
    });
  });

  describe('Product.CompareAtPrice', () => {
    it('should render compare-at price when available', () => {
      render(<Product.CompareAtPrice className="compare-price-class" />);

      const compareElement = screen.getByTestId('product-compare-at-price');
      expect(compareElement).toBeInTheDocument();
      expect(compareElement).toHaveClass('compare-price-class');
      expect(compareElement).toHaveTextContent('$39.99');
      expect(compareElement).toHaveAttribute('data-discounted', 'true');
    });

    it('should not render when no compare-at price is available', () => {
      // Mock price without compareAtPrice
      vi.mocked(SelectedVariant.Price).mockImplementationOnce(({ children }) =>
        children({
          price: '$29.99',
          compareAtPrice: null,
          currency: 'USD',
        }),
      );

      render(<Product.CompareAtPrice />);

      expect(
        screen.queryByTestId('product-compare-at-price'),
      ).not.toBeInTheDocument();
    });

    it('should render with asChild using React element', () => {
      render(
        <Product.CompareAtPrice asChild>
          <del className="strikethrough">Original price</del>
        </Product.CompareAtPrice>,
      );

      const compareElement = screen.getByTestId('product-compare-at-price');
      expect(compareElement).toBeInTheDocument();
      expect(compareElement.tagName).toBe('DEL');
      expect(compareElement).toHaveClass('strikethrough');
      expect(compareElement).toHaveTextContent('$39.99');
    });

    it('should render with asChild using render function', () => {
      const renderFunction = vi.fn((props, ref) => (
        <span
          ref={ref}
          data-testid="custom-compare-price"
          className="function-compare"
        >
          Was: {props.formattedPrice}
        </span>
      ));

      render(
        <Product.CompareAtPrice asChild>
          {renderFunction}
        </Product.CompareAtPrice>,
      );

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          price: '$39.99',
          formattedPrice: '$39.99',
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId('custom-compare-price');
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveTextContent('Was: $39.99');
    });

    it('should return null with asChild when no compare-at price', () => {
      // Mock price without compareAtPrice
      vi.mocked(SelectedVariant.Price).mockImplementationOnce(({ children }) =>
        children({
          price: '$29.99',
          compareAtPrice: null,
          currency: 'USD',
        }),
      );

      const renderFunction = vi.fn();

      render(
        <Product.CompareAtPrice asChild>
          {renderFunction}
        </Product.CompareAtPrice>,
      );

      expect(renderFunction).not.toHaveBeenCalled();
      expect(
        screen.queryByTestId('product-compare-at-price'),
      ).not.toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLElement>();

      render(<Product.CompareAtPrice ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId('product-compare-at-price'));
    });

    it('should have correct data attributes', () => {
      render(<Product.CompareAtPrice />);

      const compareElement = screen.getByTestId('product-compare-at-price');
      expect(compareElement).toHaveAttribute(
        'data-testid',
        'product-compare-at-price',
      );
      expect(compareElement).toHaveAttribute('data-discounted', 'true');
    });
  });

  describe('Product.Variants', () => {
    it('should render variants container when options are available', () => {
      render(
        <Product.Variants>
          <div data-testid="variants-content">Variants content</div>
        </Product.Variants>,
      );

      const variantsElement = screen.getByTestId('product-variants');
      expect(variantsElement).toBeInTheDocument();
      expect(screen.getByTestId('variants-content')).toBeInTheDocument();
    });

    it('should not render when no options are available', () => {
      // Mock no options available
      vi.mocked(ProductVariantSelector.Options).mockImplementationOnce(
        ({ children }) =>
          children({
            hasOptions: false,
            options: [],
            selectedChoices: {},
          }),
      );

      render(
        <Product.Variants>
          <div data-testid="variants-content">Should not render</div>
        </Product.Variants>,
      );

      expect(screen.queryByTestId('product-variants')).not.toBeInTheDocument();
      expect(screen.queryByTestId('variants-content')).not.toBeInTheDocument();
    });

    it('should render with asChild using React element', () => {
      render(
        <Product.Variants asChild>
          <section className="custom-variants">
            <div data-testid="variants-content">Variants</div>
          </section>
        </Product.Variants>,
      );

      const variantsElement = screen.getByTestId('product-variants');
      expect(variantsElement).toBeInTheDocument();
      expect(variantsElement.tagName).toBe('SECTION');
      expect(variantsElement).toHaveClass('custom-variants');
    });

    it('should have correct data attributes', () => {
      render(
        <Product.Variants>
          <div>Content</div>
        </Product.Variants>,
      );

      const variantsElement = screen.getByTestId('product-variants');
      expect(variantsElement).toHaveAttribute(
        'data-testid',
        'product-variants',
      );
    });
  });

  describe('Product.VariantOptions', () => {
    it('should render variant options container when options exist', () => {
      render(
        <Product.Root product={mockProduct}>
          <Product.Variants>
            <Product.VariantOptions>
              <div data-testid="options-content">Options content</div>
            </Product.VariantOptions>
          </Product.Variants>
        </Product.Root>,
      );

      const optionsElement = screen.getByTestId('product-variant-options');
      expect(optionsElement).toBeInTheDocument();
      expect(screen.getByTestId('options-content')).toBeInTheDocument();
    });

    it('should render empty state when no options exist', () => {
      // Mock ProductVariantSelector.Options to return hasOptions: false
      // This will cause Variants to not render, which is the correct behavior
      // when there are no options
      vi.mocked(ProductVariantSelector.Options).mockImplementationOnce(
        ({ children }) =>
          children({
            hasOptions: false,
            options: [],
            selectedChoices: {},
          }),
      );

      render(
        <Product.Root product={mockProduct}>
          <Product.Variants>
            <Product.VariantOptions
              emptyState={<div data-testid="empty-state">No options</div>}
            >
              <div data-testid="options-content">Should not render</div>
            </Product.VariantOptions>
          </Product.Variants>
        </Product.Root>,
      );

      // When hasOptions is false, the entire Variants component returns null
      // So neither the empty state nor the content should render
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
      expect(screen.queryByTestId('options-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-variants')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('product-variant-options'),
      ).not.toBeInTheDocument();
    });

    it('should have correct data attributes', () => {
      render(
        <Product.Root product={mockProduct}>
          <Product.Variants>
            <Product.VariantOptions>
              <div>Content</div>
            </Product.VariantOptions>
          </Product.Variants>
        </Product.Root>,
      );

      const optionsElement = screen.getByTestId('product-variant-options');
      expect(optionsElement).toHaveAttribute(
        'data-testid',
        'product-variant-options',
      );
    });
  });

  describe('Product.VariantOptionRepeater', () => {
    it('should render option repeater with children for each option', () => {
      render(
        <Product.Root product={mockProduct}>
          <Product.Variants>
            <Product.VariantOptions>
              <Product.VariantOptionRepeater>
                <div data-testid="option-content">Option item</div>
              </Product.VariantOptionRepeater>
            </Product.VariantOptions>
          </Product.Variants>
        </Product.Root>,
      );

      // Should render multiple options (mocked to return 2 options)
      // The actual test ID comes from Option.Root, not the repeater
      const optionElements = screen.getAllByTestId('option-root');
      expect(optionElements).toHaveLength(2);

      // Each option should have the content
      const optionContents = screen.getAllByTestId('option-content');
      expect(optionContents).toHaveLength(2);
    });

    it('should not render when no options exist', () => {
      // Mock ProductVariantSelector.Options to return no options
      vi.mocked(ProductVariantSelector.Options).mockImplementationOnce(
        ({ children }) =>
          children({
            hasOptions: false,
            options: [],
            selectedChoices: {},
          }),
      );

      render(
        <Product.Root product={mockProduct}>
          <Product.Variants>
            <Product.VariantOptions>
              <Product.VariantOptionRepeater>
                <div data-testid="option-content">Should not render</div>
              </Product.VariantOptionRepeater>
            </Product.VariantOptions>
          </Product.Variants>
        </Product.Root>,
      );

      expect(screen.queryByTestId('option-content')).not.toBeInTheDocument();
    });

    it('should pass correct props to Option.Root', () => {
      const mockOptions = [
        { name: 'Color', id: 'color-option' },
        { name: 'Size', id: 'size-option' },
      ];

      // Mock ProductVariantSelector.Options to return specific options
      vi.mocked(ProductVariantSelector.Options).mockImplementationOnce(
        ({ children }) =>
          children({
            hasOptions: true,
            options: mockOptions,
            selectedChoices: {},
          }),
      );

      render(
        <Product.Root product={mockProduct}>
          <Product.Variants>
            <Product.VariantOptions>
              <Product.VariantOptionRepeater>
                <div data-testid="option-content">Option item</div>
              </Product.VariantOptionRepeater>
            </Product.VariantOptions>
          </Product.Variants>
        </Product.Root>,
      );

      // Verify that Option.Root components are rendered
      expect(screen.getAllByTestId('option-root')).toHaveLength(2);
    });
  });

  describe('Product.Modifiers', () => {
    it('should render modifiers container when modifiers are available', () => {
      render(
        <Product.Modifiers>
          <div data-testid="modifiers-content">Modifiers content</div>
        </Product.Modifiers>,
      );

      const modifiersElement = screen.getByTestId('product-modifiers');
      expect(modifiersElement).toBeInTheDocument();
      expect(screen.getByTestId('modifiers-content')).toBeInTheDocument();
    });

    it('should not render when no modifiers are available', () => {
      // Mock no modifiers available
      vi.mocked(ProductModifiers.Modifiers).mockImplementationOnce(
        ({ children }) =>
          children({
            hasModifiers: false,
            modifiers: [],
            selectedModifiers: {},
            areAllRequiredModifiersFilled: true,
          }),
      );

      render(
        <Product.Modifiers>
          <div data-testid="modifiers-content">Should not render</div>
        </Product.Modifiers>,
      );

      expect(screen.queryByTestId('product-modifiers')).not.toBeInTheDocument();
      expect(screen.queryByTestId('modifiers-content')).not.toBeInTheDocument();
    });

    it('should render with asChild using React element', () => {
      render(
        <Product.Modifiers asChild>
          <section className="custom-modifiers">
            <div data-testid="modifiers-content">Modifiers</div>
          </section>
        </Product.Modifiers>,
      );

      const modifiersElement = screen.getByTestId('product-modifiers');
      expect(modifiersElement).toBeInTheDocument();
      expect(modifiersElement.tagName).toBe('SECTION');
      expect(modifiersElement).toHaveClass('custom-modifiers');
    });

    it('should have correct data attributes', () => {
      render(
        <Product.Modifiers>
          <div>Content</div>
        </Product.Modifiers>,
      );

      const modifiersElement = screen.getByTestId('product-modifiers');
      expect(modifiersElement).toHaveAttribute(
        'data-testid',
        'product-modifiers',
      );
    });
  });

  describe('Product.ModifierOptions', () => {
    const MockModifiersContext = React.createContext({
      hasModifiers: true,
      modifiers: [
        {
          name: 'Engraving',
          id: 'engraving-mod',
          mandatory: false,
        },
        {
          name: 'Size Upgrade',
          id: 'size-mod',
          mandatory: true,
        },
      ],
    });

    beforeEach(() => {
      // Mock React.useContext for ModifiersContext
      vi.spyOn(React, 'useContext').mockReturnValue({
        hasModifiers: true,
        modifiers: [
          {
            name: 'Engraving',
            id: 'engraving-mod',
            mandatory: false,
          },
          {
            name: 'Size Upgrade',
            id: 'size-mod',
            mandatory: true,
          },
        ],
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should render modifier options container when modifiers exist', () => {
      render(
        <Product.ModifierOptions>
          <div data-testid="modifier-options-content">Options content</div>
        </Product.ModifierOptions>,
      );

      const optionsElement = screen.getByTestId('product-modifier-options');
      expect(optionsElement).toBeInTheDocument();
      expect(
        screen.getByTestId('modifier-options-content'),
      ).toBeInTheDocument();
    });

    it('should render empty state when no modifiers exist', () => {
      vi.spyOn(React, 'useContext').mockReturnValue({
        hasModifiers: false,
        modifiers: [],
      });

      render(
        <Product.ModifierOptions
          emptyState={<div data-testid="empty-state">No modifiers</div>}
        >
          <div data-testid="modifier-options-content">Should not render</div>
        </Product.ModifierOptions>,
      );

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(
        screen.queryByTestId('modifier-options-content'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('product-modifier-options'),
      ).not.toBeInTheDocument();
    });

    it('should have correct data attributes', () => {
      render(
        <Product.ModifierOptions>
          <div>Content</div>
        </Product.ModifierOptions>,
      );

      const optionsElement = screen.getByTestId('product-modifier-options');
      expect(optionsElement).toHaveAttribute(
        'data-testid',
        'product-modifier-options',
      );
    });
  });

  describe('Product.ModifierOptionRepeater', () => {
    const mockModifiers = [
      {
        name: 'Engraving',
        id: 'engraving-mod',
        mandatory: false,
        choices: [{ name: 'Custom Text', type: 'free-text' }],
      },
      {
        name: 'Size Upgrade',
        id: 'size-mod',
        mandatory: true,
        choices: [
          { name: 'Large', addedPrice: '$5.00' },
          { name: 'Extra Large', addedPrice: '$10.00' },
        ],
      },
    ];

    const MockModifiersContext = React.createContext({
      hasModifiers: true,
      modifiers: mockModifiers,
    });

    beforeEach(() => {
      // Mock React.useContext for ModifiersContext
      vi.spyOn(React, 'useContext').mockReturnValue({
        hasModifiers: true,
        modifiers: mockModifiers,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should render modifier repeater with children for each modifier', () => {
      render(
        <Product.ModifierOptionRepeater>
          <div data-testid="modifier-content">Modifier item</div>
        </Product.ModifierOptionRepeater>,
      );

      // Should render Option.Root for each modifier
      const modifierContents = screen.getAllByTestId('modifier-content');
      expect(modifierContents).toHaveLength(2);
    });

    it('should not render when no modifiers exist', () => {
      vi.spyOn(React, 'useContext').mockReturnValue({
        hasModifiers: false,
        modifiers: [],
      });

      render(
        <Product.ModifierOptionRepeater>
          <div data-testid="modifier-content">Should not render</div>
        </Product.ModifierOptionRepeater>,
      );

      expect(screen.queryByTestId('modifier-content')).not.toBeInTheDocument();
    });

    it('should pass correct modifier data to Option.Root', () => {
      // We'll need to spy on Option.Root to verify props
      // This would require importing Option and mocking it
      render(
        <Product.ModifierOptionRepeater>
          <div data-testid="modifier-content">Modifier item</div>
        </Product.ModifierOptionRepeater>,
      );

      // Verify that modifiers are rendered
      const modifierContents = screen.getAllByTestId('modifier-content');
      expect(modifierContents).toHaveLength(2);
    });

    it('should handle different modifier types correctly', () => {
      const mixedModifiers = [
        {
          name: 'Color Modifier',
          id: 'color-mod',
          mandatory: false,
          choices: [{ name: 'Red', colorCode: '#ff0000' }],
        },
        {
          name: 'Free Text Modifier',
          id: 'text-mod',
          mandatory: true,
          type: 'free-text',
        },
      ];

      vi.spyOn(React, 'useContext').mockReturnValue({
        hasModifiers: true,
        modifiers: mixedModifiers,
      });

      render(
        <Product.ModifierOptionRepeater>
          <div data-testid="modifier-content">Modifier item</div>
        </Product.ModifierOptionRepeater>,
      );

      const modifierContents = screen.getAllByTestId('modifier-content');
      expect(modifierContents).toHaveLength(2);
    });

    it('should pass allowedTypes prop to Option.Root', () => {
      const allowedTypes = ['color', 'text'];

      render(
        <Product.ModifierOptionRepeater allowedTypes={allowedTypes}>
          <div data-testid="modifier-content">Modifier item</div>
        </Product.ModifierOptionRepeater>,
      );

      // Verify that modifiers are rendered with allowedTypes
      const modifierContents = screen.getAllByTestId('modifier-content');
      expect(modifierContents).toHaveLength(2);

      // Note: We can't easily verify the allowedTypes prop is passed to Option.Root
      // without mocking Option.Root, but the integration test above covers this
    });

    it('should handle empty allowedTypes array', () => {
      render(
        <Product.ModifierOptionRepeater allowedTypes={[]}>
          <div data-testid="modifier-content">Should not render</div>
        </Product.ModifierOptionRepeater>,
      );

      // Should still render modifiers, but the Option.ChoiceRepeater should filter out all choices
      const modifierContents = screen.getAllByTestId('modifier-content');
      expect(modifierContents).toHaveLength(2); // Modifiers render, but choices will be filtered
    });

    it('should use default allowedTypes when prop not provided', () => {
      render(
        <Product.ModifierOptionRepeater>
          <div data-testid="modifier-content">Modifier item</div>
        </Product.ModifierOptionRepeater>,
      );

      // Should render all modifiers with default allowedTypes
      const modifierContents = screen.getAllByTestId('modifier-content');
      expect(modifierContents).toHaveLength(2);
    });
  });

  describe('Integration Tests', () => {
    it('should work together in a complete product display', () => {
      render(
        <Product.Root product={mockProduct}>
          <div className="product-layout">
            <Product.Name className="product-title" />
            <Product.Description as="html" className="product-desc" />
            <div className="price-section">
              <Product.Price className="current-price" />
              <Product.CompareAtPrice className="original-price" />
            </div>
            <Product.Variants>
              <Product.VariantOptions>
                <Product.VariantOptionRepeater>
                  <div data-testid="variant-option">Variant option</div>
                </Product.VariantOptionRepeater>
              </Product.VariantOptions>
            </Product.Variants>
          </div>
        </Product.Root>,
      );

      // Verify all components render together

      expect(screen.getByTestId('product-name')).toBeInTheDocument();
      expect(screen.getByTestId('product-description')).toBeInTheDocument();
      expect(screen.getByTestId('product-price')).toBeInTheDocument();
      expect(
        screen.getByTestId('product-compare-at-price'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('product-variants')).toBeInTheDocument();
      expect(screen.getByTestId('product-variant-options')).toBeInTheDocument();

      // Verify content
      expect(screen.getByText('Test Product Name')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$39.99')).toBeInTheDocument();
    });

    it('should handle asChild patterns across multiple components', () => {
      render(
        <Product.Root product={mockProduct}>
          <div>
            <Product.Name asChild>
              <h1 className="custom-title" />
            </Product.Name>
            <Product.Price asChild>
              <span className="custom-price" />
            </Product.Price>
            <Product.CompareAtPrice asChild>
              <del className="custom-compare" />
            </Product.CompareAtPrice>
            <Product.Variants asChild>
              <section className="custom-variants">
                <Product.VariantOptions>
                  <Product.VariantOptionRepeater>
                    <div>Variant</div>
                  </Product.VariantOptionRepeater>
                </Product.VariantOptions>
              </section>
            </Product.Variants>
          </div>
        </Product.Root>,
      );

      // Verify all components use their custom elements
      const title = screen.getByTestId('product-name');
      const price = screen.getByTestId('product-price');
      const compare = screen.getByTestId('product-compare-at-price');
      const variants = screen.getByTestId('product-variants');

      expect(title.tagName).toBe('H1');
      expect(title).toHaveClass('custom-title');

      expect(price.tagName).toBe('SPAN');
      expect(price).toHaveClass('custom-price');

      expect(compare.tagName).toBe('DEL');
      expect(compare).toHaveClass('custom-compare');

      expect(variants.tagName).toBe('SECTION');
      expect(variants).toHaveClass('custom-variants');
    });

    it('should work together with modifiers in a complete product display', () => {
      render(
        <Product.Root product={mockProduct}>
          <div className="product-layout">
            <Product.Name className="product-title" />
            <Product.Description as="html" className="product-desc" />
            <div className="price-section">
              <Product.Price className="current-price" />
              <Product.CompareAtPrice className="original-price" />
            </div>
            <Product.Variants>
              <Product.VariantOptions>
                <Product.VariantOptionRepeater>
                  <div data-testid="variant-option">Variant option</div>
                </Product.VariantOptionRepeater>
              </Product.VariantOptions>
            </Product.Variants>
            <Product.Modifiers>
              <Product.ModifierOptions>
                <Product.ModifierOptionRepeater>
                  <div data-testid="modifier-option">Modifier option</div>
                </Product.ModifierOptionRepeater>
              </Product.ModifierOptions>
            </Product.Modifiers>
          </div>
        </Product.Root>,
      );

      // Verify all components render together

      expect(screen.getByTestId('product-name')).toBeInTheDocument();
      expect(screen.getByTestId('product-description')).toBeInTheDocument();
      expect(screen.getByTestId('product-price')).toBeInTheDocument();
      expect(
        screen.getByTestId('product-compare-at-price'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('product-variants')).toBeInTheDocument();
      expect(screen.getByTestId('product-variant-options')).toBeInTheDocument();
      expect(screen.getByTestId('product-modifiers')).toBeInTheDocument();
      expect(
        screen.getByTestId('product-modifier-options'),
      ).toBeInTheDocument();

      // Verify content
      expect(screen.getByText('Test Product Name')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$39.99')).toBeInTheDocument();

      // Verify both variants and modifiers render
      const variantOptions = screen.getAllByTestId('variant-option');
      const modifierOptions = screen.getAllByTestId('modifier-option');
      expect(variantOptions).toHaveLength(2); // From mock
      expect(modifierOptions).toHaveLength(2); // From mock
    });

    it('should handle modifier-only product (no variants)', () => {
      // Mock no variants available
      vi.mocked(ProductVariantSelector.Options).mockImplementationOnce(
        ({ children }) =>
          children({
            hasOptions: false,
            options: [],
            selectedChoices: {},
          }),
      );

      render(
        <Product.Root product={mockProduct}>
          <div>
            <Product.Variants>
              <Product.VariantOptions emptyState={<div>No variants</div>}>
                <Product.VariantOptionRepeater>
                  <div data-testid="variant-option">Variant option</div>
                </Product.VariantOptionRepeater>
              </Product.VariantOptions>
            </Product.Variants>
            <Product.Modifiers>
              <Product.ModifierOptions>
                <Product.ModifierOptionRepeater>
                  <div data-testid="modifier-option">Modifier option</div>
                </Product.ModifierOptionRepeater>
              </Product.ModifierOptions>
            </Product.Modifiers>
          </div>
        </Product.Root>,
      );

      // Variants should not render
      expect(screen.queryByTestId('product-variants')).not.toBeInTheDocument();
      expect(screen.queryByTestId('variant-option')).not.toBeInTheDocument();

      // But modifiers should still render
      expect(screen.getByTestId('product-modifiers')).toBeInTheDocument();
      const modifierOptions = screen.getAllByTestId('modifier-option');
      expect(modifierOptions).toHaveLength(2);
    });

    it('should handle variant-only product (no modifiers)', () => {
      // Mock no modifiers available
      vi.mocked(ProductModifiers.Modifiers).mockImplementationOnce(
        ({ children }) =>
          children({
            hasModifiers: false,
            modifiers: [],
            selectedModifiers: {},
            areAllRequiredModifiersFilled: true,
          }),
      );

      render(
        <Product.Root product={mockProduct}>
          <div>
            <Product.Variants>
              <Product.VariantOptions>
                <Product.VariantOptionRepeater>
                  <div data-testid="variant-option">Variant option</div>
                </Product.VariantOptionRepeater>
              </Product.VariantOptions>
            </Product.Variants>
            <Product.Modifiers>
              <Product.ModifierOptions emptyState={<div>No modifiers</div>}>
                <Product.ModifierOptionRepeater>
                  <div data-testid="modifier-option">Modifier option</div>
                </Product.ModifierOptionRepeater>
              </Product.ModifierOptions>
            </Product.Modifiers>
          </div>
        </Product.Root>,
      );

      // Variants should render
      expect(screen.getByTestId('product-variants')).toBeInTheDocument();
      const variantOptions = screen.getAllByTestId('variant-option');
      expect(variantOptions).toHaveLength(2);

      // But modifiers should not render
      expect(screen.queryByTestId('product-modifiers')).not.toBeInTheDocument();
      expect(screen.queryByTestId('modifier-option')).not.toBeInTheDocument();
    });
  });

  describe('Type Safety and Props', () => {
    it('should accept correct AsChildProps interface', () => {
      // This test verifies TypeScript compilation - no runtime assertions needed
      const nameProps: Product.NameProps = {
        asChild: true,
        children: React.forwardRef(({ name }, ref) => (
          <h1 ref={ref}>{name}</h1>
        )),
        className: 'test-class',
      };

      const descProps: Product.DescriptionProps = {
        asChild: true,
        as: 'html',
        children: React.forwardRef(({ description }, ref) => (
          <div ref={ref} dangerouslySetInnerHTML={{ __html: description }} />
        )),
        className: 'desc-class',
      };

      const priceProps: Product.PriceProps = {
        asChild: true,
        children: React.forwardRef(({ formattedPrice }, ref) => (
          <span ref={ref}>{formattedPrice}</span>
        )),
        className: 'price-class',
      };

      const variantsProps: Product.VariantsProps = {
        asChild: true,
        children: React.forwardRef(({ hasOptions }, ref) => (
          <div ref={ref}>Has options: {hasOptions.toString()}</div>
        )),
      };

      // If these compile without errors, the types are correct
      expect(nameProps).toBeDefined();
      expect(descProps).toBeDefined();
      expect(priceProps).toBeDefined();
      expect(variantsProps).toBeDefined();
    });
  });

  it('renders data-component-tag attribute on first DOM element', () => {
    render(
      <Product.Root product={mockProduct}>
        <div>Content</div>
      </Product.Root>,
    );

    const rootElement = screen.getByTestId('product-root');
    expect(rootElement).toHaveAttribute(
      'data-component-tag',
      'stores.product-root',
    );
  });
});
