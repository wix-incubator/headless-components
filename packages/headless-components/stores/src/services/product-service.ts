import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import * as productsV3 from "@wix/auto_sdk_stores_products-v-3";

export interface ProductServiceAPI {
  product: Signal<productsV3.V3Product>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadProduct: (slug: string) => Promise<void>;
}

export const ProductServiceDefinition =
  defineService<ProductServiceAPI>("product");

export interface ProductServiceConfig {
  product: productsV3.V3Product;
}

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

export interface SuccessProductServiceConfigResult {
  /* Type "success" means that the product was found and the config is valid */
  type: "success";
  /* The product config */
  config: ProductServiceConfig;
}
export interface NotFoundProductServiceConfigResult {
  /* Type "notFound" means that the product was not found */
  type: "notFound";
}

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
 *   productConfig: Awaited<ReturnType<typeof loadProductServiceConfig>>['config'];
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
