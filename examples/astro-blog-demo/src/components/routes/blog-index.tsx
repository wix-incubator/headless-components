import BlogCategoriesSection from "@/components/blog/BlogCategoriesSection";
import FeedPage from "@/components/blog/FeedPage";
import {
  createCustomCategory,
  loadBlogCategoriesServiceConfig,
  loadBlogFeedServiceConfig,
} from "@wix/blog/services";
import React from "react";
import { useLoaderData, useLocation } from "react-router-dom";

export function BlogIndexRoute() {
  const { blogFeedServiceConfig, blogCategoriesServiceConfig } =
    useLoaderData<typeof blogIndexRouteLoader>();
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading blog...</div>}>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <BlogCategoriesSection
            pathname={location.pathname}
            categoryPageBaseUrl="/react-router/blog/category/"
            blogCategoriesServiceConfig={blogCategoriesServiceConfig}
            customCategoriesToPrepend={[
              createCustomCategory({
                label: "All posts",
                slug: "/react-router/blog/",
                description:
                  "Discover the latest insights, tutorials, and best practices for building modern web applications.",
              }),
            ]}
          />
          <FeedPage
            blogFeedServiceConfig={blogFeedServiceConfig}
            postPageBaseUrl="/react-router/blog/post/"
            categoryPageBaseUrl="/react-router/blog/category/"
            uiLocale="en-US"
          />
        </div>
      </div>
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
