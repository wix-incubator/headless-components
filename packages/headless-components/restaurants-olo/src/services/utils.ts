import type {
  EnhancedModifier,
  EnhancedModifierGroup,
} from '@wix/headless-restaurants-menus/services';

export const getModifiersInitState = (
  modifierGroups: EnhancedModifierGroup[],
) => {
  const initialSelectedModifiers: Record<string, Array<string>> = {};
  modifierGroups.forEach((group: EnhancedModifierGroup) => {
    if (group._id) {
      const isMultiSelectItem = !isSingleSelectRule(group.rule ?? {});

      const formModifiers = group.modifiers.map(convertModifierToFormModifier);

      if (isMultiSelectItem) {
        const preSelectedModifiers = getPreSelectedModifiers(formModifiers);
        initialSelectedModifiers[group._id] = preSelectedModifiers;
      } else {
        const preSelectedModifier = getFirstPreSelectedModifier(formModifiers);
        initialSelectedModifiers[group._id] = preSelectedModifier
          ? [preSelectedModifier]
          : [];
      }
    }
  });

  return initialSelectedModifiers;
};

export const isSingleSelectRule = (
  rule: NonNullable<EnhancedModifierGroup['rule']>,
) => rule.required && rule.minSelections === 1 && rule.maxSelections === 1;

export const getFirstPreSelectedModifier = (modifiers: EnhancedModifier[]) =>
  modifiers.find(({ preSelected, inStock }) => preSelected && inStock)?._id;

export const getPreSelectedModifiers = (
  modifiers: EnhancedModifier[],
): string[] =>
  modifiers.reduce<string[]>((acc, modifier) => {
    if (modifier.preSelected && modifier.inStock && modifier._id) {
      return [...acc, modifier._id];
    }

    return acc;
  }, []);

export const convertModifierToFormModifier = (
  modifier: EnhancedModifier,
  index: number,
) => {
  return {
    ...modifier,
    _id: `${modifier._id}~${index}`,
  };
};
