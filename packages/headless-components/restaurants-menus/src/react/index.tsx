import * as MenusModule from './Menus.js';
import * as MenuModule from './Menu.js';
import * as SectionModule from './Section.js';
import * as ItemModule from './Item.js';
import * as VariantModule from './Variant.js';
import * as LabelModule from './Label.js';
import * as ModifierGroupModule from './ModifierGroup.js';
import * as ModifierModule from './Modifier.js';
import {
  useMenuContext,
  useSectionContext,
  useItemContext,
  useLabelContext,
  useVariantContext,
  useModifierGroupContext,
  useModifierContext,
} from './core/index.js';

export const Menus = MenusModule;
export const Menu = MenuModule;
export const Section = SectionModule;
export const Item = ItemModule;
export const Variant = VariantModule;
export const Label = LabelModule;
export const ModifierGroup = ModifierGroupModule;
export const Modifier = ModifierModule;

export {
  useMenuContext,
  useSectionContext,
  useItemContext,
  useLabelContext,
  useVariantContext,
  useModifierGroupContext,
  useModifierContext,
};
