import React, { useState } from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { ServiceAPI } from '@wix/services-manager/types';
import { createServicesMap } from '@wix/services-manager';
import { type LineItem } from '@wix/ecom/services';
import {
  ItemService,
  ItemServiceConfig,
  ItemServiceDefinition,
  loadItemServiceConfig,
} from '../../services/item-details-service.js';
import { OLOSettingsServiceDefinition } from '../../services/olo-settings-service.js';
import {
  useItemContext,
  useModifierGroupContext,
} from '@wix/headless-restaurants-menus/react';
import {
  EnhancedItem,
  EnhancedModifier,
  EnhancedModifierGroup,
  EnhancedVariant,
} from '@wix/headless-restaurants-menus/services';
import { AvailabilityStatus } from '../../services/common-types.js';
// ========================================
// ITEM DETAILS PRIMITIVE COMPONENTS
// ========================================
// Headless components that integrate with ItemService
// Following the headless component pattern for composable UI building

// ========================================
// ROOT COMPONENT
// ========================================

interface ItemDetailsRootProps {
  children: (props: { item: unknown }) => React.ReactNode;
  itemDetailsServiceConfig?: ItemServiceConfig;
}

export const Root: React.FC<ItemDetailsRootProps> = ({
  children,
  itemDetailsServiceConfig,
}) => {
  const service = useService(OLOSettingsServiceDefinition);
  const selectedItem = service.selectedItem?.get();
  let config = itemDetailsServiceConfig;
  if (!config) {
    config = loadItemServiceConfig({
      item: selectedItem as EnhancedItem,
      operationId: service.operation?.get()?._id ?? '',
    });
  }

  if (config.item) {
    service.selectedItem?.set(config.item);
  }

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ItemServiceDefinition,
        ItemService,
        config,
      )}
    >
      {children({ item: itemDetailsServiceConfig?.item ?? selectedItem })}
    </WixServices>
  );
};

// ========================================
// SPECIAL REQUEST COMPONENT
// ========================================

interface ItemDetailsSpecialRequestProps {
  children: (props: {
    value: string;
    onChange: (value: string) => void;
    // placeholder: string;
    // maxLength: number;
  }) => React.ReactNode;
}

export const SpecialRequest: React.FC<ItemDetailsSpecialRequestProps> = ({
  children,
}) => {
  const [value, setValue] = useState('');
  const service = useService(ItemServiceDefinition) as ServiceAPI<
    typeof ItemServiceDefinition
  >;

  const onChange = (newValue: string) => {
    setValue(newValue);
    service.updateSpecialRequest(newValue);
  };

  return children({
    value,
    onChange,
    // placeholder: 'Any special requests or dietary restrictions?',
    // maxLength: 200
  });
};

interface ItemDetailsLineItemProps {
  children: (props: { lineItem: LineItem }) => React.ReactNode;
}

export const LineItemComponent: React.FC<ItemDetailsLineItemProps> = ({
  children,
}) => {
  const service = useService(ItemServiceDefinition) as ServiceAPI<
    typeof ItemServiceDefinition
  >;
  const lineItem = service.lineItem?.get?.() ?? {};
  return children({ lineItem });
};

interface ItemDetailsQuantityProps {
  children: (props: {
    quantity: number;
    increment: () => void;
    decrement: () => void;
    setQuantity: (quantity: number) => void;
    canIncrement: boolean;
    canDecrement: boolean;
    onValueChange: (value: number) => void;
  }) => React.ReactNode;
}

export const QuantityComponent: React.FC<ItemDetailsQuantityProps> = ({
  children,
}) => {
  const service = useService(ItemServiceDefinition) as ServiceAPI<
    typeof ItemServiceDefinition
  >;
  const quantity = service.quantity?.get?.() ?? 1;
  const increment = () => service.quantity?.set?.(quantity + 1);
  const decrement = () => service.quantity?.set?.(quantity - 1);
  const setQuantity = (quantity: number) => {
    service.updateQuantity?.(quantity);
  };
  const canIncrement = true;
  const canDecrement = quantity > 1;
  const onValueChange = (value: number) => {
    service.updateQuantity?.(value);
  };
  return children({
    quantity,
    increment,
    decrement,
    setQuantity,
    canIncrement,
    canDecrement,
    onValueChange,
  });
};

// ========================================
// VARIANTS COMPONENT
// ========================================

interface ItemDetailsVariantsProps {
  children: (props: {
    variants: EnhancedVariant[];
    hasVariants: boolean;
    selectedVariantId?: string;
    onVariantChange?: (variantId: string) => void;
    selectedVariant?: EnhancedVariant;
  }) => React.ReactNode;
}

export const VariantsComponent: React.FC<ItemDetailsVariantsProps> = ({
  children,
}) => {
  const service = useService(ItemServiceDefinition) as ServiceAPI<
    typeof ItemServiceDefinition
  >;
  const { item } = useItemContext();
  const selectedVariant = service.selectedVariant?.get?.();

  // Get variants from item context
  const variants = item?.priceVariants || [];
  const hasVariants = variants.length > 0;
  const selectedVariantId = selectedVariant?._id ?? undefined;

  const onVariantChange = (variantId: string) => {
    const variant = variants.find((v: EnhancedVariant) => v._id === variantId);
    if (variant) {
      service.updateSelectedVariant?.(variant);
    }
  };

  return children({
    variants,
    hasVariants,
    selectedVariantId,
    onVariantChange,
    selectedVariant,
  });
};

// ========================================
// MODIFIER COMPONENT
// ========================================

interface ItemDetailsModifiersProps {
  children: (props: {
    selectedModifierIds: string[];
    onToggle: (modifierId: string) => void;
    modifierGroup: EnhancedModifierGroup;
    modifiers: EnhancedModifier[];
  }) => React.ReactNode;
  singleSelect?: boolean;
}

export const ModifiersComponent: React.FC<ItemDetailsModifiersProps> = ({
  children,
  singleSelect,
}) => {
  const service = useService(ItemServiceDefinition) as ServiceAPI<
    typeof ItemServiceDefinition
  >;
  const { modifierGroup } = useModifierGroupContext();
  const selectedModifiers = service.selectedModifiers?.get?.() ?? {};

  // Get selected modifier IDs for this group
  const groupId = modifierGroup._id;
  const groupSelectedModifierIds = groupId
    ? selectedModifiers[groupId] || []
    : [];

  const onToggle = (modifierId: string) => {
    if (groupId) {
      service.toggleModifier?.(groupId, modifierId, singleSelect);
    }
  };

  return children({
    selectedModifierIds: groupSelectedModifierIds,
    onToggle,
    modifierGroup,
    modifiers: modifierGroup.modifiers.map((modifier, index) => ({
      ...modifier,
      _id: `${modifier._id}~${index}`,
    })),
  });
};

// ========================================
// Availability COMPONENT
// ========================================

interface ItemDetailsAvailabilityProps {
  availabilityStatusMap: Record<AvailabilityStatus, { text?: string, buttonText?: string, action?: () => void }>;
  children: (props: {
    availabilityStatus: AvailabilityStatus;
    availabilityAction?: () => void;
    availabilityStatusText?: string;
    availabilityStatusButtonText?: string;
  }) => React.ReactNode;
}

export const AvailabilityComponent: React.FC<ItemDetailsAvailabilityProps> = ({
  children,
  availabilityStatusMap,
}) => {
    const itemService = useService(ItemServiceDefinition);
  const availabilityStatus: AvailabilityStatus = itemService.availabilityStatus?.get?.() ?? AvailabilityStatus.AVAILABLE;
  return children({ availabilityStatus, availabilityAction:availabilityStatusMap[availabilityStatus].action ,availabilityStatusText: availabilityStatusMap[availabilityStatus].text, availabilityStatusButtonText: availabilityStatusMap[availabilityStatus].buttonText });
};
