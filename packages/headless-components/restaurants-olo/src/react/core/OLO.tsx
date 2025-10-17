import React, { useEffect } from 'react';
import { createServicesMap } from '@wix/services-manager';
import { WixServices } from '@wix/services-manager-react';
// import { ItemService, ItemServiceDefinition, loadItemServiceConfig } from '@/components/restaurants-olo/services/itemDetailsService';
import {
  OLOSettingsService,
  OLOSettingsServiceDefinition,
} from '@wix/headless-restaurants-olo/services';
import { OLOSettingsServiceConfig } from '../../services/olo-settings-service.js';
import { ItemServiceConfig } from '../../services/item-details-service.js';

// import { OLOSettingsService, OLOSettingsServiceDefinition } from '../../services/OLOSettingsService';

// ========================================
// CORE OLO COMPONENT
// ========================================
// Core component that integrates with ItemService and provides service management
// This is the service integration layer that wraps the application with necessary services

interface CoreOLORootProps {
  /** The ID of the item to load */
  itemId?: string;
  /** Pre-loaded item service config (optional) */
  itemServiceConfig?: ItemServiceConfig;
  /** Pre-loaded cart service config (optional) */
  cartServiceConfig?: any; // TODO: Use proper CurrentCartServiceConfig type
  /** Pre-loaded OLO settings service config (optional) */
  oloSettingsServiceConfig?: OLOSettingsServiceConfig;
  /** Children render prop that receives the services manager state */
  //   children: (props: {
  //     servicesManager: ServicesManager | null;
  //     isLoading: boolean;
  //     error?: string;
  //     hasServices: boolean;
  //   }) => React.ReactNode;
  children: React.ReactNode;
}

/**
 * Core OLO Root component that sets up service management
 * Provides ItemService and CurrentCartService to child components
 *
 * @example
 * ```tsx
 * <CoreOLO.Root itemId="item-123">
 *   {({ servicesManager, isLoading, hasServices }) => (
 *     hasServices ? (
 *       <ServicesManagerProvider servicesManager={servicesManager}>
 *         <ItemDetailsComponents />
 *       </ServicesManagerProvider>
 *     ) : (
 *       <LoadingSpinner />
 *     )
 *   )}
 * </CoreOLO.Root>
 * ```
 */
export const Root: React.FC<CoreOLORootProps> = ({
  itemId,
  itemServiceConfig,
  cartServiceConfig,
  oloSettingsServiceConfig,
  children,
}) => {
  // const [servicesManager, setServicesManager] = useState<ServicesManager | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // const initializeServices = async () => {
    //   setIsLoading(true);
    //   setError(undefined);
    //   try {
    //     // Load configurations if not provided
    //     const loadedConfigs = await Promise.all([
    //       cartServiceConfig || loadCurrentCartServiceConfig(),
    //       itemServiceConfig || (loadItemServiceConfig(itemId))
    //     ]);
    //     const [currentCartServiceConfig, itemServiceConfigResult] = loadedConfigs;
    //     // Handle item service config result (discriminated union)
    //     if (itemServiceConfigResult && 'type' in itemServiceConfigResult) {
    //       if (itemServiceConfigResult.type === 'notFound') {
    //         setError('Item not found');
    //         return;
    //       }
    //       // Use the config from the success result
    //       const finalItemServiceConfig = itemServiceConfigResult.config;
    //       // Create services manager with both services
    //       const manager = createServicesManager(
    //         createServicesMap()
    //           .addService(CurrentCartServiceDefinition, CurrentCartService, currentCartServiceConfig)
    //         //   .addService(ItemServiceDefinition, ItemService, finalItemServiceConfig)
    //       );
    //       setServicesManager(manager);
    //     } else if (itemServiceConfigResult) {
    //       // Direct config provided
    //       const manager = createServicesManager(
    //         createServicesMap()
    //           .addService(CurrentCartServiceDefinition, CurrentCartService, currentCartServiceConfig)
    //         //   .addService(ItemServiceDefinition, ItemService, itemServiceConfigResult)
    //       );
    //       setServicesManager(manager);
    //     } else {
    //       // Only cart service, no item service
    //       const manager = createServicesManager(
    //         createServicesMap()
    //           .addService(CurrentCartServiceDefinition, CurrentCartService, currentCartServiceConfig)
    //       );
    //       setServicesManager(manager);
    //     }
    //   } catch (err) {
    //     console.error('Failed to initialize services:', err);
    //     setError('Failed to initialize services');
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // initializeServices();
  }, [itemId, itemServiceConfig, cartServiceConfig]);

  // const hasServices = Boolean(servicesManager);

  //   return children({
  //     servicesManager,
  //     isLoading,
  //     error,
  //     hasServices
  //   });

  console.log('oloSettingsServiceConfig', oloSettingsServiceConfig);

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        OLOSettingsServiceDefinition,
        OLOSettingsService,
        oloSettingsServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
};

// ========================================
// SERVICES MANAGER PROVIDER WRAPPER
// ========================================

interface CoreOLOProviderProps {
  /** The ID of the item to load */
  itemId?: string;
  /** Pre-loaded item service config (optional) */
  itemServiceConfig?: ItemServiceConfig;
  /** Pre-loaded cart service config (optional) */
  cartServiceConfig?: any; // TODO: Use proper CurrentCartServiceConfig type
  /** Pre-loaded OLO settings service config (optional) */
  oloSettingsServiceConfig?: OLOSettingsServiceConfig;
  /** Loading component to show while services are initializing */
  loading?: React.ReactNode;
  /** Error component to show if service initialization fails */
  error?: (error: string) => React.ReactNode;
  /** Children that will receive the services context */
  children: React.ReactNode;
}

/**
 * Convenience wrapper that combines Root with ServicesManagerProvider
 * Automatically provides services context to children
 *
 * @example
 * ```tsx
 * <CoreOLO.Provider itemId="item-123">
 *   <ItemDetailsComponents />
 * </CoreOLO.Provider>
 * ```
 */
export const Provider: React.FC<CoreOLOProviderProps> = ({
  itemId,
  itemServiceConfig,
  cartServiceConfig,
  oloSettingsServiceConfig,
  // loading = <div>Loading services...</div>,
  // error: errorComponent = (error: string) => <div>Error: {error}</div>,
  children,
}) => {
  return (
    <Root
      itemId={itemId}
      itemServiceConfig={itemServiceConfig}
      cartServiceConfig={cartServiceConfig}
      oloSettingsServiceConfig={oloSettingsServiceConfig}
    >
      {children}
      {/* {({ servicesManager, isLoading, error, hasServices }) => {
        if (isLoading) {
          return <>{loading}</>;
        }

        if (error) {
          return <>{errorComponent(error)}</>;
        }

        if (!hasServices || !servicesManager) {
          return <>{errorComponent('Services not available')}</>;
        }

        return (
        //   <ServicesManagerProvider servicesManager={servicesManager}>
            <>
            {children}
            </>
        //   </ServicesManagerProvider>
        );
      }} */}
    </Root>
  );
};

// ========================================
// ITEM DETAILS WRAPPER
// ========================================

interface CoreOLOItemDetailsProps {
  /** The ID of the item to load */
  itemId: string;
  /** Pre-loaded configurations (optional) */
  configs?: {
    itemServiceConfig?: ItemServiceConfig;
    cartServiceConfig?: any;
  };
  /** Loading component */
  loading?: React.ReactNode;
  /** Error component */
  error?: (error: string) => React.ReactNode;
  /** Children that will have access to item services */
  children: React.ReactNode;
}

/**
 * Specialized wrapper for item details that ensures ItemService is available
 *
 * @example
 * ```tsx
 * <CoreOLO.ItemDetails itemId="item-123">
 *   <ItemDetailsPrimitive.Root>
 *     {({ item }) => <div>{item.name}</div>}
 *   </ItemDetailsPrimitive.Root>
 * </CoreOLO.ItemDetails>
 * ```
 */
export const ItemDetails: React.FC<CoreOLOItemDetailsProps> = ({
  itemId,
  configs,
  loading,
  error,
  children,
}) => {
  return (
    <Provider
      itemId={itemId}
      itemServiceConfig={configs?.itemServiceConfig}
      cartServiceConfig={configs?.cartServiceConfig}
      loading={loading}
      error={error}
    >
      {children}
    </Provider>
  );
};
