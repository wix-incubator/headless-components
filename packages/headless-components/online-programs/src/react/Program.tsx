import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import * as programs from '@wix/auto_sdk_online-programs_programs';

import * as CoreProgram from './core/Program.js';

enum TestIds {
  programRoot = 'program-root',
  programTitle = 'program-title',
  programImage = 'program-image',
}

export interface ProgramRootProps {
  children: React.ReactNode;
  program: programs.Program;
}

/**
 * Root component that provides all necessary service contexts for a complete program experience.
 * This composite component combines Product, ProductVariantSelector, ProductModifiers, and SelectedVariant
 * functionality following the documented API patterns with proper data attributes.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Product } from '@wix/stores/components';
 *
 * function ProductPage({ product }) {
 *   return (
 *     <Product.Root product={product}>
 *       <Product.Name className="text-4xl font-bold" />
 *     </Product.Root>
 *   );
 * }
 * ```
 */
export function Root(props: ProgramRootProps): React.ReactNode {
  const { children, program, ...attrs } = props;

  return (
    <CoreProgram.Root programServiceConfig={{ program: props.program }}>
      <AsChildSlot {...attrs}>{children}</AsChildSlot>
    </CoreProgram.Root>
  );
}

/**
 * Props for Program Title component
 */
export interface TitleProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ title: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the product name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Product.Name className="text-4xl font-bold" />
 *
 * // asChild with primitive
 * <Product.Name asChild>
 *   <h1 className="text-4xl font-bold" />
 * </Product.Name>
 *
 * // asChild with react component
 * <Product.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h1 ref={ref} {...props} className="text-4xl font-bold">
 *       {name}
 *     </h1>
 *   ))}
 * </Product.Name>
 * ```
 */
export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreProgram.Title>
      {({ title }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.programTitle}
            customElement={children}
            customElementProps={{ title }}
            content={title}
            {...otherProps}
          >
            <h1>{title}</h1>
          </AsChildSlot>
        );
      }}
    </CoreProgram.Title>
  );
});

Title.displayName = 'Program.Title';
