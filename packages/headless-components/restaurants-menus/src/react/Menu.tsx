import React from 'react';
import { Menu as CoreMenu, MenuName, MenuDescription } from './core/index.js';
import type { Menu, Section } from '../services/types.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { TestIds } from './TestIds.js';
import { useMenuContext } from './core/Menu.js';
import * as SectionComponent from './Section.js';
import { useService } from '@wix/services-manager-react';
import { MenusServiceDefinition } from '../services/index.js';
export interface MenuRootProps {
  children: React.ReactNode;
  menu?: Menu;
}
export interface MenuNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}
export interface MenuDescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface MenuSectionsProps {
  children: (props: { sections: Section[] }) => React.ReactNode;
}

export interface MenuSectionsRepeaterProps {
  children: React.ReactNode;
}

/**
 * Root component that provides menu context to its children.
 *
 * @warning Do not use this component directly if it's inside a repeater.
 * Use the repeater component (e.g., Menus.MenusRepeater) instead, which will
 * automatically render this Root component for each menu.
 */
export function Root(props: MenuRootProps) {
  if (!props.menu) {
    return null;
  }

  return <CoreMenu menu={props.menu}>{props.children}</CoreMenu>;
}

/**
 * Displays the menu name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Menu.Name className="text-2xl font-semibold" />
 *
 * // asChild with primitive
 * <Menu.Name asChild>
 *   <h2 className="text-2xl font-semibold" />
 * </Menu.Name>
 *
 * // asChild with react component
 * <Menu.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h2 ref={ref} {...props} className="text-2xl font-semibold">
 *       {name}
 *     </h2>
 *   ))}
 * </Menu.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, MenuNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <MenuName>
        {({ name }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.menuName}
              customElement={children}
              customElementProps={{ name }}
              content={name}
              {...otherProps}
            >
              <h1>{name}</h1>
            </AsChildSlot>
          );
        }}
      </MenuName>
    );
  },
);

/**
 * Displays the menu description with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Menu.Description className="text-secondary-foreground" />
 *
 * // asChild with primitive
 * <Menu.Description asChild>
 *   <p className="text-secondary-foreground" />
 * </Menu.Description>
 *
 * // asChild with react component
 * <Menu.Description asChild>
 *   {React.forwardRef(({description, ...props}, ref) => (
 *     <p ref={ref} {...props} className="text-secondary-foreground">
 *       {description}
 *     </p>
 *   ))}
 * </Menu.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, MenuDescriptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <MenuDescription>
        {({ description }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.menuDescription}
              customElement={children}
              customElementProps={{ description }}
              content={description}
              {...otherProps}
            >
              <p>{description}</p>
            </AsChildSlot>
          );
        }}
      </MenuDescription>
    );
  },
);

Name.displayName = 'Menu.Name';
Description.displayName = 'Menu.Description';

export const SectionsRepeater = React.forwardRef<
  HTMLElement,
  MenuSectionsRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const { menu } = useMenuContext();
  const { sections } = useService(MenusServiceDefinition);

  const menuSections =
    (menu.sectionIds ?? [])
      .map((sectionId: string) =>
        sections.get().find((section) => section._id === sectionId),
      )
      .filter(
        (section: Section | undefined): section is Section =>
          section !== undefined,
      ) ?? [];

  const hasSections = menuSections.length > 0;

  if (!hasSections) return null;

  return (
    <>
      {menuSections.map((section: Section) => (
        <SectionComponent.Root
          key={section._id}
          section={section}
          data-testid={TestIds.itemName}
          data-section-id={section._id}
        >
          {children}
        </SectionComponent.Root>
      ))}
    </>
  );
});

SectionsRepeater.displayName = 'Menu.SectionsRepeater';

/**
 * Menu namespace containing all menu components
 * following the compound component pattern: MenuComponent.Root, MenuComponent.Name, MenuComponent.Description, etc.
 */
export const MenuComponent = {
  /** Menu root component */
  Root,
  /** Menu name component */
  Name,
  /** Menu description component */
  Description,
  /** Menu sections repeater component */
  SectionsRepeater,
} as const;
