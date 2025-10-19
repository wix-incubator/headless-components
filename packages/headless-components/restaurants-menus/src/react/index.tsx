import * as MenusModule from './Menus';
import * as MenuModule from './Menu';
import * as SectionModule from './Section';
import * as ItemModule from './Item';
import * as VariantModule from './Variant';
import * as LabelModule from './Label';
import * as ModifierGroupModule from './ModifierGroup';
import * as ModifierModule from './Modifier';
import {
  useMenuContext,
  useSectionContext,
  useItemContext,
} from './core/index';

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
};
