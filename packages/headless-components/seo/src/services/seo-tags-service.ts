import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import {
  ItemType,
  type PageNameData,
  type SlugData,
  type Tag,
  resolveItemSeoTags,
  resolveStaticPageSeoTags,
} from "@wix/auto_sdk_seo_seo-tags";

export interface SEOTagsServiceAPI {
  seoTags: Signal<Tag[]>;
  updateSeoTags: (
    itemType?: ItemType,
    itemData?: StaticPageData | DynamicPageData,
  ) => Promise<void>;
}

export const SEOTagsServiceDefinition =
  defineService<SEOTagsServiceAPI>("seoTagsService");

export interface SEOTagsServiceConfig {
  tags: Tag[];
}

export const SEOTagsService =
  implementService.withConfig<SEOTagsServiceConfig>()(
    SEOTagsServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const { tags: initialTags } = config;

      const tags: Signal<Tag[]> = signalsService.signal(initialTags);

      const updateSeoTags = async (
        itemType: ItemType = ItemType.UNKNOWN_ITEM_TYPE,
        itemData: StaticPageData | DynamicPageData = {
          pageName: "",
          seoData: { tags: [] },
        },
      ) => {
        const pageURL = window.location.href;

        const { tags: updatedTags } = await loadSEOTagsServiceConfig({
          pageUrl: pageURL,
          itemType,
          itemData,
        });

        tags.set(updatedTags);
        appendNewTags(updatedTags);
      };

      return { seoTags: tags, updateSeoTags };
    },
  );

async function resolveDynamicSeoTags(
  pageUrl: string,
  itemType: ItemType,
  itemData: DynamicPageData,
): Promise<Tag[]> {
  const res = await resolveItemSeoTags({
    pageUrl,
    itemType,
    slug: itemData.slug,
  });

  return res.seoTags?.tags || [];
}

async function resolveStaticSeoTags(
  pageUrl: string,
  itemData: StaticPageData,
): Promise<Tag[]> {
  const { pageName, seoData } = itemData;
  const res = await resolveStaticPageSeoTags({
    pageUrl,
    pageName,
    seoData,
  });

  return res.seoTags?.tags || [];
}

/**
 * Loads the SEO tags service configuration for a given page.
 *
 * @param {Object} params - The configuration parameters.
 * @param {string} params.pageUrl - The full URL of the page where SEO tags will be applied.
 * @param {ItemType} [params.itemType] - Optional. The type of item (e.g., STORES_PRODUCT, BLOG_POST) for item pages.
 * @param {DynamicPageData | StaticPageData} params.itemData - Item metadata (slug for item pages or pageName for static pages).
 * @returns {Promise<SEOTagsServiceConfig>} Promise resolving to SEO tags service configuration.
 *
 * @example
 * ```typescript
 * // Static page configuration
 * const config = await loadSEOTagsServiceConfig({
 *   pageUrl: "https://mysite.com/store",
 *   itemData: {
 *     pageName: "Store Home",
 *     seoData: { tags: [] }
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Item page configuration
 * const config = await loadSEOTagsServiceConfig({
 *   pageUrl: "https://mysite.com/store/product-123",
 *   itemType: ItemType.STORES_PRODUCT,
 *   itemData: { slug: "product-123" }
 * });
 * ```
 */

export interface StaticPageData extends PageNameData {}

export interface DynamicPageData extends SlugData {}

export interface LoadSEOTagsServiceConfigParams {
  itemType?: ItemType;
  pageUrl: string;
  itemData: StaticPageData | DynamicPageData;
}

export async function loadSEOTagsServiceConfig(params: LoadSEOTagsServiceConfigParams): Promise<SEOTagsServiceConfig> {
  const { itemType, pageUrl, itemData } = params;
  const isStaticPage = !itemType || itemType === ItemType.UNKNOWN_ITEM_TYPE;

  let tags: Tag[] = [];
  if (isStaticPage) {
    tags = await resolveStaticSeoTags(pageUrl, itemData as StaticPageData);
  } else {
    tags = await resolveDynamicSeoTags(pageUrl, itemType, itemData as DynamicPageData);
  }
  return {
    tags,
  };
}

function appendNewTags(tags: Tag[]) {
  if (typeof window === "undefined") return;

  const newTagElements: HTMLElement[] = [];
  try {
    tags.forEach((tag) => {
      const el = createTagElement(tag);
      if (el) newTagElements.push(el);
    });

    document.head
      .querySelectorAll('[wix-seo-tags="true"]')
      .forEach((el) => el.remove());

    newTagElements.forEach((el) => document.head.appendChild(el));
  } catch (err) {
    console.error("SEO tag update failed", err);
  }

  function createTagElement(tag: any): HTMLElement | null {
    let el: HTMLElement | null = null;
    if (tag.type === "title") {
      el = document.createElement("title");
      el.textContent = tag.children || "";
    } else if (tag.type === "meta") {
      el = document.createElement("meta");
      setAttributes(el, tag.props);
    } else if (tag.type === "link") {
      el = document.createElement("link");
      setAttributes(el, tag.props);
    } else if (tag.type === "script") {
      el = document.createElement("script");
      setAttributes(el, tag.props);
      setAttributes(el, tag.meta);
      if (tag.children) el.textContent = tag.children;
    }
    if (el) el.setAttribute("wix-seo-tags", "true");
    return el;
  }

  function setAttributes(el: HTMLElement, attrs?: Record<string, any>) {
    if (!attrs) return;
    Object.entries(attrs).forEach(([k, v]) => {
      if (v !== undefined) el.setAttribute(k, v as string);
    });
  }
}
