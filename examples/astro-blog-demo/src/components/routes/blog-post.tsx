import {
  loadBlogFeedServiceConfig,
  loadBlogPostServiceConfig,
} from "@wix/blog/services";
import React from "react";

import RoutePost from "@/components/blog/RoutePost";
import { useLoaderData } from "react-router-dom";

export function BlogPostRoute() {
  const { blogPostServiceConfig, recentPostsServiceConfig } =
    useLoaderData<typeof blogPostRouteLoader>();

  return (
    <React.Suspense fallback={<div>Loading blog post...</div>}>
      <RoutePost
        blogPostServiceConfig={blogPostServiceConfig}
        recentPostsServiceConfig={recentPostsServiceConfig}
        feedPageHref="/react-router/blog/"
        categoryPageBaseUrl="/react-router/blog/category/"
        postPageBaseUrl="/react-router/blog/post/"
        uiLocale="en-US"
      />
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
