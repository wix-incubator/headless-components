import React from 'react';
import {
  Loading as CoreLoading,
  ErrorState as CoreErrorState,
  Menus,
} from './core/index.js';
import type { Menu } from '../services/types.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { TestIds } from './TestIds.js';
import { useService } from '@wix/services-manager-react';
import { MenusServiceConfig, MenusServiceDefinition } from '../services/index.js';
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
  return <Menus config={props.config}>{props.children}</Menus>;
}

export const MenusRepeater = React.forwardRef<HTMLElement, MenusRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const menusService = useService(MenusServiceDefinition) as ServiceAPI<
      typeof MenusServiceDefinition
    >;
    const menus = menusService.menus.get();
    const hasMenus = menus.length > 0;

    if (!hasMenus) return null;

    return (
      <>
        {menus.map((menu: Menu) => (
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
 *   <div className="text-center" />
 * </Menus.Loading>
 *
 * // asChild with react component
 * <Menus.Loading asChild>
 *   {React.forwardRef(({loading, ...props}, ref) => (
 *     <div ref={ref} {...props} className="text-center">
 *       {loading ? "Loading..." : null}
 *     </div>
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
              <div>{loading ? 'Loading...' : null}</div>
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
 *   <div className="text-red-600" />
 * </Menus.Error>
 *
 * // asChild with react component
 * <Menus.Error asChild>
 *   {React.forwardRef(({error, ...props}, ref) => (
 *     <div ref={ref} {...props} className="text-red-600">
 *       {error ? `Error: ${error}` : null}
 *     </div>
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
            <div>{error ? `Error: ${error}` : null}</div>
          </AsChildSlot>
        );
      }}
    </CoreErrorState>
  );
});

Loading.displayName = 'Menus.Loading';
Error.displayName = 'Menus.Error';

/**
 * Menus namespace containing all menus components
 * following the compound component pattern: MenusComponent.Root, MenusComponent.MenusRepeater, MenusComponent.Loading, etc.
 */
export const MenusComponent = {
  /** Menus root component */
  Root,
  /** Menus repeater component */
  MenusRepeater,
  /** Menus loading component */
  Loading,
  /** Menus error component */
  Error,
} as const;
