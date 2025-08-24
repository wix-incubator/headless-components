import React, { forwardRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  AsChildSlot,
  type AsChildSlot as AsChildSlotProps,
} from './AsChildSlot';

// Test component for React element testing
const TestDiv = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

TestDiv.displayName = 'TestDiv';

// Test component that uses AsChildSlot
interface TestComponentProps extends AsChildSlotProps {
  title?: string;
  count?: number;
}

const TestComponent = forwardRef<HTMLElement, TestComponentProps>(
  (props, ref) => {
    return <AsChildSlot {...props} ref={ref} />;
  },
);

describe('AsChildSlot', () => {
  describe('asChild with customElement as React Element', () => {
    it('should clone React element and forward ref', () => {
      const mockRef = React.createRef<HTMLElement>();
      const customElement = <div data-original="true">Original content</div>;

      render(
        <TestComponent
          asChild
          customElement={customElement}
          content="New content"
          data-testid="cloned"
          ref={mockRef}
        />,
      );

      const clonedElement = screen.getByTestId('cloned');
      expect(clonedElement).toBeInTheDocument();
      expect(clonedElement).toHaveAttribute('data-original', 'true');
      expect(clonedElement).toHaveTextContent('New content');
      expect(mockRef.current).toBe(clonedElement);
    });

    it('should merge props when cloning React element', () => {
      const customElement = (
        <div className="original" data-original="true">
          Content
        </div>
      );

      render(
        <TestComponent
          asChild
          customElement={customElement}
          className="merged"
          data-testid="merged-element"
          data-new="value"
        />,
      );

      const mergedElement = screen.getByTestId('merged-element');
      expect(mergedElement).toHaveClass('merged');
      expect(mergedElement).toHaveAttribute('data-original', 'true');
      expect(mergedElement).toHaveAttribute('data-new', 'value');
    });

    it('should handle React element without content prop', () => {
      const customElement = (
        <div data-testid="no-content">Original content</div>
      );

      render(
        <TestComponent
          asChild
          customElement={customElement}
          className="test-class"
        />,
      );

      const element = screen.getByTestId('no-content');
      expect(element).toHaveClass('test-class');
      // When content is undefined, original content should be preserved
      expect(element).toHaveTextContent('Original content');
    });
  });

  describe('asChild with customElement as Render Function', () => {
    it('should call render function with customElementProps and ref', () => {
      const mockRef = React.createRef<HTMLElement>();
      const customElementProps = { title: 'Function Title', count: 123 };
      const renderFunction = vi.fn((props, ref) => (
        <h1 ref={ref} data-testid="function-rendered">
          {props.title} - {props.count}
        </h1>
      ));

      render(
        <TestComponent
          asChild
          customElement={renderFunction}
          customElementProps={customElementProps}
          className="function-class"
          ref={mockRef}
        />,
      );

      expect(renderFunction).toHaveBeenCalledWith(customElementProps, mockRef);

      const renderedElement = screen.getByTestId('function-rendered');
      expect(renderedElement).toHaveTextContent('Function Title - 123');
      expect(mockRef.current).toBe(renderedElement);
    });

    it('should handle render function with empty customElementProps', () => {
      const renderFunction = vi.fn((props, ref) => (
        <div ref={ref} data-testid="empty-props">
          Content
        </div>
      ));

      render(
        <TestComponent
          asChild
          customElement={renderFunction}
          data-testid="wrapper"
        />,
      );

      expect(renderFunction).toHaveBeenCalledWith({}, expect.any(Object));
      expect(screen.getByTestId('empty-props')).toBeInTheDocument();
    });

    it('should handle render function returning complex JSX', () => {
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

      render(
        <TestComponent
          asChild
          customElement={renderFunction}
          customElementProps={{ items: ['Item 1', 'Item 2', 'Item 3'] }}
        />,
      );

      const list = screen.getByTestId('complex-function');
      expect(list).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('customElement as Render Object', () => {
    it('should call render method with customElementProps and ref', () => {
      const mockRef = React.createRef<HTMLElement>();
      const customElementProps = { message: 'Object Message' };
      const renderObject = {
        render: vi.fn((props, ref) => (
          <span ref={ref} data-testid="object-rendered">
            {props.message}
          </span>
        )),
      };

      render(
        <TestComponent
          asChild
          customElement={renderObject}
          customElementProps={customElementProps}
          className="object-class"
          ref={mockRef}
        />,
      );

      expect(renderObject.render).toHaveBeenCalledWith(
        customElementProps,
        mockRef,
      );

      const renderedElement = screen.getByTestId('object-rendered');
      expect(renderedElement).toHaveTextContent('Object Message');
      expect(mockRef.current).toBe(renderedElement);
    });

    it('should handle render object with complex render method', () => {
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

      render(
        <TestComponent
          asChild
          customElement={renderObject}
          customElementProps={{ data: { name: 'John Doe', age: 30 } }}
        />,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Age: 30')).toBeInTheDocument();
    });

    it('should work with render object even when asChild is true', () => {
      const renderObject = {
        render: (props: any, ref: React.Ref<HTMLElement>) => (
          <div ref={ref} data-testid="render-object-with-asChild">
            Render object content
          </div>
        ),
      };

      render(
        <TestComponent
          asChild
          customElement={renderObject}
          customElementProps={{}}
        />,
      );

      expect(
        screen.getByTestId('render-object-with-asChild'),
      ).toBeInTheDocument();
    });
  });

  describe('Default children rendering', () => {
    it('should render children as ReactNode when no asChild or customElement', () => {
      render(
        <TestComponent data-testid="default-children">
          <span>Default content</span>
        </TestComponent>,
      );

      const element = screen.getByTestId('default-children');
      expect(element).toHaveTextContent('Default content');
    });

    it('should call children as function when it is a function', () => {
      const mockRef = React.createRef<HTMLElement>();
      const childrenFunction = vi.fn((props, ref) => (
        <div ref={ref} data-testid="function-children">
          Function children content
        </div>
      ));

      render(
        <TestComponent
          children={childrenFunction}
          data-testid="wrapper"
          ref={mockRef}
        />,
      );

      expect(childrenFunction).toHaveBeenCalledWith({}, mockRef);
      expect(screen.getByTestId('function-children')).toBeInTheDocument();
    });

    it('should handle string children', () => {
      render(
        <TestComponent data-testid="string-children">
          Simple string content
        </TestComponent>,
      );

      const element = screen.getByTestId('string-children');
      expect(element).toHaveTextContent('Simple string content');
    });

    it('should handle complex ReactNode children', () => {
      render(
        <TestComponent data-testid="complex-children">
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </TestComponent>,
      );

      const element = screen.getByTestId('complex-children');
      expect(element).toHaveTextContent('Title');
      expect(element).toHaveTextContent('Paragraph');
      expect(element).toHaveTextContent('Item 1');
      expect(element).toHaveTextContent('Item 2');
    });
  });

  describe('Props forwarding and merging', () => {
    it('should forward all props except component-specific ones', () => {
      render(
        <TestComponent
          data-testid="props-forwarding"
          className="custom-class"
          id="custom-id"
          role="button"
          aria-label="Custom label"
          tabIndex={0}
          style={{ color: 'red' }}
        >
          Content
        </TestComponent>,
      );

      const element = screen.getByTestId('props-forwarding');
      expect(element).toHaveClass('custom-class');
      expect(element).toHaveAttribute('id', 'custom-id');
      expect(element).toHaveAttribute('role', 'button');
      expect(element).toHaveAttribute('aria-label', 'Custom label');
      expect(element).toHaveAttribute('tabIndex', '0');
      expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });

    it('should handle className prop correctly', () => {
      render(
        <TestComponent className="test-class" data-testid="class-test">
          Content
        </TestComponent>,
      );

      const element = screen.getByTestId('class-test');
      expect(element).toHaveClass('test-class');
    });

    it('should exclude component-specific props from restProps', () => {
      const renderFunction = vi.fn((props, ref) => (
        <div ref={ref} data-testid="excluded-props" {...props}>
          Content
        </div>
      ));

      render(
        <TestComponent
          asChild
          customElement={renderFunction}
          customElementProps={{ test: 'value' }}
          content="test content"
          className="test-class"
          data-custom="custom-value"
        />,
      );

      // The render function should not receive asChild, customElement, customElementProps, or content
      expect(renderFunction).toHaveBeenCalledWith(
        { test: 'value' },
        expect.any(Object),
      );

      // But other props should be forwarded to the Slot
      const element = screen.getByTestId('excluded-props');
      expect(element).toHaveClass('test-class');
      expect(element).toHaveAttribute('data-custom', 'custom-value');
    });
  });

  describe('Ref forwarding', () => {
    it('should properly forward refs to React elements', () => {
      const ref = React.createRef<HTMLDivElement>();
      const customElement = <div data-testid="ref-element" />;

      render(<TestComponent asChild customElement={customElement} ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId('ref-element'));
    });

    it('should pass refs to render functions', () => {
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

      render(
        <TestComponent asChild customElement={renderFunction} ref={ref} />,
      );

      expect(receivedRef).toBe(ref);
      expect(ref.current).toBe(screen.getByTestId('ref-function'));
    });

    it('should pass refs to render object methods', () => {
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

      render(<TestComponent asChild customElement={renderObject} ref={ref} />);

      expect(receivedRef).toBe(ref);
      expect(ref.current).toBe(screen.getByTestId('ref-object'));
    });

    it('should forward refs in default children rendering', () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <TestComponent ref={ref} data-testid="default-ref">
          Content
        </TestComponent>,
      );

      expect(ref.current).toBe(screen.getByTestId('default-ref'));
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle invalid customElement types gracefully', () => {
      // Test with string as customElement (invalid)
      render(
        <TestComponent
          asChild
          customElement={'invalid' as any}
          data-testid="invalid-custom-element"
        >
          Fallback content
        </TestComponent>,
      );

      const element = screen.getByTestId('invalid-custom-element');
      expect(element).toHaveTextContent('invalid');
    });

    it('should handle object without render method', () => {
      const invalidObject = { notRender: () => <div /> };

      render(
        <TestComponent
          customElement={invalidObject as any}
          data-testid="invalid-object"
        >
          Fallback content
        </TestComponent>,
      );

      const element = screen.getByTestId('invalid-object');
      expect(element).toHaveTextContent('Fallback content');
    });

    it('should handle empty customElementProps', () => {
      const renderFunction = vi.fn((props, ref) => (
        <div ref={ref} data-testid="empty-props">
          Content
        </div>
      ));

      render(
        <TestComponent
          asChild
          customElement={renderFunction}
          // customElementProps is undefined
        />,
      );

      expect(renderFunction).toHaveBeenCalledWith({}, expect.any(Object));
    });

    it('should handle customElement as function without asChild', () => {
      const renderFunction = (props: any, ref: React.Ref<HTMLElement>) => (
        <div ref={ref} data-testid="function-without-asChild">
          Function content
        </div>
      );

      render(
        <TestComponent customElement={renderFunction} data-testid="wrapper">
          Fallback content
        </TestComponent>,
      );

      // Should render fallback children since asChild is not true
      const element = screen.getByTestId('wrapper');
      expect(element).toHaveTextContent('Fallback content');
      expect(
        screen.queryByTestId('function-without-asChild'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Integration scenarios', () => {
    it('should work with complex component composition', () => {
      const ComplexComponent = ({ title, items, children, ...props }: any) => (
        <div {...props}>
          {children || (
            <>
              <h2>{title}</h2>
              <ul>
                {items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      );

      render(
        <TestComponent
          asChild
          customElement={
            <ComplexComponent title="Test Title" items={['A', 'B']} />
          }
          content="This replaces original content"
          data-testid="complex-composition"
          className="integration-class"
        />,
      );

      const element = screen.getByTestId('complex-composition');
      expect(element).toHaveClass('integration-class');
      expect(element).toHaveTextContent('This replaces original content');
    });

    it('should work with forwardRef components', () => {
      const ForwardRefComponent = forwardRef<HTMLDivElement, { label: string }>(
        ({ label, ...props }, ref) => (
          <div ref={ref} {...props}>
            {label}
          </div>
        ),
      );

      const ref = React.createRef<HTMLDivElement>();

      render(
        <TestComponent
          asChild
          customElement={<ForwardRefComponent label="Forward ref test" />}
          data-testid="forward-ref-test"
          ref={ref}
        />,
      );

      expect(ref.current).toBe(screen.getByTestId('forward-ref-test'));
      expect(screen.getByTestId('forward-ref-test')).toHaveTextContent(
        'Forward ref test',
      );
    });
  });
});
