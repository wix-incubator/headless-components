import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ScrollableTabsProps {
  children: React.ReactNode;
  className?: string;
}

enum ScrollDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

/**
 * ScrollableTabs component that provides horizontal scrolling with navigation arrows
 * when tabs exceed the width of their container.
 *
 * @component
 * @example
 * ```tsx
 *   <FilterOptions>
 *     <FilterOptionRepeater>
 *       <ScrollableTabs>
 *         <FilterOptionSingle variant="tabs" />
 *       </ScrollableTabs>
 *     </FilterOptionRepeater>
 *   </FilterOptions>
 * ```
 */
export const ScrollableTabs = forwardRef<HTMLDivElement, ScrollableTabsProps>(
  ({ children, className }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [arrows, setArrows] = useState<{ left: boolean; right: boolean }>({
      left: false,
      right: false,
    });

    const checkForOverflow = () => {
      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = container;

      setArrows({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1,
      });
    };

    useEffect(() => {
      checkForOverflow();

      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }

      const resizeObserver = new ResizeObserver(checkForOverflow);
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const scroll = (direction: ScrollDirection) => {
      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }

      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === ScrollDirection.LEFT ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    };

    return (
      <div ref={ref} className={cn('relative', className)}>
        <button
          onClick={() => scroll(ScrollDirection.LEFT)}
          className={cn(
            `absolute left-0 top-0 bottom-0 z-10 ${arrows.left ? 'opacity-100' : 'opacity-0'}`,
            'transition-opacity duration-300',
            'bg-background/80 backdrop-blur-sm'
          )}
          aria-label="Scroll left"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        <button
          onClick={() => scroll(ScrollDirection.RIGHT)}
          className={cn(
            `absolute right-0 top-0 bottom-0 z-10 ${arrows.right ? 'opacity-100' : 'opacity-0'}`,
            'transition-opacity duration-300',
            'bg-background/80 backdrop-blur-sm'
          )}
          aria-label="Scroll right"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onScroll={checkForOverflow}
        >
          <div className="min-w-max">{children}</div>
        </div>
      </div>
    );
  }
);

ScrollableTabs.displayName = 'ScrollableTabs';
