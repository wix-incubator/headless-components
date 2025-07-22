import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { CollectionServiceDefinition } from "../services/collection-service.js";
import {
  InventoryAvailabilityStatus,
  type V3Product,
} from "@wix/auto_sdk_stores_products-v-3";

/**
 * Props for Grid headless component
 */
export interface GridProps {
  /** Render prop function that receives product grid data */
  children: (props: GridRenderProps) => React.ReactNode;
}

/**
 * Render props for Grid component
 */
export interface GridRenderProps {
  /** Array of products */
  products: V3Product[];
  /** Whether products are loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether there are no products */
  isEmpty: boolean;
  /** Total number of products */
  totalProducts: number;
  /** Whether collection has products */
  hasProducts: boolean;
}

/**
 * Headless component for product grid
 *
 * @component
 * @example
 * ```tsx
 * import { Collection } from '@wix/stores/components';
 *
 * function ProductGrid() {
 *   return (
 *     <Collection.Grid>
 *       {({ products, isLoading, error, isEmpty, totalProducts, hasProducts }) => (
 *         <div>
 *           {isLoading && <div>Loading products...</div>}
 *           {error && <div>Error: {error}</div>}
 *           {isEmpty && <div>No products found</div>}
 *           {hasProducts && (
 *             <div>
 *               <p>Showing {products.length} of {totalProducts} products</p>
 *               <div className="product-grid">
 *                 {products.map(product => (
 *                   <div key={product.id} className="product-card">
 *                     <h3>{product.name}</h3>
 *                     <p>{product.price?.price} {product.price?.currency}</p>
 *                   </div>
 *                 ))}
 *               </div>
 *             </div>
 *           )}
 *         </div>
 *       )}
 *     </Collection.Grid>
 *   );
 * }
 * ```
 */
export const Grid = (props: GridProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  // Debug logging to help identify service issues
  if (!service) {
    console.error("CollectionService is undefined");
    return props.children({
      products: [],
      isLoading: false,
      error: "Service not available",
      isEmpty: true,
      totalProducts: 0,
      hasProducts: false,
    });
  }

  // Safely access service properties with error handling
  try {
    const productList = service.products?.get() || [];
    const isLoading = service.isLoading?.get() || false;
    const error = service.error?.get() || null;
    const totalProducts = service.totalProducts?.get() || 0;
    const hasProducts = service.hasProducts?.get() || false;

    return props.children({
      products: productList,
      isLoading,
      error,
      isEmpty: !hasProducts && !isLoading,
      totalProducts,
      hasProducts,
    });
  } catch (err) {
    console.error("Error accessing service properties:", err);
    return props.children({
      products: [],
      isLoading: false,
      error: "Failed to load products",
      isEmpty: true,
      totalProducts: 0,
      hasProducts: false,
    });
  }
};

/**
 * Props for Item headless component
 */
export interface ItemProps {
  /** Product data */
  product: V3Product;
  /** Render prop function that receives product item data */
  children: (props: ItemRenderProps) => React.ReactNode;
}

/**
 * Render props for Item component
 */
export interface ItemRenderProps {
  /** Product ID */
  id: string;
  /** Product title */
  title: string;
  /** Product slug for URL */
  slug: string;
  /** Main product image URL */
  image: string | null;
  /** Product price */
  price: string;
  /** Compare at price (for strikethrough) */
  compareAtPrice: string | null;
  /** Product description */
  description: string;
  /** Whether product is available */
  available: boolean;
}

/**
 * Headless component for individual product item
 *
 * @component
 * @example
 * ```tsx
 * import { Collection } from '@wix/stores/components';
 *
 * function ProductCard({ product }) {
 *   return (
 *     <Collection.Item product={product}>
 *       {({ id, title, slug, image, price, compareAtPrice, description, available }) => (
 *         <div className={`product-card ${!available ? 'unavailable' : ''}`}>
 *           {image && <img src={image} alt={title} />}
 *           <h3>{title}</h3>
 *           <p>{description}</p>
 *           <div className="pricing">
 *             <span className="price">{price}</span>
 *             {compareAtPrice && (
 *               <span className="compare-price"><s>{compareAtPrice}</s></span>
 *             )}
 *           </div>
 *           {!available && <div className="badge">Out of Stock</div>}
 *           <a href={`/products/${slug}`}>View Product</a>
 *         </div>
 *       )}
 *     </Collection.Item>
 *   );
 * }
 * ```
 */
export const Item = (props: ItemProps) => {
  const { product } = props;

  // Use actual v3 API structure based on real data
  // Images are in media.main.image, not media.itemsInfo.items
  const image = product?.media?.main?.image || null;

  // Create formatted price since formattedAmount is not available
  const rawAmount = product.actualPriceRange?.minValue?.amount;
  const price = rawAmount ? `$${rawAmount}` : "$0.00";

  // Create formatted compare-at price
  const rawCompareAmount = product.compareAtPriceRange?.minValue?.amount;
  const compareAtPrice = rawCompareAmount ? `$${rawCompareAmount}` : null;

  const availabilityStatus = product.inventory?.availabilityStatus;
  const available =
    availabilityStatus === InventoryAvailabilityStatus.IN_STOCK ||
    availabilityStatus === InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK;
  const description =
    typeof product.description === "string" ? product.description : "";

  return props.children({
    id: product._id || "",
    title: product.name || "",
    slug: product.slug || "",
    image,
    price,
    compareAtPrice,
    description,
    available,
  });
};

/**
 * Props for LoadMore headless component
 */
export interface LoadMoreProps {
  /** Render prop function that receives load more data */
  children: (props: LoadMoreRenderProps) => React.ReactNode;
}

/**
 * Render props for LoadMore component
 */
export interface LoadMoreRenderProps {
  /** Function to load more products */
  loadMore: () => Promise<void>;
  /** Function to refresh products */
  refresh: () => Promise<void>;
  /** Whether load more is currently loading */
  isLoading: boolean;
  /** Whether there are products */
  hasProducts: boolean;
  /** Total number of products currently loaded */
  totalProducts: number;
  /** Whether there are more products to load */
  hasMoreProducts: boolean;
}

/**
 * Headless component for load more products functionality
 * Note: V3 API uses simplified loading without traditional pagination
 *
 * @component
 * @example
 * ```tsx
 * import { Collection } from '@wix/stores/components';
 *
 * function LoadMoreButton() {
 *   return (
 *     <Collection.LoadMore>
 *       {({ loadMore, refresh, isLoading, hasProducts, totalProducts, hasMoreProducts }) => (
 *         <div className="load-more-section">
 *           {hasProducts && (
 *             <div>
 *               <p>Loaded {totalProducts} products</p>
 *               <div className="actions">
 *                 {hasMoreProducts && (
 *                   <button
 *                     onClick={loadMore}
 *                     disabled={isLoading}
 *                   >
 *                     {isLoading ? 'Loading...' : 'Load More Products'}
 *                   </button>
 *                 )}
 *                 <button onClick={refresh}>Refresh Collection</button>
 *               </div>
 *             </div>
 *           )}
 *         </div>
 *       )}
 *     </Collection.LoadMore>
 *   );
 * }
 * ```
 */
export const LoadMore = (props: LoadMoreProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  // Error handling for undefined service
  if (!service) {
    console.error("CollectionService is undefined in LoadMore");
    return props.children({
      loadMore: async () => {},
      refresh: async () => {},
      isLoading: false,
      hasProducts: false,
      totalProducts: 0,
      hasMoreProducts: false,
    });
  }

  try {
    const isLoading = service.isLoading?.get() || false;
    const hasProducts = service.hasProducts?.get() || false;
    const totalProducts = service.totalProducts?.get() || 0;
    const hasMoreProducts = service.hasMoreProducts?.get() || false;

    return props.children({
      loadMore: service.loadMore || (async () => {}),
      refresh: service.refresh || (async () => {}),
      isLoading,
      hasProducts,
      totalProducts,
      hasMoreProducts,
    });
  } catch (err) {
    console.error("Error in LoadMore:", err);
    return props.children({
      loadMore: async () => {},
      refresh: async () => {},
      isLoading: false,
      hasProducts: false,
      totalProducts: 0,
      hasMoreProducts: false,
    });
  }
};

/**
 * Props for Header headless component
 */
export interface HeaderProps {
  /** Render prop function that receives collection header data */
  children: (props: HeaderRenderProps) => React.ReactNode;
}

/**
 * Render props for Header component
 */
export interface HeaderRenderProps {
  /** Total number of products */
  totalProducts: number;
  /** Whether collection is loading */
  isLoading: boolean;
  /** Whether collection has products */
  hasProducts: boolean;
}

/**
 * Headless component for collection header with product count
 *
 * @component
 * @example
 * ```tsx
 * import { Collection } from '@wix/stores/components';
 *
 * function CollectionHeader() {
 *   return (
 *     <Collection.Header>
 *       {({ totalProducts, isLoading, hasProducts }) => (
 *         <div className="collection-header">
 *           {isLoading && <div>Loading collection...</div>}
 *           {hasProducts && !isLoading && (
 *             <h2>Products ({totalProducts} items)</h2>
 *           )}
 *           {!hasProducts && !isLoading && (
 *             <h2>No products found</h2>
 *           )}
 *         </div>
 *       )}
 *     </Collection.Header>
 *   );
 * }
 * ```
 */
export const Header = (props: HeaderProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  // Error handling for undefined service
  if (!service) {
    console.error("CollectionService is undefined in Header");
    return props.children({
      totalProducts: 0,
      isLoading: false,
      hasProducts: false,
    });
  }

  try {
    const totalProducts = service.totalProducts?.get() || 0;
    const isLoading = service.isLoading?.get() || false;
    const hasProducts = service.hasProducts?.get() || false;

    return props.children({
      totalProducts,
      isLoading,
      hasProducts,
    });
  } catch (err) {
    console.error("Error in Header:", err);
    return props.children({
      totalProducts: 0,
      isLoading: false,
      hasProducts: false,
    });
  }
};

/**
 * Props for Actions headless component
 */
export interface ActionsProps {
  /** Render prop function that receives collection actions data */
  children: (props: ActionsRenderProps) => React.ReactNode;
}

/**
 * Render props for Actions component
 */
export interface ActionsRenderProps {
  /** Function to refresh the collection */
  refresh: () => Promise<void>;
  /** Function to load more products */
  loadMore: () => Promise<void>;
  /** Whether actions are loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

/**
 * Headless component for collection actions (refresh, load more)
 * Replaces traditional pagination for V3 API
 *
 * @component
 * @example
 * ```tsx
 * import { Collection } from '@wix/stores/components';
 *
 * function CollectionActions() {
 *   return (
 *     <Collection.Actions>
 *       {({ refresh, loadMore, isLoading, error }) => (
 *         <div className="collection-actions">
 *           {error && (
 *             <div className="error">
 *               Error: {error}
 *               <button onClick={refresh}>Retry</button>
 *             </div>
 *           )}
 *           <div className="action-buttons">
 *             <button
 *               onClick={refresh}
 *               disabled={isLoading}
 *             >
 *               {isLoading ? 'Refreshing...' : 'Refresh'}
 *             </button>
 *             <button
 *               onClick={loadMore}
 *               disabled={isLoading}
 *             >
 *               Load More
 *             </button>
 *           </div>
 *         </div>
 *       )}
 *     </Collection.Actions>
 *   );
 * }
 * ```
 */
export const Actions = (props: ActionsProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  // Error handling for undefined service
  if (!service) {
    console.error("CollectionService is undefined in Actions");
    return props.children({
      refresh: async () => {},
      loadMore: async () => {},
      isLoading: false,
      error: "Service not available",
    });
  }

  try {
    const isLoading = service.isLoading?.get() || false;
    const error = service.error?.get() || null;

    return props.children({
      refresh: service.refresh || (async () => {}),
      loadMore: service.loadMore || (async () => {}),
      isLoading,
      error,
    });
  } catch (err) {
    console.error("Error in Actions:", err);
    return props.children({
      refresh: async () => {},
      loadMore: async () => {},
      isLoading: false,
      error: "Failed to load actions",
    });
  }
};
