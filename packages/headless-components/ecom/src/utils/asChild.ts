import React from 'react';
import { Slot } from '@radix-ui/react-slot';

/**
 * Function signature for render function pattern
 */
export type AsChildRenderFunction<TProps = any> = (
  props: TProps,
  ref: React.Ref<HTMLElement>,
) => React.ReactNode;

/**
 * Object with render method pattern
 */
export type AsChildRenderObject<TProps = any> = {
  render: AsChildRenderFunction<TProps>;
};

/**
 * Union type for all supported asChild patterns
 */
export type AsChildChildren<TProps = any> =
  | React.ReactElement
  | AsChildRenderFunction<TProps>
  | AsChildRenderObject<TProps>;

/**
 * Generic interface for components that support asChild pattern.
 * This interface can be extended by specific components to add their own props.
 *
 * @template TData - The shape of the data object passed to asChild render functions
 * @template TProps - Additional props specific to the component
 *
 * @example
 * ```tsx
 * // For a component that provides name data
 * interface NameProps extends AsChildProps<{ name: string }> {
 *   // className is already included from AsChildProps
 * }
 *
 * // For a component that provides description data
 * interface DescriptionProps extends AsChildProps<{ description: string }> {
 *   as?: "plain" | "html";
 *   // className is already included from AsChildProps
 * }
 * ```
 */
export interface AsChildProps<
  TData extends Record<string, any> = Record<string, any>,
  TProps = {},
> {
  /** When true, renders as a child component instead of default element */
  asChild?: boolean;
  /** Custom render function or React element when using asChild */
  children?: AsChildChildren<TData & TProps>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Props type for cloneable React elements
 */
type CloneableElementProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

/**
 * Parameters for the renderAsChild utility function
 */
export interface RenderAsChildParams<TProps = any> {
  /** The children to render (React element, function, or render object) */
  children: AsChildChildren<TProps> | undefined;
  /** Props to pass to render functions */
  props: TProps;
  /** Ref to forward to the rendered element */
  ref: React.Ref<HTMLElement>;
  /** Content to pass as children to React elements */
  content?: React.ReactNode;
  /** Additional attributes to merge into cloned React elements */
  attributes?: Record<string, any>;
}

/**
 * Utility function to handle asChild prop with different rendering patterns.
 *
 * Supports three rendering patterns:
 * 1. **React Elements**: Clones the element and forwards the ref and attributes
 *    ```tsx
 *    <Component asChild><div>Content</div></Component>
 *    ```
 *
 * 2. **Render Functions**: Calls the function with props and ref
 *    ```tsx
 *    <Component asChild>
 *      {(props, ref) => <div ref={ref}>{props.content}</div>}
 *    </Component>
 *    ```
 *
 * 3. **Render Objects**: Calls the render method with props and ref
 *    ```tsx
 *    <Component asChild>
 *      {{ render: (props, ref) => <div ref={ref}>{props.content}</div> }}
 *    </Component>
 *    ```
 *
 * @param params - Configuration object with children, props, ref, content, and attributes
 * @returns Rendered React node or null if no valid children provided
 *
 * @example
 * ```tsx
 * const result = renderAsChild({
 *   children: (props, ref) => <h1 ref={ref}>{props.title}</h1>,
 *   props: { title: "Hello World" },
 *   ref: myRef,
 *   attributes: { "data-testid": "my-component" },
 * });
 * ```
 */
export function renderAsChild<TProps = any>({
  children,
  props,
  ref,
  content,
  attributes,
}: RenderAsChildParams<TProps>): React.ReactNode | null {
  // Early return if no children provided
  if (!children) return null;

  // Handle React element pattern
  if (React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<CloneableElementProps>,
      {
        ref,
        children: content,
        ...attributes,
      },
    );
  }

  // Handle render function pattern
  if (typeof children === 'function') {
    return children(
      {
        ...props,
        ...attributes,
      },
      ref,
    );
  }

  // Handle render object pattern
  if (children && typeof children === 'object' && 'render' in children) {
    return children.render(
      {
        ...props,
        ...attributes,
      },
      ref,
    );
  }

  // Fallback for unknown patterns
  return null;
}

/**
 * Hook for determining the correct component to render based on asChild prop
 *
 * @param asChild - Whether to use Slot for composition
 * @param defaultElement - The default HTML element to render (e.g., "button", "div")
 * @returns The component to render (either Slot or the default element)
 *
 * @example
 * ```tsx
 * function Button({ asChild, className, children, ...props }) {
 *   const Comp = useAsChild(asChild, "button");
 *   return <Comp className={className} {...props}>{children}</Comp>;
 * }
 *
 * // Usage without asChild - renders as button
 * <Button onClick={handleClick}>Click me</Button>
 *
 * // Usage with asChild - renders as link with button behavior
 * <Button asChild>
 *   <a href="/contact">Contact</a>
 * </Button>
 * ```
 */
export function useAsChild(asChild?: boolean, defaultElement = 'div') {
  return asChild ? Slot : defaultElement;
}

/**
 * Utility function to handle children rendering.
 *
 * Supports three rendering patterns:
 * 1. **React Elements**: Returns the element
 *    ```tsx
 *    <Component><div>Content</div></Component>
 *    ```
 *
 * 2. **Render Functions**: Calls the function with props and ref
 *    ```tsx
 *    <Component>
 *      {(props, ref) => <div ref={ref}>{props.content}</div>}
 *    </Component>
 *    ```
 *
 * @param params - Configuration object with children, props, and ref
 * @returns Rendered React node or null if no valid children provided
 *
 * @example
 * ```tsx
 * const result = renderChildren({
 *   children: (props, ref) => <h1 ref={ref}>{props.title}</h1>,
 *   props: { title: "Hello World" },
 *   ref: myRef,
 * });
 * ```
 */
export function renderChildren<THTMLElement = HTMLElement, TProps = any>({
  children,
  props,
  ref,
}: RenderChildrenParams<THTMLElement, TProps>): React.ReactNode | null {
  // Early return if no children provided
  if (!children) return null;

  // Handle React element pattern
  if (React.isValidElement(children)) {
    return children;
  }

  // Handle render function pattern
  if (typeof children === 'function') {
    return children(props, ref);
  }

  // Fallback for unknown patterns
  return children;
}

/**
 * Parameters for the renderAsChild utility function
 */
export interface RenderChildrenParams<
  THTMLElement = HTMLElement,
  TProps = any,
> {
  /** The children to render (React element, function, or render object) */
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<THTMLElement, TProps>
    | undefined;
  /** Props to pass to render functions */
  props: TProps;
  /** Ref to forward to the rendered element */
  ref: React.Ref<THTMLElement>;
}
