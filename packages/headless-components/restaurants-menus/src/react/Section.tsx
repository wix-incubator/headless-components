import React from "react";
import {
  Section as CoreSection,
  SectionName,
  SectionDescription,
} from "./core";
import type {
  Section,
  EnhancedItem,
} from "../../../components/restaurants-menus/types";
import { AsChildSlot, type AsChildChildren } from "@wix/headless-utils/react";
import { TestIds } from "./TestIds";
import { useSectionContext } from "./core/Section";
import * as ItemComponent from "./Item";
import { MenusServiceDefinition } from "../services";
import { useService } from "@wix/services-manager-react";

export interface SectionRootProps {
  children: React.ReactNode;
  section?: Section;
}

export interface SectionNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface SectionDescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface SectionItemsRepeaterProps {
  children: React.ReactNode;
}

export function Root(props: SectionRootProps) {
  if (!props.section) {
    return null;
  }

  return <CoreSection section={props.section}>{props.children}</CoreSection>;
}

/**
 * Displays the section name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Section.Name className="text-xl font-medium" />
 *
 * // asChild with primitive
 * <Section.Name asChild>
 *   <h3 className="text-xl font-medium" />
 * </Section.Name>
 *
 * // asChild with react component
 * <Section.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h3 ref={ref} {...props} className="text-xl font-medium">
 *       {name}
 *     </h3>
 *   ))}
 * </Section.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, SectionNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <SectionName>
        {({ name }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.sectionName}
              customElement={children}
              customElementProps={{ name }}
              content={name}
              {...otherProps}
            >
              <div>{name}</div>
            </AsChildSlot>
          );
        }}
      </SectionName>
    );
  }
);

/**
 * Displays the section description with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Section.Description className="text-secondary-foreground" />
 *
 * // asChild with primitive
 * <Section.Description asChild>
 *   <p className="text-secondary-foreground" />
 * </Section.Description>
 *
 * // asChild with react component
 * <Section.Description asChild>
 *   {React.forwardRef(({description, ...props}, ref) => (
 *     <p ref={ref} {...props} className="text-secondary-foreground">
 *       {description}
 *     </p>
 *   ))}
 * </Section.Description>
 * ```
 */
export const Description = React.forwardRef<
  HTMLElement,
  SectionDescriptionProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <SectionDescription>
      {({ description }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.sectionDescription}
            customElement={children}
            customElementProps={{ description }}
            content={description}
            {...otherProps}
          >
            <div>{description}</div>
          </AsChildSlot>
        );
      }}
    </SectionDescription>
  );
});

Name.displayName = "Section.Name";
Description.displayName = "Section.Description";

export const ItemsRepeater = React.forwardRef<
  HTMLElement,
  SectionItemsRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const menusService = useService(MenusServiceDefinition);
  const { section } = useSectionContext();
  const items = section.itemIds.map((itemId) =>
    menusService.items.get().find((item) => item._id === itemId)
  );
  const hasItems = items.length > 0;

  if (!hasItems) return null;

  return items.map((item: EnhancedItem) => (
    <ItemComponent.Root
      key={item._id}
      item={item}
      data-testid={TestIds.itemName}
      data-item-id={item._id}
    >
      {children}
    </ItemComponent.Root>
  ));
});

ItemsRepeater.displayName = "Section.ItemsRepeater";

/**
 * Section namespace containing all section components
 * following the compound component pattern: SectionComponent.Root, SectionComponent.Name, SectionComponent.Description, etc.
 */
export const SectionComponent = {
  /** Section root component */
  Root,
  /** Section name component */
  Name,
  /** Section description component */
  Description,
  /** Section items repeater component */
  ItemsRepeater,
} as const;
