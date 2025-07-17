import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { ProductServiceDefinition } from "../services/product-service.js";
import type { V3Product } from "@wix/auto_sdk_stores_products-v-3";

/**
 * Props for ProductName headless component
 */
export interface ProductNameProps {
  /** Render prop function that receives product name data */
  children: (props: ProductNameRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductName component
 */
export interface ProductNameRenderProps {
  /** Product name */
  name: string;
}

/**
 * Headless component for product name display
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
 * Props for ProductDescription headless component
 */
export interface ProductDescriptionProps {
  /** Render prop function that receives product description data */
  children: (props: ProductDescriptionRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductDescription component
 */
export interface ProductDescriptionRenderProps {
  /** Product description using the RICOS (Rich Content Object) format. See https://dev.wix.com/docs/ricos/api-reference/ricos-document */
  description: NonNullable<V3Product["description"]>;
  /** Product description with plain html */
  plainDescription: NonNullable<V3Product["plainDescription"]>;
}

/**
 * Render props for ProductDescription component
 */
export interface ProductDescriptionRenderProps {
  /** Product description using the RICOS (Rich Content Object) format. See https://dev.wix.com/docs/ricos/api-reference/ricos-document */
  description: NonNullable<V3Product["description"]>;
  /** Product description with plain html */
  plainDescription: NonNullable<V3Product["plainDescription"]>;
}
/**
* Headless component for product description display
*
* @example
* <Product.Description>
*   {({ plainDescription }) => (
*     <>
*       {plainDescription && (
*         <p
*           dangerouslySetInnerHTML={{
*             __html: plainDescription,
*           }}
*         />
*       )}
*     </>
*   )}
* </Product.Description>
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
