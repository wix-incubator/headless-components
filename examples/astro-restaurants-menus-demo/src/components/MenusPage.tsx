import React from "react";
import {
  Menus,
  Menu,
  Section,
  Item,
  Variant,
  Label,
  ModifierGroup,
  Modifier,
} from "@wix/headless-restaurants-menus/react";
import type { MenusServiceConfig } from "@wix/headless-restaurants-menus/services";

export interface MenusPageProps {
  menusServiceConfig: MenusServiceConfig;
}

export const MenusPage: React.FC<MenusPageProps> = ({ menusServiceConfig }) => {

  return (
    <div className="min-h-screen bg-background">
      <Menus.Root config={menusServiceConfig}>
        <div className="max-w-4xl mx-auto p-6">
          <Menus.LocationSelector
            allText="All Locations"
            contentClassName="relative z-50 max-h-48 min-w-[6rem] overflow-y-auto overflow-x-hidden rounded-md border border-background bg-background text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]"
            scrollDownButtonClassName="flex cursor-default items-center justify-center py-1"
            scrollUpButtonClassName="flex cursor-default items-center justify-center py-1"
            triggerClassName="flex h-10 w-48 items-center justify-between whitespace-nowrap rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm text-foreground data-[placeholder]:text-foreground/50 hover:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mb-6"
            viewportClassName="p-1"
            className="mb-6"
            optionClassName="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm text-foreground outline-none focus:bg-foreground/5 focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          />
          <Menus.MenuSelector
            allText="All Menus"
            listClassName="inline-flex h-11 items-center justify-center rounded-lg bg-foreground/10 p-1 font-medium text-sm text-foreground/60 hover:text-foreground/90"
            className="mb-6"
            triggerClassName="inline-flex items-center justify-center whitespace-nowrap rounded-md h-full px-3 py-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          />
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
                      <div className="bg-secondary border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                        <Item.Image className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <Item.Name className="text-lg text-foreground mb-2 font-heading" />
                          <Item.Description className="text-sm text-foreground mb-3 font-paragraph" />

                          <Item.VariantsRepeater>
                            <div className="flex justify-between items-center mb-3">
                              <Variant.Name className="text-sm text-foreground font-heading" />
                              <Variant.Price className="text-sm text-foreground font-paragraph" />
                            </div>
                          </Item.VariantsRepeater>

                          <div className="flex flex-wrap gap-1 mb-3">
                            <Item.LabelsRepeater>
                              <span className="inline-flex items-center gap-1 bg-primary/10 text-foreground text-xs px-2 py-1 rounded-full">
                                <Label.Icon className="w-4 h-4 object-contain" />
                                <Label.Name />
                              </span>
                            </Item.LabelsRepeater>
                          </div>

                          <Item.ModifierGroupsRepeater>
                            <div className="mb-2">
                              <ModifierGroup.Name className="text-sm text-foreground font-heading" />
                              <div className="mt-2">
                                <ModifierGroup.ModifiersRepeater>
                                  <div className="flex justify-between items-center py-1">
                                    <Modifier.Name className="text-sm text-foreground font-paragraph" />
                                    <Modifier.Price className="text-sm text-foreground font-paragraph" />
                                  </div>
                                </ModifierGroup.ModifiersRepeater>
                              </div>
                            </div>
                          </Item.ModifierGroupsRepeater>
                        </div>
                      </div>
                    </Section.ItemsRepeater>
                  </div>
                </div>
              </Menu.SectionsRepeater>
            </div>
          </Menus.MenusRepeater>
          <Menus.Loading />
          <Menus.Error />
        </div>
      </Menus.Root>
    </div>
  );
};
