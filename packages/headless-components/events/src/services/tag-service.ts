import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
export interface TagServiceAPI {
  tag: Signal<string>;
}

export interface TagServiceConfig {
  tag: string;
}

export const TagServiceDefinition = defineService<
  TagServiceAPI,
  TagServiceConfig
>('tag');

export const TagService = implementService.withConfig<TagServiceConfig>()(
  TagServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const tag = signalsService.signal<string>(config.tag);

    return {
      tag,
    };
  },
);
