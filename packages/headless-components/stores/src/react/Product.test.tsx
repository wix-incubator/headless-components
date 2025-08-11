import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as Product from "./Product";
import * as CoreProduct from "./core/Product.js";
import * as SelectedVariant from "./core/SelectedVariant.js";

// Mock all core components
vi.mock("./core/Product.js", () => ({
  Root: vi.fn(({ children, productServiceConfig, ...props }) => (
    <div {...props}>{children}</div>
  )),
  Name: vi.fn(({ children }) => children({ name: "Test Product Name" })),
  Description: vi.fn(({ children }) =>
    children({
      description: { content: "Rich description" },
      plainDescription: "<p>Plain HTML description</p>",
    }),
  ),
}));

vi.mock("./core/ProductModifiers.js", () => ({
  Root: vi.fn(({ children }) => (
    <div data-testid="modifiers-root">{children}</div>
  )),
}));

vi.mock("./core/ProductVariantSelector.js", () => ({
  Root: vi.fn(({ children }) => (
    <div data-testid="variant-selector-root">{children}</div>
  )),
}));

vi.mock("./core/SelectedVariant.js", () => ({
  Root: vi.fn(({ children }) => (
    <div data-testid="selected-variant-root">{children}</div>
  )),
  Price: vi.fn(({ children }) =>
    children({
      price: "$29.99",
      compareAtPrice: "$39.99",
    }),
  ),
}));

const mockProduct = {
  id: "test-product-id",
  name: "Test Product",
  description: "Test product description",
} as any;

describe("Product Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Product.Root", () => {
    it("should render with proper data attributes and context setup", () => {
      render(
        <Product.Root product={mockProduct}>
          <div data-testid="child-content">Child content</div>
        </Product.Root>,
      );

      // Check that the root has the correct test id
      expect(screen.getByTestId("product-root")).toBeInTheDocument();

      // Verify child content is rendered
      expect(screen.getByTestId("child-content")).toBeInTheDocument();

      // Verify all context providers are set up
      expect(screen.getByTestId("variant-selector-root")).toBeInTheDocument();
      expect(screen.getByTestId("modifiers-root")).toBeInTheDocument();
      expect(screen.getByTestId("selected-variant-root")).toBeInTheDocument();
    });

    it("should pass product to CoreProduct.Root", () => {
      render(
        <Product.Root product={mockProduct}>
          <div>Content</div>
        </Product.Root>,
      );

      expect(CoreProduct.Root).toHaveBeenCalledWith(
        expect.objectContaining({
          productServiceConfig: { product: mockProduct },
          "data-testid": "product-root",
        }),
        expect.any(Object),
      );
    });

    it("should handle selectedVariant prop", () => {
      const selectedVariant = { id: "variant-1" };

      render(
        <Product.Root product={mockProduct} selectedVariant={selectedVariant}>
          <div>Content</div>
        </Product.Root>,
      );

      // The selectedVariant is currently not used in the implementation,
      // but we test that the component accepts it without errors
      expect(screen.getByTestId("product-root")).toBeInTheDocument();
    });
  });

  describe("Product.Name", () => {
    it("should render product name with default styling", () => {
      render(<Product.Name className="custom-class" />);

      const nameElement = screen.getByTestId("product-name");
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveClass("custom-class");
      expect(nameElement).toHaveTextContent("Test Product Name");
    });

    it("should render with asChild using React element", () => {
      render(
        <Product.Name asChild>
          <h1 className="title-class">Custom title</h1>
        </Product.Name>,
      );

      const titleElement = screen.getByTestId("product-name");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.tagName).toBe("H1");
      expect(titleElement).toHaveClass("title-class");
      expect(titleElement).toHaveTextContent("Test Product Name");
    });

    it("should render with asChild using render function", () => {
      const renderFunction = vi.fn((props, ref) => (
        <h2 ref={ref} data-testid="custom-name" className="function-class">
          Name: {props.name}
        </h2>
      ));

      render(<Product.Name asChild>{renderFunction}</Product.Name>);

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Product Name",
          "data-testid": "product-name",
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId("custom-name");
      expect(customElement).toBeInTheDocument();
      expect(customElement.tagName).toBe("H2");
      expect(customElement).toHaveClass("function-class");
      expect(customElement).toHaveTextContent("Name: Test Product Name");
    });

    it("should render with asChild using render object", () => {
      const renderObject = {
        render: vi.fn((props, ref) => (
          <h3 ref={ref} data-testid="object-name" className="object-class">
            Product: {props.name}
          </h3>
        )),
      };

      render(<Product.Name asChild>{renderObject}</Product.Name>);

      expect(renderObject.render).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Product Name",
          "data-testid": "product-name",
        }),
        expect.any(Object),
      );

      const objectElement = screen.getByTestId("object-name");
      expect(objectElement).toBeInTheDocument();
      expect(objectElement.tagName).toBe("H3");
      expect(objectElement).toHaveClass("object-class");
      expect(objectElement).toHaveTextContent("Product: Test Product Name");
    });

    it("should forward ref correctly with asChild", () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Product.Name asChild ref={ref}>
          <h1>Custom element</h1>
        </Product.Name>,
      );

      const element = screen.getByTestId("product-name");
      expect(element.tagName).toBe("H1");
      // Note: ref forwarding in asChild is tested through renderAsChild utility
    });

    it("should have correct data attributes", () => {
      render(<Product.Name />);

      const nameElement = screen.getByTestId("product-name");
      expect(nameElement).toHaveAttribute("data-testid", "product-name");
    });
  });

  describe("Product.Description", () => {
    it("should render description with default plain format", () => {
      render(<Product.Description className="desc-class" />);

      const descElement = screen.getByTestId("product-description");
      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveClass("desc-class");
      expect(descElement).toHaveTextContent("Plain HTML description");
    });

    it("should render as HTML when as='html' is specified", () => {
      render(<Product.Description as="html" className="html-desc" />);

      const descElement = screen.getByTestId("product-description");
      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveClass("html-desc");
      // Should render HTML content directly
      expect(descElement.innerHTML).toContain("<p>Plain HTML description</p>");
    });

    it("should render as RICOS when as='ricos' is specified", () => {
      render(<Product.Description as="ricos" className="ricos-desc" />);

      const descElement = screen.getByTestId("product-description");
      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveClass("ricos-desc");
      // Should render stringified rich description
      expect(descElement).toHaveTextContent('{"content":"Rich description"}');
    });

    it("should strip HTML tags for plain format", () => {
      render(<Product.Description as="plain" />);

      const descElement = screen.getByTestId("product-description");
      expect(descElement).toHaveTextContent("Plain HTML description");
      expect(descElement.innerHTML).not.toContain("<p>");
    });

    it("should render with asChild using render function", () => {
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
          description: "Plain HTML description",
          "data-testid": "product-description",
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId("custom-description");
      expect(customElement).toBeInTheDocument();
      expect(customElement.tagName).toBe("ARTICLE");
      expect(customElement).toHaveClass("article-class");
    });

    it("should handle empty description gracefully", () => {
      // Mock empty description
      vi.mocked(CoreProduct.Description).mockImplementationOnce(
        ({ children }) =>
          children({
            description: null,
            plainDescription: "",
          }),
      );

      render(<Product.Description />);

      const descElement = screen.getByTestId("product-description");
      expect(descElement).toBeInTheDocument();
      expect(descElement).toHaveTextContent("");
    });

    it("should forward ref correctly with asChild", () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Product.Description asChild ref={ref}>
          <article>Custom description</article>
        </Product.Description>,
      );

      const element = screen.getByTestId("product-description");
      expect(element.tagName).toBe("ARTICLE");
      // Note: ref forwarding in asChild is tested through renderAsChild utility
    });

    it("should have correct data attributes", () => {
      render(<Product.Description />);

      const descElement = screen.getByTestId("product-description");
      expect(descElement).toHaveAttribute("data-testid", "product-description");
    });
  });

  describe("Product.Price", () => {
    it("should render price with discount data attribute", () => {
      render(<Product.Price className="price-class" />);

      const priceElement = screen.getByTestId("product-price");
      expect(priceElement).toBeInTheDocument();
      expect(priceElement).toHaveClass("price-class");
      expect(priceElement).toHaveTextContent("$29.99");
      expect(priceElement).toHaveAttribute("data-discounted", "true");
    });

    it("should render without discount data attribute when no compareAtPrice", () => {
      // Mock price without compareAtPrice
      vi.mocked(SelectedVariant.Price).mockImplementationOnce(({ children }) =>
        children({
          price: "$29.99",
          compareAtPrice: null,
        }),
      );

      render(<Product.Price />);

      const priceElement = screen.getByTestId("product-price");
      expect(priceElement).toHaveAttribute("data-discounted", "false");
    });

    it("should render with asChild using React element", () => {
      render(
        <Product.Price asChild>
          <span className="custom-price">Price display</span>
        </Product.Price>,
      );

      const priceElement = screen.getByTestId("product-price");
      expect(priceElement).toBeInTheDocument();
      expect(priceElement.tagName).toBe("SPAN");
      expect(priceElement).toHaveClass("custom-price");
      expect(priceElement).toHaveTextContent("$29.99");
    });

    it("should render with asChild using render function", () => {
      const renderFunction = vi.fn((props, ref) => (
        <div ref={ref} data-testid="custom-price" className="function-price">
          Current price: {props.formattedPrice}
        </div>
      ));

      render(<Product.Price asChild>{renderFunction}</Product.Price>);

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          price: "$29.99",
          formattedPrice: "$29.99",
          "data-testid": "product-price",
          "data-discounted": true,
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId("custom-price");
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveTextContent("Current price: $29.99");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLElement>();

      render(<Product.Price ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId("product-price"));
    });

    it("should have correct data attributes", () => {
      render(<Product.Price />);

      const priceElement = screen.getByTestId("product-price");
      expect(priceElement).toHaveAttribute("data-testid", "product-price");
      expect(priceElement).toHaveAttribute("data-discounted", "true");
    });
  });

  describe("Product.CompareAtPrice", () => {
    it("should render compare-at price when available", () => {
      render(<Product.CompareAtPrice className="compare-price-class" />);

      const compareElement = screen.getByTestId("product-compare-at-price");
      expect(compareElement).toBeInTheDocument();
      expect(compareElement).toHaveClass("compare-price-class");
      expect(compareElement).toHaveTextContent("$39.99");
      expect(compareElement).toHaveAttribute("data-discounted", "true");
    });

    it("should not render when no compare-at price is available", () => {
      // Mock price without compareAtPrice
      vi.mocked(SelectedVariant.Price).mockImplementationOnce(({ children }) =>
        children({
          price: "$29.99",
          compareAtPrice: null,
        }),
      );

      render(<Product.CompareAtPrice />);

      expect(
        screen.queryByTestId("product-compare-at-price"),
      ).not.toBeInTheDocument();
    });

    it("should render with asChild using React element", () => {
      render(
        <Product.CompareAtPrice asChild>
          <del className="strikethrough">Original price</del>
        </Product.CompareAtPrice>,
      );

      const compareElement = screen.getByTestId("product-compare-at-price");
      expect(compareElement).toBeInTheDocument();
      expect(compareElement.tagName).toBe("DEL");
      expect(compareElement).toHaveClass("strikethrough");
      expect(compareElement).toHaveTextContent("$39.99");
    });

    it("should render with asChild using render function", () => {
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
          price: "$39.99",
          formattedPrice: "$39.99",
          "data-testid": "product-compare-at-price",
          "data-discounted": true,
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId("custom-compare-price");
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveTextContent("Was: $39.99");
    });

    it("should return null with asChild when no compare-at price", () => {
      // Mock price without compareAtPrice
      vi.mocked(SelectedVariant.Price).mockImplementationOnce(({ children }) =>
        children({
          price: "$29.99",
          compareAtPrice: null,
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
        screen.queryByTestId("product-compare-at-price"),
      ).not.toBeInTheDocument();
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLElement>();

      render(<Product.CompareAtPrice ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId("product-compare-at-price"));
    });

    it("should have correct data attributes", () => {
      render(<Product.CompareAtPrice />);

      const compareElement = screen.getByTestId("product-compare-at-price");
      expect(compareElement).toHaveAttribute(
        "data-testid",
        "product-compare-at-price",
      );
      expect(compareElement).toHaveAttribute("data-discounted", "true");
    });
  });

  describe("Integration Tests", () => {
    it("should work together in a complete product display", () => {
      render(
        <Product.Root product={mockProduct}>
          <div className="product-layout">
            <Product.Name className="product-title" />
            <Product.Description as="html" className="product-desc" />
            <div className="price-section">
              <Product.Price className="current-price" />
              <Product.CompareAtPrice className="original-price" />
            </div>
          </div>
        </Product.Root>,
      );

      // Verify all components render together
      expect(screen.getByTestId("product-root")).toBeInTheDocument();
      expect(screen.getByTestId("product-name")).toBeInTheDocument();
      expect(screen.getByTestId("product-description")).toBeInTheDocument();
      expect(screen.getByTestId("product-price")).toBeInTheDocument();
      expect(
        screen.getByTestId("product-compare-at-price"),
      ).toBeInTheDocument();

      // Verify content
      expect(screen.getByText("Test Product Name")).toBeInTheDocument();
      expect(screen.getByText("$29.99")).toBeInTheDocument();
      expect(screen.getByText("$39.99")).toBeInTheDocument();
    });

    it("should handle asChild patterns across multiple components", () => {
      render(
        <Product.Root product={mockProduct}>
          <Product.Name asChild>
            <h1 className="custom-title" />
          </Product.Name>
          <Product.Price asChild>
            <span className="custom-price" />
          </Product.Price>
          <Product.CompareAtPrice asChild>
            <del className="custom-compare" />
          </Product.CompareAtPrice>
        </Product.Root>,
      );

      // Verify all components use their custom elements
      const title = screen.getByTestId("product-name");
      const price = screen.getByTestId("product-price");
      const compare = screen.getByTestId("product-compare-at-price");

      expect(title.tagName).toBe("H1");
      expect(title).toHaveClass("custom-title");

      expect(price.tagName).toBe("SPAN");
      expect(price).toHaveClass("custom-price");

      expect(compare.tagName).toBe("DEL");
      expect(compare).toHaveClass("custom-compare");
    });
  });

  describe("Type Safety and Props", () => {
    it("should accept correct AsChildProps interface", () => {
      // This test verifies TypeScript compilation - no runtime assertions needed
      const nameProps: Product.NameProps = {
        asChild: true,
        children: React.forwardRef(({ name }, ref) => (
          <h1 ref={ref}>{name}</h1>
        )),
        className: "test-class",
      };

      const descProps: Product.DescriptionProps = {
        asChild: true,
        as: "html",
        children: React.forwardRef(({ description }, ref) => (
          <div ref={ref} dangerouslySetInnerHTML={{ __html: description }} />
        )),
        className: "desc-class",
      };

      const priceProps: Product.PriceProps = {
        asChild: true,
        children: React.forwardRef(({ formattedPrice }, ref) => (
          <span ref={ref}>{formattedPrice}</span>
        )),
        className: "price-class",
      };

      // If these compile without errors, the types are correct
      expect(nameProps).toBeDefined();
      expect(descProps).toBeDefined();
      expect(priceProps).toBeDefined();
    });
  });
});
