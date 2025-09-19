import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  ScheduleItemTagService,
  ScheduleItemTagServiceDefinition,
  type ScheduleItemTagServiceConfig,
} from '../../services/schedule-item-tag-service.js';

export interface RootProps {
  /** Child components that will have access to the tag service */
  children: React.ReactNode;
  /** Tag data */
  tag: string;
}

/**
 * Tag Root core component that provides tag service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { tag, children } = props;

  const tagServiceConfig: ScheduleItemTagServiceConfig = { tag };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ScheduleItemTagServiceDefinition,
        ScheduleItemTagService,
        tagServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface TagProps {
  /** Render prop function */
  children: (props: TagRenderProps) => React.ReactNode;
}

export interface TagRenderProps {
  /** Tag label value */
  tag: string;
}

/**
 * Tag core component that provides tag data.
 *
 * @component
 */
export function Tag(props: TagProps): React.ReactNode {
  const tagService = useService(ScheduleItemTagServiceDefinition);
  const tag = tagService.tag.get();

  return props.children({ tag });
}
