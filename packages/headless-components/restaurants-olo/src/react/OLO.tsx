import React from 'react';
import { CoreOLO } from './core/index.js';
import { ItemServiceConfig } from '../services/item-details-service.js';

// ========================================
// OLO HEADLESS COMPONENTS
// ========================================
// Headless components that wrap CoreOLO and provide convenient service management
// These components handle service initialization and provide render props for UI

// ========================================
// ROOT COMPONENT
// ========================================

interface OLORootProps {
  /** The ID of the item to load */
  itemId?: string;
  /** Pre-loaded item service config (optional) */
  itemServiceConfig?: any; // TODO: Use proper ItemServiceConfig type
  /** Pre-loaded OLO settings service config (optional) */
  oloSettingsServiceConfig?: any; // TODO: Use proper OLOSettingsServiceConfig type
  /** Children render prop that receives the service state */
  // children: (props: {
  //   isLoading: boolean;
  //   error?: string;
  //   hasServices: boolean;
  //   retry: () => void;
  // }) => React.ReactNode;
  children: React.ReactNode;
}

/**
 * Root headless component for OLO service management
 * Wraps CoreOLO.Root and provides service state to children
 *
 * @example
 * ```tsx
 * <OLO.Root itemId="item-123">
 *   {({ isLoading, hasServices, error, retry }) => (
 *     isLoading ? (
 *       <LoadingSpinner />
 *     ) : error ? (
 *       <ErrorMessage error={error} onRetry={retry} />
 *     ) : hasServices ? (
 *       <ItemDetailsComponents />
 *     ) : null
 *   )}
 * </OLO.Root>
 * ```
 */
export const Root: React.FC<OLORootProps> = ({
  itemId,
  oloSettingsServiceConfig,
  children,
}) => {
  const [retryKey] = React.useState(0);

  // const retry = React.useCallback(() => {
  //   setRetryKey(prev => prev + 1);
  // }, []);

  return (
    <CoreOLO.Root
      key={retryKey} // Force re-initialization on retry
      itemId={itemId}
      oloSettingsServiceConfig={oloSettingsServiceConfig}
    >
      {children}
    </CoreOLO.Root>
  );
};

// ========================================
// PROVIDER COMPONENT
// ========================================

interface OLOProviderProps {
  /** The ID of the item to load */
  itemId?: string;
  /** Pre-loaded configurations (optional) */
  configs?: {
    itemServiceConfig?: ItemServiceConfig;
  };
  /** Loading component to show while services are initializing */
  loading?: React.ReactNode;
  /** Error component to show if service initialization fails */
  error?: (props: { error: string; retry: () => void }) => React.ReactNode;
  /** Children that will receive the services context */
  children: React.ReactNode;
}

/**
 * Convenience provider that handles loading and error states automatically
 *
 * @example
 * ```tsx
 * <OLO.Provider
 *   itemId="item-123"
 *   loading={<Spinner />}
 *   error={({ error, retry }) => <ErrorBanner message={error} onRetry={retry} />}
 * >
 *   <ItemDetailsComponents />
 * </OLO.Provider>
 * ```
 */
export const Provider: React.FC<OLOProviderProps> = ({
  itemId,
  configs,
  // loading = (
  //   <div className="flex items-center justify-center p-8">
  //     <div className="text-secondary-foreground">Loading services...</div>
  //   </div>
  // ),
  // error: errorComponent = ({ error, retry }) => (
  //   <div className="flex flex-col items-center justify-center p-8 space-y-4">
  //     <div className="text-destructive">Error: {error}</div>
  //     <button
  //       onClick={retry}
  //       className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
  //     >
  //       Retry
  //     </button>
  //   </div>
  // ),
  children,
}) => {
  return (
    <Root itemId={itemId} itemServiceConfig={configs?.itemServiceConfig}>
      {children}
      {/* {({ isLoading, error, hasServices, retry }) => {
        if (isLoading) {
          return <>{loading}</>;
        }

        if (error) {
          return <>{errorComponent({ error, retry })}</>;
        }

        if (!hasServices) {
          return <>{errorComponent({ error: 'Services not available', retry })}</>;
        }

        return <>{children}</>;
      }} */}
    </Root>
  );
};

// ========================================
// ITEM DETAILS COMPONENT
// ========================================

interface OLOItemDetailsProps {
  /** The ID of the item to load */
  itemId: string;
  /** Pre-loaded configurations (optional) */
  configs?: {
    itemServiceConfig?: ItemServiceConfig;
    cartServiceConfig?: any;
  };
  /** Custom loading component */
  loading?: React.ReactNode;
  /** Custom error component */
  error?: (props: { error: string; retry: () => void }) => React.ReactNode;
  /** Custom not found component */
  notFound?: React.ReactNode;
  /** Children that will have access to item services */
  children: React.ReactNode;
}

/**
 * Specialized headless component for item details
 * Includes item-specific error handling (like 404 not found)
 *
 * @example
 * ```tsx
 * <OLO.ItemDetails
 *   itemId="item-123"
 *   notFound={<NotFoundPage />}
 * >
 *   <ItemDetailsUI />
 * </OLO.ItemDetails>
 * ```
 */
export const ItemDetails: React.FC<OLOItemDetailsProps> = ({
  itemId,
  configs,
  loading,
  error,
  notFound = (
    <div className="flex items-center justify-center p-8">
      <div className="text-secondary-foreground">Item not found</div>
    </div>
  ),
  children,
}) => {
  return (
    <Provider
      itemId={itemId}
      configs={configs}
      loading={loading}
      error={({ error: errorMessage, retry }) => {
        // Handle item not found specifically
        if (errorMessage === 'Item not found') {
          return <>{notFound}</>;
        }

        // Use custom error component if provided
        if (error) {
          return <>{error({ error: errorMessage, retry })}</>;
        }

        // Default error handling
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="text-destructive">Error: {errorMessage}</div>
            <button
              onClick={retry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        );
      }}
    >
      {children}
    </Provider>
  );
};

// ========================================
// CART ONLY COMPONENT
// ========================================

interface OLOCartProps {
  /** Pre-loaded cart service config (optional) */
  cartServiceConfig?: any;
  /** Loading component */
  loading?: React.ReactNode;
  /** Error component */
  error?: (props: { error: string; retry: () => void }) => React.ReactNode;
  /** Children that will have access to cart services */
  children: React.ReactNode;
}

/**
 * Headless component for cart-only functionality
 * Doesn't load item services, only cart services
 *
 * @example
 * ```tsx
 * <OLO.Cart>
 *   <CartComponents />
 * </OLO.Cart>
 * ```
 */
export const Cart: React.FC<OLOCartProps> = ({ loading, error, children }) => {
  return (
    <Provider loading={loading} error={error}>
      {children}
    </Provider>
  );
};

// ========================================
// SERVICES STATUS COMPONENT
// ========================================

interface OLOServicesStatusProps {
  /** The ID of the item to check */
  itemId?: string;
  /** Children render prop that receives service status */
  // children: (props: {
  //   isLoading: boolean;
  //   hasItemService: boolean;
  //   hasCartService: boolean;
  //   error?: string;
  //   retry: () => void;
  // }) => React.ReactNode;
  children: React.ReactNode;
}

/**
 * Headless component for checking service status
 * Useful for debugging or conditional rendering
 *
 * @example
 * ```tsx
 * <OLO.ServicesStatus itemId="item-123">
 *   {({ hasItemService, hasCartService, error }) => (
 *     <div>
 *       Item Service: {hasItemService ? '✅' : '❌'}
 *       Cart Service: {hasCartService ? '✅' : '❌'}
 *       {error && <div>Error: {error}</div>}
 *     </div>
 *   )}
 * </OLO.ServicesStatus>
 * ```
 */
export const ServicesStatus: React.FC<OLOServicesStatusProps> = ({
  itemId,
  children,
}) => {
  return (
    <Root itemId={itemId}>
      {children}
      {/* {({ isLoading, hasServices, error, retry }) => {
        // For now, we assume both services are available if hasServices is true
        // TODO: Add individual service status checking
        const hasItemService = hasServices && Boolean(itemId);
        const hasCartService = hasServices;

        return children({
          isLoading,
          hasItemService,
          hasCartService,
          error,
          retry
        });
      }} */}
    </Root>
  );
};
/**
 * Headless component for Menus service management.
 * Wraps CoreOLO.Menus and provides render props for UI.
 *
 * @example
 * ```tsx
 * <OLO.Menus>
 *   {({ menus, isLoading, error }) => (
 *     isLoading ? (
 *       <div>Loading...</div>
 *     ) : error ? (
 *       <div className="text-destructive">{error}</div>
 *     ) : (
 *       <ul>
 *         {menus.map(menu => (
 *           <li key={menu.id} className="text-foreground font-paragraph">{menu.name}</li>
 *         ))}
 *       </ul>
 *     )
 *   )}
 * </OLO.Menus>
 * ```
 */
interface OLOMenusProps {
  /** Optional menu service config */
  menuServiceConfig?: any;
  /** Children render prop that receives menus state */
  children?: React.ReactNode;
}

export const Menus: React.FC<OLOMenusProps> = ({
  // menuServiceConfig,
  children,
}) => {
  // const [retryKey, setRetryKey] = React.useState(0);
  // const [menus, setMenus] = React.useState<any[]>([]);
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [error, setError] = React.useState<string | undefined>(undefined);

  return <>{children}</>;
};
