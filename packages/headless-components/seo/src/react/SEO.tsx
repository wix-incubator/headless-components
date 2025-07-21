import type { ServiceAPI } from "@wix/services-manager/types";
import {
  SEOTagsServiceDefinition,
  type SEOTagsServiceConfig,
} from "../services/seo-tags-service.js";
import { useService } from "@wix/services-manager-react";
import { ItemType, PageNameData, SlugData } from "@wix/auto_sdk_seo_seo-tags";

export interface TagsProps {
  /** Configuration for the SEO tags service */
  seoTagsServiceConfig: SEOTagsServiceConfig;
}

/**
 * Renders SEO tags (title, meta, link, script) in the document head using a provided SEO service configuration.
 *
 * Integrates with the Wix services manager and a custom SEO tags service to inject SEO-relevant tags.
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
 * UpdateTagsTrigger - Handles updating SEO tags dynamically
 *
 * This component provides a way to update SEO tags on the client side without
 * requiring a full page reload. It wraps content with the ability to trigger
 * SEO tag updates.
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
