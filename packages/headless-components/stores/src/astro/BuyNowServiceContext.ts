import { createContext, withContext } from "@wix/headless-components-core";
import { BuyNowServiceImplementation } from "../services";

(globalThis as any).BuyNowServiceContext ||= createContext<{service: ReturnType<typeof BuyNowServiceImplementation>}>();

export const [BuyNowServiceProvider, getBuyNowServiceProvider] = (globalThis as any).BuyNowServiceContext;

export const withBuyButtonService = (Component: React.ComponentType<any>) => {
  return withContext((globalThis as any).BuyNowServiceContext[1], Component);
}
