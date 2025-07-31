import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import * as productsV3 from "@wix/auto_sdk_stores_products-v-3";

/**
 * API interface for the Product service, providing reactive product data management.
 * This service handles loading and managing a single product's data, loading state, and errors.
 *
 * @interface ProductServiceAPI
 */
export interface ProductServiceAPI {
  /** Reactive signal containing the current product data */
  product: Signal<productsV3.V3Product>;
  /** Reactive signal indicating if a product is currently being loaded */
  isLoading: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
  /** Function to load a product by its slug */
  loadProduct: (slug: string) => Promise<void>;
}

/**
 * Service definition for the Product service.
 * This defines the contract that the ProductService must implement.
 *
 * @constant
 */
export const ProductServiceDefinition =
  defineService<ProductServiceAPI>("product");

/**
 * Configuration interface required to initialize the ProductService.
 * Contains the initial product data that will be loaded into the service.
 *
 * @interface ProductServiceConfig
 */
export interface ProductServiceConfig {
  /** The initial product data to configure the service with */
  product: productsV3.V3Product;
}

/**
 * Implementation of the Product service that manages reactive product data.
 * This service provides signals for product data, loading state, and error handling,
 * along with methods to dynamically load products.
 *
 * @example
 * ```tsx
 * import { ProductService, ProductServiceDefinition } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function ProductComponent({ productConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ProductServiceDefinition, ProductService.withConfig(productConfig)]
 *     ])}>
 *       <ProductDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function ProductDisplay() {
 *   const productService = useService(ProductServiceDefinition);
 *   const product = productService.product.get();
 *   const isLoading = productService.isLoading.get();
 *   const error = productService.error.get();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return <h1>{product.name}</h1>;
 * }
 * ```
 */
export const ProductService =
  implementService.withConfig<ProductServiceConfig>()(
    ProductServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const product: Signal<productsV3.V3Product> = signalsService.signal(
        config.product as any,
      );
      const isLoading: Signal<boolean> = signalsService.signal(false as any);
      const error: Signal<string | null> = signalsService.signal(null as any);

      const loadProduct = async (slug: string) => {
        isLoading.set(true);
        const productResponse = await loadProductBySlug(slug);
        if (!productResponse.product) {
          error.set("Product not found");
        } else {
          product.set(productResponse.product!);
          error.set(null);
        }
        isLoading.set(false);
      };

      return {
        product,
        isLoading,
        error,
        loadProduct,
      };
    },
  );

/**
 * Success result interface for product service configuration loading.
 * Returned when a product is successfully found and loaded.
 *
 * @interface SuccessProductServiceConfigResult
 */
export interface SuccessProductServiceConfigResult {
  /** Type "success" means that the product was found and the config is valid */
  type: "success";
  /** The product config containing the loaded product data */
  config: ProductServiceConfig;
}

/**
 * Not found result interface for product service configuration loading.
 * Returned when a product with the given slug cannot be found.
 *
 * @interface NotFoundProductServiceConfigResult
 */
export interface NotFoundProductServiceConfigResult {
  /** Type "notFound" means that the product was not found */
  type: "notFound";
}

/**
 * Internal helper function to load a product by its slug from the Wix Products API.
 * Fetches comprehensive product data including description, categories, media, etc.
 *
 * @private
 * @param {string} slug - The product slug to load
 * @returns {Promise} Product response from the API
 */
const loadProductBySlug = async (slug: string) => {
  const productResponse = await productsV3.getProductBySlug(slug, {
    fields: [
      "DESCRIPTION" as any,
      "DIRECT_CATEGORIES_INFO" as any,
      "BREADCRUMBS_INFO" as any,
      "INFO_SECTION" as any,
      "MEDIA_ITEMS_INFO" as any,
      "PLAIN_DESCRIPTION" as any,
      "THUMBNAIL" as any,
      "URL" as any,
      "VARIANT_OPTION_CHOICE_NAMES" as any,
      "WEIGHT_MEASUREMENT_UNIT_INFO" as any,
    ],
  });

  return productResponse;
};

/**
 * Loads product service configuration from the Wix Products API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * a specific product by slug that will be used to configure the ProductService.
 *
 * @param productSlug The product slug to load
 * @returns Promise that resolves to ProductServiceConfigResult (success with config or notFound)
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/product/[slug].astro
 * import { loadProductServiceConfig } from '@wix/stores/services';
 * import { Product } from '@wix/stores/components';
 *
 * // Get product slug from URL params
 * const { slug } = Astro.params;
 *
 * // Load product data during SSR
 * const productResult = await loadProductServiceConfig(slug);
 *
 * // Handle not found case
 * if (productResult.type === 'notFound') {
 *   return Astro.redirect('/404');
 * }
 * ---
 *
 * <Product.Root productConfig={productResult.config}>
 *   <Product.Name>
 *     {({ name }) => <h1>{name}</h1>}
 *   </Product.Name>
 * </Product.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example - pages/product/[slug].tsx
 * import { GetServerSideProps } from 'next';
 * import { loadProductServiceConfig } from '@wix/stores/services';
 * import { Product } from '@wix/stores/components';
 *
 * interface ProductPageProps {
 *   productConfig: Extract<Awaited<ReturnType<typeof import('@wix/headless-stores/services').loadProductServiceConfig>>, { type: 'success' }>['config']
 * }
 *
 * export const getServerSideProps: GetServerSideProps<ProductPageProps> = async ({ params }) => {
 *   const slug = params?.slug as string;
 *
 *   // Load product data during SSR
 *   const productResult = await loadProductServiceConfig(slug);
 *
 *   // Handle not found case
 *   if (productResult.type === 'notFound') {
 *     return {
 *       notFound: true,
 *     };
 *   }
 *
 *   return {
 *     props: {
 *       productConfig: productResult.config,
 *     },
 *   };
 * };
 *
 * export default function ProductPage({ productConfig }: ProductPageProps) {
 *   return (
 *     <Product.Root productConfig={productConfig}>
 *       <Product.Name>
 *         {({ name }) => <h1>{name}</h1>}
 *       </Product.Name>
 *     </Product.Root>
 *   );
 * }
 * ```
 */
export async function loadProductServiceConfig(
  productSlug: string,
): Promise<
  SuccessProductServiceConfigResult | NotFoundProductServiceConfigResult
> {
  try {
    // Use getProductBySlug directly - single API call with comprehensive fields
    const productResponse = await loadProductBySlug(productSlug);

    if (!productResponse.product) {
      return { type: "notFound" };
    }

    return {
      type: "success",
      config: {
        product: productResponse.product!,
      },
    };
  } catch (error) {
    console.error(`Failed to load product for slug "${productSlug}":`, error);
    return { type: "notFound" };
  }
}
