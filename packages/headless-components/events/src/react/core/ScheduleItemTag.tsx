import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  ScheduleItemTagService,
  ScheduleItemTagServiceDefinition,
  type ScheduleItemTagServiceConfig,
} from '../../services/schedule-item-tag-service.js';
import { ScheduleListServiceDefinition } from '../../services/schedule-list-service.js';

export interface RootProps {
  /** Child components that will have access to the tag service */
  children: React.ReactNode;
  /** Tag data */
  tag: string;
}

/**
 * ScheduleItemTag Root core component that provides tag service data.
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
  /** Whether the tag is active */
  active: boolean;
  /** Click handler for the tag */
  toggleTagFilter: () => void;
}

/**
 * ScheduleItemTag Tag core component that provides tag data.
 *
 * @component
 */
export function Tag(props: TagProps): React.ReactNode {
  const tagService = useService(ScheduleItemTagServiceDefinition);
  const scheduleListService = useService(ScheduleListServiceDefinition);

  const tag = tagService.tag.get();
  const active = scheduleListService.tagFilters.get().includes(tag);

  const toggleTagFilter = () => {
    if (active) {
      scheduleListService.removeTagFilter(tag);
    } else {
      scheduleListService.addTagFilter(tag);
    }
  };

  return props.children({ tag, active, toggleTagFilter });
}
