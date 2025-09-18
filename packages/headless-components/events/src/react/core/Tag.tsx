import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TagService,
  TagServiceDefinition,
  type Tag,
  type TagServiceConfig,
} from '../../services/tag-service.js';

export interface RootProps {
  /** Child components that will have access to the tag service */
  children: React.ReactNode;
  /** Tag data */
  tag: Tag;
}

/**
 * Tag Root core component that provides tag service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { tag, children } = props;

  const tagServiceConfig: TagServiceConfig = {
    tag,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        TagServiceDefinition,
        TagService,
        tagServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface LabelProps {
  /** Render prop function */
  children: (props: LabelRenderProps) => React.ReactNode;
}

export interface LabelRenderProps {
  /** Tag value/text */
  text: string;
  /** Tag index */
  index: number;
}

/**
 * Tag Label core component that provides tag label data.
 *
 * @component
 */
export function Label(props: LabelProps): React.ReactNode {
  const tagService = useService(TagServiceDefinition);
  const tag = tagService.tag.get();

  return props.children({
    text: tag.value,
    index: tag.index,
  });
}
