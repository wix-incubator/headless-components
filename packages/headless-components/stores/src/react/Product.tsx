import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { ProductServiceDefinition } from "../services/product-service.js";
import type { V3Product } from "@wix/auto_sdk_stores_products-v-3";

/**
 * Props for the ProductName headless component.
 */
export interface ProductNameProps {
  /** Function that receives product name data. Use this function to render the product name in custom UI components. */
  children: (props: ProductNameRenderProps) => React.ReactNode;
}

/**
 * Render props for the ProductName component.
 */
export interface ProductNameRenderProps {
  /** Product name. */
  name: string;
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
 * Headless component for displaying the product name.
 *
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { Name } from "@wix/stores/components";
 * 
 * <Name>
 * {({ name }) => (
 *  <h2 style={{ color: "#1a1a1a" }}>
 *    Product Name: {name}
 *  </h2>
 * )}
 * </Name>
 * 
 * @component
 */
export const Name = (props: ProductNameProps) => {
  const service = useService(ProductServiceDefinition) as ServiceAPI<
    typeof ProductServiceDefinition
  >;

  const product = service.product.get();
  const name = product.name!;

  return props.children({
    name,
  });
};

/**
 * Props for the ProductDescription headless component.
 */
export interface ProductDescriptionProps {
  /** Function that receives product description data. Use this function to render the product description in custom UI components. */
  children: (props: ProductDescriptionRenderProps) => React.ReactNode;
}

/**
 * Render props for the ProductDescription component.
 */
export interface ProductDescriptionRenderProps {
  /** Product description. The text may contain HTML. */
  description: NonNullable<V3Product["description"]>;
  /** Product description without HTML. */
  plainDescription: NonNullable<V3Product["plainDescription"]>;
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
 * Headless component for displaying the product description.
 *
 * > **Notes:** 
 * - This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and 
 * [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * - Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control 
 * over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 * 
 * @example
 * import { Description } from "@wix/stores/components";
 * 
 * <Description>
 * {({ plainDescription }) => (
 *  <div className="product-description">
 *    <strong>Summary:</strong> {plainDescription}
 *  </div>
 * )}
 * </Description>
 * 
 * @component
 */
export const Description = (props: ProductDescriptionProps) => {
  const service = useService(ProductServiceDefinition) as ServiceAPI<
    typeof ProductServiceDefinition
  >;

  const product = service.product.get();

  const descriptionRichContent = product.description!;
  const plainDescription = product.plainDescription!;

  return props.children({
    description: descriptionRichContent,
    plainDescription: plainDescription,
  });
};
