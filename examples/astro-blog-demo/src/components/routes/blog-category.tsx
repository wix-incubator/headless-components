import {
  createCustomCategory,
  loadBlogCategoriesServiceConfig,
  loadBlogFeedServiceConfig,
} from "@wix/blog/services";
import React from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import RouteFeed from "@/components/blog/RouteFeed";

export function BlogCategoryRoute() {
  const { blogFeedServiceConfig, blogCategoriesServiceConfig } =
    useLoaderData<typeof blogCategoryRouteLoader>();
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading category...</div>}>
      <RouteFeed
        pathname={location.pathname}
        blogCategoriesServiceConfig={blogCategoriesServiceConfig}
        customCategoriesToPrepend={[
          createCustomCategory({
            label: "All posts",
            slug: "/react-router/blog/",
            description:
              "Discover the latest insights, tutorials, and best practices for building modern web applications.",
          }),
        ]}
        blogFeedServiceConfig={blogFeedServiceConfig}
        postPageBaseUrl="/react-router/blog/post/"
        categoryPageBaseUrl="/react-router/blog/category/"
        uiLocale="en-US"
       />
    </React.Suspense>
  );
}

export async function blogCategoryRouteLoader({
  params,
}: {
  params: { slug?: string };
}) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const [blogFeedServiceConfig, blogCategoriesServiceConfig] =
      await Promise.all([
        loadBlogFeedServiceConfig({
          categorySlug: slug,
          pageSize: 10,
          showPinnedPostsFirst: true,
          sort: [
            {
              fieldName: "firstPublishedDate",
              order: "DESC",
            },
          ],
        }),
        loadBlogCategoriesServiceConfig(),
      ]);

    return {
      blogFeedServiceConfig,
      blogCategoriesServiceConfig,
    };
  } catch (error) {
    // If category not found, throw 404
    throw new Response("Not Found", { status: 404 });
  }
}
