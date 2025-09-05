import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import * as CoreBlogPost from './core/BlogPost.js';
import type { PostWithResolvedFields } from '../services/blog-feed-service.js';
import { posts, tags } from '@wix/blog';
import {
  pluginCodeBlockViewer,
  pluginIndentViewer,
  pluginLineSpacingViewer,
  pluginLinkViewer,
  pluginTextColorViewer,
  pluginTextHighlightViewer,
  pluginAudioViewer,
  pluginLinkButtonViewer,
  pluginCollapsibleListViewer,
  pluginDividerViewer,
  pluginGalleryViewer,
  pluginGiphyViewer,
  pluginHtmlViewer,
  pluginImageViewer,
  pluginLinkPreviewViewer,
  pluginTableViewer,
  pluginVideoViewer,
  RicosViewer,
  type RicosCustomStyles,
} from '@wix/ricos';

import { createAuthorName } from './helpers.js';

interface PostContextValue {
  post: PostWithResolvedFields | null;
}

const PostContext = React.createContext<PostContextValue | null>(null);

export function usePostContext(): PostContextValue {
  const context = React.useContext(PostContext);
  if (!context) {
    throw new Error(
      'usePostContext must be used within a BlogPost.Root component',
    );
  }
  return context;
}

const enum TestIds {
  blogPostRoot = 'blog-post-root',
  blogPostTitle = 'blog-post-title',
  blogPostContent = 'blog-post-content',
  blogPostCoverImage = 'blog-post-cover-image',
  blogPostAuthor = 'blog-post-author',
  blogPostAuthorName = 'blog-post-author-name',
  blogPostAuthorAvatar = 'blog-post-author-avatar',
  blogPostPublishDate = 'blog-post-publish-date',
  blogPostReadingTime = 'blog-post-reading-time',
  blogPostCategories = 'blog-post-categories',
  blogPostCategory = 'blog-post-category',
  blogPostTags = 'blog-post-tags',
  blogPostTag = 'blog-post-tag',
}

export interface BlogPostRootProps {
  asChild?: boolean;
  className?: string;
  children: AsChildChildren<{ post: PostWithResolvedFields }> | React.ReactNode;
  post?: PostWithResolvedFields;
  /** Content to render when no post is available */
  emptyState?: React.ReactNode;
}

/**
 * Root container for blog post that provides post context to all child components.
 * Supports both service-driven and prop-driven post data.
 * Follows Container Level pattern from architecture rules.
 *
 * **Important:** This package requires manual CSS import for proper styling:
 * ```tsx
 * import '@wix/headless-blog/react/styles.css';
 * ```
 * The CSS is required for proper rendering of BlogPost.Content and other styled components.
 *
 * @component
 * @example
 * ```tsx
 * import { BlogPost } from '@wix/headless-blog/react';
 *
 * // Service-driven (gets post from BlogPostService)
 * function BlogPostPage() {
 *   return (
 *     <BlogPost.Root emptyState={<div>Post not found</div>}>
 *       <article>
 *         <BlogPost.Title />
 *         <BlogPost.PublishDate locale="en-US" />
 *         <BlogPost.Content />
 *         <BlogPost.Tags>
 *           <BlogPost.TagRepeater>
 *             <BlogPost.Tag />
 *           </BlogPost.TagRepeater>
 *         </BlogPost.Tags>
 *         <BlogPost.Categories>
 *           <BlogPost.CategoryRepeater>
 *             <BlogPost.CategoryLink baseUrl="/category/" />
 *           </BlogPost.CategoryRepeater>
 *         </BlogPost.Categories>
 *         <BlogPost.AuthorName />
 *         <BlogPost.AuthorAvatar />
 *         <BlogPost.ShareUrlToFacebook href={location.href} />
 *         <BlogPost.ShareUrlToX href={location.href} />
 *         <BlogPost.ShareUrlToLinkedIn href={location.href} />
 *       </article>
 *     </BlogPost.Root>
 *   );
 * }
 *
 * // Prop-driven (provide post data directly)
 * function BlogPostCard({ post }) {
 *   return (
 *     <BlogPost.Root post={post} emptyState={<div>Post not found</div>}>
 *       <article>
 *         ... same as service-driven example
 *       </article>
 *     </BlogPost.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, BlogPostRootProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      post: providedPost,
      emptyState,
    } = props;

    const renderRoot = (post: PostWithResolvedFields) => {
      const contextValue: PostContextValue = {
        post,
      };
      const attributes = {
        'data-testid': TestIds.blogPostRoot,
        'data-post-id': post._id,
        'data-post-slug': post.slug,
      };

      return (
        <PostContext.Provider value={contextValue}>
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            customElementProps={{ post }}
            {...attributes}
          >
            {children}
          </AsChildSlot>
        </PostContext.Provider>
      );
    };

    // If post is provided via props, use it directly
    if (providedPost) {
      return renderRoot(providedPost);
    }

    // Otherwise, use service to get post data
    return (
      <CoreBlogPost.Content>
        {({ post }) => {
          if (!post) {
            return emptyState || null;
          }

          return renderRoot(post);
        }}
      </CoreBlogPost.Content>
    );
  },
);

export interface TitleProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ title: string }> | React.ReactNode;
}

/**
 * Displays the blog post title with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <BlogPost.Title />
 *
 * // Custom styling
 * <BlogPost.Title className="text-4xl font-bold text-gray-900" />
 *
 * // Custom rendering with asChild
 * <BlogPost.Title asChild>
 *   {({ title }) => <h1 className="blog-title">{title}</h1>}
 * </BlogPost.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { post } = usePostContext();

  if (!post?.title) return null;

  const title = post.title;
  const attributes = {
    'data-testid': TestIds.blogPostTitle,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ title }}
      content={title}
    >
      <h1>{title}</h1>
    </AsChildSlot>
  );
});

export interface ContentProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ ricosViewerContent: any }> | React.ReactNode;
  customStyles?: RicosCustomStyles;
}
/**
 * Displays the blog post rich content using Wix Ricos viewer.
 *
 * **Note:** Requires CSS import for proper content styling:
 * ```tsx
 * import '@wix/headless-blog/react/styles.css';
 * ```
 * Without this import, the rich content may not render with proper typography and layout.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering with built-in Ricos viewer
 * <BlogPost.Content />
 *
 * // Custom styling
 * <BlogPost.Content className="prose max-w-[60ch] mx-auto" />
 *
 * // Custom Ricos styles using CSS custom properties
 * <BlogPost.Content
 *   customStyles={{
 *     p: {
 *       fontSize: 'var(--text-lg)',
 *       lineHeight: 'var(--leading-relaxed)',
 *       color: 'var(--color-content-primary)',
 *     },
 *   }}
 * />
 *
 * // Custom rendering with asChild
 * <BlogPost.Content asChild>
 *   {({ ricosViewerContent }) => (
 *     <div className="custom-content-wrapper">
 *       <RicosViewer content={ricosViewerContent} plugins={customPlugins()} />
 *     </div>
 *   )}
 * </BlogPost.Content>
 * ```
 */
export const Content = React.forwardRef<HTMLElement, ContentProps>(
  (props, ref) => {
    const { asChild, children, className, customStyles } = props;

    const attributes = {
      'data-testid': TestIds.blogPostContent,
    };

    const ricosPluginsForBlog = [
      pluginAudioViewer(),
      pluginCodeBlockViewer(),
      pluginCollapsibleListViewer(),
      pluginDividerViewer(),
      pluginGalleryViewer(),
      pluginGiphyViewer(),
      pluginHtmlViewer(),
      pluginImageViewer(),
      pluginIndentViewer(),
      pluginLineSpacingViewer(),
      pluginLinkViewer(),
      pluginLinkButtonViewer(),
      pluginLinkPreviewViewer(),
      pluginTableViewer(),
      pluginTextColorViewer(),
      pluginTextHighlightViewer(),
      pluginVideoViewer(),
    ];

    return (
      <CoreBlogPost.RichContent>
        {({ ricosViewerContent }) => {
          if (!ricosViewerContent) return null;

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              {...attributes}
              customElement={children}
              customElementProps={{ ricosViewerContent }}
            >
              <div>
                <RicosViewer
                  content={ricosViewerContent}
                  plugins={ricosPluginsForBlog}
                  theme={{ customStyles }}
                />
              </div>
            </AsChildSlot>
          );
        }}
      </CoreBlogPost.RichContent>
    );
  },
);

export interface PublishDateProps {
  asChild?: boolean;
  className?: string;
  locale: Intl.LocalesArgument;
  children?:
    | AsChildChildren<{ publishDate: string; formattedDate: string }>
    | React.ReactNode;
}

/**
 * Displays the blog post publish date with localization support.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <BlogPost.PublishDate locale="en-US" />
 *
 * // Custom styling and locale
 * <BlogPost.PublishDate
 *   locale="fr-FR"
 *   className="text-gray-500 text-sm"
 * />
 *
 * // Custom rendering with asChild
 * <BlogPost.PublishDate locale="en-US" asChild>
 *   {({ formattedDate, publishDate }) => (
 *     <time dateTime={publishDate} className="published-date">
 *       Published on {formattedDate}
 *     </time>
 *   )}
 * </BlogPost.PublishDate>
 * ```
 */
export const PublishDate = React.forwardRef<HTMLElement, PublishDateProps>(
  (props, ref) => {
    const { asChild, children, className, locale } = props;
    const { post } = usePostContext();

    const publishDate = post?.firstPublishedDate;
    if (!publishDate) return null;

    const formattedDate = new Date(publishDate).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Ensure publishDate is a string for dateTime attribute
    const dateTimeString =
      typeof publishDate === 'string' ? publishDate : publishDate.toISOString();

    const attributes = {
      'data-testid': TestIds.blogPostPublishDate,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ publishDate: dateTimeString, formattedDate }}
        content={formattedDate}
      >
        <time dateTime={dateTimeString}>{formattedDate}</time>
      </AsChildSlot>
    );
  },
);

export interface ReadingTimeProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ readingTime: number }> | React.ReactNode;
}

export const ReadingTime = React.forwardRef<HTMLElement, ReadingTimeProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { post } = usePostContext();

    const readingTime = post?.minutesToRead ?? 0;
    if (readingTime <= 0) return null;

    const attributes = {
      'data-testid': TestIds.blogPostReadingTime,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ readingTime }}
        content={readingTime}
      >
        <span>{readingTime}</span>
      </AsChildSlot>
    );
  },
);

interface PostCategoriesContextValue {
  categories: posts.Category[];
}

const PostCategoriesContext =
  React.createContext<PostCategoriesContextValue | null>(null);

export function usePostCategoriesContext(): PostCategoriesContextValue {
  const context = React.useContext(PostCategoriesContext);
  if (!context) {
    throw new Error(
      'usePostCategoriesContext must be used within a BlogPost.Categories component',
    );
  }
  return context;
}

interface CategoryContextValue {
  category: posts.Category;
}

const CategoryContext = React.createContext<CategoryContextValue | null>(null);

function useCategoryContext(): CategoryContextValue {
  const context = React.useContext(CategoryContext);
  if (!context) {
    throw new Error(
      'useCategoryContext must be used within a BlogPost.CategoryRepeater component',
    );
  }
  return context;
}

interface PostTagsContextValue {
  tags: tags.BlogTag[];
}

const PostTagsContext = React.createContext<PostTagsContextValue | null>(null);

export function usePostTagsContext(): PostTagsContextValue {
  const context = React.useContext(PostTagsContext);
  if (!context) {
    throw new Error(
      'usePostTagsContext must be used within a BlogPost.Tags component',
    );
  }
  return context;
}

interface TagContextValue {
  tag: tags.BlogTag;
}

const TagContext = React.createContext<TagContextValue | null>(null);

export function useTagContext(): TagContextValue {
  const context = React.useContext(TagContext);
  if (!context) {
    throw new Error(
      'useTagContext must be used within a BlogPost.TagRepeater component',
    );
  }
  return context;
}

export interface CategoriesProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Container for post categories that provides categories context to all child components.
 * Does not render if no categories are available.
 * Follows Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <BlogPost.Categories>
 *   <BlogPost.CategoryRepeater>
 *     <BlogPost.Category />
 *   </BlogPost.CategoryRepeater>
 * </BlogPost.Categories>
 * ```
 */
export const Categories = React.forwardRef<HTMLElement, CategoriesProps>(
  (props, ref) => {
    const { children, className } = props;
    const { post } = usePostContext();

    const categories = post?.resolvedFields?.categories || [];
    const hasCategories = categories.length > 0;

    if (!hasCategories) return null;

    const contextValue: PostCategoriesContextValue = {
      categories,
    };

    const attributes = {
      'data-testid': TestIds.blogPostCategories,
    };

    return (
      <PostCategoriesContext.Provider value={contextValue}>
        <div
          {...attributes}
          ref={ref as React.Ref<HTMLDivElement>}
          className={className}
        >
          {children}
        </div>
      </PostCategoriesContext.Provider>
    );
  },
);

export interface CategoryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that creates individual category contexts for each category.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 */
export const CategoryRepeater = React.forwardRef<
  HTMLElement,
  CategoryRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const { categories } = usePostCategoriesContext();

  if (categories.length === 0) return null;

  return (
    <>
      {categories.map((category) => {
        const contextValue: CategoryContextValue = {
          category,
        };

        return (
          <CategoryContext.Provider key={category._id} value={contextValue}>
            {children}
          </CategoryContext.Provider>
        );
      })}
    </>
  );
});

export interface CategoryLinkProps {
  asChild?: boolean;
  className?: string;
  baseUrl?: string;
  children?:
    | AsChildChildren<{ category: posts.Category; href: string }>
    | React.ReactNode;
}

export const CategoryLink = React.forwardRef<HTMLElement, CategoryLinkProps>(
  (props, ref) => {
    const { asChild, children, className, baseUrl = '' } = props;
    const { category } = useCategoryContext();

    if (!category?.label) return null;

    const href = `${baseUrl}${category.slug}`;

    const attributes = {
      'data-testid': TestIds.blogPostCategory,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ category, href }}
        content={category.label}
      >
        <a href={href}>{category.label}</a>
      </AsChildSlot>
    );
  },
);

export interface CategoryLabelProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ category: posts.Category }> | React.ReactNode;
}

export const CategoryLabel = React.forwardRef<HTMLElement, CategoryLabelProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { category } = useCategoryContext();

    if (!category?.label) return null;

    const attributes = {
      'data-testid': TestIds.blogPostCategory,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ category }}
        content={category.label}
      >
        <span>{category.label}</span>
      </AsChildSlot>
    );
  },
);

export interface TagsProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Container for post tags that provides tags context to all child components.
 * Does not render if no tags are available.
 * Follows Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <BlogPost.Tags>
 *   <BlogPost.TagRepeater>
 *     <BlogPost.Tag />
 *   </BlogPost.TagRepeater>
 * </BlogPost.Tags>
 * ```
 */
export const Tags = React.forwardRef<HTMLElement, TagsProps>((props, ref) => {
  const { children, className } = props;
  const { post } = usePostContext();

  const postTags = post?.resolvedFields?.tags || [];
  const hasTags = postTags.length > 0;

  if (!hasTags) return null;

  const contextValue: PostTagsContextValue = {
    tags: postTags,
  };

  const attributes = {
    'data-testid': TestIds.blogPostTags,
  };

  return (
    <PostTagsContext.Provider value={contextValue}>
      <div
        {...attributes}
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
      >
        {children}
      </div>
    </PostTagsContext.Provider>
  );
});

export interface TagRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that creates individual tag contexts for each tag.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 */
export const TagRepeater = React.forwardRef<HTMLElement, TagRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const { tags } = usePostTagsContext();

    if (tags.length === 0) return null;

    return (
      <>
        {tags.map((tag) => {
          const contextValue: TagContextValue = {
            tag,
          };

          return (
            <TagContext.Provider key={tag._id} value={contextValue}>
              {children}
            </TagContext.Provider>
          );
        })}
      </>
    );
  },
);

export interface TagProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ tag: tags.BlogTag }> | React.ReactNode;
}

export const Tag = React.forwardRef<HTMLElement, TagProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { tag } = useTagContext();

  if (!tag?.label) return null;

  const attributes = {
    'data-testid': TestIds.blogPostTag,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ tag }}
      content={tag.label}
    >
      <span>{tag.label}</span>
    </AsChildSlot>
  );
});

export interface AuthorNameProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ authorName: string }> | React.ReactNode;
}

export const AuthorName = React.forwardRef<HTMLElement, AuthorNameProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { post } = usePostContext();

    const owner = post?.resolvedFields?.owner;
    if (!owner) return null;

    const { authorName } = createAuthorName(owner);
    if (!authorName) return null;

    const attributes = {
      'data-testid': TestIds.blogPostAuthorName,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{
          authorName,
        }}
        content={authorName}
      >
        <span>{authorName}</span>
      </AsChildSlot>
    );
  },
);

export interface AuthorAvatarProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{
        authorNameInitials: string;
        authorAvatarUrl: string | undefined;
      }>
    | React.ReactNode;
}

export const AuthorAvatar = React.forwardRef<HTMLElement, AuthorAvatarProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { post } = usePostContext();

    const owner = post?.resolvedFields?.owner;
    if (!owner) return null;

    const [error, setError] = React.useState(false);
    const { authorAvatarInitials } = createAuthorName(owner);
    const authorAvatarUrl = owner.profile?.photo?.url;

    if (!authorAvatarInitials && !authorAvatarUrl) return null;

    const attributes = {
      'data-testid': TestIds.blogPostAuthorAvatar,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{
          authorAvatarUrl,
          authorAvatarInitials,
        }}
      >
        {authorAvatarUrl && !error ? (
          <img
            src={authorAvatarUrl}
            alt={authorAvatarInitials}
            onError={() => setError(true)}
          />
        ) : (
          <span>{authorAvatarInitials}</span>
        )}
      </AsChildSlot>
    );
  },
);

export interface ShareUrlToFacebookProps {
  href: string;
  children: (props: ShareUrlToFacebookRenderProps) => React.ReactNode;
}

export interface ShareUrlToFacebookRenderProps {
  url: string;
}

/**
 * Generates a Facebook share URL for the current blog post.
 * Follows render prop pattern for maximum flexibility.
 *
 * @component
 * @example
 * ```tsx
 * <BlogPost.ShareUrlToFacebook href={window.location.href}>
 *   {({ url }) => (
 *     <a
 *       href={url}
 *       target="_blank"
 *       rel="noopener noreferrer"
 *       className="btn-social facebook"
 *     >
 *       Share on Facebook
 *     </a>
 *   )}
 * </BlogPost.ShareUrlToFacebook>
 * ```
 */
export const ShareUrlToFacebook = (props: ShareUrlToFacebookProps) => {
  const { href } = props;

  return props.children({
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href)}`,
  });
};

export interface ShareUrlToXProps {
  href: string;
  children: (props: ShareUrlToXRenderProps) => React.ReactNode;
}

export interface ShareUrlToXRenderProps {
  url: string;
}

/**
 * Generates an X (formerly Twitter) share URL for the current blog post.
 * Follows render prop pattern for maximum flexibility.
 *
 * @component
 * @example
 * ```tsx
 * <BlogPost.ShareUrlToX href={window.location.href}>
 *   {({ url }) => (
 *     <a
 *       href={url}
 *       target="_blank"
 *       rel="noopener noreferrer"
 *       className="btn-social twitter"
 *     >
 *       Share on X
 *     </a>
 *   )}
 * </BlogPost.ShareUrlToX>
 * ```
 */
export const ShareUrlToX = (props: ShareUrlToXProps) => {
  const { href } = props;

  return props.children({
    url: `https://x.com/share?url=${encodeURIComponent(href)}`,
  });
};

export interface ShareUrlToLinkedInProps {
  href: string;
  children: (props: ShareUrlToLinkedInRenderProps) => React.ReactNode;
}

export interface ShareUrlToLinkedInRenderProps {
  url: string;
}

/**
 * Generates a LinkedIn share URL for the current blog post.
 * Follows render prop pattern for maximum flexibility.
 *
 * @component
 * @example
 * ```tsx
 * <BlogPost.ShareUrlToLinkedIn href={window.location.href}>
 *   {({ url }) => (
 *     <a
 *       href={url}
 *       target="_blank"
 *       rel="noopener noreferrer"
 *       className="btn-social linkedin"
 *     >
 *       Share on LinkedIn
 *     </a>
 *   )}
 * </BlogPost.ShareUrlToLinkedIn>
 * ```
 */
export const ShareUrlToLinkedIn = (props: ShareUrlToLinkedInProps) => {
  const { href } = props;

  return props.children({
    url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(href)}`,
  });
};
