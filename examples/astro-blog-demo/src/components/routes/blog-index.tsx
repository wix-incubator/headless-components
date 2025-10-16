import {
  createCustomCategory,
  loadBlogCategoriesServiceConfig,
  loadBlogFeedServiceConfig,
} from "@wix/blog/services";
import React from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import RouteFeed from "@/components/blog/RouteFeed";

export function BlogIndexRoute() {
  const { blogFeedServiceConfig, blogCategoriesServiceConfig } =
    useLoaderData<typeof blogIndexRouteLoader>();
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading blog...</div>}>
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

export async function blogIndexRouteLoader() {
  const [blogFeedServiceConfig, blogCategoriesServiceConfig] =
    await Promise.all([
      loadBlogFeedServiceConfig({
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
}
