import React, { createContext } from 'react';
import { useService } from '@wix/services-manager-react';
import { ServiceAPI } from '@wix/services-manager/types';
import { useModifierGroupContext } from '@wix/headless-restaurants-menus/react';
import {
  EnhancedModifier,
  EnhancedModifierGroup,
} from '@wix/headless-restaurants-menus/services';
import {
  convertModifierToFormModifier,
  getModifierGroupRuleType,
  isSingleSelectRule,
} from '../../services/utils.js';
import { RuleType } from '../../services/common-types.js';
import { ItemServiceDefinition } from '../../services/item-details-service.js';

interface ModifiersContextValue {
  selectedModifierIds: string[];
  onToggle: (modifierId: string) => void;
  modifierGroup: EnhancedModifierGroup;
  modifiers: EnhancedModifier[];
  ruleType: RuleType;
  isSingleSelect: boolean;
}

const ModifiersContext = createContext<ModifiersContextValue | null>(null);

export function useModifiersContext(): ModifiersContextValue {
  const context = React.useContext(ModifiersContext);
  if (!context) {
    throw new Error(
      'useModifiersContext must be used within a ModifierGroupComponent',
    );
  }
  return context;
}

interface ModifierGroupComponentProps {
  children: React.ReactNode;
}

export const ModifierGroupComponent: React.FC<ModifierGroupComponentProps> = ({
  children,
}) => {
  const service = useService(ItemServiceDefinition) as ServiceAPI<
    typeof ItemServiceDefinition
  >;
  const { modifierGroup } = useModifierGroupContext();

  const rule = modifierGroup.rule;
  const isSingleSelect = Boolean(
    rule ? isSingleSelectRule(rule as NonNullable<typeof rule>) : false,
  );

  const groupId = modifierGroup._id;
  const groupSelectedModifierIds = service.getSelectedModifiers?.(
    groupId ?? '',
  );

  const onToggle = (modifierId: string) => {
    if (groupId) {
      service.toggleModifier?.(groupId, modifierId, isSingleSelect);
    }
  };

  const ruleType = getModifierGroupRuleType(modifierGroup.rule);

  const contextValue: ModifiersContextValue = {
    selectedModifierIds: groupSelectedModifierIds,
    onToggle,
    modifierGroup,
    modifiers: modifierGroup.modifiers.map(convertModifierToFormModifier),
    isSingleSelect,
    ruleType,
  };

  return (
    <ModifiersContext.Provider value={contextValue}>
      {children}
    </ModifiersContext.Provider>
  );
};

interface ModifierComponentProps {
  children: (props: {
    selectedModifierIds: string[];
    onToggle: (modifierId: string) => void;
    modifierGroup: EnhancedModifierGroup;
    modifiers: EnhancedModifier[];
    isSingleSelect: boolean;
    singleSelectedModifierId: string;
  }) => React.ReactNode;
}

export const ModifierComponent: React.FC<ModifierComponentProps> = ({
  children,
}) => {
  const {
    selectedModifierIds,
    onToggle,
    modifierGroup,
    modifiers,
    isSingleSelect,
  } = useModifiersContext();

  const singleSelectedModifierId =
    selectedModifierIds.length > 0 ? selectedModifierIds[0] ?? '' : '';

  return children({
    selectedModifierIds,
    onToggle,
    modifierGroup,
    modifiers,
    isSingleSelect,
    singleSelectedModifierId,
  });
};

