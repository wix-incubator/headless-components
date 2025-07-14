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
 * Headless components are in Developer Preview and subject to change.
 * </blockquote>
 *
 * Headless component for displaying products from a collection in a grid layout.
 * Collections are themed groupings of products that store owners create to organize their catalog.
 * For example, a store owner might create collections like "Spring 2019" or "Running shoes".
 * Products can belong to multiple collections.
 *
 * > **Note:** This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
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
 * Headless components are in Developer Preview and subject to change.
 * </blockquote>
 *
 * Headless component for displaying an individual product item.
 * Handles product variants and provides ready-to-use product information for UI components.
 *
 * > **Note:** This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
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
  /** Function to load additional products from the collection. */
  loadMore: () => Promise<void>;
  /** Function to refresh the entire collection data. */
  refresh: () => Promise<void>;
  /** Whether additional products are loading. */
  isLoading: boolean;
  /** Whether the collection contains any products. */
  hasProducts: boolean;
  /** Number of products loaded from the collection. */
  loadedCount: number;
  /** Whether there are more products available to load. */
  hasMoreProducts: boolean;
}

/**
 * <blockquote class="caution">
 * Headless components are in Developer Preview and subject to change.
 * </blockquote>
 *
 * Headless component for progressive loading of collection products.
 * Enables loading additional products from the collection without traditional pagination.
 * Note: V3 API uses simplified loading without traditional pagination
 *
 * > **Note:** This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
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
 * Headless components are in Developer Preview and subject to change.
 * </blockquote>
 *
 * Headless component for displaying collection metadata such as product count and loading state.
 *
 * > **Note:** This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
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
  /** Function to load additional products from the collection. */
  loadMore: () => Promise<void>;
  /** Whether an action is loading. */
  isLoading: boolean;
  /** Error message if an action fails. */
  error: string | null;
}

/**
 * <blockquote class="caution">
 * Headless components are in Developer Preview and subject to change.
 * </blockquote>
 *
 * Headless component for performing actions on collections, such as refresh and load more.
 * This component replaces traditional pagination for V3 API.
 *
 * > **Note:** This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
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
