import React from 'react';
import { useService } from '@wix/services-manager-react';
import { programs } from '@wix/online-programs';

import {
  ProgramListServiceConfig,
  ProgramListServiceDefinition,
} from '../services/program-list-service.js';
import * as CoreProgramList from './core/ProgramList.js';
import { Program } from './Program.js';

enum TestIds {
  programListItems = 'program-list-items',
  programListItem = 'program-list-item',
}

/**
 * Props for the ProductList.Root component
 */
interface ProgramListRootProps {
  children: React.ReactNode;
  programListConfig?: ProgramListServiceConfig;
}

/**
 * Root component that provides the ProgramList service for rendering program lists.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProgramList } from '@wix/online-programs/components';
 *
 * function ProgramListPage(props) {
 *  const { programs } = props;
 *
 *   return (
 *     <ProgramList.Root programListConfig={{ programs }}>
 *       <ProgramList.Programs>
 *         <ProgramList.ProgramRepeater>
 *           <Program.Title />
 *           <Program.Description />
 *         </ProgramList.ProgramRepeater>
 *       </ProgramList.Programs>
 *     </ProgramList.Root>
 *   );
 * }
 * ```
 */
function Root(props: ProgramListRootProps) {
  const { children, programListConfig } = props;

  const serviceConfig = programListConfig || {
    programs: [],
  };

  return (
    <CoreProgramList.Root programListConfig={serviceConfig}>
      {children}
    </CoreProgramList.Root>
  );
}

Root.displayName = 'ProgramList.Root';

/**
 * Props for ProgramList.Raw component
 */
interface RawProps {
  children: ((props: RawRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for ProgramList.Raw component
 */
interface RawRenderProps {
  programs: programs.Program[];
}

/**
 * Raw component that provides direct access to program list data.
 * Should only be used when you need custom access to list data.
 *
 * @component
 * @example
 * ```tsx
 * <ProgramList.Root programListConfig={{ programs }}>
 *  <ProgramList.Raw>
 *    {({ programs }) => (
 *      <div>
 *        {programs.map((program) => (
 *          <div key={program._id}>{program.description?.title || 'No title'}</div>
 *        ))}
 *      </div>
 *    )}
 *  </ProgramList.Raw>
 * </ProgramList.Root>
 * ```
 */
const Raw = React.forwardRef<HTMLElement, RawProps>((props, _ref) => {
  const { children } = props;

  const programListService = useService(ProgramListServiceDefinition);

  const programs = programListService.programs.get();

  return typeof children === 'function' ? children({ programs }) : children;
});

Raw.displayName = 'ProgramList.Raw';

interface ProgramsProps {
  children: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}

/**
 * Container for the program list with empty state support.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <ProgramList.Programs emptyState={<div>No programs found</div>}>
 *   <ProgramList.ProgramRepeater>
 *     <Program.Title />
 *     <Program.Description />
 *   </ProgramList.ProgramRepeater>
 * </ProgramList.Programs>
 * ```
 */
const Programs = React.forwardRef<HTMLElement, ProgramsProps>((props, ref) => {
  const { children, className, emptyState } = props;

  const programListService = useService(ProgramListServiceDefinition);

  const programs = programListService.programs.get();
  const hasPrograms = programs.length > 0;

  if (!hasPrograms) {
    return emptyState || null;
  }

  const attributes = {
    'data-testid': TestIds.programListItems,
  };

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      {...attributes}
    >
      {children as React.ReactNode}
    </div>
  );
});

Programs.displayName = 'ProgramList.Programs';

/**
 * Props for ProgramList.ProgramRepeater component
 */
interface ProgramRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders Program.Root for each program.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <ProgramList.ProgramRepeater>
 *   <Program.Title />
 *   <Program.Description />
 * </ProgramList.ProgramRepeater>
 * ```
 */
const ProgramRepeater = React.forwardRef<HTMLElement, ProgramRepeaterProps>(
  (props, _ref) => {
    const { children } = props;

    const programListService = useService(ProgramListServiceDefinition);

    const programs = programListService.programs.get();

    return (
      <>
        {programs.map((program: programs.Program) => (
          <Program.Root
            key={program._id}
            program={program}
            // ? How this data-testid should be passed?
            data-testid={TestIds.programListItem}
          >
            {children}
          </Program.Root>
        ))}
      </>
    );
  },
);

ProgramRepeater.displayName = 'ProgramList.ProgramRepeater';

/**
 * Compound component for ProgramList with all sub-components
 */
export const ProgramList = {
  Root,
  Raw,
  Programs,
  ProgramRepeater,
} as const;
