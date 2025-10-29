import React from 'react';
import { MenusServiceConfig } from '@wix/headless-restaurants-menus/services';
import { OLOSettingsServiceDefinition } from '../../services/olo-settings-service.js';
import { useService } from '@wix/services-manager-react';
import { ServiceAPI } from '@wix/services-definitions';

export interface OLOMenusRootProps {
  config: MenusServiceConfig;
  children: (updatedConfig: MenusServiceConfig) => React.ReactNode;
}

export const Root = React.forwardRef<HTMLElement, OLOMenusRootProps>(
  function OLOMenusRoot({ config, children }) {
    const service = useService(OLOSettingsServiceDefinition) as ServiceAPI<
      typeof OLOSettingsServiceDefinition
    >;
    const filteredMenus = service.filterMenus(config.menus);
    const hasMenus = Array.isArray(filteredMenus) && filteredMenus.length > 0;
    if (!hasMenus) return null;
    config.menus = filteredMenus;

    return children(config);
  },
);
