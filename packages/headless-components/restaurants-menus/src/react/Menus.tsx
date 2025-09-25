import React from 'react';
import {
  Loading as CoreLoading,
  ErrorState as CoreErrorState,
  Menus,
  MenuSelector as CoreMenuSelector,
  LocationSelector as CoreLocationSelector,
} from './core/index.js';
import type { Menu, Location } from '../services/types.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { TestIds } from './TestIds.js';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import { useService } from '@wix/services-manager-react';
import {
  MenusServiceConfig,
  MenusServiceDefinition,
} from '../services/index.js';
import type { ServiceAPI } from '@wix/services-definitions';
import * as MenuComponent from './Menu.js';

export interface MenusRootProps {
  children: React.ReactNode;
  config: MenusServiceConfig;
}

export interface MenusProps {
  children: (props: { menus: Menu[] }) => React.ReactNode;
}

export interface MenusRepeaterProps {
  children: React.ReactNode;
}

export function Root(props: MenusRootProps) {
  return (
    <Menus config={props.config}>
      <div data-component-tag="menus.root">{props.children}</div>
    </Menus>
  );
}

export interface MenuSelectorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    menus: Menu[];
    selectedMenu: Menu | null;
    onMenuSelect: (menu: Menu) => void;
  }>;
  /** CSS classes to apply to the tabs root element */
  className?: string;
  /** CSS classes to apply to the tabs list element */
  listClassName?: string;
  /** CSS classes to apply to each tab trigger element */
  triggerClassName?: string;
  /** Text for the "all" option */
  allText?: string;
  /** Whether to show the "all" option */
  showAll?: boolean;
}

/**
 * Menu selector component that provides menu selection functionality using tabs.
 * Uses the core MenuSelector component and wraps it with AsChildSlot for flexible rendering.
 * Only renders when there are more than 2 menus available.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage with custom styling (only shows if more than 2 menus)
 * <Menus.MenuSelector
 *   className="w-full"
 *   listClassName="flex space-x-1"
 *   triggerClassName="px-4 py-2 rounded-md hover:bg-gray-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
 * />
 *
 * // Conditional rendering based on menu count
 * {menus.length > 2 && (
 *   <Menus.MenuSelector className="mb-4" />
 * )}
 *
 * // asChild with custom tabs implementation
 * <Menus.MenuSelector asChild>
 *   {React.forwardRef(({menus, selectedMenu, onMenuSelect, ...props}, ref) => (
 *     <Tabs.Root ref={ref} {...props} value={selectedMenu?._id || ''} onValueChange={(value) => {
 *       const menu = menus.find(m => m._id === value);
 *       if (menu) onMenuSelect(menu);
 *     }}>
 *       <Tabs.List className="flex space-x-1">
 *         {menus.map(menu => (
 *           <Tabs.Trigger key={menu._id} value={menu._id} className="px-4 py-2">
 *             {menu.name}
 *           </Tabs.Trigger>
 *         ))}
 *       </Tabs.List>
 *     </Tabs.Root>
 *   ))}
 * </Menus.MenuSelector>
 *
 * // Custom render function
 * <Menus.MenuSelector>
 *   {({ menus, selectedMenu, onMenuSelect }) => (
 *     <Tabs.Root value={selectedMenu?._id || ''} onValueChange={(value) => {
 *       const menu = menus.find(m => m._id === value);
 *       if (menu) onMenuSelect(menu);
 *     }}>
 *       <Tabs.List className="flex space-x-1">
 *         {menus.map(menu => (
 *           <Tabs.Trigger key={menu._id} value={menu._id} className="px-4 py-2">
 *             {menu.name}
 *           </Tabs.Trigger>
 *         ))}
 *       </Tabs.List>
 *     </Tabs.Root>
 *   )}
 * </Menus.MenuSelector>
 * ```
 */
export const MenuSelector = React.forwardRef<HTMLElement, MenuSelectorProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      listClassName,
      triggerClassName,
      allText = 'All',
      showAll = true,
      ...otherProps
    } = props;

    return (
      <CoreMenuSelector allText={allText} showAll={showAll}>
        {({
          menus,
          selectedMenu,
          onMenuSelect,
        }: {
          menus: Menu[];
          selectedMenu: Menu | null;
          onMenuSelect: (menu: Menu) => void;
        }) => {
          // Only show selector if there are more than 2 menus
          if (menus.length <= 2) {
            return null;
          }

          if (asChild && children && typeof children === 'function') {
            return children({ menus, selectedMenu, onMenuSelect }, ref);
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              data-testid={TestIds.menuSelector}
              {...otherProps}
            >
              <Tabs.Root
                className={className}
                value={selectedMenu?._id || 'all'}
                onValueChange={(value) => {
                  const menu = menus.find((m: Menu) => m._id === value);
                  if (menu) onMenuSelect(menu);
                }}
              >
                <Tabs.List className={listClassName}>
                  {menus.map((menu: Menu) => (
                    <Tabs.Trigger
                      key={menu._id}
                      value={menu._id || ''}
                      className={triggerClassName}
                    >
                      {menu.name}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </Tabs.Root>
            </AsChildSlot>
          );
        }}
      </CoreMenuSelector>
    );
  },
);

MenuSelector.displayName = 'Menus.MenuSelector';

export const MenusRepeater = React.forwardRef<HTMLElement, MenusRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const menusService = useService(MenusServiceDefinition) as ServiceAPI<
      typeof MenusServiceDefinition
    >;
    const menus = menusService.menus.get();
    const selectedMenu = menusService.selectedMenu.get();
    const hasMenus = menus.length > 0;

    if (!hasMenus) return null;

    const menusToRender = selectedMenu ? [selectedMenu] : menus;

    return (
      <>
        {menusToRender.map((menu: Menu) => (
          <MenuComponent.Root
            key={menu._id}
            menu={menu}
            data-testid={TestIds.itemName}
            data-menu-id={menu._id}
          >
            {children}
          </MenuComponent.Root>
        ))}
      </>
    );
  },
);

MenusRepeater.displayName = 'Menus.Repeater';

export interface LoadingProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ loading: boolean }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface ErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ error: string | null }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays loading state with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Menus.Loading className="text-center" />
 *
 * // asChild with primitive
 * <Menus.Loading asChild>
 *   <p className="text-center" />
 * </Menus.Loading>
 *
 * // asChild with react component
 * <Menus.Loading asChild>
 *   {React.forwardRef(({loading, ...props}, ref) => (
 *     <p ref={ref} {...props} className="text-center">
 *       {loading ? "Loading..." : null}
 *     </p>
 *   ))}
 * </Menus.Loading>
 * ```
 */
export const Loading = React.forwardRef<HTMLElement, LoadingProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreLoading>
        {({ loading }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.menusLoading}
              customElement={children}
              customElementProps={{ loading }}
              content={loading ? 'Loading...' : null}
              {...otherProps}
            >
              <p>{loading ? 'Loading...' : null}</p>
            </AsChildSlot>
          );
        }}
      </CoreLoading>
    );
  },
);

/**
 * Displays error state with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Menus.Error className="text-red-600" />
 *
 * // asChild with primitive
 * <Menus.Error asChild>
 *   <p className="text-red-600" />
 * </Menus.Error>
 *
 * // asChild with react component
 * <Menus.Error asChild>
 *   {React.forwardRef(({error, ...props}, ref) => (
 *     <p ref={ref} {...props} className="text-red-600">
 *       {error ? `Error: ${error}` : null}
 *     </p>
 *   ))}
 * </Menus.Error>
 * ```
 */
export const Error = React.forwardRef<HTMLElement, ErrorProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreErrorState>
      {({ error }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.menusError}
            customElement={children}
            customElementProps={{ error }}
            content={error ? `Error: ${error}` : null}
            {...otherProps}
          >
            <p>{error ? `Error: ${error}` : null}</p>
          </AsChildSlot>
        );
      }}
    </CoreErrorState>
  );
});

Loading.displayName = 'Menus.Loading';
Error.displayName = 'Menus.Error';

export interface LocationSelectorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    locations: Location[];
    selectedLocation: string | null;
    onLocationSelect: (location: string) => void;
  }>;
  /** CSS classes to apply to the select element */
  className?: string;
  /** CSS classes to apply to the option elements */
  optionClassName?: string;
  /** Placeholder text for the select */
  placeholder?: string;
  /** Text for the "all" option */
  allText?: string;
  /** Whether to show the "all" option */
  showAll?: boolean;
}

/**
 * Location selector component that provides location selection functionality using a dropdown.
 * Uses the core LocationSelector component and wraps it with AsChildSlot for flexible rendering.
 * Only renders when there are 2 or more locations available.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage with custom styling (only shows if 2+ locations)
 * <Menus.LocationSelector
 *   className="w-full p-2 border rounded-md"
 *   optionClassName="p-2"
 *   placeholder="Choose your location"
 * />
 *
 * // Conditional rendering based on location count
 * {locations.length >= 2 && (
 *   <Menus.LocationSelector className="mb-4" placeholder="Pick a location" />
 * )}
 *
 * // asChild with custom Radix Select implementation
 * <Menus.LocationSelector asChild>
 *   {React.forwardRef(({locations, selectedLocation, onLocationSelect, ...props}, ref) => (
 *     <Select.Root
 *       ref={ref}
 *       {...props}
 *       value={selectedLocation || ''}
 *       onValueChange={onLocationSelect}
 *     >
 *       <Select.Trigger>
 *         <Select.Value placeholder="Select a location" />
 *         <Select.Icon />
 *       </Select.Trigger>
 *       <Select.Portal>
 *         <Select.Content>
 *           <Select.Viewport>
 *             {locations.map(location => (
 *               <Select.Item key={location.id} value={location.id}>
 *                 <Select.ItemText>{location.name}</Select.ItemText>
 *               </Select.Item>
 *             ))}
 *           </Select.Viewport>
 *         </Select.Content>
 *       </Select.Portal>
 *     </Select.Root>
 *   ))}
 * </Menus.LocationSelector>
 *
 * // Custom render function
 * <Menus.LocationSelector>
 *   {({ locations, selectedLocation, onLocationSelect }) => (
 *     <Select.Root
 *       value={selectedLocation || ''}
 *       onValueChange={onLocationSelect}
 *     >
 *       <Select.Trigger>
 *         <Select.Value placeholder="Select a location" />
 *         <Select.Icon />
 *       </Select.Trigger>
 *       <Select.Portal>
 *         <Select.Content>
 *           <Select.Viewport>
 *             {locations.map(location => (
 *               <Select.Item key={location.id} value={location.id}>
 *                 <Select.ItemText>{location.name}</Select.ItemText>
 *               </Select.Item>
 *             ))}
 *           </Select.Viewport>
 *         </Select.Content>
 *       </Select.Portal>
 *     </Select.Root>
 *   )}
 * </Menus.LocationSelector>
 * ```
 */
export const LocationSelector = React.forwardRef<
  HTMLElement,
  LocationSelectorProps
>((props, ref) => {
  const {
    asChild,
    children,
    className,
    optionClassName,
    placeholder = 'Select a location',
    allText = 'All',
    showAll = true,
    ...otherProps
  } = props;

  return (
    <CoreLocationSelector allText={allText} showAll={showAll}>
      {({
        locations,
        selectedLocation,
        onLocationSelect,
      }: {
        locations: Location[];
        selectedLocation: string | null;
        onLocationSelect: (location: string) => void;
      }) => {
        // Only show selector if there are 2 or more locations
        if (locations.length < 2) {
          return null;
        }

        if (asChild && children && typeof children === 'function') {
          return children(
            { locations, selectedLocation, onLocationSelect },
            ref,
          );
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            data-testid={TestIds.locationSelector}
            {...otherProps}
          >
            <Select.Root
              value={selectedLocation || 'all'}
              onValueChange={onLocationSelect}
            >
              <Select.Trigger className={className}>
                <Select.Value placeholder={placeholder} />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content>
                  <Select.ScrollUpButton />
                  <Select.Viewport>
                    {locations.map((location: Location) => (
                      <Select.Item
                        key={location.id}
                        value={location.id}
                        className={optionClassName}
                      >
                        <Select.ItemText>{location.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </AsChildSlot>
        );
      }}
    </CoreLocationSelector>
  );
});

LocationSelector.displayName = 'Menus.LocationSelector';

/**
 * Menus namespace containing all menus components
 * following the compound component pattern: MenusComponent.Root, MenusComponent.MenusRepeater, MenusComponent.Loading, etc.
 */
export const MenusComponent = {
  /** Menus root component */
  Root,
  /** Menu selector component */
  MenuSelector,
  /** Location selector component */
  LocationSelector,
  /** Menus repeater component */
  MenusRepeater,
  /** Menus loading component */
  Loading,
  /** Menus error component */
  Error,
} as const;
