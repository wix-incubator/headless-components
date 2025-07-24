import type { ServiceAPI } from "@wix/services-definitions";
import { useService, WixServices } from "@wix/services-manager-react";
import {
  SelectedVariantServiceDefinition,
  SelectedVariantService,
  SelectedVariantServiceConfig,
} from "../services/selected-variant-service.js";
import { createServicesMap } from "@wix/services-manager";
import type { PropsWithChildren } from "react";

/**
 * Root component that provides the SelectedVariant service context to its children.
 * This component sets up the necessary services for rendering and managing selected variant data.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { SelectedVariant } from '@wix/stores/components';
 *
 * function ProductVariantDisplay() {
 *   return (
 *     <SelectedVariant.Root selectedVariantServiceConfig={{ fetchInventoryData: true }}>
 *       <div>
 *         <SelectedVariant.Price>
 *           {({ price, compareAtPrice, currency }) => (
 *             <div className="price-display">
 *               <span className="current-price">{price}</span>
 *               {compareAtPrice && (
 *                 <span className="compare-price">
 *                   <s>{compareAtPrice}</s>
 *                 </span>
 *               )}
 *               <span className="currency">{currency}</span>
 *             </div>
 *           )}
 *         </SelectedVariant.Price>
 *       </div>
 *     </SelectedVariant.Root>
 *   );
 * }
 * ```
 */
export function Root(
  props: PropsWithChildren<{
    selectedVariantServiceConfig: SelectedVariantServiceConfig;
  }>,
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        SelectedVariantServiceDefinition,
        SelectedVariantService,
        props.selectedVariantServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for ProductDetails headless component
 */
export interface ProductDetailsProps {
  /** Render prop function that receives product details data */
  children: (props: ProductDetailsRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductDetails component
 */
export interface ProductDetailsRenderProps {
  /** Product SKU */
  sku: string | null;
  /** Product weight */
  weight: string | null;
}

/**
 * Headless component for selected variant details display
 *
 * @component
 * @example
 * ```tsx
 * import { SelectedVariant } from '@wix/stores/components';
 *
 * function VariantDetails() {
 *   return (
 *     <SelectedVariant.Details>
 *       {({ sku, weight }) => (
 *         <div>
 *           {sku && <div>SKU: {sku}</div>}
 *           {weight && <div>Weight: {weight}</div>}
 *         </div>
 *       )}
 *     </SelectedVariant.Details>
 *   );
 * }
 * ```
 */
export const Details = (props: ProductDetailsProps) => {
  const selectedVariantService = useService(
    SelectedVariantServiceDefinition,
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedVariant = selectedVariantService.currentVariant?.get();

  let sku: string | null = selectedVariant?.sku || null;
  let weight: string | null =
    selectedVariant?.physicalProperties?.weight?.toString() || null;

  return props.children({
    sku,
    weight,
  });
};

/**
 * Props for Price headless component
 */
export interface PriceProps {
  /** Render prop function that receives price data */
  children: (props: PriceRenderProps) => React.ReactNode;
}

/**
 * Render props for Price component
 */
export interface PriceRenderProps {
  /** Current price (formatted) */
  price: string;
  /** Compare at price (formatted) - null if no compare price */
  compareAtPrice: string | null;
  /** Currency code */
  currency: string;
}

/**
 * Headless component for product price display
 *
 * @component
 * @example
 * ```tsx
 * import { SelectedVariant } from '@wix/stores/components';
 *
 * function ProductPrice() {
 *   return (
 *     <SelectedVariant.Price>
 *       {({ price, compareAtPrice, currency }) => (
 *         <div className="price-display">
 *           <span className="current-price">{price}</span>
 *           {compareAtPrice && (
 *             <span className="compare-price">
 *               <s>{compareAtPrice}</s>
 *             </span>
 *           )}
 *           <span className="currency">{currency}</span>
 *         </div>
 *       )}
 *     </SelectedVariant.Price>
 *   );
 * }
 * ```
 */
export const Price = (props: PriceProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition,
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const price = variantService.currentPrice.get();
  const compareAtPrice = variantService.currentCompareAtPrice.get();
  const currency = variantService.currency.get();

  return props.children({
    price,
    compareAtPrice,
    currency,
  });
};

/**
 * Props for SKU headless component
 */
export interface SKUProps {
  /** Render prop function that receives SKU data */
  children: (props: SKURenderProps) => React.ReactNode;
}

/**
 * Render props for SKU component
 */
export interface SKURenderProps {
  /** Product SKU */
  sku: string | null;
}

/**
 * Headless component for product SKU display
 *
 * @component
 * @example
 * ```tsx
 * import { SelectedVariant } from '@wix/stores/components';
 *
 * function ProductSKU() {
 *   return (
 *     <SelectedVariant.SKU>
 *       {({ sku }) => (
 *         <div>
 *           {sku && (
 *             <div className="product-sku">
 *               <strong>SKU:</strong> {sku}
 *             </div>
 *           )}
 *         </div>
 *       )}
 *     </SelectedVariant.SKU>
 *   );
 * }
 * ```
 */
export const SKU = (props: SKUProps) => {
  const selectedVariantService = useService(
    SelectedVariantServiceDefinition,
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedVariant = selectedVariantService.currentVariant?.get();
  const sku: string | null = selectedVariant?.sku || null;

  return props.children({
    sku,
  });
};
