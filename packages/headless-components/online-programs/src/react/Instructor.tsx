import React from 'react';
import { instructors } from '@wix/online-programs';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

interface InstructorContextValue {
  instructor: instructors.Instructor;
}

const InstructorContext = React.createContext<InstructorContextValue | null>(null);

function useInstructorContext(): InstructorContextValue {
  const context = React.useContext(InstructorContext);
  if (!context) {
    throw new Error(
      'useInstructorContext must be used within a Instructor.Root component',
    );
  }
  return context;
}

enum TestIds {
  instructorName = 'instructor-name',
}

/**
 * Props for the Instructor root component following the documented API
 */
interface InstructorRootProps {
  /** Child components that will have access to the Instructor service */
  children: React.ReactNode;
  /** Instructor data */
  instructor: instructors.Instructor;
}

/**
 * Root component that provides all necessary service contexts for a complete instructor experience.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Instructor } from '@wix/online-programs/components';
 *
 * function InstructorCard({ instructor }) {
 *   return (
 *     <Instructor.Root instructor={instructor}>
 *       <Instructor.Name className="text-4xl font-bold" />
 *     </Instructor.Root>
 *   );
 * }
 * ```
 */
function Root(props: InstructorRootProps): React.ReactNode {
  const { children, instructor } = props;

  return (
    <InstructorContext.Provider value={{ instructor }}>
      {children}
    </InstructorContext.Provider>
  );
}

/**
 * Props for Instructor Name component
 */
interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
}

/**
 * Displays the instructor name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Instructor.Name className="text-4xl font-bold" />
 *
 * // asChild with primitive
 * <Instructor.Name asChild>
 *   <p className="text-4xl font-bold" />
 * </Instructor.Name>
 *
 * // asChild with react component
 * <Instructor.Name asChild>
 *   {React.forwardRef(({ title, ...props }, ref) => (
 *     <p ref={ref} { ...props } className="text-4xl font-bold">
 *       {title}
 *     </p>
 *   ))}
 * </Instructor.Name>
 * ```
 */
const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const { instructor } = useInstructorContext();

  const name = instructor.name || '';

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      data-testid={TestIds.instructorName}
      customElement={children}
      customElementProps={{ name }}
      content={name}
      {...otherProps}
    >
      <p>{name}</p>
    </AsChildSlot>
  );
});

Name.displayName = 'Instructor.Name';

/**
 * Compound component for Instructor with all sub-components
 */
export const Instructor = {
  Root,
  Name,
} as const;
