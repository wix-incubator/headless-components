import { useService } from "@wix/services-manager-react";
import { PayNowServiceDefinition } from "../services/pay-now-service";

export type PayNowRedirectToCheckout = () => void

/**
 * Props passed to the render function of the PayNow component
 */
export interface PayNowRenderProps {
  /** Whether the buy now operation is currently loading */
  isLoading: boolean;
  /** Function to redirect the user to the checkout page */
  redirectToCheckout: PayNowRedirectToCheckout;
  /** The error message if the buy now operation fails */
  error: string | null;
};

export type PayNowChildren = (props: PayNowRenderProps) => React.ReactNode
export interface PayNowProps {
  /** Render function that receives buy now state and actions */
  children: PayNowChildren;
};

export function PayNow(props: PayNowProps) {
  const {
    redirectToCheckout,
    loadingSignal,
    errorSignal,
  } = useService(PayNowServiceDefinition);

  return props.children({
    isLoading: loadingSignal.get(),
    error: errorSignal.get(),
    redirectToCheckout,
  });
}
