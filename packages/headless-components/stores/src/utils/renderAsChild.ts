import React from "react";
import type { AsChildChildren } from "./types.js";

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
}

/**
 * Utility function to handle asChild prop with different rendering patterns.
 *
 * Supports three rendering patterns:
 * 1. **React Elements**: Clones the element and forwards the ref
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
 * @param params - Configuration object with children, props, and ref
 * @returns Rendered React node or null if no valid children provided
 *
 * @example
 * ```tsx
 * const result = renderAsChild({
 *   children: (props, ref) => <h1 ref={ref}>{props.title}</h1>,
 *   props: { title: "Hello World" },
 *   ref: myRef,
 * });
 * ```
 */
export function renderAsChild<TProps = any>({
  children,
  props,
  ref,
  content,
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
      },
    );
  }

  // Handle render function pattern
  if (typeof children === "function") {
    return children(props, ref);
  }

  // Handle render object pattern
  if (children && typeof children === "object" && "render" in children) {
    return children.render(props, ref);
  }

  // Fallback for unknown patterns
  return null;
}
