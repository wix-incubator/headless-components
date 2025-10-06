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
 *     <ScrollableTabs>
 *       <FilterOptionRepeater>
 *         <FilterOptionSingle variant="tabs" />
 *       </FilterOptionRepeater>
 *     </ScrollableTabs>
 *   </FilterOptions>
 * ```
 */
export const ScrollableTabs = forwardRef<HTMLDivElement, ScrollableTabsProps>(
  ({ children, className }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkForOverflow = () => {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current!;

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    };

    const scroll = (direction: ScrollDirection) => {
      const { clientWidth, scrollBy } = scrollContainerRef.current!;
      const scrollAmount = clientWidth * 0.8;

      scrollBy({
        left: direction === ScrollDirection.LEFT ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    };

    useEffect(() => {
      checkForOverflow();
    }, []);

    return (
      <div
        ref={ref}
        className={cn('group relative', className)}
        data-right-arrow-visible={showRightArrow}
        data-left-arrow-visible={showLeftArrow}
      >
        <button
          className={
            'absolute left-0 top-0 bottom-0 z-1 group-data-[left-arrow-visible=true]:opacity-100 group-data-[left-arrow-visible=false]:opacity-0 transition-opacity duration-300 bg-background/80'
          }
          aria-label="Scroll left"
          onClick={() => scroll(ScrollDirection.LEFT)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              className="text-foreground"
              fill="currentColor"
              d="M10.8448202,5.14270801 C11.0394183,5.33600267 11.0404716,5.64963633 10.8476779,5.84372938 L7.71273205,8.99980356 L10.8488003,12.1634729 C11.0414976,12.3578663 11.0408107,12.6714558 10.8472635,12.865003 C10.6532807,13.0582298 10.3404929,13.0576181 10.1479487,12.8643191 L6.29891136,9.00019644 L10.1421589,5.14494052 C10.3357619,4.95073257 10.649987,4.9497342 10.8448202,5.14270801 Z"
            />
          </svg>
        </button>

        <button
          className={
            'absolute right-0 top-0 bottom-0 z-1 group-data-[right-arrow-visible=true]:opacity-100 group-data-[right-arrow-visible=false]:opacity-0 transition-opacity duration-300 bg-background/80'
          }
          aria-label="Scroll right"
          onClick={() => scroll(ScrollDirection.RIGHT)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              className="text-foreground"
              fill="currentColor"
              d="M7.85366656,5.14812687 L11.7010886,9.00019644 L7.84883812,12.8545114 C7.65549651,13.047853 7.34217977,13.047853 7.14893188,12.8546051 C6.95549906,12.6611723 6.95512999,12.3476697 7.14810684,12.153782 L10.287268,8.99980356 L7.14821587,5.8468489 C6.95542094,5.6532001 6.95611314,5.33992556 7.14976194,5.14713064 C7.15006407,5.14682984 7.15036659,5.14652943 7.1506695,5.14622941 C7.34555703,4.95320179 7.65982386,4.95405003 7.85366656,5.14812687 Z"
            />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={checkForOverflow}
        >
          <div className="min-w-max">{children}</div>
        </div>
      </div>
    );
  }
);

ScrollableTabs.displayName = 'ScrollableTabs';
