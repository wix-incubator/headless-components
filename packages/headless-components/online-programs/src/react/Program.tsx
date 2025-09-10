import React from 'react';
import { programs } from '@wix/online-programs';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

import * as CoreProgram from './core/Program.js';

enum TestIds {
  programTitle = 'program-title',
}

/**
 * Props for the Program root component following the documented API
 */
export interface ProgramRootProps {
  children: React.ReactNode;
  program: programs.Program;
}

/**
 * Root component that provides all necessary service contexts for a complete program experience.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramPage({ program }) {
 *   return (
 *     <Program.Root program={program}>
 *       <Program.Title className="text-4xl font-bold" />
 *     </Program.Root>
 *   );
 * }
 * ```
 */
export function Root(props: ProgramRootProps): React.ReactNode {
  const { children, program, ...attrs } = props;

  return (
    <CoreProgram.Root programServiceConfig={{ program }}>
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
}

/**
 * Displays the program title with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Program.Title className="text-4xl font-bold" />
 *
 * // asChild with primitive
 * <Program.Title asChild>
 *   <h1 className="text-4xl font-bold" />
 * </Program.Title>
 *
 * // asChild with react component
 * <Program.Title asChild>
 *   {React.forwardRef(({ title, ...props }, ref) => (
 *     <h1 ref={ref} { ...props } className="text-4xl font-bold">
 *       {title}
 *     </h1>
 *   ))}
 * </Program.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;

  return (
    <CoreProgram.Title>
      {({ title }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
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
