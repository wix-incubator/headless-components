import React from 'react';
import { type AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {
  Modifier,
  ModifierGroup as ModifierGroupComponents,
  useModifierContext,
} from '@wix/headless-restaurants-menus/react';
import {
  ModifierGroupComponent,
  ModifierComponent,
} from './core/ModifierGroup.js';
import {
  EnhancedModifier,
  EnhancedModifierGroup,
} from '@wix/headless-restaurants-menus/services';

enum TestIds {
  itemModifier = 'item-modifier',
}

const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
      fill="currentColor"
    />
  </svg>
);

export interface ItemDetailsModifierGroupProps {
  children: React.ReactNode;
}

export interface ModifiersProps {
  className?: string;
  asChild?: boolean;
  modifierNameClassName?: string;
  modifierPriceClassName?: string;
  children?: AsChildChildren<{
    selectedModifierIds: string[];
    onToggle: (modifierId: string) => void;
    modifierGroup: EnhancedModifierGroup;
    modifiers: EnhancedModifier[];
    isSingleSelect: boolean;
  }>;
}

export interface ModifierCheckboxProps {
  selectedModifierIds: string[];
  onToggle: (modifierId: string) => void;
  className?: string;
  asChild?: boolean;
  modifierNameClassName?: string;
  modifierPriceClassName?: string;
  children?: AsChildChildren<{
    selectedModifierIds: string[];
    onToggle: (modifierId: string) => void;
  }>;
}

export interface ModifierRadioProps {
  modifierNameClassName?: string;
  modifierPriceClassName?: string;
}

export const Root = React.forwardRef<
  HTMLElement,
  ItemDetailsModifierGroupProps
>(({ children }) => {
  return <ModifierGroupComponent>{children}</ModifierGroupComponent>;
});

Root.displayName = 'ItemDetailsModifierGroup.Root';

export const Modifiers = React.forwardRef<HTMLElement, ModifiersProps>(
  (
    {
      className,
      asChild,
      modifierNameClassName,
      modifierPriceClassName,
      children,
    },
    ref,
  ) => {
    return (
      <ModifierComponent>
        {({
          selectedModifierIds,
          onToggle,
          modifierGroup,
          modifiers,
          isSingleSelect,
          singleSelectedModifierId,
        }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            testId={TestIds.itemModifier}
            className={className}
            customElement={children}
            customElementProps={{
              selectedModifierIds,
              onToggle,
              modifierGroup,
              modifiers,
              isSingleSelect,
            }}
          >
            {isSingleSelect ? (
              <RadioGroupPrimitive.Root
                value={singleSelectedModifierId}
                onValueChange={onToggle}
              >
                <ModifierGroupComponents.ModifiersRepeater>
                  <ModifierRadio
                    modifierNameClassName={modifierNameClassName}
                    modifierPriceClassName={modifierPriceClassName}
                  />
                </ModifierGroupComponents.ModifiersRepeater>
              </RadioGroupPrimitive.Root>
            ) : (
              <ModifierGroupComponents.ModifiersRepeater>
                <ModifierCheckbox
                  selectedModifierIds={selectedModifierIds}
                  onToggle={onToggle}
                  modifierNameClassName={modifierNameClassName}
                  modifierPriceClassName={modifierPriceClassName}
                />
              </ModifierGroupComponents.ModifiersRepeater>
            )}
          </AsChildSlot>
        )}
      </ModifierComponent>
    );
  },
);

Modifiers.displayName = 'ItemDetailsModifierGroup.Modifiers';

const ModifierCheckbox = React.forwardRef<HTMLElement, ModifierCheckboxProps>(
  ({
    selectedModifierIds,
    onToggle,
    className,
    asChild,
    modifierNameClassName,
    modifierPriceClassName,
    children,
    ...rest
  }) => {
    const { modifier } = useModifierContext();
    const isSelected = selectedModifierIds.includes(modifier._id || '');

    return (
      <AsChildSlot
        asChild={asChild}
        testId={TestIds.itemModifier}
        className={className}
        customElement={children}
        customElementProps={{
          selectedModifierIds,
          onToggle,
        }}
        {...rest}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CheckboxPrimitive.Root
            className="CheckboxRoot"
            checked={isSelected}
            onCheckedChange={() => onToggle(modifier._id || '')}
            id={modifier._id || undefined}
            disabled={!modifier.inStock}
          >
            <CheckboxPrimitive.Indicator className="CheckboxIndicator">
              <CheckIcon />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          <label className="Label" htmlFor={modifier._id || undefined}>
            <Modifier.Name className={modifierNameClassName} />
            <Modifier.Price className={modifierPriceClassName} />
          </label>
        </div>
      </AsChildSlot>
    );
  },
);

const ModifierRadio = React.forwardRef<HTMLElement, ModifierRadioProps>(
  ({ modifierNameClassName, modifierPriceClassName }) => {
    const { modifier } = useModifierContext();

    return (
      <RadioGroupPrimitive.Item
        className="RadioGroupItem"
        value={modifier._id || ''}
        id={modifier._id || undefined}
        disabled={!modifier.inStock}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroupPrimitive.Indicator className="RadioGroupIndicator" />
          <label className="Label" htmlFor={modifier._id || undefined}>
            <Modifier.Name className={modifierNameClassName} />
            <Modifier.Price className={modifierPriceClassName} />
          </label>
        </div>
      </RadioGroupPrimitive.Item>
    );
  },
);

export const ModifierGroup = {
  Root,
  Modifiers,
} as const;
