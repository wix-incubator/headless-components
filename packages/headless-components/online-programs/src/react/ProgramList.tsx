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
  programListRoot = 'program-list-root',
  programListItems = 'program-list-items',
  programListItem = 'program-list-item',
}

/**
 * Props for the ProductList.Root component
 */
export interface ProgramListRootProps {
  children: React.ReactNode;
  programListConfig?: ProgramListServiceConfig;
}

// TODO: Add example
export const Root = React.forwardRef<HTMLElement, ProgramListRootProps>(
  (props, ref) => {
    const { children, programListConfig } = props;

    const serviceConfig = programListConfig || {
      programs: [],
    };

    return (
      <CoreProgramList.Root programListConfig={serviceConfig}>
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          data-testid={TestIds.programListRoot}
        >
          {children}
        </div>
      </CoreProgramList.Root>
    );
  },
);

/**
 * Props for ProgramList.Raw component
 */
export interface RawProps {
  children: ((props: RawRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for ProgramList.Raw component
 */
export interface RawRenderProps {
  programs: programs.Program[];
}

// TODO: Add example
export const Raw = React.forwardRef<HTMLElement, RawProps>((props, _ref) => {
  const { children } = props;

  const programListService = useService(ProgramListServiceDefinition);

  const programs = programListService.programs.get();

  return typeof children === 'function' ? children({ programs }) : children;
});

export interface ProgramsProps {
  children: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}

// TODO: Add example
export const Programs = React.forwardRef<HTMLElement, ProgramsProps>(
  (props, ref) => {
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
  },
);

/**
 * Props for ProgramList.ProgramRepeater component
 */
export interface ProgramRepeaterProps {
  children: React.ReactNode;
}

// TODO: Add example
export const ProgramRepeater = React.forwardRef<
  HTMLElement,
  ProgramRepeaterProps
>((props, _ref) => {
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
});

/**
 * Compound component for ProgramList with all sub-components
 */
export const ProgramList = {
  Root,
  Raw,
  Programs,
  ProgramRepeater,
} as const;
