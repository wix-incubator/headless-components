import {
  loadBlogFeedServiceConfig,
  loadBlogPostServiceConfig,
} from "@wix/blog/services";
import React from "react";

import PostPage from "@/components/blog/PostPage";
import RecentPostsSection from "@/components/blog/RecentPostsSection";
import { useLoaderData } from "react-router-dom";

export function BlogPostRoute() {
  const { blogPostServiceConfig, recentPostsServiceConfig } =
    useLoaderData<typeof blogPostRouteLoader>();

  return (
    <React.Suspense fallback={<div>Loading blog post...</div>}>
      <div className="min-h-screen bg-background">
        <div className="px-6 py-12">
          <div className="mx-auto mb-14 max-w-3xl">
            <PostPage
              blogPostServiceConfig={blogPostServiceConfig}
              feedPageHref="/react-router/blog/"
              categoryPageBaseUrl="/react-router/blog/category/"
              dateLocale="en-US"
            />
          </div>
          <RecentPostsSection
            recentPostsServiceConfig={recentPostsServiceConfig}
            postPageBaseUrl="/react-router/blog/post/"
            categoryPageBaseUrl="/react-router/blog/category/"
            dateLocale="en-US"
          />
        </div>
      </div>
    </React.Suspense>
  );
}

export async function blogPostRouteLoader({
  params,
}: {
  params: { slug?: string };
}) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const blogPostServiceConfigResult = await loadBlogPostServiceConfig({
    postSlug: slug,
  });

  if (blogPostServiceConfigResult.type === "notFound") {
    throw new Response("Not Found", { status: 404 });
  }

  const blogPostServiceConfig = blogPostServiceConfigResult.config;

  const [recentPostsServiceConfig] = await Promise.all([
    loadBlogFeedServiceConfig({
      pageSize: 3,
      sort: [{ fieldName: "firstPublishedDate", order: "DESC" }],
      postIds: blogPostServiceConfig.post.relatedPostIds,
      excludePostIds: [blogPostServiceConfig.post._id],
    }),
  ]);

  return {
    blogPostServiceConfig,
    recentPostsServiceConfig,
  };
}
