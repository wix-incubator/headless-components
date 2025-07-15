import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { CollectionServiceDefinition } from "../services/collection-service.js";
import {
  InventoryAvailabilityStatus,
  type V3Product,
} from "@wix/auto_sdk_stores_products-v-3";

/**
 * Props for the Grid headless component.
 */
export interface GridProps {
  /** Function that receives product grid data and loading states. Use this function to render your custom UI components with the provided data. */
  children: (props: GridRenderProps) => JSX.Element;
}

/**
 * Render props for the Grid component.
 */
export interface GridRenderProps {
  /** Array of products from the collection. Learn about [managing products and categories](https://support.wix.com/en/managing-products-and-categories). */
  products: V3Product[];
  /** Whether the collection data is loading. */
  isLoading: boolean;
  /** Error message if loading fails. */
  error: string | null;
  /** Whether the collection is empty. */
  isEmpty: boolean;
  /** Total number of products in the collection. */
  totalProducts: number;
  /** Whether the collection contains any products. */
  hasProducts: boolean;
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
 * Headless component for displaying products in a grid layout. Handles the display of product collections with loading states and error handling.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components provide ready-to-use business logic and state management, while giving you complete control over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 *
 * @example
 * import { Grid } from "@wix/stores/components";
 *
 * <Grid>
 *   {({ products, isLoading, error, isEmpty }) => (
 *     <div className="product-grid">
 *       {isLoading && <div>Loading products...</div>}
 *       {error && <div>Error: {error}</div>}
 *       {isEmpty && <div>No products found</div>}
 *       <div className="grid">
 *         {products.map(product => (
 *           <div key={product._id} className="product-card">
 *             <img src={product.media?.main?.image} alt={product.name} />
 *             <h3>{product.name}</h3>
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   )}
 * </Grid>
 *
 * @component
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
 * Props for the Item headless component.
 */
export interface ItemProps {
  /** Product data with all available variants and options. */
  product: V3Product;
  /** Function that receives product item data. Use this function to render your custom UI components with the provided product information. */
  children: (props: ItemRenderProps) => React.ReactNode;
}

/**
 * Render props for the Item component.
 */
export interface ItemRenderProps {
  /** Product ID. */
  id: string;
  /** Display name of the product. */
  title: string;
  /** URL-friendly product identifier used in product page URLs. */
  slug: string;
  /** Main product image URL. */
  image: string | null;
  /** Formatted product price that reflects the variant pricing. */
  price: string;
  /** Original price for comparison. Indicates a discount when available. */
  compareAtPrice: string | null;
  /** Product description. */
  description: string;
  /** Whether the product is available for purchase based on inventory status. */
  available: boolean;
  /** Direct link to the product page. */
  href: string;
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
 * Headless component for displaying an individual product item.
 * Handles product variants and provides ready-to-use product information for UI components.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components provide ready-to-use business logic and state management, while giving you complete control over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 *
 * @example
 * import { Item } from "@wix/stores/components";
 *
 * <Item product={product}>
 *   {({ title, price, compareAtPrice, image, available, href }) => (
 *     <div className="product-item">
 *       {image && <img src={image} alt={title} />}
 *       <h3>{title}</h3>
 *       <div className="price">
 *         <span className="current-price">{price}</span>
 *         {compareAtPrice && (
 *           <span className="compare-price">{compareAtPrice}</span>
 *         )}
 *       </div>
 *       {available ? (
 *         <a href={href} className="product-link">
 *           View Product
 *         </a>
 *       ) : (
 *         <span className="out-of-stock">Out of Stock</span>
 *       )}
 *     </div>
 *   )}
 * </Item>
 *
 * @component
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
    href: `/store/products/${product.slug}`,
  });
};

/**
 * Props for the LoadMore headless component.
 */
export interface LoadMoreProps {
  /** Function that receives pagination and loading state data. Use this function to render your custom loading and pagination UI components. */
  children: (props: LoadMoreRenderProps) => React.ReactNode;
}

/**
 * Render props for the LoadMore component.
 */
export interface LoadMoreRenderProps {
  /** Function to load additional products. */
  loadMore: () => Promise<void>;
  /** Function to refresh the collection data. */
  refresh: () => Promise<void>;
  /** Whether additional products are loading. */
  isLoading: boolean;
  /** Whether the collection contains any products. */
  hasProducts: boolean;
  /** Number of products currently loaded. */
  loadedCount: number;
  /** Whether there are more products available to load. */
  hasMoreProducts: boolean;
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
 * Headless component for progressive loading of products.
 * Enables loading additional products without traditional pagination.
 * Note: V3 API uses simplified loading without traditional pagination
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components provide ready-to-use business logic and state management, while giving you complete control over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 *
 * @example
 * import { LoadMore } from "@wix/stores/components";
 *
 * <LoadMore>
 *   {({ loadMore, isLoading, hasMoreProducts }) => (
 *     <div className="load-more">
 *       {hasMoreProducts && (
 *         <button onClick={loadMore} disabled={isLoading}>
 *           {isLoading ? 'Loading...' : 'Load More Products'}
 *         </button>
 *       )}
 *     </div>
 *   )}
 * </LoadMore>
 *
 * @component
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
 * Props for the Header headless component.
 */
export interface HeaderProps {
  /** Function that receives collection metadata such as product count and loading state. Use this function to render your custom header UI components. */
  children: (props: HeaderRenderProps) => React.ReactNode;
}

/**
 * Render props for the Header component.
 */
export interface HeaderRenderProps {
  /** Total number of products in the collection. */
  totalProducts: number;
  /** Whether the collection data is loading. */
  isLoading: boolean;
  /** Whether the collection contains any products. */
  hasProducts: boolean;
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
 * Headless component for displaying collection metadata such as product count and loading state.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components provide ready-to-use business logic and state management, while giving you complete control over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 *
 * @example
 * import { Header } from "@wix/stores/components";
 *
 * <Header>
 *   {({ totalProducts, isLoading }) => (
 *     <div className="collection-header">
 *       {isLoading ? (
 *         <p>Loading...</p>
 *       ) : (
 *         <h2>{totalProducts} Products</h2>
 *       )}
 *     </div>
 *   )}
 * </Header>
 *
 * @component
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
 * Props for the Actions headless component.
 */
export interface ActionsProps {
  /** Function that receives collection action controls and state. Use this function to render your custom action UI components. */
  children: (props: ActionsRenderProps) => React.ReactNode;
}

/**
 * Render props for the Actions component.
 */
export interface ActionsRenderProps {
  /** Function to refresh the collection data. */
  refresh: () => Promise<void>;
  /** Function to load additional products. */
  loadMore: () => Promise<void>;
  /** Whether an action is loading. */
  isLoading: boolean;
  /** Error message if an action fails. */
  error: string | null;
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
 * Headless component for performing actions on collections, such as refresh and load more.
 * This component replaces traditional pagination for V3 API.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components provide ready-to-use business logic and state management, while giving you complete control over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 *
 * @example
 * import { Actions } from "@wix/stores/components";
 *
 * <Actions>
 *   {({ refresh, loadMore, isLoading, error }) => (
 *     <div className="collection-actions">
 *       {error && <p>Error: {error}</p>}
 *       <button onClick={refresh} disabled={isLoading}>
 *         Refresh
 *       </button>
 *       <button onClick={loadMore} disabled={isLoading}>
 *         Load More
 *       </button>
 *     </div>
 *   )}
 * </Actions>
 *
 * @component
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
