import type { ServiceAPI } from "@wix/services-manager/types";
import {
  SEOTagsServiceDefinition,
  type SEOTagsServiceConfig,
} from "../services/seo-tags-service.js";
import { useService } from "@wix/services-manager-react";
import { ItemType, PageNameData, SlugData } from "@wix/auto_sdk_seo_seo-tags";

export interface TagsProps {
  seoTagsServiceConfig: SEOTagsServiceConfig;
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
 * A headless component for rendering SEO tags based on the provided service configuration.
 * Injects title, meta, link, and script tags into the document head using the Wix services manager and SEO tags service.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components use the render props pattern. They provide business logic and state management, while giving you full control over the UI so you can build custom experiences faster.
 *
 * @param {SEOTagsServiceConfig} props.seoTagsServiceConfig - Configuration for the SEO tags service.
 *
 * @example
 * import { loadSEOTagsServiceConfig } from "@wix/seo/server-actions";
 * import { SEO } from "@wix/seo/components";
 * import { seoTags } from "@wix/seo";
 *
 * const seoTagsServiceConfig = await loadSEOTagsServiceConfig({
 *   pageURL: url,
 *   itemData: { slug: "<YOUR_ITEM_SLUG>" },
 *   itemType: seoTags.ItemType.<YOUR_ITEM_TYPE>,
 * });
 *
 * <head>
 *   <SEO.Tags seoTagsServiceConfig={seoTagsServiceConfig} />
 * </head>
 *
 * @component
 */
export function Tags(props: TagsProps): React.ReactNode {
  const { seoTagsServiceConfig } = props;
  const dataAttr = { "wix-seo-tags": "true" };
  return seoTagsServiceConfig.tags
    .filter((tag) => !tag.disabled)
    .map((tag, index) => {
      if (tag.type === "title") {
        return (
          <title key={`title-${index}`} {...dataAttr}>
            {tag.children}
          </title>
        );
      }
      if (tag.type === "meta") {
        return <meta key={`meta-${index}`} {...tag.props} {...dataAttr} />;
      }

      if (tag.type === "link") {
        return <link key={`link-${index}`} {...tag.props} {...dataAttr} />;
      }

      if (tag.type === "script") {
        return (
          <script
            key={`script-${index}`}
            {...tag.props}
            {...tag.meta}
            {...dataAttr}
            dangerouslySetInnerHTML={{ __html: tag.children || "" }}
          />
        );
      }
      return null;
    });
}

export interface UpdateTagsTriggerProps {
  children: (props: {
    updateSeoTags: (
      itemType: ItemType,
      itemData: SlugData | PageNameData
    ) => Promise<void>;
  }) => React.ReactNode;
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
 * A headless component for updating SEO tags dynamically on the client side.
 * Exposes an `updateSeoTags` function that allows you to update SEO tags without requiring a full page reload.
 *
 * > **Notes:**
 * > * This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 * > * Headless components use the render props pattern. They provide business logic and state management, while giving you full control over the UI so you can build custom experiences faster.
 *
 * @example
 * ```tsx
 * import { SEO } from "@wix/seo/components";
 * import { seoTags } from "@wix/seo";
 *
 * <SEO.UpdateTagsTrigger>
 *   {({ updateSeoTags }) => (
 *     <a
 *       href="https://your-domain.com/items/different-item"
 *       onClick={() =>
 *         updateSeoTags(seoTags.ItemType.STORES_PRODUCT, { slug: "product-slug" })
 *       }
 *     >
 *       Go to a different item
 *     </a>
 *   )}
 * </SEO.UpdateTagsTrigger>
 * ```
 *
 * @component
 */
export function UpdateTagsTrigger(
  props: UpdateTagsTriggerProps
): React.ReactNode {
  const service = useService(SEOTagsServiceDefinition) as ServiceAPI<
    typeof SEOTagsServiceDefinition
  >;

  return props.children({
    updateSeoTags: service.updateSeoTags,
  });
}
