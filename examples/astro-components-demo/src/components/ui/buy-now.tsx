
import type { Signal } from "@wix/services-definitions";
import { withManagerProvider } from "@wix/headless-stores/astro/ManagerProviderContext";
import { BuyNowServiceDefinition } from "@wix/headless-stores/services";

export const BuyNow = withManagerProvider(({ context }) => {
  console.log("BuyNow servicesManager", context);
  const { loadingSignal, errorSignal, redirectToCheckout } = context.getService(BuyNowServiceDefinition)

  if (loadingSignal.get()) return <>Preparing checkout...</>;
  if (errorSignal.get()) return <>Error: {errorSignal.get()}</>;

  return <button onClick={redirectToCheckout} className="bg-blue-500 text-white p-2 rounded-md">
    Yalla, Buy!
  </button>
});

