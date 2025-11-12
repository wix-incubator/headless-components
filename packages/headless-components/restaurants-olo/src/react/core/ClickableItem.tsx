import React from 'react';
import {
  useItemContext,
  useMenuContext,
  useSectionContext,
} from '@wix/headless-restaurants-menus/react';
import { useService } from '@wix/services-manager-react';
import { OLOSettingsServiceDefinition } from '@wix/headless-restaurants-olo/services';
// import { OLOSettingsServiceDefinition } from "../../services/OLOSettingsService";

/**
 * CoreMenuItem
 *
 * A core menu item component that displays the item image, name, description, and price
 * using the project's design system for colors and fonts.
 */
export function CoreClickableItem({
  children,
}: {
  children: (props: { item: any; itemSelected: () => void }) => React.ReactNode;
}) {
  const { item } = useItemContext();
  const { section } = useSectionContext();
  const { menu } = useMenuContext();
  const service = useService(OLOSettingsServiceDefinition);
  const itemSelected = () => {
    const selectedItem = { ...item, sectionId: section._id, menuId: menu._id };
    service.selectedItem?.set(selectedItem);
  };
  return children({ item, itemSelected });
}
