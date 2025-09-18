import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';

export interface Tag {
  value: string;
  index: number;
}

export interface TagServiceAPI {
  tag: Signal<Tag>;
}

export interface TagServiceConfig {
  tag: Tag;
}

export const TagServiceDefinition = defineService<
  TagServiceAPI,
  TagServiceConfig
>('tag');

export const TagService = implementService.withConfig<TagServiceConfig>()(
  TagServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const tag = signalsService.signal<Tag>(config.tag);

    return {
      tag,
    };
  },
);
