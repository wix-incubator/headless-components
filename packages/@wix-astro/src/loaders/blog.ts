import { categories, posts, tags } from "@wix/blog";
import { media } from "@wix/sdk";
import type { Loader, LoaderContext } from "astro/loaders";
import { getWixClient } from "../client.js";

enum PostFieldField {
  RICH_CONTENT = "RICH_CONTENT",
  CONTENT_TEXT = "CONTENT_TEXT",
}

export function wixBlogLoader(transform = (item: any) => item): Loader {
  return {
    name: "wix-blog-loader",
    load: async (context: LoaderContext) => {
      const { items } = await getWixClient()
        .use(posts)
        .queryPosts({
          fieldsets: [PostFieldField.RICH_CONTENT, PostFieldField.CONTENT_TEXT],
        })
        .find();
      const useCategories = getWixClient().use(categories);
      const useTags = getWixClient().use(tags);

      for (const item of items) {
        const categories = await Promise.all(
          (item.categoryIds || []).map(async (categoryId) => {
            const { category } = await useCategories.getCategory(categoryId);
            return category;
          })
        );
        const { items: tags } = await useTags.queryTags().find();

        const data = transform({
          ...item,

          // Additions
          ...(item.media?.wixMedia?.image && {
            mediaUrl: media.getImageUrl(item.media?.wixMedia?.image).url,
          }),
          categories,
          tags,
        });

        const digest = context.generateDigest(data);

        context.store.set({
          id: data.id,
          data,
          digest,
          rendered: {
            html: item.contentText || "",
          },
        });
      }
    },
  };
}
