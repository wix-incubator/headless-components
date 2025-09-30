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
      item: selectedItem,
      operationId: service.operation?.get()?._id ?? '',
    });
  }
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ItemServiceDefinition,
        ItemService,
        config,
      )}
    >
      {children({ item: selectedItem })}
    </WixServices>
  );
};

// ========================================
// MODIFIERS REPEATER COMPONENT
// ========================================

interface ItemDetailsModifiersRepeaterProps {
  children: (props: {
    modifiers: []; // TODO: Use proper Modifier type
    hasModifiers: boolean;
  }) => React.ReactNode;
}

export const ModifiersRepeater: React.FC<ItemDetailsModifiersRepeaterProps> = ({
  children,
}) => {
  const service = useService(ItemServiceDefinition) as ServiceAPI<
    typeof ItemServiceDefinition
  >;
  const item = service.item?.get();

  // TODO: Check if modifiers exist on item type - might be in a different property
  const modifiers = (item as unknown as { modifiers: [] })?.modifiers || [];
  const hasModifiers = modifiers.length > 0;

  return children({ modifiers, hasModifiers });
};

// ========================================
// VARIANTS REPEATER COMPONENT
// ========================================

interface ItemDetailsVariantsRepeaterProps {
  children: (props: {
    variants: []; // TODO: Use proper Variant type
    hasVariants: boolean;
  }) => React.ReactNode;
}

export const VariantsRepeater: React.FC<ItemDetailsVariantsRepeaterProps> = ({
  children,
}) => {
  const service = useService(ItemServiceDefinition) as ServiceAPI<
    typeof ItemServiceDefinition
  >;
  const item = service.item?.get();

  // TODO: Check if variants exist on item type - might be in a different property
  const variants = (item as unknown as { variants: [] })?.variants || [];
  const hasVariants = variants.length > 0;

  return children({ variants, hasVariants });
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
