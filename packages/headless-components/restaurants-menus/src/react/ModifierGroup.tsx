import React from 'react';
import type {
  EnhancedModifier,
  EnhancedModifierGroup,
} from '../services/types.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { TestIds } from './TestIds.js';
import {
  CoreModifierGroup,
  ModifierGroupName,
  useModifierGroupContext,
} from './core/index.js';
import * as ModifierComponent from './Modifier.js';

export interface ModifierGroupRootProps {
  modifierGroup?: EnhancedModifierGroup;
  children: React.ReactNode;
}

/**
 * Root component that provides modifier group context to its children.
 *
 * @warning Do not use this component directly if it's inside a repeater.
 * Use the repeater component (e.g., Item.ModifierGroupsRepeater) instead, which will
 * automatically render this Root component for each modifier group.
 */
export const Root = (props: ModifierGroupRootProps) => {
  if (!props.modifierGroup) {
    return null;
  }

  return (
    <CoreModifierGroup modifierGroup={props.modifierGroup}>
      {props.children}
    </CoreModifierGroup>
  );
};

export interface ModifierGroupNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface ModifierGroupModifiersRepeaterProps {
  children: React.ReactNode;
}

/**
 * Displays the modifier group name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ModifierGroup.Name className="text-sm font-medium" />
 *
 * // asChild with primitive
 * <ModifierGroup.Name asChild>
 *   <h4 className="text-sm font-medium" />
 * </ModifierGroup.Name>
 *
 * // asChild with react component
 * <ModifierGroup.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h4 ref={ref} {...props} className="text-sm font-medium">
 *       {name}
 *     </h4>
 *   ))}
 * </ModifierGroup.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, ModifierGroupNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <ModifierGroupName>
        {({ name }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.modifierGroupName}
              customElement={children}
              customElementProps={{ name }}
              content={name}
              {...otherProps}
            >
              <p>{name}</p>
            </AsChildSlot>
          );
        }}
      </ModifierGroupName>
    );
  },
);

Name.displayName = 'ModifierGroup.Name';

export const ModifiersRepeater = (
  props: ModifierGroupModifiersRepeaterProps,
) => {
  const { children } = props;
  const { modifierGroup } = useModifierGroupContext();
  const hasModifiers = !!(
    modifierGroup.modifiers && modifierGroup.modifiers.length > 0
  );

  if (!hasModifiers) {
    return null;
  }

  const modifierGroupModifiers = modifierGroup.modifiers!;

  return (
    <>
      {modifierGroupModifiers.map((modifier: EnhancedModifier) => (
        <ModifierComponent.Root key={modifier._id} modifier={modifier}>
          {children}
        </ModifierComponent.Root>
      ))}
    </>
  );
};

ModifiersRepeater.displayName = 'ModifierGroup.ModifiersRepeater';

/**
 * ModifierGroup namespace containing all modifier group components
 * following the compound component pattern: ModifierGroupComponent.Root, ModifierGroupComponent.Name, ModifierGroupComponent.ModifiersRepeater
 */
export const ModifierGroupComponent = {
  /** ModifierGroup root component */
  Root,
  /** ModifierGroup name component */
  Name,
  /** ModifierGroup modifiers repeater component */
  ModifiersRepeater,
} as const;
