import { useState } from 'react';
import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  ProductModifiersServiceDefinition,
  ProductModifiersService,
} from '../../services/product-modifiers-service.js';
import {
  ModifierRenderType,
  type ConnectedModifier,
  type ConnectedModifierChoice,
} from '@wix/auto_sdk_stores_products-v-3';
import { createServicesMap } from '@wix/services-manager';

export interface RootProps {
  children: React.ReactNode;
}

/**
 * Root component that provides the ProductModifiers service context to its children.
 * This component sets up the necessary services for managing product modifier functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProductModifiers } from '@wix/stores/components';
 *
 * function ProductCustomization() {
 *   return (
 *     <ProductModifiers.Root>
 *       <div>
 *         <ProductModifiers.Modifiers>
 *           {({ modifiers, hasModifiers, selectedModifiers, areAllRequiredModifiersFilled }) => (
 *             <div>
 *               {hasModifiers && (
 *                 <div>
 *                   <h3>Customize your product</h3>
 *                   {modifiers.map(modifier => (
 *                     <ProductModifiers.Modifier key={modifier.id} modifier={modifier}>
 *                       {({ name, mandatory, hasChoices, choices, isFreeText }) => (
 *                         <div className="modifier-field">
 *                           <label>
 *                             {name} {mandatory && <span className="required">*</span>}
 *                           </label>
 *                           {hasChoices && (
 *                             <div className="choices">
 *                               {choices.map(choice => (
 *                                 <ProductModifiers.Choice key={choice.id} modifier={modifier} choice={choice}>
 *                                   {({ value, isSelected, select }) => (
 *                                     <button
 *                                       onClick={select}
 *                                       className={isSelected ? 'selected' : ''}
 *                                     >
 *                                       {value}
 *                                     </button>
 *                                   )}
 *                                 </ProductModifiers.Choice>
 *                               ))}
 *                             </div>
 *                           )}
 *                           {isFreeText && (
 *                             <ProductModifiers.FreeText modifier={modifier}>
 *                               {({ value, onChange, placeholder, maxChars }) => (
 *                                 <input
 *                                   type="text"
 *                                   value={value}
 *                                   onChange={(e) => onChange(e.target.value)}
 *                                   placeholder={placeholder}
 *                                   maxLength={maxChars}
 *                                 />
 *                               )}
 *                             </ProductModifiers.FreeText>
 *                           )}
 *                         </div>
 *                       )}
 *                     </ProductModifiers.Modifier>
 *                   ))}
 *                   {!areAllRequiredModifiersFilled && (
 *                     <div className="warning">Please fill all required options</div>
 *                   )}
 *                 </div>
 *               )}
 *             </div>
 *           )}
 *         </ProductModifiers.Modifiers>
 *       </div>
 *     </ProductModifiers.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductModifiersServiceDefinition,
        ProductModifiersService,
        {},
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Custom hook to safely get the modifiers service
 */
function useModifiersService() {
  try {
    return useService(ProductModifiersServiceDefinition) as ServiceAPI<
      typeof ProductModifiersServiceDefinition
    >;
  } catch {
    return null;
  }
}

/**
 * Props for Modifiers headless component
 */
export interface ModifiersProps {
  /** Render prop function that receives modifiers data */
  children: (props: ModifiersRenderProps) => React.ReactNode;
}

/**
 * Render props for Modifiers component
 */
export interface ModifiersRenderProps {
  /** Array of product modifiers */
  modifiers: ConnectedModifier[];
  /** Whether product has modifiers */
  hasModifiers: boolean;
  /** Currently selected modifier values */
  selectedModifiers: Record<string, any>;
  /** Whether all required modifiers are filled */
  areAllRequiredModifiersFilled: boolean;
}

/**
 * Headless component for all product modifiers
 *
 * @component
 * @example
 * ```tsx
 * import { ProductModifiers } from '@wix/stores/components';
 *
 * function ModifiersSelector() {
 *   return (
 *     <ProductModifiers.Modifiers>
 *       {({ modifiers, hasModifiers, selectedModifiers, areAllRequiredModifiersFilled }) => (
 *         <div>
 *           {hasModifiers && (
 *             <div>
 *               <h3>Customize your product</h3>
 *               {modifiers.map(modifier => (
 *                 <div key={modifier.id}>
 *                   <label>{modifier.name}</label>
 *                   {modifier.required && <span>*</span>}
 *                   {modifier.choices?.map(choice => (
 *                     <label key={choice.id}>
 *                       <input
 *                         type={modifier.multiple ? 'checkbox' : 'radio'}
 *                         name={modifier.id}
 *                         value={choice.id}
 *                         checked={selectedModifiers[modifier.id] === choice.id}
 *                       />
 *                       {choice.description} (+{choice.priceChange?.price})
 *                     </label>
 *                   ))}
 *                 </div>
 *               ))}
 *               {!areAllRequiredModifiersFilled && (
 *                 <div className="warning">Please fill all required options</div>
 *               )}
 *             </div>
 *           )}
 *         </div>
 *       )}
 *     </ProductModifiers.Modifiers>
 *   );
 * }
 * ```
 */
export function Modifiers(props: ModifiersProps) {
  const modifiersService = useModifiersService();

  if (!modifiersService) {
    return props.children({
      modifiers: [],
      hasModifiers: false,
      selectedModifiers: {},
      areAllRequiredModifiersFilled: true,
    });
  }

  const modifiers = modifiersService.modifiers.get();
  const hasModifiers = modifiersService.hasModifiers.get();
  const selectedModifiers = modifiersService.selectedModifiers.get();
  const areAllRequiredModifiersFilled =
    modifiersService.areAllRequiredModifiersFilled();

  return props.children({
    modifiers,
    hasModifiers,
    selectedModifiers,
    areAllRequiredModifiersFilled,
  });
}

/**
 * Props for Modifier headless component
 */
export interface ModifierProps {
  /** Product modifier data */
  modifier: ConnectedModifier;
  /** Render prop function that receives modifier data */
  children: (props: ModifierRenderProps) => React.ReactNode;
}

/**
 * Render props for Modifier component
 */
export interface ModifierRenderProps {
  /** Modifier name */
  name: string;
  /** Modifier type */
  type: any;
  /** Whether this modifier is mandatory */
  mandatory: boolean;
  /** Array of choices for this modifier (for choice-based modifiers) */
  choices: ConnectedModifierChoice[];
  /** Currently selected value for this modifier */
  selectedValue: any;
  /** Whether this modifier has choices */
  hasChoices: boolean;
  /** Whether this modifier is a free text type */
  isFreeText: boolean;
  /** Maximum characters for free text */
  maxChars?: number;
  /** Placeholder text for free text */
  placeholder?: string;
}

/**
 * Headless component for a specific product modifier
 *
 * @component
 * @example
 * ```tsx
 * import { ProductModifiers } from '@wix/stores/components';
 *
 * function ModifierField({ modifier }) {
 *   return (
 *     <ProductModifiers.Modifier modifier={modifier}>
 *       {({ name, mandatory, hasChoices, choices, selectedValue, isFreeText, placeholder, maxChars }) => (
 *         <div className="modifier-field">
 *           <label>
 *             {name} {mandatory && <span className="required">*</span>}
 *           </label>
 *           {hasChoices && (
 *             <div className="choices">
 *               {choices.map(choice => (
 *                 <label key={choice.id}>
 *                   <input
 *                     type="radio"
 *                     name={name}
 *                     value={choice.name}
 *                     checked={selectedValue?.choiceValue === choice.name}
 *                   />
 *                   {choice.description} (+{choice.priceChange?.price || '0'})
 *                 </label>
 *               ))}
 *             </div>
 *           )}
 *           {isFreeText && (
 *             <input
 *               type="text"
 *               placeholder={placeholder}
 *               maxLength={maxChars}
 *               value={selectedValue?.freeTextValue || ''}
 *             />
 *           )}
 *         </div>
 *       )}
 *     </ProductModifiers.Modifier>
 *   );
 * }
 * ```
 */
export function Modifier(props: ModifierProps) {
  const modifiersService = useModifiersService();
  const { modifier } = props;

  const name = modifier.name || '';
  const type = modifier.modifierRenderType;
  const mandatory = modifier.mandatory || false;
  const choices = modifier.choicesSettings?.choices || [];
  const hasChoices = choices.length > 0;
  const isFreeText = type === ModifierRenderType.FREE_TEXT;
  const freeTextSettings = modifier.freeTextSettings;
  const maxChars = (freeTextSettings as any)?.maxLength;
  const placeholder = (freeTextSettings as any)?.placeholder;

  const selectedValue = modifiersService?.selectedModifiers.get()[name] || null;

  return props.children({
    name,
    type,
    mandatory,
    choices,
    selectedValue,
    hasChoices,
    isFreeText,
    maxChars,
    placeholder,
  });
}

/**
 * Props for ModifierChoice headless component
 */
export interface ChoiceProps {
  /** Product modifier data */
  modifier: ConnectedModifier;
  /** Choice data */
  choice: ConnectedModifierChoice;
  /** Render prop function that receives choice data */
  children: (props: ChoiceRenderProps) => React.ReactNode;
}

/**
 * Render props for ModifierChoice component
 */
export interface ChoiceRenderProps {
  /** Choice value to display */
  value: string;
  /** Choice description (for color options) */
  description: string | undefined;
  /** Whether this choice is currently selected */
  isSelected: boolean;
  /** Function to select this choice */
  select: () => void;
  /** Modifier name */
  modifierName: string;
  /** Choice value */
  choiceValue: string;
  /** Color code for swatch choices */
  colorCode?: string;
}

/**
 * Headless component for individual modifier choice selection
 *
 * @component
 * @example
 * ```tsx
 * import { ProductModifiers } from '@wix/stores/components';
 *
 * function ModifierChoiceButton({ modifier, choice }) {
 *   return (
 *     <ProductModifiers.Choice modifier={modifier} choice={choice}>
 *       {({ value, description, isSelected, select, colorCode }) => (
 *         <button
 *           onClick={select}
 *           className={`choice-button ${isSelected ? 'selected' : ''}`}
 *           style={colorCode ? { backgroundColor: colorCode } : {}}
 *         >
 *           {colorCode ? (
 *             <div className="color-swatch" title={value} />
 *           ) : (
 *             <span>{value}</span>
 *           )}
 *           {description && <span className="description">{description}</span>}
 *         </button>
 *       )}
 *     </ProductModifiers.Choice>
 *   );
 * }
 * ```
 */
export function Choice(props: ChoiceProps) {
  const modifiersService = useModifiersService();
  const { modifier, choice } = props;

  const modifierName = modifier.name || '';
  const renderType = modifier.modifierRenderType;

  // For TEXT_CHOICES, use choice.key; for SWATCH_CHOICES, use choice.name
  const choiceValue =
    renderType === ModifierRenderType.TEXT_CHOICES
      ? (choice as any).key || choice.name || ''
      : choice.name || '';

  const value = choice.name || ''; // Display name is always choice.name
  const description = (choice as any).description;
  const colorCode = (choice as any).colorCode;

  const selectedValue = modifiersService?.getModifierValue(modifierName);
  const isSelected = selectedValue?.choiceValue === choiceValue;

  const select = () => {
    modifiersService?.setModifierChoice(modifierName, choiceValue);
  };

  return props.children({
    value,
    description,
    isSelected,
    select,
    modifierName,
    choiceValue,
    colorCode,
  });
}

/**
 * Props for ModifierFreeText headless component
 */
export interface FreeTextProps {
  /** Product modifier data */
  modifier: ConnectedModifier;
  /** Render prop function that receives free text data */
  children: (props: FreeTextRenderProps) => React.ReactNode;
}

/**
 * Render props for ModifierFreeText component
 */
export interface FreeTextRenderProps {
  /** Current text value */
  value: string;
  /** Function to update text value */
  setText: (value: string) => void;
  /** Whether this modifier is mandatory */
  mandatory: boolean;
  /** Maximum characters allowed */
  maxChars?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Character count */
  charCount: number;
  /** Whether character limit is exceeded */
  isOverLimit: boolean;
  /** Modifier name */
  modifierName: string;
}

/**
 * Headless component for free text modifier input
 *
 * @component
 * @example
 * ```tsx
 * import { ProductModifiers } from '@wix/stores/components';
 *
 * function FreeTextModifier({ modifier }) {
 *   return (
 *     <ProductModifiers.FreeText modifier={modifier}>
 *       {({ value, setText, mandatory, maxChars, placeholder, charCount, isOverLimit, modifierName }) => (
 *         <div className="free-text-modifier">
 *           <label>
 *             {modifierName} {mandatory && <span className="required">*</span>}
 *           </label>
 *           <textarea
 *             value={value}
 *             setText={(e) => setText(e.target.value)}
 *             placeholder={placeholder}
 *             maxLength={maxChars}
 *             className={isOverLimit ? 'over-limit' : ''}
 *           />
 *           {maxChars && (
 *             <div className={`char-count ${isOverLimit ? 'over-limit' : ''}`}>
 *               {charCount}/{maxChars}
 *             </div>
 *           )}
 *         </div>
 *       )}
 *     </ProductModifiers.FreeText>
 *   );
 * }
 * ```
 */
export function FreeText(props: FreeTextProps) {
  const modifiersService = useModifiersService();
  const { modifier } = props;

  const modifierName = modifier.name || '';
  const mandatory = modifier.mandatory || false;
  const freeTextSettings = modifier.freeTextSettings;
  const maxChars = (freeTextSettings as any)?.maxLength;
  const placeholder = (freeTextSettings as any)?.placeholder;

  const selectedValue = modifiersService?.getModifierValue(modifierName);
  const value = selectedValue?.freeTextValue || '';
  const charCount = value.length;
  const isOverLimit = maxChars ? charCount > maxChars : false;

  const setText = (newValue: string) => {
    if (maxChars && newValue.length > maxChars) return;
    modifiersService?.setModifierFreeText(modifierName, newValue);
  };

  return props.children({
    value,
    setText,
    mandatory,
    maxChars,
    placeholder,
    charCount,
    isOverLimit,
    modifierName,
  });
}

/**
 * Props for ModifierToggleFreeText headless component
 */
export interface ToggleFreeTextProps {
  /** Product modifier data */
  modifier: ConnectedModifier;
  /** Render prop function that receives toggle data */
  children: (props: ToggleFreeTextRenderProps) => React.ReactNode;
}

/**
 * Render props for ModifierToggleFreeText component
 */
export interface ToggleFreeTextRenderProps {
  /** Whether the text input is shown */
  isTextInputShown: boolean;
  /** Function to toggle text input visibility */
  toggle: () => void;
  /** Whether this modifier is mandatory */
  mandatory: boolean;
  /** Modifier name */
  modifierName: string;
}

/**
 * Headless component for toggling free text modifier input
 * Used for optional free text modifiers where a checkbox shows/hides the input
 *
 * @component
 * @example
 * ```tsx
 * import { ProductModifiers } from '@wix/stores/components';
 *
 * function ToggleFreeTextModifier({ modifier }) {
 *   return (
 *     <ProductModifiers.ToggleFreeText modifier={modifier}>
 *       {({ isTextInputShown, toggle, mandatory, modifierName }) => (
 *         <div className="toggle-free-text">
 *           {!mandatory && (
 *             <label>
 *               <input
 *                 type="checkbox"
 *                 checked={isTextInputShown}
 *                 onChange={toggle}
 *               />
 *               Add {modifierName}
 *             </label>
 *           )}
 *           {isTextInputShown && (
 *             <ProductModifiers.FreeText modifier={modifier}>
 *               {(props) => (
 *                 <textarea
 *                   value={props.value}
 *                   onChange={(e) => props.onChange(e.target.value)}
 *                   placeholder={props.placeholder}
 *                 />
 *               )}
 *             </ProductModifiers.FreeText>
 *           )}
 *         </div>
 *       )}
 *     </ProductModifiers.ToggleFreeText>
 *   );
 * }
 * ```
 */
export function ToggleFreeText(props: ToggleFreeTextProps) {
  const modifiersService = useModifiersService();
  const { modifier } = props;

  const modifierName = modifier.name || '';
  const mandatory = modifier.mandatory || false;
  const [isTextInputShown, setIsTextInputShown] = useState(mandatory);

  const toggle = () => {
    const newState = !isTextInputShown;
    setIsTextInputShown(newState);

    if (!newState) {
      modifiersService?.clearModifier(modifierName);
    }
  };

  return props.children({
    isTextInputShown,
    toggle,
    mandatory,
    modifierName,
  });
}
