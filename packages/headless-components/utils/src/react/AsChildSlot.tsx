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

    if (asChild && customElement) {
      // Handle string
      if (typeof customElement === 'string') {
        return (
          <Slot ref={ref} {...restProps}>
            <span {...getDataComponentTagProps(dataComponentTag)}>
              {customElement}
            </span>
          </Slot>
        );
      }

      // Handle React element pattern
      if (React.isValidElement(customElement)) {
        return (
          <Slot {...restProps}>
            {React.cloneElement(customElement as React.ReactElement, {
              ref,
              ...(content !== undefined ? { children: content } : {}),
              ...getDataComponentTagProps(dataComponentTag),
            })}
          </Slot>
        );
      }

      // Handle render function pattern
      if (typeof customElement === 'function') {
        const renderedElement = customElement(customElementProps, ref);

        if (dataComponentTag) {
          return injectDataComponentTag(
            renderedElement,
            dataComponentTag,
            restProps,
          );
        }

        return <Slot {...restProps}>{renderedElement}</Slot>;
      }

      // Handle render object pattern
      if (typeof customElement === 'object' && 'render' in customElement) {
        const renderedElement = customElement.render(customElementProps, ref);

        if (dataComponentTag) {
          return injectDataComponentTag(
            renderedElement,
            dataComponentTag,
            restProps,
          );
        }

        return <Slot {...restProps}>{renderedElement}</Slot>;
      }
    }

    if (!children) {
      return null;
    }

    if (typeof children === 'string') {
      return (
        <Slot ref={ref} {...restProps}>
          <div {...getDataComponentTagProps(dataComponentTag)}>{children}</div>
        </Slot>
      );
    }

    if (typeof children === 'function') {
      const renderedElement = children(customElementProps, ref);

      if (dataComponentTag) {
        return injectDataComponentTag(
          renderedElement,
          dataComponentTag,
          restProps,
        );
      }

      return <Slot {...restProps}>{renderedElement}</Slot>;
    }

    if (typeof children === 'object' && 'render' in children) {
      const renderedElement = children.render(customElementProps, ref);

      if (dataComponentTag) {
        return injectDataComponentTag(
          renderedElement,
          dataComponentTag,
          restProps,
        );
      }

      return <Slot {...restProps}>{renderedElement}</Slot>;
    }

    // Handle React Fragment children specifically
    if (React.isValidElement(children) && children.type === React.Fragment) {
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

    if (React.Children.count(children) > 1) {
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
