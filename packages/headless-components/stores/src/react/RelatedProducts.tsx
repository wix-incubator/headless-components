import React from "react";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService, WixServices } from "@wix/services-manager-react";
import {
  RelatedProductsServiceDefinition,
  RelatedProductsService,
  RelatedProductsServiceConfig,
} from "../services/related-products-service.js";
import { createServicesMap } from "@wix/services-manager";
import type { PropsWithChildren } from "react";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import {
  InventoryAvailabilityStatus,
  type V3Product,
} from "@wix/auto_sdk_stores_products-v-3";

/**
 * Root component that provides the RelatedProducts service context to its children.
 * This component sets up the necessary services for rendering and managing related products functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { RelatedProducts } from '@wix/stores/components';
 *
 * function RecommendedSection({ currentProductId }) {
 *   return (
 *     <RelatedProducts.Root relatedProductsServiceConfig={{ productId: currentProductId }}>
 *       <div>
 *         <h3>You might also like</h3>
 *         <RelatedProducts.List>
 *           {({ products, isLoading, error, hasProducts, refresh }) => (
 *             <div>
 *               {isLoading && <div>Loading related products...</div>}
 *               {error && <div>Error: {error}</div>}
 *               {hasProducts && (
 *                 <div className="products-grid">
 *                   {products.map(product => (
 *                     <RelatedProducts.Item key={product.id} product={product}>
 *                       {({ title, image, price, available, description, onQuickAdd }) => (
 *                         <div className={`related-product ${!available ? 'unavailable' : ''}`}>
 *                           {image && <img src={image} alt={title} />}
 *                           <h4>{title}</h4>
 *                           <div className="price">{price}</div>
 *                           <button onClick={onQuickAdd} disabled={!available}>
 *                             Quick Add
 *                           </button>
 *                         </div>
 *                       )}
 *                     </RelatedProducts.Item>
 *                   ))}
 *                 </div>
 *               )}
 *             </div>
 *           )}
 *         </RelatedProducts.List>
 *       </div>
 *     </RelatedProducts.Root>
 *   );
 * }
 * ```
 */
export function Root(
  props: PropsWithChildren<{
    relatedProductsServiceConfig: RelatedProductsServiceConfig;
  }>,
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        RelatedProductsServiceDefinition,
        RelatedProductsService,
        props.relatedProductsServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for List headless component
 */
export interface ListProps {
  /** Render prop function that receives list data */
  children: (props: ListRenderProps) => React.ReactNode;
}

/**
 * Render props for List component
 */
export interface ListRenderProps {
  /** Array of related products */
  products: V3Product[];
  /** Whether products are loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether there are products available */
  hasProducts: boolean;
  /** Function to refresh products */
  refresh: () => Promise<void>;
}

/**
 * Headless component for displaying related products list
 *
 * @component
 * @example
 * ```tsx
 * import { RelatedProducts } from '@wix/stores/components';
 *
 * function RecommendedProducts() {
 *   return (
 *     <RelatedProducts.List>
 *       {({ products, isLoading, error, hasProducts, refresh }) => (
 *         <div>
 *           <h3>You might also like</h3>
 *           {isLoading && <div>Loading related products...</div>}
 *           {error && <div>Error: {error}</div>}
 *           {hasProducts && (
 *             <div className="products-grid">
 *               {products.map(product => (
 *                 <div key={product.id}>
 *                   <h4>{product.name}</h4>
 *                   <p>{product.price?.price} {product.price?.currency}</p>
 *                 </div>
 *               ))}
 *             </div>
 *           )}
 *           <button onClick={refresh}>Refresh Recommendations</button>
 *         </div>
 *       )}
 *     </RelatedProducts.List>
 *   );
 * }
 * ```
 */
export const List = (props: ListProps) => {
  const service = useService(RelatedProductsServiceDefinition) as ServiceAPI<
    typeof RelatedProductsServiceDefinition
  >;
  const signalsService = useService(SignalsServiceDefinition);

  const [products, setProducts] = React.useState<V3Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasProducts, setHasProducts] = React.useState(false);

  React.useEffect(() => {
    const effects = [
      signalsService.effect(() => {
        setProducts(service.relatedProducts.get());
      }),
      signalsService.effect(() => {
        setIsLoading(service.isLoading.get());
      }),
      signalsService.effect(() => {
        setError(service.error.get());
      }),
      signalsService.effect(() => {
        setHasProducts(service.hasRelatedProducts.get());
      }),
    ];

    return () => effects.forEach((dispose) => dispose());
  }, [service, signalsService]);

  return props.children({
    products,
    isLoading,
    error,
    hasProducts,
    refresh: service.refreshRelatedProducts,
  });
};

/**
 * Props for Item headless component
 */
export interface ItemProps {
  /** Product data */
  product: V3Product;
  /** Render prop function that receives item data */
  children: (props: ItemRenderProps) => React.ReactNode;
}

/**
 * Render props for Item component
 */
export interface ItemRenderProps {
  /** Product title */
  title: string;
  /** Product image URL */
  image: string | null;
  /** Formatted price */
  price: string;
  /** Whether product is available */
  available: boolean;
  /** Product description */
  description: string;
  /** Function to add product to cart quickly */
  onQuickAdd: () => void;
}

/**
 * Headless component for individual related product item
 *
 * @component
 * @example
 * ```tsx
 * import { RelatedProducts } from '@wix/stores/components';
 *
 * function RelatedProductCard({ product }) {
 *   return (
 *     <RelatedProducts.Item product={product}>
 *       {({ title, image, price, available, description, onQuickAdd }) => (
 *         <div className={`related-product ${!available ? 'unavailable' : ''}`}>
 *           {image && <img src={image} alt={title} />}
 *           <h4>{title}</h4>
 *           {description && <p>{description}</p>}
 *           <div className="price">{price}</div>
 *           {!available && <div className="badge">Out of Stock</div>}
 *           <div className="actions">
 *             <button onClick={onQuickAdd} disabled={!available}>
 *               Quick Add
 *             </button>
 *             <a href={`/product/${product.slug}`}>View Details</a>
 *           </div>
 *         </div>
 *       )}
 *     </RelatedProducts.Item>
 *   );
 * }
 * ```
 */
export const Item = (props: ItemProps) => {
  const { product } = props;

  const title = product.name || "Unknown Product";
  // Use actual v3 media structure - image is directly a string URL
  const image = product.media?.main?.image || null;
  // Create formatted price from raw amount since formattedAmount may not be available
  const rawPrice = product.actualPriceRange?.minValue?.amount;
  const price = rawPrice ? `$${rawPrice}` : "Price unavailable";
  const availabilityStatus = product.inventory?.availabilityStatus;
  const available =
    availabilityStatus === InventoryAvailabilityStatus.IN_STOCK ||
    availabilityStatus === InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK;
  const description =
    typeof product.description === "string" ? product.description : "";

  const handleQuickAdd = () => {
    // This would typically add the product to cart
    // For now, we'll just log it
    console.log("Quick add:", product.name);
  };

  return props.children({
    title,
    image,
    price,
    available,
    description,
    onQuickAdd: handleQuickAdd,
  });
};
