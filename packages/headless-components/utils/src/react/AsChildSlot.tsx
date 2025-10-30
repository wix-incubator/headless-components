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

export interface AsChildSlot {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: React.ReactNode;
  /** Custom render function when using asChild */
  customElement?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<HTMLElement, any>;
  customElementProps?: any;
  /** CSS classes to apply to the default element */
  className?: string;

  content?: React.ReactNode | string;
  /** Data component tag to pass to the first child */
  'data-component-tag'?: string;

  [key: string]: any;
}

// Helper functions for data-component-tag prop merging
function getDataComponentTagProps(dataComponentTag?: string) {
  return dataComponentTag ? { 'data-component-tag': dataComponentTag } : {};
}

function getConditionalDataComponentTagProps(
  dataComponentTag?: string,
  existingTag?: string,
) {
  return dataComponentTag && !existingTag
    ? { 'data-component-tag': dataComponentTag }
    : {};
}

// Helper function to inject data-component-tag into rendered elements
function injectDataComponentTag(
  renderedElement: React.ReactNode,
  dataComponentTag: string,
  restProps: any,
): React.ReactElement {
  // Automatically inject data-component-tag into the first/only element
  if (React.isValidElement(renderedElement)) {
    // Handle fragments specifically
    if (renderedElement.type === React.Fragment) {
      const children = React.Children.toArray(
        (renderedElement.props as any).children,
      );
      if (children.length > 0) {
        const firstChild = children[0];
        const restChildren = children.slice(1);

        if (React.isValidElement(firstChild)) {
          // Only inject data-component-tag if the child doesn't already have one
          const existingTag = (firstChild.props as any)['data-component-tag'];
          const enhancedFirstChild = React.cloneElement(firstChild, {
            ...(firstChild.props as any),
            ...getConditionalDataComponentTagProps(
              dataComponentTag,
              existingTag,
            ),
          });
          return (
            <Slot {...restProps}>
              <>
                {enhancedFirstChild}
                {restChildren}
              </>
            </Slot>
          );
        }
      }
      return <Slot {...restProps}>{renderedElement}</Slot>;
    }

    // Handle single element
    // Only inject data-component-tag if the element doesn't already have one
    const existingTag = (renderedElement.props as any)['data-component-tag'];
    const enhancedElement = React.cloneElement(renderedElement, {
      ...(renderedElement.props as any), // Preserve existing props
      ...getConditionalDataComponentTagProps(dataComponentTag, existingTag),
    });
    return <Slot {...restProps}>{enhancedElement}</Slot>;
  }

  return <Slot {...restProps}>{renderedElement}</Slot>;
}

// Helper to handle string elements
function handleStringElement(
  element: string,
  dataComponentTag: string | undefined,
  ref: React.Ref<HTMLElement>,
  restProps: any,
  WrapperComponent: 'span' | 'div' = 'span',
): React.ReactElement {
  return (
    <Slot ref={ref} {...restProps}>
      <WrapperComponent {...getDataComponentTagProps(dataComponentTag)}>
        {element}
      </WrapperComponent>
    </Slot>
  );
}

// Helper to handle render functions and objects
function handleRenderElement(
  element: AsChildRenderFunction | AsChildRenderObject,
  props: any,
  ref: React.Ref<HTMLElement>,
  dataComponentTag: string | undefined,
  restProps: any,
): React.ReactElement {
  const renderFn = typeof element === 'function' ? element : element.render;
  const renderedElement = renderFn(props, ref);

  if (dataComponentTag) {
    return injectDataComponentTag(renderedElement, dataComponentTag, restProps);
  }

  return <Slot {...restProps}>{renderedElement}</Slot>;
}

// Helper to handle React elements (for customElement case)
function handleReactElement(
  element: React.ReactElement,
  content: React.ReactNode | undefined,
  dataComponentTag: string | undefined,
  ref: React.Ref<HTMLElement>,
  restProps: any,
): React.ReactElement {
  return (
    <Slot {...restProps}>
      {React.cloneElement(element, {
        ref,
        ...(content !== undefined ? { children: content } : {}),
        ...getDataComponentTagProps(dataComponentTag),
      })}
    </Slot>
  );
}

// Helper to handle fragments
function handleFragmentChildren(
  children: React.ReactElement,
  dataComponentTag: string | undefined,
  ref: React.Ref<HTMLElement>,
  restProps: any,
): React.ReactElement {
  const fragmentChildren = React.Children.toArray(
    (children.props as any).children,
  );

  if (fragmentChildren.length > 0) {
    const firstChild = fragmentChildren[0];
    const restChildren = fragmentChildren.slice(1);

    if (React.isValidElement(firstChild)) {
      // Only inject data-component-tag if the child doesn't already have one
      const existingTag = (firstChild.props as any)['data-component-tag'];
      const enhancedFirstChild = React.cloneElement(firstChild, {
        ...getConditionalDataComponentTagProps(dataComponentTag, existingTag),
      });

      return (
        <Slot ref={ref} {...restProps}>
          <>
            {enhancedFirstChild}
            {restChildren}
          </>
        </Slot>
      );
    }
  }

  return (
    <Slot ref={ref} {...restProps}>
      {children}
    </Slot>
  );
}

// Helper to handle multiple children
function handleMultipleChildren(
  children: React.ReactNode,
  dataComponentTag: string | undefined,
  ref: React.Ref<HTMLElement>,
  restProps: any,
): React.ReactElement {
  const childrenArray = React.Children.toArray(children);
  const firstChild = childrenArray[0];
  const restChildren = childrenArray.slice(1);

  if (React.isValidElement(firstChild)) {
    // Only inject data-component-tag if the child doesn't already have one
    const existingTag = (firstChild.props as any)['data-component-tag'];
    const enhancedFirstChild = React.cloneElement(firstChild, {
      ...getConditionalDataComponentTagProps(dataComponentTag, existingTag),
    });

    return (
      <Slot ref={ref} {...restProps}>
        <>
          {enhancedFirstChild}
          {restChildren}
        </>
      </Slot>
    );
  }

  return (
    <Slot ref={ref} {...restProps}>
      <>{children}</>
    </Slot>
  );
}

export const AsChildSlot = React.forwardRef<HTMLElement, AsChildSlot>(
  (props, ref) => {
    const {
      asChild,
      children,
      customElement,
      customElementProps = {},
      content,
      'data-component-tag': dataComponentTag,
      ...restProps
    } = props;

    // Handle customElement when asChild is true
    if (asChild && customElement) {
      if (typeof customElement === 'string') {
        return handleStringElement(customElement, dataComponentTag, ref, restProps);
      }

      if (React.isValidElement(customElement)) {
        return handleReactElement(customElement, content, dataComponentTag, ref, restProps);
      }

      if (typeof customElement === 'function' || (typeof customElement === 'object' && 'render' in customElement)) {
        return handleRenderElement(customElement, customElementProps, ref, dataComponentTag, restProps);
      }
    }

    // Handle children cases
    if (!children) {
      return null;
    }

    if (typeof children === 'string') {
      return handleStringElement(children, dataComponentTag, ref, restProps, 'div');
    }

    if (typeof children === 'function' || (typeof children === 'object' && 'render' in children)) {
      return handleRenderElement(children, customElementProps, ref, dataComponentTag, restProps);
    }

    // Handle React Fragment children specifically
    if (React.isValidElement(children) && children.type === React.Fragment) {
      return handleFragmentChildren(children, dataComponentTag, ref, restProps);
    }

    // Handle multiple children
    if (React.Children.count(children) > 1) {
      return handleMultipleChildren(children, dataComponentTag, ref, restProps);
    }

    // Handle single child (default case)
    return (
      <Slot
        ref={ref}
        {...restProps}
        {...getDataComponentTagProps(dataComponentTag)}
      >
        {children}
      </Slot>
    );
  },
);
