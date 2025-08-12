import { MediaGallery as MediaGalleryRadix } from "@wix/headless-media/react";

export const Next = () => {
  return <MediaGalleryRadix.Next className="absolute right-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full transition-all" asChild>
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </MediaGalleryRadix.Next>
}
