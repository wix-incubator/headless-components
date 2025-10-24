import {
  menus,
  sections,
  items,
  itemVariants,
  itemLabels,
  itemModifierGroups,
  itemModifiers,
} from '@wix/restaurants';

export interface Location {
  id: string;
  name: string;
}

export interface BusinessLocationDetails {
  name?: string;
  archived?: boolean;
  default?: boolean;
}

export interface EnhancedMenu
  extends Omit<menus.Menu, 'businessLocationDetails'> {
  businessLocationDetails?: BusinessLocationDetails;
}

export type Menu = EnhancedMenu;
export type Section = sections.Section;
export type Item = items.Item;
export type Variant = itemVariants.Variant;
export type Label = itemLabels.Label;
export type ModifierGroup = itemModifierGroups.ModifierGroup;
export type Modifier = itemModifiers.Modifier;
export type CursorPagingMetadata = menus.CursorPagingMetadata;

export type EnhancedVariant = Variant & {
  priceInfo?: {
    price?: string;
    formattedPrice?: string;
  };
};
export interface EnhancedItem
  extends Omit<Item, 'labels' | 'modifierGroups' | 'priceVariants'> {
  labels: Label[];
  modifierGroups: EnhancedModifierGroup[];
  priceVariants?: Array<EnhancedVariant>;
}

export interface EnhancedModifierGroup
  extends Omit<ModifierGroup, 'modifiers'> {
  modifiers: Array<EnhancedModifier>;
}

export type EnhancedModifier = Modifier & {
  additionalChargeInfo?: {
    additionalCharge?: string;
    formattedAdditionalCharge?: string;
  };
};
