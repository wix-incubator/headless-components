import React from 'react';

type BiLogger = {
  report: (event: { evid: number; src: number; params: Record<string, any> }) => void;
};

declare global {
  interface Window {
    wixBi?: BiLogger;
  }
}

function createEnhancedBiLogger(baseLogger: BiLogger) {
  type ReadingTimePayload = {
    percent_scrolled: number;
    browser_width: number;
    view_start: string;
    timediff: number;
    scrollable_heights: number;
    scrolled_bottom: number;
    scrolled_top: number;
    bottom_position: number;
    top_position: number;
    reading_session_id: string;
    post_stable_id: string;
    is_demo: boolean;
    screen_name: string;
  };

  type ActiveTabChangePayload = {
    is_on: boolean;
    reading_session_id: string;
    post_stable_id: string;
  };

  function isInEditor() {
    // use iframe detection to check if we are in the editor
    try {
      return window.self !== window.top;
    } catch (e) {
      // Handle DOMException: Blocked a frame with origin "..." from accessing a cross-origin frame.
      return true;
    }
  }

  return {
    readingTime: ({
      readingStartTime,
      contentContainer,
      reading_session_id,
      post_stable_id,
    }: {
      readingStartTime: Date;
      contentContainer?: HTMLDivElement | null;
      reading_session_id: string;
      post_stable_id: string;
    }) => {
      if (isInEditor()) {
        return;
      }

      function calculateReadingTimeProps({
        readingStartTime,
        contentContainer,
      }: {
        readingStartTime: Date;
        contentContainer?: HTMLDivElement | null;
      }): Omit<ReadingTimePayload, 'reading_session_id' | 'post_stable_id'> | undefined {
        if (
          typeof window === 'undefined' ||
          typeof document === 'undefined' ||
          !document.documentElement
        ) {
          return undefined;
        }

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollY = window.scrollY;
        const innerHeight = window.innerHeight;
        const innerWidth = window.innerWidth;
        const scrollableHeight = scrollHeight - innerHeight;

        if (scrollableHeight <= 0) {
          return undefined;
        }

        const contentContainerRect = contentContainer?.getBoundingClientRect();

        return {
          is_demo: false,
          screen_name: 'Vibe: Post Content',
          scrolled_top: Math.round(scrollY),
          scrolled_bottom: Math.round(scrollY + innerHeight),
          top_position: contentContainerRect ? Math.round(contentContainerRect.top + scrollY) : 0,
          bottom_position: contentContainerRect
            ? Math.round(contentContainerRect.bottom + scrollY)
            : 0,
          browser_width: innerWidth,
          scrollable_heights: scrollableHeight,
          percent_scrolled: Math.round((scrollY / scrollableHeight) * 100),
          view_start: readingStartTime.toISOString(),
          timediff: Date.now() - readingStartTime.getTime(),
        };
      }

      const readingTimeStats = calculateReadingTimeProps({
        readingStartTime,
        contentContainer,
      });

      if (!readingTimeStats) {
        return;
      }

      const params: ReadingTimePayload = {
        ...readingTimeStats,
        reading_session_id,
        post_stable_id,
      };

      baseLogger.report({
        evid: 2101,
        src: 69,
        params,
      });
    },
    activeTabChange: (params: ActiveTabChangePayload) => {
      if (isInEditor()) {
        return;
      }

      baseLogger.report({ evid: 2102, src: 69, params });
    },
  };
}

type EnhancedBiLogger = ReturnType<typeof createEnhancedBiLogger>;

export const useBiLogger = (): EnhancedBiLogger | null => {
  const [biLogger, setBiLogger] = React.useState<EnhancedBiLogger | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.wixBi) {
      setBiLogger(createEnhancedBiLogger(window.wixBi));
    }
  }, []);

  return biLogger;
};
