import type {
  EnhancedModifier,
  EnhancedModifierGroup,
} from '@wix/headless-restaurants-menus/services';
import { RuleType } from './common-types.js';

interface ruleUtilsArgs {
  required: boolean;
  minSelections: number;
  maxSelections?: number | null;
}

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

export const getModifierGroupRuleType = (
  modifierGroupRule: EnhancedModifierGroup['rule'],
) => {
  const required = modifierGroupRule?.required ?? false;
  const minSelections = modifierGroupRule?.minSelections ?? 0;
  const maxSelections = modifierGroupRule?.maxSelections;
  const ruleFields = { required, minSelections, maxSelections };
  if (hasNoLimit(ruleFields)) {
    return RuleType.NO_LIMIT;
  }
  if (hasToChooseOne(ruleFields) || canChooseOne(ruleFields)) {
    return RuleType.CHOOSE_ONE;
  }
  if (hasToChooseX(ruleFields)) {
    return RuleType.CHOOSE_X;
  }
  if (hasToChooseAtLeastOne(ruleFields)) {
    return RuleType.CHOOSE_AT_LEAST_ONE;
  }
  if (hasToChooseAtLeastX(ruleFields)) {
    return RuleType.CHOOSE_AT_LEAST_X;
  }
  if (chooseUpToX(ruleFields)) {
    return RuleType.CHOOSE_UP_TO_X;
  }
  if (hasToChooseBetweenXAndY(ruleFields)) {
    return RuleType.CHOOSE_BETWEEN_X_AND_Y;
  }
  return RuleType.NO_LIMIT;
};

const hasNoValue = (variable?: number | null): variable is number =>
  variable === null || variable === undefined;

export const hasNoLimit = ({
  required,
  minSelections,
  maxSelections,
}: ruleUtilsArgs) =>
  !required && minSelections < 1 && (maxSelections ? maxSelections < 1 : true);

export const canChooseOne = ({
  required,
  minSelections,
  maxSelections,
}: ruleUtilsArgs) =>
  !required &&
  minSelections === 0 &&
  (maxSelections ? maxSelections === 1 : false);

export const hasToChooseOne = ({
  required,
  minSelections,
  maxSelections,
}: ruleUtilsArgs) =>
  required &&
  minSelections === 1 &&
  (maxSelections ? maxSelections === 1 : false);

export const hasToChooseX = ({
  required,
  minSelections,
  maxSelections,
}: ruleUtilsArgs) =>
  required ? maxSelections && minSelections === maxSelections : false;

export const hasToChooseAtLeastOne = ({
  required,
  minSelections,
  maxSelections,
}: ruleUtilsArgs) =>
  required ? minSelections === 1 && hasNoValue(maxSelections) : false;

export const hasToChooseAtLeastX = ({
  required,
  minSelections,
  maxSelections,
}: ruleUtilsArgs) =>
  required ? minSelections > 1 && hasNoValue(maxSelections) : false;

export const chooseUpToX = ({
  required,
  minSelections,
  maxSelections,
}: ruleUtilsArgs) =>
  !required &&
  minSelections === 0 &&
  (maxSelections ? maxSelections > 1 : false);

export const hasToChooseBetweenXAndY = ({
  required,
  minSelections,
  maxSelections,
}: ruleUtilsArgs) =>
  required
    ? maxSelections
      ? minSelections > 0 && maxSelections > minSelections
      : false
    : false;
