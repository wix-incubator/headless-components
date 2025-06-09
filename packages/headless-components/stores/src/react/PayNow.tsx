import { useService } from "@wix/services-manager-react";
import { PayNowServiceDefinition } from "../services/pay-now-service";

interface PayNowProps {
  children: (props: {
    isLoading: boolean;
    error: string | null;
    productName: string;
    redirectToCheckout: () => Promise<void>;
  }) => React.ReactNode;
}

export function PayNow(props: PayNowProps) {
  const {
    redirectToCheckout,
    loadingSignal,
    productName,
    errorSignal,
  } = useService(PayNowServiceDefinition);

  return props.children({
    isLoading: loadingSignal.get(),
    error: errorSignal.get(),
    productName: productName,
    redirectToCheckout,
  });
}
