import React from 'react';

/**
 * Parameters for the renderChildren utility function
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
  content?: string | null;
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
  content,
}: RenderChildrenParams<THTMLElement, TProps>): React.ReactNode | null {
  // Early return if no children provided
  if (!children) return null;

  // Handle React element pattern
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      ref,
      ...(content ? { children: content } : {}),
    });
  }

  // Handle render function pattern
  if (typeof children === 'function') {
    return children(props, ref);
  }

  // Fallback for unknown patterns
  return null;
}
