import {
  BlogFeed,
  BlogCategories,
  createCustomCategory,
} from '@wix/headless-blog/react';
import {
  BlogFeedService,
  BlogFeedServiceDefinition,
  type BlogFeedServiceConfig,
  BlogCategoriesService,
  BlogCategoriesServiceDefinition,
  type BlogCategoriesServiceConfig,
} from '@wix/headless-blog/services';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import { useState } from 'react';
import { KitchensinkLayout } from '../../layouts/KitchensinkLayout';
import '../../styles/theme-blog.css';

interface BlogFeedPageProps {
  pathname: string;
  blogFeedServiceConfig: BlogFeedServiceConfig;
  blogCategoriesServiceConfig: BlogCategoriesServiceConfig;
}

export default function BlogFeedPage({
  pathname,
  blogFeedServiceConfig,
  blogCategoriesServiceConfig,
}: BlogFeedPageProps) {
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap()
        .addService(
          BlogFeedServiceDefinition,
          BlogFeedService,
          blogFeedServiceConfig,
        )
        .addService(
          BlogCategoriesServiceDefinition,
          BlogCategoriesService,
          blogCategoriesServiceConfig,
        ),
    ),
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <KitchensinkLayout>
        <div className="min-h-screen bg-surface-primary">
          <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-content-primary mb-4">
                Headless Components Blog
              </h1>
            </div>

            {/* Categories Section */}
            <BlogCategories.Root
              customCategories={[
                createCustomCategory('All posts', '/', {
                  description: `Discover the latest insights, tutorials, and best practices for
                building modern web applications with headless components.`,
                }),
              ]}
            >
              <section className="relative overflow-hidden place-items-center text-center rounded-xl p-8 grid gap-5 min-h-[182px] bg-gradient-to-tr from-lime-300/50 to-transparent">
                <BlogCategories.ActiveCategory
                  baseUrl="/category/"
                  asChild
                  currentPath={pathname}
                >
                  {({ category }) => {
                    const withImage = category.imageUrl;
                    return (
                      <>
                        {withImage && (
                          <figure className="absolute inset-0 after:absolute after:inset-0 after:bg-black/50">
                            <BlogCategories.CategoryImage className="object-cover h-full w-full " />
                          </figure>
                        )}
                        <div className="isolate flex flex-col justify-center">
                          <BlogCategories.CategoryLabel
                            className={`text-2xl font-bold ${
                              withImage ? 'text-white' : 'text-content-primary'
                            }`}
                          />
                          <BlogCategories.CategoryDescription
                            className={`${withImage ? 'text-white' : 'text-content-primary'}`}
                          />
                        </div>
                        <BlogCategories.Categories>
                          <div className="isolate">
                            <div className="flex flex-wrap gap-3 justify-center">
                              <BlogCategories.CategoryRepeater>
                                <BlogCategories.CategoryLink
                                  baseUrl="/category/"
                                  asChild
                                >
                                  {({ href }) => {
                                    const activeClass = withImage
                                      ? 'bg-white text-black border border-transparent'
                                      : 'bg-black text-white border border-transparent';
                                    const inactiveClass = withImage
                                      ? 'bg-transparent text-white border border-white'
                                      : 'bg-transparent text-black border border-black';

                                    return (
                                      <a
                                        href={href}
                                        className={`px-4 py-2 rounded-lg hover:scale-105 ${
                                          pathname === href
                                            ? activeClass
                                            : inactiveClass
                                        }`}
                                      >
                                        <BlogCategories.CategoryLabel />
                                      </a>
                                    );
                                  }}
                                </BlogCategories.CategoryLink>
                              </BlogCategories.CategoryRepeater>
                            </div>
                          </div>
                        </BlogCategories.Categories>
                      </>
                    );
                  }}
                </BlogCategories.ActiveCategory>
              </section>
            </BlogCategories.Root>
            <BlogFeed.Sort className="mb-4" />
            <BlogFeed.Root>
              <BlogFeed.Posts
                className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8"
                emptyState={
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-content-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-content-primary mb-4">
                      No Posts Found
                    </h3>
                    <p className="text-content-muted">
                      There are no blog posts available at the moment. Check
                      back later for new content!
                    </p>
                  </div>
                }
              >
                <BlogFeed.PostRepeater>
                  <article className="bg-surface-card border border-surface-primary rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col gap-5">
                    <BlogFeed.PostCoverImage className="w-full aspect-video object-cover rounded-xl" />

                    <BlogFeed.PostCategories className="flex flex-wrap gap-2">
                      <BlogFeed.PostCategoryRepeater>
                        <BlogFeed.PostCategoryLabel className="bg-status-info-light text-brand-primary border border-brand-light px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide" />
                      </BlogFeed.PostCategoryRepeater>
                    </BlogFeed.PostCategories>

                    <BlogFeed.PostLink baseUrl="/">
                      <BlogFeed.PostTitle className="text-xl font-bold" />
                    </BlogFeed.PostLink>

                    <BlogFeed.PostExcerpt className="text-content-light mb-4 line-clamp-3 flex-grow" />

                    <div className="flex items-center text-sm gap-3 text-content-muted mt-auto pt-4">
                      <BlogFeed.PostAuthorAvatar className="w-8 h-8 text-xs bg-gradient-to-br from-purple-500/60 to-red-500/80 text-white rounded-full flex items-center justify-center" />
                      <BlogFeed.PostAuthorName />

                      <BlogFeed.PostPublishDate
                        className="ms-auto"
                        locale="en-US"
                      />
                    </div>

                    {/* <BlogFeed.PostTags className="flex flex-wrap gap-1">
                      <BlogFeed.PostTagRepeater>
                        <BlogFeed.PostTag className="badge-tag text-xs" />
                      </BlogFeed.PostTagRepeater>
                    </BlogFeed.PostTags> */}

                    <BlogFeed.PostLink
                      baseUrl="/"
                      className="text-brand-primary hover:text-brand-light hover:underline transition-colors text-sm gap-1 flex items-center"
                    >
                      Read More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="2 2 20 20"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6.5 19 12m0 0-5.5 5.5"
                        />
                      </svg>
                    </BlogFeed.PostLink>
                  </article>
                </BlogFeed.PostRepeater>

                {/* Load More Button */}
                <div className="col-span-full text-center mt-12">
                  <BlogFeed.LoadMore asChild>
                    {({ isLoading, loadNextPage }) => {
                      return (
                        <button
                          onClick={loadNextPage}
                          disabled={isLoading}
                          className="btn-primary px-8 py-3 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
                              Loading...
                            </>
                          ) : (
                            <>Load More Posts</>
                          )}
                        </button>
                      );
                    }}
                  </BlogFeed.LoadMore>
                </div>
              </BlogFeed.Posts>
            </BlogFeed.Root>
          </div>
        </div>
      </KitchensinkLayout>
    </ServicesManagerProvider>
  );
}
