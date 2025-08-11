import React, { forwardRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  renderAsChild,
  type AsChildRenderFunction,
  type AsChildRenderObject,
  type AsChildChildren,
  type AsChildProps,
  type RenderAsChildParams,
} from "./renderAsChild";

// Test component for React element testing
const TestDiv = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

TestDiv.displayName = "TestDiv";

// Test component that uses AsChildProps
interface TestComponentProps
  extends AsChildProps<{ title: string; count: number }> {
  customProp?: string;
}

const TestComponent: React.FC<TestComponentProps> = ({
  asChild,
  children,
  className,
  customProp,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const props = {
    title: "Test Title",
    count: 42,
    customProp,
  };

  if (asChild && children) {
    return renderAsChild({
      children,
      props,
      ref,
      content: "Default content",
      attributes: { className, "data-testid": "test-component" },
    });
  }

  return (
    <div ref={ref} className={className} data-testid="test-component">
      Default content
    </div>
  );
};

describe("renderAsChild", () => {
  describe("React Element Pattern", () => {
    it("should clone React element and forward ref", () => {
      const mockRef = React.createRef<HTMLElement>();
      const element = <div data-original="true">Original content</div>;

      const result = renderAsChild({
        children: element,
        props: { title: "Test" },
        ref: mockRef,
        content: "New content",
        attributes: { "data-testid": "cloned" },
      });

      render(<>{result}</>);

      const clonedElement = screen.getByTestId("cloned");
      expect(clonedElement).toBeInTheDocument();
      expect(clonedElement).toHaveAttribute("data-original", "true");
      expect(clonedElement).toHaveTextContent("New content");
    });

    it("should merge attributes when cloning React element", () => {
      const element = <div className="original" data-original="true" />;

      const result = renderAsChild({
        children: element,
        props: {},
        ref: null,
        attributes: {
          className: "merged",
          "data-testid": "merged-element",
          "data-new": "value",
        },
      });

      render(<>{result}</>);

      const mergedElement = screen.getByTestId("merged-element");
      expect(mergedElement).toHaveClass("merged");
      expect(mergedElement).toHaveAttribute("data-original", "true");
      expect(mergedElement).toHaveAttribute("data-new", "value");
    });

    it("should handle React element with complex props", () => {
      const ComplexComponent = ({ title, count, ...props }: any) => (
        <div {...props}>
          {title} - {count}
        </div>
      );

      const element = <ComplexComponent title="Original" count={1} />;

      const result = renderAsChild({
        children: element,
        props: { title: "Updated", count: 2 },
        ref: null,
        attributes: { "data-testid": "complex" },
      });

      render(<>{result}</>);

      const complexElement = screen.getByTestId("complex");
      expect(complexElement).toHaveTextContent("Original - 1"); // Original props preserved
    });
  });

  describe("Render Function Pattern", () => {
    it("should call render function with props and ref", () => {
      const mockRef = React.createRef<HTMLElement>();
      const renderFunction: AsChildRenderFunction<{
        title: string;
        count: number;
      }> = vi.fn((props, ref) => (
        <h1 ref={ref} data-testid="function-rendered">
          {props.title} - {props.count}
        </h1>
      ));

      const result = renderAsChild({
        children: renderFunction,
        props: { title: "Function Title", count: 123 },
        ref: mockRef,
        attributes: { className: "function-class" },
      });

      render(<>{result}</>);

      expect(renderFunction).toHaveBeenCalledWith(
        { title: "Function Title", count: 123, className: "function-class" },
        mockRef,
      );

      const renderedElement = screen.getByTestId("function-rendered");
      expect(renderedElement).toHaveTextContent("Function Title - 123");
    });

    it("should merge attributes with props in render function", () => {
      const renderFunction: AsChildRenderFunction = (props, ref) => (
        <div ref={ref} {...props}>
          Content
        </div>
      );

      const result = renderAsChild({
        children: renderFunction,
        props: { "data-original": "value" },
        ref: null,
        attributes: {
          "data-testid": "merged-props",
          className: "merged-class",
          "data-additional": "extra",
        },
      });

      render(<>{result}</>);

      const element = screen.getByTestId("merged-props");
      expect(element).toHaveAttribute("data-original", "value");
      expect(element).toHaveAttribute("data-additional", "extra");
      expect(element).toHaveClass("merged-class");
    });

    it("should handle render function returning complex JSX", () => {
      const renderFunction = (
        props: { items: string[] },
        ref: React.Ref<HTMLElement>,
      ) => (
        <ul
          ref={ref as React.Ref<HTMLUListElement>}
          data-testid="complex-function"
        >
          {props.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );

      const result = renderAsChild({
        children: renderFunction,
        props: { items: ["Item 1", "Item 2", "Item 3"] },
        ref: null,
      });

      render(<>{result}</>);

      const list = screen.getByTestId("complex-function");
      expect(list).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });
  });

  describe("Render Object Pattern", () => {
    it("should call render method with props and ref", () => {
      const mockRef = React.createRef<HTMLElement>();
      const renderObject: AsChildRenderObject<{ message: string }> = {
        render: vi.fn((props, ref) => (
          <span ref={ref} data-testid="object-rendered">
            {props.message}
          </span>
        )),
      };

      const result = renderAsChild({
        children: renderObject,
        props: { message: "Object Message" },
        ref: mockRef,
        attributes: { className: "object-class" },
      });

      render(<>{result}</>);

      expect(renderObject.render).toHaveBeenCalledWith(
        { message: "Object Message", className: "object-class" },
        mockRef,
      );

      const renderedElement = screen.getByTestId("object-rendered");
      expect(renderedElement).toHaveTextContent("Object Message");
    });

    it("should handle render object with complex render method", () => {
      const renderObject = {
        render: (
          props: { data: { name: string; age: number } },
          ref: React.Ref<HTMLElement>,
        ) => (
          <div
            ref={ref as React.Ref<HTMLDivElement>}
            data-testid="complex-object"
          >
            <h2>{props.data.name}</h2>
            <p>Age: {props.data.age}</p>
          </div>
        ),
      };

      const result = renderAsChild({
        children: renderObject,
        props: { data: { name: "John Doe", age: 30 } },
        ref: null,
      });

      render(<>{result}</>);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Age: 30")).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should return null when children is undefined", () => {
      const result = renderAsChild({
        children: undefined,
        props: {},
        ref: null,
      });

      expect(result).toBeNull();
    });

    it("should return null when children is null", () => {
      const result = renderAsChild({
        children: null as any,
        props: {},
        ref: null,
      });

      expect(result).toBeNull();
    });

    it("should return null for invalid children types", () => {
      const result = renderAsChild({
        children: "invalid string" as any,
        props: {},
        ref: null,
      });

      expect(result).toBeNull();
    });

    it("should return null for object without render method", () => {
      const result = renderAsChild({
        children: { notRender: () => <div /> } as any,
        props: {},
        ref: null,
      });

      expect(result).toBeNull();
    });

    it("should handle empty props and attributes", () => {
      const renderFunction = vi.fn((props, ref) => (
        <div ref={ref} data-testid="empty-props">
          Content
        </div>
      ));

      const result = renderAsChild({
        children: renderFunction,
        props: {},
        ref: null,
      });

      render(<>{result}</>);

      expect(renderFunction).toHaveBeenCalledWith({}, null);
      expect(screen.getByTestId("empty-props")).toBeInTheDocument();
    });

    it("should handle missing content parameter", () => {
      const element = <div data-testid="no-content">Original</div>;

      const result = renderAsChild({
        children: element,
        props: {},
        ref: null,
        // content is undefined
      });

      render(<>{result}</>);

      const clonedElement = screen.getByTestId("no-content");
      // When content is undefined, React.cloneElement sets children to undefined, clearing the content
      expect(clonedElement).toHaveTextContent("");
    });

    it("should handle missing attributes parameter", () => {
      const renderFunction = vi.fn((props, ref) => (
        <div ref={ref} data-testid="no-attributes">
          Content
        </div>
      ));

      const result = renderAsChild({
        children: renderFunction,
        props: { title: "Test" },
        ref: null,
        // attributes is undefined
      });

      render(<>{result}</>);

      expect(renderFunction).toHaveBeenCalledWith({ title: "Test" }, null);
      expect(screen.getByTestId("no-attributes")).toBeInTheDocument();
    });
  });

  describe("Integration with AsChildProps", () => {
    it("should work with component using AsChildProps interface", () => {
      render(
        <TestComponent asChild className="custom-class" customProp="test-prop">
          {(props, ref) => (
            <h1
              ref={ref as React.Ref<HTMLHeadingElement>}
              data-testid="integrated"
              className={(props as any).className}
            >
              {props.title} - {props.count} - {(props as any).customProp}
            </h1>
          )}
        </TestComponent>,
      );

      const element = screen.getByTestId("integrated");
      expect(element).toHaveTextContent("Test Title - 42 - test-prop");
      expect(element).toHaveClass("custom-class");
    });

    it("should render default content when asChild is false", () => {
      render(
        <TestComponent asChild={false} className="default-class">
          {() => <span>Should not render</span>}
        </TestComponent>,
      );

      const element = screen.getByTestId("test-component");
      expect(element).toHaveTextContent("Default content");
      expect(element).toHaveClass("default-class");
      expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
    });

    it("should work with React element children", () => {
      render(
        <TestComponent asChild className="element-class">
          <article data-testid="article-child">Custom article content</article>
        </TestComponent>,
      );

      // The cloned element gets the test-component testid from attributes, not the original article-child testid
      const element = screen.getByTestId("test-component");
      expect(element.tagName).toBe("ARTICLE");
      expect(element).toHaveTextContent("Default content"); // Content gets replaced
      expect(element).toHaveClass("element-class");
    });
  });

  describe("Type Safety", () => {
    it("should support typed props in render functions", () => {
      interface TypedProps {
        name: string;
        age: number;
        isActive: boolean;
      }

      const typedRenderFunction: AsChildRenderFunction<TypedProps> = (
        props,
        ref,
      ) => (
        <div ref={ref as React.Ref<HTMLDivElement>} data-testid="typed">
          {props.name} - {props.age} - {props.isActive.toString()}
        </div>
      );

      const result = renderAsChild<TypedProps>({
        children: typedRenderFunction,
        props: { name: "Alice", age: 25, isActive: true },
        ref: null,
      });

      render(<>{result}</>);

      const element = screen.getByTestId("typed");
      expect(element).toHaveTextContent("Alice - 25 - true");
    });

    it("should support typed props in render objects", () => {
      interface TypedData {
        items: string[];
        total: number;
      }

      const typedRenderObject: AsChildRenderObject<TypedData> = {
        render: (props, ref) => (
          <div
            ref={ref as React.Ref<HTMLDivElement>}
            data-testid="typed-object"
          >
            Total: {props.total}, Items: {props.items.join(", ")}
          </div>
        ),
      };

      const result = renderAsChild<TypedData>({
        children: typedRenderObject,
        props: { items: ["A", "B", "C"], total: 3 },
        ref: null,
      });

      render(<>{result}</>);

      const element = screen.getByTestId("typed-object");
      expect(element).toHaveTextContent("Total: 3, Items: A, B, C");
    });
  });

  describe("Ref Forwarding", () => {
    it("should properly forward refs to React elements", () => {
      const ref = React.createRef<HTMLDivElement>();
      const element = <div data-testid="ref-element" />;

      const result = renderAsChild({
        children: element,
        props: {},
        ref,
      });

      render(<>{result}</>);

      expect(ref.current).toBe(screen.getByTestId("ref-element"));
    });

    it("should pass refs to render functions", () => {
      const ref = React.createRef<HTMLSpanElement>();
      let receivedRef: React.Ref<HTMLElement> | null = null;

      const renderFunction = (props: any, refParam: React.Ref<HTMLElement>) => {
        receivedRef = refParam;
        return (
          <span
            ref={refParam as React.Ref<HTMLSpanElement>}
            data-testid="ref-function"
          />
        );
      };

      const result = renderAsChild({
        children: renderFunction,
        props: {},
        ref,
      });

      render(<>{result}</>);

      expect(receivedRef).toBe(ref);
      expect(ref.current).toBe(screen.getByTestId("ref-function"));
    });

    it("should pass refs to render object methods", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      let receivedRef: React.Ref<HTMLElement> | null = null;

      const renderObject = {
        render: (props: any, refParam: React.Ref<HTMLElement>) => {
          receivedRef = refParam;
          return (
            <p
              ref={refParam as React.Ref<HTMLParagraphElement>}
              data-testid="ref-object"
            />
          );
        },
      };

      const result = renderAsChild({
        children: renderObject,
        props: {},
        ref,
      });

      render(<>{result}</>);

      expect(receivedRef).toBe(ref);
      expect(ref.current).toBe(screen.getByTestId("ref-object"));
    });
  });
});
