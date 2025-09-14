import {
  menus,
  sections,
  items,
  itemVariants,
  itemLabels,
  itemModifierGroups,
  itemModifiers,
} from '@wix/restaurants';

export type Menu = menus.Menu;
export type Section = sections.Section;
export type Item = items.Item;
export type Variant = itemVariants.Variant;
export type Label = itemLabels.Label;
export type ModifierGroup = itemModifierGroups.ModifierGroup;
export type Modifier = itemModifiers.Modifier;
export type CursorPagingMetadata = menus.CursorPagingMetadata;

// Enhanced types with connected entities
export interface EnhancedItem
  extends Omit<Item, 'labels' | 'modifierGroups' | 'priceVariants'> {
  labels: Label[];
  modifierGroups: EnhancedModifierGroup[];
  priceVariants?: Array<
    Variant & {
      priceInfo?: {
        price?: string;
        formattedPrice?: string;
      };
    }
  >;
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
