import type {
  BlogFeedServiceConfig,
  BlogPostServiceConfig,
} from "@wix/blog/services";
import PostPage from "./PostPage";
import RecentPostsSection from "./RecentPostsSection";

type RoutePostProps = {
  blogPostServiceConfig: BlogPostServiceConfig;
  recentPostsServiceConfig: BlogFeedServiceConfig;
  feedPageHref: string;
  categoryPageBaseUrl: string;
  postPageBaseUrl: string;
  uiLocale: string;
};

export default function RoutePost({
  blogPostServiceConfig,
  categoryPageBaseUrl,
  feedPageHref,
  postPageBaseUrl,
  recentPostsServiceConfig,
  uiLocale,
}: RoutePostProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-12">
        <div className="mx-auto mb-14 max-w-3xl">
          <PostPage
            blogPostServiceConfig={blogPostServiceConfig}
            feedPageHref={feedPageHref}
            categoryPageBaseUrl={categoryPageBaseUrl}
            postPageBaseUrl={postPageBaseUrl}
            uiLocale={uiLocale}
          />
        </div>
        <RecentPostsSection
          recentPostsServiceConfig={recentPostsServiceConfig}
          postPageBaseUrl={postPageBaseUrl}
          categoryPageBaseUrl={categoryPageBaseUrl}
          uiLocale={uiLocale}
        />
      </div>
    </div>
  );
}
