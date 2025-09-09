import React from 'react';

interface ShareUrlToFacebookProps {
  href: string;
  children: (props: ShareUrlToFacebookRenderProps) => React.ReactNode;
}

interface ShareUrlToFacebookRenderProps {
  url: string;
}

/**
 * Generates a Facebook share URL for the current blog post.
 * Follows render prop pattern for maximum flexibility.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Post.ShareUrlToFacebook href={window.location.href}>
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
 * </Blog.Post.ShareUrlToFacebook>
 * ```
 */
const ShareUrlToFacebook = (props: ShareUrlToFacebookProps) => {
  const { href } = props;

  return props.children({
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href)}`,
  });
};

interface ShareUrlToXProps {
  href: string;
  children: (props: ShareUrlToXRenderProps) => React.ReactNode;
}

interface ShareUrlToXRenderProps {
  url: string;
}

/**
 * Generates an X (formerly Twitter) share URL for the current blog post.
 * Follows render prop pattern for maximum flexibility.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Post.ShareUrlToX href={window.location.href}>
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
 * </Blog.Post.ShareUrlToX>
 * ```
 */
const ShareUrlToX = (props: ShareUrlToXProps) => {
  const { href } = props;

  return props.children({
    url: `https://x.com/share?url=${encodeURIComponent(href)}`,
  });
};

interface ShareUrlToLinkedInProps {
  href: string;
  children: (props: ShareUrlToLinkedInRenderProps) => React.ReactNode;
}

interface ShareUrlToLinkedInRenderProps {
  url: string;
}

/**
 * Generates a LinkedIn share URL for the current blog post.
 * Follows render prop pattern for maximum flexibility.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Post.ShareUrlToLinkedIn href={window.location.href}>
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
 * </Blog.Post.ShareUrlToLinkedIn>
 * ```
 */
const ShareUrlToLinkedIn = (props: ShareUrlToLinkedInProps) => {
  const { href } = props;

  return props.children({
    url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(href)}`,
  });
};

interface ShareUrlToClipboardProps {
  href: string;
  children: (props: ShareUrlToClipboardRenderProps) => React.ReactNode;
}

interface ShareUrlToClipboardRenderProps {
  copyToClipboard: () => Promise<void>;
  isCopied: boolean;
}

/**
 * Provides clipboard functionality for copying the current blog post URL.
 * Includes copy feedback state and error handling.
 * Follows render prop pattern for maximum flexibility.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Post.ShareUrlToClipboard href={window.location.href}>
 *   {({ copyToClipboard, isCopied }) => (
 *     <button
 *       onClick={copyToClipboard}
 *       className="btn-social clipboard"
 *       disabled={isCopied}
 *     >
 *       {isCopied ? 'Copied!' : 'Copy Link'}
 *     </button>
 *   )}
 * </Blog.Post.ShareUrlToClipboard>
 * ```
 */
const ShareUrlToClipboard = (props: ShareUrlToClipboardProps) => {
  const { href, children } = props;
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(href);
      setIsCopied(true);

      // Reset copied state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000) as unknown as number;
    } catch (error) {
      console.error('Failed to copy URL to clipboard:', error);
    }
  }, [href]);

  return children({
    copyToClipboard,
    isCopied,
  });
};

const ShareUrl = {
  Facebook: ShareUrlToFacebook,
  X: ShareUrlToX,
  LinkedIn: ShareUrlToLinkedIn,
  Clipboard: ShareUrlToClipboard,
};

export default ShareUrl;
