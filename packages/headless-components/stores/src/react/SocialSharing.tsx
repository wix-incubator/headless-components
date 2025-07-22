import React from "react";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import {
  SocialSharingServiceDefinition,
  type SharingPlatform,
} from "../services/social-sharing-service.js";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

/**
 * Props for Root headless component
 */
export interface RootProps {
  /** Render prop function that receives sharing data */
  children: (props: RootRenderProps) => React.ReactNode;
}

/**
 * Render props for Root component
 */
export interface RootRenderProps {
  /** Available sharing platforms */
  platforms: SharingPlatform[];
  /** Total share count */
  shareCount: number;
  /** Last shared platform */
  lastShared: string | null;
  /** Share to Facebook */
  shareFacebook: (url: string, title: string, description?: string) => void;
  /** Share to Twitter */
  shareTwitter: (url: string, text: string, hashtags?: string[]) => void;
  /** Share to LinkedIn */
  shareLinkedIn: (url: string, title: string, summary?: string) => void;
  /** Share to WhatsApp */
  shareWhatsApp: (url: string, text: string) => void;
  /** Share via Email */
  shareEmail: (url: string, subject: string, body: string) => void;
  /** Copy to clipboard */
  copyLink: (url: string) => Promise<boolean>;
  /** Native share API */
  shareNative: (data: {
    title: string;
    text: string;
    url: string;
  }) => Promise<boolean>;
}

/**
 * Headless component for social sharing root
 *
 * @component
 * @example
 * ```tsx
 * import { SocialSharing } from '@wix/stores/components';
 *
 * function ShareProduct() {
 *   const productUrl = 'https://example.com/product/123';
 *   const productTitle = 'Amazing Product';
 *
 *   return (
 *     <SocialSharing.Root>
 *       {({ platforms, shareCount, shareFacebook, shareTwitter, copyLink, shareNative }) => (
 *         <div>
 *           <p>Share this product ({shareCount} shares)</p>
 *           <div className="share-buttons">
 *             <button onClick={() => shareFacebook(productUrl, productTitle)}>
 *               Share on Facebook
 *             </button>
 *             <button onClick={() => shareTwitter(productUrl, `Check out ${productTitle}!`)}>
 *               Share on Twitter
 *             </button>
 *             <button onClick={() => copyLink(productUrl)}>
 *               Copy Link
 *             </button>
 *             <button onClick={() => shareNative({
 *               title: productTitle,
 *               text: 'Check this out!',
 *               url: productUrl
 *             })}>
 *               Share
 *             </button>
 *           </div>
 *         </div>
 *       )}
 *     </SocialSharing.Root>
 *   );
 * }
 * ```
 */
export const Root = (props: RootProps) => {
  const service = useService(SocialSharingServiceDefinition) as ServiceAPI<
    typeof SocialSharingServiceDefinition
  >;
  const signalsService = useService(SignalsServiceDefinition);

  const [platforms, setPlatforms] = React.useState<SharingPlatform[]>([]);
  const [shareCount, setShareCount] = React.useState(0);
  const [lastShared, setLastShared] = React.useState<string | null>(null);

  React.useEffect(() => {
    const effects = [
      signalsService.effect(() => {
        setPlatforms(service.availablePlatforms.get());
      }),
      signalsService.effect(() => {
        setShareCount(service.shareCount.get());
      }),
      signalsService.effect(() => {
        setLastShared(service.lastSharedPlatform.get());
      }),
    ];

    return () => effects.forEach((dispose) => dispose());
  }, [service, signalsService]);

  return props.children({
    platforms,
    shareCount,
    lastShared,
    shareFacebook: service.shareToFacebook,
    shareTwitter: service.shareToTwitter,
    shareLinkedIn: service.shareToLinkedIn,
    shareWhatsApp: service.shareToWhatsApp,
    shareEmail: service.shareToEmail,
    copyLink: service.copyToClipboard,
    shareNative: service.shareNative,
  });
};

/**
 * Props for Platform headless component
 */
export interface PlatformProps {
  /** Platform data */
  platform: SharingPlatform;
  /** Click handler */
  onClick: () => void;
  /** Render prop function that receives platform data */
  children: (props: PlatformRenderProps) => React.ReactNode;
}

/**
 * Render props for Platform component
 */
export interface PlatformRenderProps {
  /** Platform data */
  platform: SharingPlatform;
  /** Platform click handler */
  onSelect: () => void;
}

/**
 * Headless component for individual social platform
 *
 * @component
 * @example
 * ```tsx
 * import { SocialSharing } from '@wix/stores/components';
 *
 * function SocialButton({ platform, onClick }) {
 *   return (
 *     <SocialSharing.Platform platform={platform} onClick={onClick}>
 *       {({ platform, onSelect }) => (
 *         <button
 *           onClick={onSelect}
 *           className={`social-btn social-btn-${platform.name.toLowerCase()}`}
 *         >
 *           <span className="icon">{platform.icon}</span>
 *           Share on {platform.name}
 *         </button>
 *       )}
 *     </SocialSharing.Platform>
 *   );
 * }
 * ```
 */
export const Platform = (props: PlatformProps) => {
  const { platform, onClick } = props;

  return props.children({
    platform,
    onSelect: onClick,
  });
};

/**
 * Props for Platforms headless component
 */
export interface PlatformsProps {
  /** URL to share */
  url: string;
  /** Share title */
  title: string;
  /** Share description */
  description?: string;
  /** Hashtags for sharing */
  hashtags?: string[];
  /** Render prop function that receives platforms data */
  children: (props: PlatformsRenderProps) => React.ReactNode;
}

/**
 * Render props for Platforms component
 */
export interface PlatformsRenderProps {
  /** Available platforms */
  platforms: SharingPlatform[];
  /** Share to Facebook */
  shareFacebook: () => void;
  /** Share to Twitter */
  shareTwitter: () => void;
  /** Share to LinkedIn */
  shareLinkedIn: () => void;
  /** Share to WhatsApp */
  shareWhatsApp: () => void;
  /** Share via Email */
  shareEmail: () => void;
  /** Copy link to clipboard */
  copyLink: () => Promise<boolean>;
  /** Share natively */
  shareNative: () => Promise<boolean>;
}

/**
 * Headless component for social sharing platforms with logic
 *
 * @component
 * @example
 * ```tsx
 * import { SocialSharing } from '@wix/stores/components';
 *
 * function SocialShareButtons() {
 *   return (
 *     <SocialSharing.Platforms
 *       url="https://example.com/product/123"
 *       title="Amazing Product"
 *       description="Check out this amazing product!"
 *       hashtags={['product', 'amazing']}
 *     >
 *       {({ platforms, shareFacebook, shareTwitter, shareLinkedIn, copyLink, shareNative }) => (
 *         <div className="social-platforms">
 *           <button onClick={shareFacebook}>Share on Facebook</button>
 *           <button onClick={shareTwitter}>Share on Twitter</button>
 *           <button onClick={shareLinkedIn}>Share on LinkedIn</button>
 *           <button onClick={() => copyLink()}>Copy Link</button>
 *           <button onClick={() => shareNative()}>Share</button>
 *         </div>
 *       )}
 *     </SocialSharing.Platforms>
 *   );
 * }
 * ```
 */
export const Platforms = (props: PlatformsProps) => {
  const { url, title, description = "", hashtags = [] } = props;

  const service = useService(SocialSharingServiceDefinition) as ServiceAPI<
    typeof SocialSharingServiceDefinition
  >;
  const signalsService = useService(SignalsServiceDefinition);

  const [platforms, setPlatforms] = React.useState<SharingPlatform[]>([]);

  React.useEffect(() => {
    const dispose = signalsService.effect(() => {
      setPlatforms(service.availablePlatforms.get());
    });
    return dispose;
  }, [service, signalsService]);

  const shareFacebook = () => service.shareToFacebook(url, title, description);
  const shareTwitter = () => service.shareToTwitter(url, title, hashtags);
  const shareLinkedIn = () => service.shareToLinkedIn(url, title, description);
  const shareWhatsApp = () =>
    service.shareToWhatsApp(url, `${title} - ${description}`);
  const shareEmail = () => service.shareToEmail(url, title, description);
  const copyLink = () => service.copyToClipboard(url);
  const shareNative = () =>
    service.shareNative({ title, text: description, url });

  return props.children({
    platforms,
    shareFacebook,
    shareTwitter,
    shareLinkedIn,
    shareWhatsApp,
    shareEmail,
    copyLink,
    shareNative,
  });
};
