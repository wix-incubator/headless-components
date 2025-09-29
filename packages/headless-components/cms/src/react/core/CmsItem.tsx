import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  CmsItemServiceDefinition,
  CmsItemServiceConfig,
  CmsItemServiceImplementation,
} from '../../services/cms-item-service.js';
import { createServicesMap } from '@wix/services-manager';

export interface RootProps {
  children: React.ReactNode;
  itemServiceConfig: CmsItemServiceConfig;
}

/**
 * Core Root component that provides the CMS Item service context to its children.
 * This component sets up the necessary services for rendering and managing individual item data.
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CmsItemServiceDefinition,
        CmsItemServiceImplementation,
        props.itemServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

export interface FieldProps {
  /** Render prop function that receives field data */
  children: (props: FieldRenderProps) => React.ReactNode;
  /** ID of the field to extract from the item */
  fieldId: string;
}

export interface FieldRenderProps {
  /** The raw field value */
  fieldValue: any;
}

/**
 * Core headless component for CMS item field display
 */
export function Field(props: FieldProps) {
  const { children, fieldId } = props;

  const service = useService(CmsItemServiceDefinition) as ServiceAPI<
    typeof CmsItemServiceDefinition
  >;

  const item = service.itemSignal.get();

  // Extract field value by fieldId from the item's data
  const fieldValue = item?.[fieldId] ?? null;

  return children({
    fieldValue,
  });
}
