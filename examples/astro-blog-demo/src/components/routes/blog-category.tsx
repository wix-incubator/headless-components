import BlogCategoriesSection from "@/components/blog/BlogCategoriesSection";
import FeedPage from "@/components/blog/FeedPage";
import {
  createCustomCategory,
  loadBlogCategoriesServiceConfig,
  loadBlogFeedServiceConfig,
} from "@wix/blog/services";
import React from "react";
import { useLoaderData, useLocation } from "react-router-dom";

export function BlogCategoryRoute() {
  const { blogFeedServiceConfig, blogCategoriesServiceConfig } =
    useLoaderData<typeof blogCategoryRouteLoader>();
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading category...</div>}>
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
