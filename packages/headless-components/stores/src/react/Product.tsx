import type { ServiceAPI } from "@wix/services-definitions";
import { useService, WixServices } from "@wix/services-manager-react";
import {
  ProductServiceDefinition,
  ProductServiceConfig,
  ProductService,
} from "../services/product-service.js";
import { createServicesMap } from "@wix/services-manager";
import type {
  V3Product,
  ProductMedia,
} from "@wix/auto_sdk_stores_products-v-3";
import type { PropsWithChildren } from "react";

/**
 * Root component that provides the Product service context to its children.
 * This component sets up the necessary services for rendering and managing a single product's data.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Product } from '@wix/stores/components';
 *
 * function ProductPage() {
 *   return (
 *     <Product.Root productServiceConfig={{ product: myProduct }}>
 *       <div>
 *         <Product.Name>
 *           {({ name }) => (
 *             <h1
 *               className="text-4xl font-bold text-content-primary mb-4"
 *               data-testid="product-name"
 *             >
 *               {name}
 *             </h1>
 *           )}
 *         </Product.Name>
 *       </div>
 *     </Product.Root>
 *   );
 * }
 * ```
 */
export function Root(
  props: PropsWithChildren<{
    productServiceConfig: ProductServiceConfig;
  }>,
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductServiceDefinition,
        ProductService,
        props.productServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

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
 * @example
 * ```tsx
 * import { Product } from '@wix/stores/components';
 *
 * function ProductHeader() {
 *   return (
 *     <Product.Name>
 *       {({ name }) => (
 *         <h1>{name}</h1>
 *       )}
 *     </Product.Name>
 *   );
 * }
 * ```
 */
export function Name(props: ProductNameProps) {
  const service = useService(ProductServiceDefinition) as ServiceAPI<
    typeof ProductServiceDefinition
  >;

  const product = service.product.get();
  const name = product.name!;

  return props.children({
    name,
  });
}

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
 * @component
 * @example
 * ```tsx
 * import { Product } from '@wix/stores/components';
 *
 * function ProductDescription() {
 *   return (
 *     <Product.Description>
 *       {({ plainDescription, description }) => (
 *         <div>
 *           {plainDescription && (
 *             <div
 *               dangerouslySetInnerHTML={{
 *                 __html: plainDescription,
 *               }}
 *             />
 *           )}
 *           {description && (
 *             <div>Rich content description available</div>
 *           )}
 *         </div>
 *       )}
 *     </Product.Description>
 *   );
 * }
 * ```
 */
export function Description(props: ProductDescriptionProps) {
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
}

export interface ProductMediaProps {
  children: (props: ProductMediaRenderProps) => React.ReactNode;
}

export interface ProductMediaRenderProps {
  media: ProductMedia[];
}

export function Media(props: ProductMediaProps) {
  const service = useService(ProductServiceDefinition) as ServiceAPI<
    typeof ProductServiceDefinition
  >;

  const product = service.product.get();
  const media = product.media?.itemsInfo?.items ?? [];

  return props.children({
    media,
  });
}
