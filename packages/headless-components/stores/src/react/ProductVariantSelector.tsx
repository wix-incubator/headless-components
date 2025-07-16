import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { SelectedVariantServiceDefinition } from "../services/selected-variant-service.js";
import {
  type ConnectedOption,
  type ConnectedOptionChoice,
  InventoryAvailabilityStatus,
} from "@wix/auto_sdk_stores_products-v-3";

/**
 * Props for the Options headless component.
 */
export interface OptionsProps {
  /** Function that receives product options and selected choice data. 
   * Use this function to render product options in your custom product UI components. */
  children: (props: OptionsRenderProps) => React.ReactNode;
}

/**
 * Render props for the Options component.
 */
export interface OptionsRenderProps {
  /** Array of product options. */
  options: ConnectedOption[];
  /** Whether the product has options. */
  hasOptions: boolean;
  /** Currently selected choices. */
  selectedChoices: Record<string, string>;
}

/**
 * <blockquote class="caution">
 * 
 * **Developer Preview**
 * 
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 * 
 * </blockquote>
 * 
 * Headless component for displaying product options. The component allows you to display and manage selected choices for each option.
 *
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { Options } from "@wix/stores/components";
 * 
 * function ProductOptionsDisplay() {
 *  return (
 *    <Options>
 *      {({ options, hasOptions, selectedChoices }) => (
 *       <div className="product-options">
 *         {hasOptions ? (
 *           <ul>
 *             {options.map(option => (
 *               <li key={option._id}>
 *                 <strong>{option.name}:</strong>{" "}
 *                 {selectedChoices[option._id] || "Not selected"}
 *               </li>
 *             ))}
 *           </ul>
 *         ) : (
 *           <div>No product options available.</div>
 *         )}
 *       </div>
 *     )}
 *   </Options>
 *  );
 * }
 * 
 * @component
 */
export const Options = (props: OptionsProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const options = variantService.productOptions.get();

  return props.children({
    options,
    hasOptions: options.length > 0,
    selectedChoices,
  });
};

/**
 * Props for the Option headless component.
 */
export interface OptionProps {
  /** Product option data. */
  option: ConnectedOption;
  /** Function that receives data for a single product option.
   * Use this function to render individual product options in custom UI components. */
  children: (props: OptionRenderProps) => React.ReactNode;
}

/**
 * Render props for the Option component.
 */
export interface OptionRenderProps {
  /** Option name. */
  name: string;
  /** Option type. */
  type: any;
  /** Array of choices for the option. */
  choices: ConnectedOptionChoice[];
  /** Currently selected value for the option. */
  selectedValue: string | null;
  /** Whether this option has choices. */
  hasChoices: boolean;
}

/**
 * <blockquote class="caution">
 * 
 * **Developer Preview**
 * 
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 * 
 * </blockquote>
 * 
 * Headless component to display and manage choices for a specific product option.
 *
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { Option } from "@wix/stores/components";
 * 
 * function ProductOptionDisplay({ option }) {
 *  return (
 *   <Option option={option}>
 *     {({ name, choices, selectedValue, hasChoices }) => (
 *       <div className="product-option">
 *         <div>
 *           <strong>{name}</strong>
 *         </div>
 *         {hasChoices ? (
 *           <ul>
 *             {choices.map(choice => (
 *               <li
 *                 key={choice.choiceId}
 *                 style={{
 *                   fontWeight:
 *                     selectedValue === choice.name ? "bold" : "normal",
 *                 }}
 *               >
 *                 {choice.name}
 *                 {selectedValue === choice.name && " (selected)"}
 *               </li>
 *             ))}
 *           </ul>
 *         ) : (
 *           <div>No choices available.</div>
 *         )}
 *       </div>
 *     )}
 *   </Option>
 *  );
 * }
 * 
 * @component
 */
export const Option = (props: OptionProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const { option } = props;

  const name = option.name || "";
  const choices = option.choicesSettings?.choices || [];
  const selectedValue = selectedChoices[name] || null;

  return props.children({
    name,
    type: option.optionRenderType,
    choices,
    selectedValue,
    hasChoices: choices.length > 0,
  });
};

/**
 * Props for the Choice headless component.
 */
export interface ChoiceProps {
  /** Data for the product option that the choice belongs to. */
  option: ConnectedOption;
  /** Choice data. */
  choice: ConnectedOptionChoice;
  /** Function that receives choice data. Use this function to render and select option choices in your custom product UI components. */
  children: (props: ChoiceRenderProps) => React.ReactNode;
}

/**
 * Render props for the Choice component.
 */
export interface ChoiceRenderProps {
  /** Choice value to display. */
  value: string;
  /** Choice description. */
  description: string | undefined;
  /** Whether the choice is currently selected. */
  isSelected: boolean;
  /** Whether the choice is visible. */
  isVisible: boolean;
  /** Whether the choice is in stock. */
  isInStock: boolean;
  /** Whether the choice is available for pre-order. */
  isPreOrderEnabled: boolean;
  /** Function to select the choice. */
  onSelect: () => void;
  /** Name of the product option the choice belongs to. */
  optionName: string;
  /** Choice value. */
  choiceValue: string;
}

/**
 * <blockquote class="caution">
 * 
 * **Developer Preview**
 * 
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 * 
 * </blockquote>
 * 
 * Headless component to display and manage choice selection for product options.
 * 
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { Choice } from "@wix/stores/components";
 * 
 * function ChoiceDisplay() {
 *  return (
 *    <Choice option={option} choice={choice}>
 *      {({ value, description, isSelected, isVisible, isInStock, isPreOrderEnabled, onSelect }) =>
 *        isVisible && (
 *          <button
 *            onClick={onSelect}
 *            disabled={!isInStock && !isPreOrderEnabled}
 *            style={{
 *              background: isSelected ? '#E7F0FF' : '#FFF',
 *              color: isInStock ? '#222' : '#AAA',
 *              border: isSelected ? '2px solid #A8CAFF' : '1px solid #CCC',
 *              marginRight: 8,
 *              padding: 8,
 *              cursor: isInStock || isPreOrderEnabled ? 'pointer' : 'not-allowed'
 *            }}
 *            title={description}
 *          >
 *            {value}
 *            {isSelected && " Available"}
 *            {!isInStock && isPreOrderEnabled && " (Pre-order)"}
 *            {!isInStock && !isPreOrderEnabled && " (Out of stock)"}
 *          </button>
 *        )
 *      }
 *    </Choice>
 *  );
 * }
 *
 * @component
 */
export const Choice = (props: ChoiceProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const { option, choice } = props;

  const optionName = option.name || "";
  const choiceValue = choice.name || "";

  const isSelected = selectedChoices[optionName] === choiceValue;

  // Check if this choice is available based on current selections
  const isVisible = variantService.isChoiceAvailable(optionName, choiceValue);

  // Check if this choice results in an in-stock variant
  const isInStock = variantService.isChoiceInStock(optionName, choiceValue);

  // Check if this choice is available for pre-order
  const isPreOrderEnabled = variantService.isChoicePreOrderEnabled(
    optionName,
    choiceValue
  );

  const value = choiceValue;

  const onSelect = () => {
    const newChoices = {
      ...selectedChoices,
      [optionName]: choiceValue,
    };
    variantService.setSelectedChoices(newChoices);
  };

  return props.children({
    value,
    description: undefined, // v3 choices don't have separate description field
    isSelected,
    isVisible,
    isInStock,
    isPreOrderEnabled,
    onSelect,
    optionName,
    choiceValue,
  });
};

/**
 * Props for the Stock headless component.
 */
export interface StockProps {
  /** Function that receives stock and inventory data for a product.
   * Use this function to render a product inventory status in your custom product UI components. */
  children: (props: StockRenderProps) => React.ReactNode;
}

/**
 * Render props for the Stock component.
 */
export interface StockRenderProps {
  /** Whether the product is in stock. */
  inStock: boolean;
  /** Whether pre-order is enabled for the product. */
  isPreOrderEnabled: boolean;
  /** The product's raw inventory availability status. */
  availabilityStatus: InventoryAvailabilityStatus | string;
  /** Whether inventory tracking is enabled for the product. */
  trackInventory: boolean;
  /** Current variant ID. */
  currentVariantId: string | null;
  /** Available quantity. */
  availableQuantity: number | null;
  /** Currently selected quantity. */
  selectedQuantity: number;
  /** Function to increment quantity. */
  incrementQuantity: () => void;
  /** Function to decrement quantity. */
  decrementQuantity: () => void;
}

/**
 * <blockquote class="caution">
 * 
 * **Developer Preview**
 * 
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 * 
 * </blockquote>
 * 
 * Headless component to display product stock status.
 *
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { Stock } from "@wix/stores/components";
 * 
 * function StockStatus() {
 *  return (
 *    <Stock>
 *      {({
 *        inStock,
 *        isPreOrderEnabled,
 *        availableQuantity,
 *        selectedQuantity,
 *        incrementQuantity,
 *        decrementQuantity
 *      }) => (
 *        <div className="product-stock">
 *          {inStock ? (
 *            <div>
 *              <span>In stock</span>
 *              <div>
 *                <button onClick={decrementQuantity} disabled={selectedQuantity <= 1}>-</button>
 *                <span style={{ margin: '0 8px' }}>{selectedQuantity}</span>
 *                <button onClick={incrementQuantity} disabled={availableQuantity !== null && selectedQuantity >= availableQuantity}>
 *                   +
 *                </button>
 *                {availableQuantity !== null && (
 *                  <span style={{ marginLeft: 8 }}>(Only {availableQuantity} left!)</span>
 *                )}
 *              </div>
 *            </div>
 *          ) : isPreOrderEnabled ? (
 *            <div>Available for pre-order</div>
 *          ) : (
 *            <div>Out of stock</div>
 *          )}
 *        </div>
 *      )}
 *    </Stock>
 *  );
 * }
 * 
 * @component
 */
export const Stock = (props: StockProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const inStock = variantService.isInStock.get();
  const isPreOrderEnabled = variantService.isPreOrderEnabled.get();
  const trackInventory = variantService.trackQuantity.get();
  const currentVariantId = variantService.selectedVariantId.get();
  const availableQuantity = variantService.quantityAvailable.get();
  const selectedQuantity = variantService.selectedQuantity.get();

  // Return raw availability status - UI components will handle display conversion
  const availabilityStatus = inStock
    ? InventoryAvailabilityStatus.IN_STOCK
    : InventoryAvailabilityStatus.OUT_OF_STOCK;

  const incrementQuantity = () => {
    variantService.incrementQuantity();
  };

  const decrementQuantity = () => {
    variantService.decrementQuantity();
  };

  return props.children({
    inStock,
    availableQuantity,
    isPreOrderEnabled,
    currentVariantId,
    availabilityStatus,
    trackInventory,
    selectedQuantity,
    incrementQuantity,
    decrementQuantity,
  });
};

/**
 * Props for the Reset headless component.
 */
export interface ResetProps {
  /** Function that receives variant reset data.
   * Use this function to render the reset button and reset variant selections in your custom product UI components. */
  children: (props: ResetRenderProps) => React.ReactNode;
}

/**
 * Render props for the Reset component.
 */
export interface ResetRenderProps {
  /** Function to reset all selections. */
  onReset: () => void;
  /** Whether the reset button should be rendered. */
  hasSelections: boolean;
}

/**
 * <blockquote class="caution">
 * 
 * **Developer Preview**
 * 
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 * 
 * </blockquote>
 * 
 * Headless component that allows variant selections to be reset.
 *
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { Reset } from "@wix/stores/components";
 * 
 * function ProductSelectionReset() {
 *  return (
 *    <Reset>
 *      {({ onReset, hasSelections }) =>
 *        hasSelections ? (
 *        <button
 *         type="button"
 *         onClick={onReset}
 *         style={{
 *           margin: '12px 0',
 *           background: '#E7F0FF',
 *           border: '1px solid #A8CAFF',
 *           color: '#1a1a1a',
 *           borderRadius: 4,
 *           padding: '8px 16px',
 *           cursor: 'pointer'
 *         }}
 *        >
 *         Reset selections
 *        </button>
 *      ) : null
 *     }
 *    </Reset>
 *  );
 * }
 * 
 * @component
 */
export const Reset = (props: ResetProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const hasSelections = Object.keys(selectedChoices).length > 0;

  const onReset = () => {
    variantService.resetSelections();
  };

  return props.children({
    onReset,
    hasSelections,
  });
};
