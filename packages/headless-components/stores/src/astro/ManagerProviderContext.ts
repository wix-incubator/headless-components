import { createContext, withContext } from "@wix/headless-components-core";
import { createServicesManager } from "@wix/services-manager";

(globalThis as any).ManagerProviderContext ||= createContext<{service: ReturnType<typeof createServicesManager>}>();

export const [ManagerProvider, getManagerProvider] = (globalThis as any).ManagerProviderContext;

export const withManagerProvider = (Component: React.ComponentType<any>) => {
  console.log("withManagerProvider manager is", (globalThis as any).ManagerProviderContext[1]);
  return withContext((globalThis as any).ManagerProviderContext[1], Component);
}
