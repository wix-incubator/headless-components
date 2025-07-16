import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { SelectedVariantServiceDefinition } from "../services/selected-variant-service.js";

/**
 * Props for the ProductDetails headless component.
 */
export interface ProductDetailsProps {
  /** Function that receives the product details data. Use this function to render product details in a custom UI component. */
  children: (props: ProductDetailsRenderProps) => React.ReactNode;
}

/**
 * Render props for the ProductDetails component.
 */
export interface ProductDetailsRenderProps {
  /** Product SKU. */
  sku: string | null;
  /** Product weight */
  weight: string | null;
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
 * Headless component to display the details of the selected variant.
 * 
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { Details } from "@wix/stores/components";
 * 
 * function ProductDetailsDisplay() {
 *   return (
 *     <Details>
 *       {({ sku, weight }) => (
 *        <div className="product-details">
 *         <div><strong>SKU:</strong> {sku || 'N/A'}</div>
 *         <div><strong>Weight:</strong> {weight ? `${weight} kg` : 'N/A'}</div>
 *        </div>
 *       )}
 *     </Details>
 *   );
 *  }
 *
 * @component
 */
export const Details = (props: ProductDetailsProps) => {
  const selectedVariantService = useService(
    SelectedVariantServiceDefinition
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
 * Props for the Price headless component.
 */
export interface PriceProps {
  /** Function that receives price data. Use this function to render product pricing in a custom UI component. */
  children: (props: PriceRenderProps) => React.ReactNode;
}

/**
 * Render props for the Price component.
 */
export interface PriceRenderProps {
  /** Current price. */
  price: string;
  /** The original product price, before any discounts are applied. If no discount exists, the value is null. */
  compareAtPrice: string | null;
  /** Currency code. */
  currency: string;
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
 * Headless component to display the product price.
 * 
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { Price } from "@wix/stores/components";
 * 
 * function ProductPriceDisplay() {
 *   return (
 *     <Price>
 *       {({ price, compareAtPrice, currency }) => (
 *         <div className="product-price">
 *           <span style={{
 *             fontSize: "1.1em",
 *             fontWeight: "bold",
 *             color: "#222",
 *             marginRight: compareAtPrice ? 8 : 0
 *           }}>
 *             {currency} {price}
 *           </span>
 *           {compareAtPrice && (
 *             <span style={{
 *               textDecoration: "line-through",
 *               color: "#AAA"
 *             }}>
 *               {currency} {compareAtPrice}
 *             </span>
 *           )}
 *         </div>
 *       )}
 *     </Price>
 *   );
 *  }
 *
 * @component
 */
export const Price = (props: PriceProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
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
 * Props for the SKU headless component.
 */
export interface SKUProps {
  /** Function that receives product SKU data. Use this function to render the SKU in custom UI components. */
  children: (props: SKURenderProps) => React.ReactNode;
}

/**
 * Render props for the SKU component.
 */
export interface SKURenderProps {
  /** Product SKU (stock keeping unit). */
  sku: string | null;
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
 * Headless component to display the product SKU.
 *
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { SKU } from "@wix/stores/components";
 * 
 * function ProductSKUDisplay() {
 *   return (
 *     <SKU>
 *      {({ sku }) => (
 *       <div className="product-sku">
 *         <strong>SKU:</strong> {sku ? sku : 'N/A'}
 *       </div>
 *     )}
 *   </SKU>
 *  );
 * }
 * 
 * @component
 */
export const SKU = (props: SKUProps) => {
  const selectedVariantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedVariant = selectedVariantService.currentVariant?.get();
  const sku: string | null = selectedVariant?.sku || null;

  return props.children({
    sku,
  });
};
