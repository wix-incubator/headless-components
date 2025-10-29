import React from 'react';
import { Item, Label, Modifier, ModifierGroup, Menus, Section, Variant } from '@wix/headless-restaurants-menus/react';
import { Menu } from '@wix/headless-restaurants-menus/react';
import { ClickableItem } from '@wix/headless-restaurants-olo/react';
import { type MenusServiceConfig } from '@wix/headless-restaurants-menus/services';
import { OLOMenus as FilteredMenus } from '@wix/headless-restaurants-olo/react';

/**
 * OLOMenus component
 * Renders a list of menus with their names, descriptions, and sections.
 * Expects a `menusServiceConfig` prop for configuration.
 */
interface OLOMenusProps {
  menusServiceConfig: MenusServiceConfig;
  onItemSelected: (item: any) => void;
}

export const OLOMenus: React.FC<OLOMenusProps> = ({ onItemSelected, menusServiceConfig }) => {
  return (
    <>
      <FilteredMenus.Root config={menusServiceConfig}>
        <Menus.MenusRepeater>
              <div className="mb-12">
                <Menu.Name className="text-3xl text-foreground mb-2 font-heading" />
                <Menu.Description className="text-foreground mb-6 font-paragraph" />

                <Menu.SectionsRepeater>
                  <div className="mb-8">
                    <Section.Name className="text-xl text-foreground mb-4 font-heading" />
                    <Section.Description className="text-foreground mb-4 font-paragraph" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Section.ItemsRepeater>
                      <ClickableItem.Actions.Select onItemSelected={onItemSelected}>
                        <div className="bg-secondary border border-border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-out overflow-hidden flex flex-col h-full min-h-[420px] transform-gpu hover:scale-[1.02] hover:-translate-y-1">
                          <Item.Image className="w-full h-48 object-cover flex-shrink-0 transition-transform duration-300 ease-out" />

                          <div className="p-4 flex flex-col flex-1">
                            <Item.Name className="text-lg text-foreground mb-2 font-heading" />
                            <Item.Description className="text-sm text-foreground mb-3 font-paragraph" />

                            <div className="flex flex-wrap gap-1 mb-3">
                              <Item.LabelsRepeater>
                                <span className="inline-flex items-center gap-1 bg-primary/10 text-foreground text-xs px-2 py-1 rounded-full transition-colors duration-300 ease-in-out">
                                  <Label.Icon className="w-4 h-4 object-contain" />
                                  <Label.Name />
                                </span>
                              </Item.LabelsRepeater>
                            </div>
                          </div>
                        </div>
                      </ClickableItem.Actions.Select>
                      </Section.ItemsRepeater>
                    </div>
                  </div>
                </Menu.SectionsRepeater>
              </div>
            </Menus.MenusRepeater>
        <Menus.Loading />
        <Menus.Error />
      </FilteredMenus.Root>
    </>
  );
};

export default OLOMenus;
