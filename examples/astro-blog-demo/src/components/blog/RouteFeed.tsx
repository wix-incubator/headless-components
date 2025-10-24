import type {
  BlogCategoriesServiceConfig,
  BlogFeedServiceConfig,
  createCustomCategory,
} from "@wix/blog/services";
import BlogCategoriesSection from "./BlogCategoriesSection";
import FeedPage from "./FeedPage";

type RouteFeedProps = {
  blogCategoriesServiceConfig: BlogCategoriesServiceConfig;
  customCategoriesToPrepend: ReturnType<typeof createCustomCategory>[];
  blogFeedServiceConfig: BlogFeedServiceConfig;
  postPageBaseUrl: string;
  categoryPageBaseUrl: string;
  uiLocale: string;
  pathname: string;
};

export default function RouteFeed({
  pathname,
  blogCategoriesServiceConfig,
  customCategoriesToPrepend,
  blogFeedServiceConfig,
  postPageBaseUrl,
  categoryPageBaseUrl,
  uiLocale,
}: RouteFeedProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <BlogCategoriesSection
          pathname={pathname}
          categoryPageBaseUrl={categoryPageBaseUrl}
          blogCategoriesServiceConfig={blogCategoriesServiceConfig}
          customCategoriesToPrepend={customCategoriesToPrepend}
        />
        <FeedPage
          blogFeedServiceConfig={blogFeedServiceConfig}
          postPageBaseUrl={postPageBaseUrl}
          categoryPageBaseUrl={categoryPageBaseUrl}
          uiLocale={uiLocale}
        />
      </div>
    </div>
  );
}
