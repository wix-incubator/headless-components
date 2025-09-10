import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GenericList } from './generic-list';

// Test data
const mockItems = [
  { id: '1', name: 'Item 1', category: 'A' },
  { id: '2', name: 'Item 2', category: 'B' },
  { id: '3', name: 'Item 3', category: 'A' },
];

describe('GenericList', () => {
  describe('GenericList.Root', () => {
    it('should render with basic props', () => {
      render(
        <GenericList.Root items={mockItems}>
          <div data-testid="content">List content</div>
        </GenericList.Root>,
      );

      const root = screen.getByTestId('generic-list-root');
      expect(root).toBeInTheDocument();
      expect(root).toHaveAttribute('data-variant', 'list');
      expect(root).toHaveAttribute('data-has-items', 'true');
      expect(root).toHaveAttribute('data-is-loading', 'false');
      expect(root).toHaveAttribute('data-has-more', 'false');

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should render with custom variant and loading state', () => {
      render(
        <GenericList.Root
          items={mockItems}
          variant="grid"
          isLoading={true}
          hasMore={true}
        >
          <div>Content</div>
        </GenericList.Root>,
      );

      const root = screen.getByTestId('generic-list-root');
      expect(root).toHaveAttribute('data-variant', 'grid');
      expect(root).toHaveAttribute('data-is-loading', 'true');
      expect(root).toHaveAttribute('data-has-more', 'true');
    });

    it('should render with asChild pattern', () => {
      render(
        <GenericList.Root items={mockItems} asChild>
          <section data-testid="custom-root">Custom root</section>
        </GenericList.Root>,
      );

      const customRoot = screen.getByTestId('custom-root');
      expect(customRoot).toBeInTheDocument();
      expect(customRoot).toHaveAttribute('data-testid', 'generic-list-root');
      expect(customRoot.tagName).toBe('SECTION');
    });

    it('should handle empty items array', () => {
      render(
        <GenericList.Root items={[]}>
          <div>Content</div>
        </GenericList.Root>,
      );

      const root = screen.getByTestId('generic-list-root');
      expect(root).toHaveAttribute('data-has-items', 'false');
    });
  });

  describe('GenericList.Items', () => {
    it('should render children when items exist', () => {
      render(
        <GenericList.Root items={mockItems}>
          <GenericList.Items>
            <div data-testid="items-content">Items content</div>
          </GenericList.Items>
        </GenericList.Root>,
      );

      const items = screen.getByTestId('generic-list-items');
      expect(items).toBeInTheDocument();
      expect(items).toHaveAttribute('data-variant', 'list');
      expect(items).toHaveAttribute('data-empty', 'false');

      expect(screen.getByTestId('items-content')).toBeInTheDocument();
    });

    it('should render empty state when no items', () => {
      render(
        <GenericList.Root items={[]}>
          <GenericList.Items
            emptyState={<div data-testid="empty">No items</div>}
          >
            <div data-testid="items-content">Items content</div>
          </GenericList.Items>
        </GenericList.Root>,
      );

      expect(screen.getByTestId('empty')).toBeInTheDocument();
      expect(
        screen.queryByTestId('generic-list-items'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('items-content')).not.toBeInTheDocument();
    });

    it('should return null when no items and no empty state', () => {
      const { container } = render(
        <GenericList.Root items={[]}>
          <GenericList.Items>
            <div data-testid="items-content">Items content</div>
          </GenericList.Items>
        </GenericList.Root>,
      );

      expect(
        screen.queryByTestId('generic-list-items'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('items-content')).not.toBeInTheDocument();
      // Should only contain the root div
      expect(container.firstChild?.childNodes.length).toBe(0);
    });

    it('should render with asChild pattern', () => {
      render(
        <GenericList.Root items={mockItems}>
          <GenericList.Items asChild>
            <ul data-testid="custom-items">Custom items container</ul>
          </GenericList.Items>
        </GenericList.Root>,
      );

      const customItems = screen.getByTestId('custom-items');
      expect(customItems).toBeInTheDocument();
      expect(customItems).toHaveAttribute('data-testid', 'generic-list-items');
      expect(customItems.tagName).toBe('UL');
    });
  });

  describe('GenericList.LoadMore', () => {
    it('should render when hasMore is true', () => {
      const onLoadMore = vi.fn();

      render(
        <GenericList.Root
          items={mockItems}
          hasMore={true}
          onLoadMore={onLoadMore}
        >
          <GenericList.LoadMore />
        </GenericList.Root>,
      );

      const loadMore = screen.getByTestId('generic-list-load-more');
      expect(loadMore).toBeInTheDocument();
      expect(loadMore).toHaveAttribute('data-has-more', 'true');
      expect(loadMore).toHaveAttribute('data-is-loading', 'false');
      expect(loadMore).not.toBeDisabled();
      expect(loadMore).toHaveTextContent('Load More');
    });

    it('should not render when hasMore is false', () => {
      render(
        <GenericList.Root items={mockItems} hasMore={false}>
          <GenericList.LoadMore />
        </GenericList.Root>,
      );

      expect(
        screen.queryByTestId('generic-list-load-more'),
      ).not.toBeInTheDocument();
    });

    it('should handle loading state', () => {
      render(
        <GenericList.Root items={mockItems} hasMore={true} isLoading={true}>
          <GenericList.LoadMore loadingLabel="Loading items..." />
        </GenericList.Root>,
      );

      const loadMore = screen.getByTestId('generic-list-load-more');
      expect(loadMore).toHaveAttribute('data-is-loading', 'true');
      expect(loadMore).toBeDisabled();
      expect(loadMore).toHaveTextContent('Loading items...');
    });

    it('should call onLoadMore when clicked', () => {
      const onLoadMore = vi.fn();

      render(
        <GenericList.Root
          items={mockItems}
          hasMore={true}
          onLoadMore={onLoadMore}
        >
          <GenericList.LoadMore />
        </GenericList.Root>,
      );

      const loadMore = screen.getByTestId('generic-list-load-more');
      fireEvent.click(loadMore);

      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('should not call onLoadMore when loading', () => {
      const onLoadMore = vi.fn();

      render(
        <GenericList.Root
          items={mockItems}
          hasMore={true}
          isLoading={true}
          onLoadMore={onLoadMore}
        >
          <GenericList.LoadMore />
        </GenericList.Root>,
      );

      const loadMore = screen.getByTestId('generic-list-load-more');
      fireEvent.click(loadMore);

      expect(onLoadMore).not.toHaveBeenCalled();
    });

    it('should render with custom labels', () => {
      render(
        <GenericList.Root items={mockItems} hasMore={true}>
          <GenericList.LoadMore
            label="Load More Items"
            loadingLabel="Fetching..."
          />
        </GenericList.Root>,
      );

      const loadMore = screen.getByTestId('generic-list-load-more');
      expect(loadMore).toHaveTextContent('Load More Items');
    });

    it('should render with asChild pattern', () => {
      const onLoadMore = vi.fn();

      render(
        <GenericList.Root
          items={mockItems}
          hasMore={true}
          onLoadMore={onLoadMore}
        >
          <GenericList.LoadMore asChild>
            <button data-testid="custom-button">Custom Load More</button>
          </GenericList.LoadMore>
        </GenericList.Root>,
      );

      const customButton = screen.getByTestId('custom-button');
      expect(customButton).toBeInTheDocument();
      expect(customButton).toHaveAttribute(
        'data-testid',
        'generic-list-load-more',
      );

      fireEvent.click(customButton);
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });
  });

  describe('Context integration', () => {
    it('should throw error when components used outside Root', () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<GenericList.Items>Content</GenericList.Items>);
      }).toThrow(
        'useGenericListContext must be used within a GenericList.Root component',
      );

      expect(() => {
        render(<GenericList.LoadMore />);
      }).toThrow(
        'useGenericListContext must be used within a GenericList.Root component',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Complete integration', () => {
    it('should render complete list with all components', () => {
      const onLoadMore = vi.fn();

      render(
        <GenericList.Root
          items={mockItems}
          hasMore={true}
          isLoading={false}
          onLoadMore={onLoadMore}
          variant="grid"
          className="custom-list"
        >
          <GenericList.Items
            emptyState={<div data-testid="empty">No items</div>}
            className="items-container"
          >
            <div data-testid="items-content">
              {mockItems.map((item) => (
                <div key={item.id} data-testid={`item-${item.id}`}>
                  {item.name}
                </div>
              ))}
            </div>
          </GenericList.Items>
          <GenericList.LoadMore
            label="Load More Products"
            loadingLabel="Loading products..."
            className="load-more-btn"
          />
        </GenericList.Root>,
      );

      // Root should be present with correct attributes
      const root = screen.getByTestId('generic-list-root');
      expect(root).toHaveClass('custom-list');
      expect(root).toHaveAttribute('data-variant', 'grid');

      // Items should be present with content
      const items = screen.getByTestId('generic-list-items');
      expect(items).toHaveClass('items-container');
      expect(screen.getByTestId('items-content')).toBeInTheDocument();

      // Individual items should be rendered
      mockItems.forEach((item) => {
        expect(screen.getByTestId(`item-${item.id}`)).toHaveTextContent(
          item.name,
        );
      });

      // Load more should be present and functional
      const loadMore = screen.getByTestId('generic-list-load-more');
      expect(loadMore).toHaveClass('load-more-btn');
      expect(loadMore).toHaveTextContent('Load More Products');

      fireEvent.click(loadMore);
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });
  });
});
