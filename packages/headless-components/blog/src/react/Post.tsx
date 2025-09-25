import { posts, tags } from '@wix/blog';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import type { members } from '@wix/members';
import React from 'react';
import type { PostWithResolvedFields } from '../services/blog-feed-service.js';
import * as BlogCategories from './Categories.js';
import * as CoreBlogPost from './core/Post.js';

import { createServicesMap } from '@wix/services-manager';
import { WixServices } from '@wix/services-manager-react';
import {
  BlogPostService,
  BlogPostServiceDefinition,
  type BlogPostServiceConfig,
} from '../services/blog-post-service.js';
import { isValidChildren } from './helpers.js';

/** https://manage.wix.com/apps/14bcded7-0066-7c35-14d7-466cb3f09103/extensions/dynamic/wix-vibe-component?component-id=cb293890-7b26-4bcf-8c87-64f624c59158 */
const HTML_CODE_TAG = 'blog.post';

interface PostContextValue {
  post: PostWithResolvedFields | null;
  coverImageUrl?: string;
}

const PostContext = React.createContext<PostContextValue | null>(null);

PostContext.displayName = 'Blog.Post.PostContext';

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
  blogPostLink = 'blog-post-link',
  blogPostTitle = 'blog-post-title',
  blogPostExcerpt = 'blog-post-excerpt',
  blogPostContent = 'blog-post-content',
  blogPostCoverImage = 'blog-post-cover-image',
  blogPostAuthor = 'blog-post-author',
  blogPostAuthorName = 'blog-post-author-name',
  blogPostAuthorAvatar = 'blog-post-author-avatar',
  blogPostPublishDate = 'blog-post-publish-date',
  blogPostReadingTime = 'blog-post-reading-time',
  blogPostCategories = 'blog-post-categories',
  blogPostTags = 'blog-post-tags',
}

export interface BlogPostRootProps {
  asChild?: boolean;
  className?: string;
  children: AsChildChildren<{ post: PostWithResolvedFields }> | React.ReactNode;
  post?: PostWithResolvedFields;
  blogPostServiceConfig?: BlogPostServiceConfig;
  /** Fallback image url to use when the post cover image is not available */
  fallbackImageUrl?: string;
  /** Content to render when no post is available */
  emptyState?: React.ReactNode;
}

/**
 * Root container for blog post that provides post context to all child components.
 * Supports both service-driven and prop-driven post data.
 * Follows Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * import { Blog } from '@wix/blog/components';
 * import { RicosViewer } from '@/components/ui/ricos-viewer';
 *
 * // Service-driven (gets post from BlogPostService)
 * function BlogPostPage() {
 *   return (
 *     <Blog.Post.Root emptyState={<div>Post not found</div>}>
 *       <article>
 *         <Blog.Post.Title />
 *         <Blog.Post.PublishDate locale="en-US" />
 *         <Blog.Post.Content>
 *           {RicosViewer}
 *         </Blog.Post.Content>
 *         <Blog.Post.Tags>
 *           <Blog.Post.TagRepeater>
 *             <Blog.Post.Tag />
 *           </Blog.Post.TagRepeater>
 *         </Blog.Post.Tags>
 *         <Blog.Post.Categories>
 *           <Blog.Post.CategoryRepeater>
 *             <Blog.Categories.Link baseUrl="/category/" />
 *           </Blog.Post.CategoryRepeater>
 *         </Blog.Post.Categories>
 *         <Blog.Post.AuthorName />
 *         <Blog.Post.AuthorAvatar />
 *         <Blog.Post.ShareUrlToFacebook href={location.href} />
 *         <Blog.Post.ShareUrlToX href={location.href} />
 *         <Blog.Post.ShareUrlToLinkedIn href={location.href} />
 *       </article>
 *     </Blog.Post.Root>
 *   );
 * }
 *
 * // Prop-driven (provide post data directly)
 * function BlogPostCard({ post }) {
 *   return (
 *     <Blog.Post.Root post={post} emptyState={<div>Post not found</div>}>
 *       <article>
 *         ... same as service-driven example
 *       </article>
 *     </Blog.Post.Root>
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
      fallbackImageUrl,
      blogPostServiceConfig,
    } = props;

    const renderRoot = (post: PostWithResolvedFields) => {
      const contextValue: PostContextValue = {
        post,
        coverImageUrl: post?.resolvedFields?.coverImageUrl || fallbackImageUrl,
      };
      const attributes = {
        'data-component-tag': HTML_CODE_TAG,
        'data-testid': TestIds.blogPostRoot,
        'data-post-id': post._id,
        'data-post-slug': post.slug,
        'data-post-pinned': post.pinned,
        'data-has-cover-image': !!contextValue.coverImageUrl,
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
      <WixServices
        servicesMap={createServicesMap().addService(
          BlogPostServiceDefinition,
          BlogPostService,
          blogPostServiceConfig,
        )}
      >
        <CoreBlogPost.Root>
          {({ post }) => {
            if (!post) {
              return emptyState || null;
            }

            return renderRoot(post);
          }}
        </CoreBlogPost.Root>
      </WixServices>
    );
  },
);

Root.displayName = 'Blog.Post.Root';

export interface CoverImageProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{ imageUrl: string; alt: string }>
    | React.ReactNode;
}

export const CoverImage = React.forwardRef<HTMLElement, CoverImageProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { post, coverImageUrl } = usePostContext();

    const alt = post?.resolvedFields?.coverImageAlt || post?.title || '';

    if (!coverImageUrl) return null;

    const attributes = {
      'data-testid': TestIds.blogPostCoverImage,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ imageUrl: coverImageUrl, alt }}
      >
        <img src={coverImageUrl} alt={alt} />
      </AsChildSlot>
    );
  },
);

CoverImage.displayName = 'Blog.Post.CoverImage';

export interface LinkProps {
  asChild?: boolean;
  className?: string;
  /** Prepended to the slug to form the full URL */
  baseUrl?: string;
  children?: AsChildChildren<{ href: string; slug: string }> | React.ReactNode;
}

/**
 * Creates a link to the full blog post with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default link
 * <Blog.Post.Link baseUrl="/blog/" />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Link baseUrl="/blog/" asChild>
 *   {({ href }) => (
 *     <Link to={href} className="block hover:shadow-lg transition-shadow">
 *       <Blog.Post.Title />
 *       <Blog.Post.Excerpt />
 *     </Link>
 *   )}
 * </Blog.Post.Link>
 * ```
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const { asChild, children, className, baseUrl = '' } = props;
    const { post } = usePostContext();

    const slug = post?.slug;
    if (!slug) return null;

    const href = `${baseUrl}${slug}`;

    const attributes = {
      'data-testid': TestIds.blogPostLink,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ href, slug }}
        content={children}
      >
        <a href={href}>{isValidChildren(children) ? children : slug}</a>
      </AsChildSlot>
    );
  },
);

Link.displayName = 'Blog.Post.Link';

export interface ExcerptProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ excerpt: string }> | React.ReactNode;
}

/**
 * Displays the post excerpt within feed context.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Excerpt />
 *
 * // Custom styling with line clamping
 * <Blog.Post.Excerpt className="text-gray-600 line-clamp-3" />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Excerpt asChild>
 *   {({ excerpt }) => (
 *     <p className="post-excerpt">{excerpt.substring(0, 100)}...</p>
 *   )}
 * </Blog.Post.Excerpt>
 * ```
 */
export const Excerpt = React.forwardRef<HTMLElement, ExcerptProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { post } = usePostContext();

    if (!post?.excerpt) return null;

    const excerpt = post.excerpt;
    const attributes = {
      'data-testid': TestIds.blogPostExcerpt,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ excerpt }}
        content={excerpt}
      >
        <p>{excerpt}</p>
      </AsChildSlot>
    );
  },
);

Excerpt.displayName = 'Blog.Post.Excerpt';

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
 * <Blog.Post.Title />
 *
 * // Custom styling
 * <Blog.Post.Title className="text-4xl font-bold text-gray-900" />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Title asChild>
 *   {({ title }) => <h1 className="blog-title">{title}</h1>}
 * </Blog.Post.Title>
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

Title.displayName = 'Blog.Post.Title';

export interface ContentProps {
  className?: string;
  children:
    | AsChildChildren<{ content: any; pricingPlanIds: string[] }>
    | React.ReactElement<{ content: any }>;
}
/**
 * Exposes blog post rich content
 *
 * @component
 * @example
 * ```tsx
 * import { RicosViewer } from '@/components/ui/ricos-viewer';
 *
 * // Default rendering with built-in Ricos viewer
 * <Blog.Post.Content>
 *   {RicosViewer}
 * </Blog.Post.Content>
 *
 * // Custom styling
 * <Blog.Post.Content className="prose max-w-[60ch] mx-auto">
 *   {RicosViewer}
 * </Blog.Post.Content>
 *
 * // Custom rendering with asChild
 * <Blog.Post.Content asChild>
 *   {({ content }) => (
 *     <div className="custom-content-wrapper">
 *       <RicosViewer content={content} />
 *     </div>
 *   )}
 * </Blog.Post.Content>
 * ```
 */
export const Content = React.forwardRef<HTMLElement, ContentProps>(
  (props, ref) => {
    const { children, className } = props;
    const asChild = true;

    const attributes = {
      'data-testid': TestIds.blogPostContent,
    };

    return (
      <CoreBlogPost.RichContent>
        {({ content, pricingPlanIds }) => {
          if (!content) return null;

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              {...attributes}
              customElement={children}
              customElementProps={{ content, pricingPlanIds }}
            ></AsChildSlot>
          );
        }}
      </CoreBlogPost.RichContent>
    );
  },
);

Content.displayName = 'Blog.Post.Content';

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
 * <Blog.Post.PublishDate locale="en-US" />
 *
 * // Custom styling and locale
 * <Blog.Post.PublishDate
 *   locale="fr-FR"
 *   className="text-gray-500 text-sm"
 * />
 *
 * // Custom rendering with asChild
 * <Blog.Post.PublishDate locale="en-US" asChild>
 *   {({ formattedDate, publishDate }) => (
 *     <time dateTime={publishDate} className="published-date">
 *       Published on {formattedDate}
 *     </time>
 *   )}
 * </Blog.Post.PublishDate>
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

PublishDate.displayName = 'Blog.Post.PublishDate';

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

ReadingTime.displayName = 'Blog.Post.ReadingTime';

interface PostCategoriesContextValue {
  categories: posts.Category[];
}

const PostCategoriesContext =
  React.createContext<PostCategoriesContextValue | null>(null);

PostCategoriesContext.displayName = 'Blog.Post.PostCategoriesContext';

export function usePostCategoriesContext(): PostCategoriesContextValue {
  const context = React.useContext(PostCategoriesContext);
  if (!context) {
    throw new Error(
      'usePostCategoriesContext must be used within a BlogPost.Categories component',
    );
  }
  return context;
}

interface CategoryRepeaterContextValue {
  category: posts.Category;
  index: number;
  amount: number;
}

const CategoryRepeaterContext =
  React.createContext<CategoryRepeaterContextValue | null>(null);

CategoryRepeaterContext.displayName = 'Blog.Post.CategoryRepeaterContext';

export function useCategoryRepeaterContext(): CategoryRepeaterContextValue {
  const context = React.useContext(CategoryRepeaterContext);
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

PostTagsContext.displayName = 'Blog.Post.PostTagsContext';

export function usePostTagsContext(): PostTagsContextValue {
  const context = React.useContext(PostTagsContext);
  if (!context) {
    throw new Error(
      'usePostTagsContext must be used within a BlogPost.Tags component',
    );
  }
  return context;
}

interface TagRepeaterContextValue {
  tag: tags.BlogTag;
  index: number;
  amount: number;
}

const TagRepeaterContext = React.createContext<TagRepeaterContextValue | null>(
  null,
);

TagRepeaterContext.displayName = 'Blog.Post.TagRepeaterContext';

export function useTagRepeaterContext(): TagRepeaterContextValue {
  const context = React.useContext(TagRepeaterContext);
  if (!context) {
    throw new Error(
      'useTagContext must be used within a BlogPost.TagRepeater component',
    );
  }
  return context;
}

export interface CategoryItemsProps {
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
 * <Blog.Post.CategoryItems>
 *   <Blog.Post.CategoryRepeater>
 *     <Blog.Categories.Label />
 *   </Blog.Post.CategoryRepeater>
 * </Blog.Post.CategoryItems>
 * ```
 */
export const CategoryItems = React.forwardRef<HTMLElement, CategoryItemsProps>(
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
        <BlogCategories.Root categories={categories} asChild>
          <div
            {...attributes}
            ref={ref as React.Ref<HTMLDivElement>}
            className={className}
          >
            {children}
          </div>
        </BlogCategories.Root>
      </PostCategoriesContext.Provider>
    );
  },
);

CategoryItems.displayName = 'Blog.Post.Categories';

export interface TagItemsProps {
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
 * <Blog.Post.TagItems>
 *   <Blog.Post.TagRepeater>
 *     <Blog.Tag.Label />
 *   </Blog.Post.TagRepeater>
 * </Blog.Post.TagItems>
 * ```
 */
export const TagItems = React.forwardRef<HTMLElement, TagItemsProps>(
  (props, ref) => {
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
  },
);

TagItems.displayName = 'Blog.Post.Tags';

export interface TagItemRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that creates individual tag contexts for each tag.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Post.TagItems>
 *   <Blog.Post.TagItemRepeater>
 *     <Blog.Tag.Label />
 *   </Blog.Post.TagItemRepeater>
 * </Blog.Post.TagItems>
 * ```
 */
export const TagItemRepeater = React.forwardRef<
  HTMLElement,
  TagItemRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const { tags } = usePostTagsContext();

  if (tags.length === 0) return null;

  return (
    <>
      {tags.map((tag, index) => {
        const contextValue: TagRepeaterContextValue = {
          tag,
          index,
          amount: tags.length,
        };

        return (
          <TagRepeaterContext.Provider key={tag._id} value={contextValue}>
            {children}
          </TagRepeaterContext.Provider>
        );
      })}
    </>
  );
});

TagItemRepeater.displayName = 'Blog.Post.TagRepeater';

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

AuthorName.displayName = 'Blog.Post.AuthorName';

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
    const [error, setError] = React.useState(false);
    const onError = React.useCallback(() => setError(true), []);

    const owner = post?.resolvedFields?.owner;
    if (!owner) return null;

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
            onError={onError}
          />
        ) : (
          <span>{authorAvatarInitials}</span>
        )}
      </AsChildSlot>
    );
  },
);

AuthorAvatar.displayName = 'Blog.Post.AuthorAvatar';

/**
 * Helper function to create author name from member data
 */
function createAuthorName(owner: members.Member | null | undefined): {
  authorName: string;
  authorAvatarInitials: string;
} {
  const formattedFirstName = owner?.contact?.firstName?.trim();
  const formattedLastName = owner?.contact?.lastName?.trim();
  const nickname = owner?.profile?.nickname?.trim();

  const authorName =
    nickname ||
    `${formattedFirstName || ''} ${formattedLastName || ''}`.trim() ||
    '';

  const authorAvatarInitials = authorName
    ?.split(' ')
    .map((name) => name[0]?.toLocaleUpperCase())
    .filter((char) => char && /[A-Z]/i.test(char))
    .join('');

  return {
    authorName,
    authorAvatarInitials,
  };
}
