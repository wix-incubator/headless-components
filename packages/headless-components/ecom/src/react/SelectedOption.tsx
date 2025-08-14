import { WixServices } from "@wix/services-manager-react";
import React from "react";
import {
  SelectedOptionServiceDefinition,
  SelectedOptionService,
  type SelectedOptionServiceConfig,
  type SelectedOption,
} from "../services/selected-option-service.js";
import { createServicesMap } from "@wix/services-manager";

export interface SelectedOptionRootProps {
  children: React.ReactNode;
  option: SelectedOption;
}

/**
 * Root component for a selected option that provides the SelectedOption service context to its children
 *
 * @example
 * ```tsx
 * <SelectedOption.Root option={selectedOption}>
 *   <SelectedOption.Text />
 *   <SelectedOption.Color />
 * </SelectedOption.Root>
 * ```
 */
export function Root(props: SelectedOptionRootProps): React.ReactNode {
  const { children, option } = props;

  const selectedOptionServiceConfig: SelectedOptionServiceConfig = {
    selectedOption: option,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        SelectedOptionServiceDefinition,
        SelectedOptionService,
        selectedOptionServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

Root.displayName = "SelectedOption.Root";
