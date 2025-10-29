// import ItemDetailsDialog from './ItemDetailsDialog';
// import { OLO } from '@/components/restaurants-olo';
import { rootRouteLoader } from './OLOLayout';
// import OLOMenus from './OLOMenus';
import { useEffect, useState } from 'react';
import OLOMenus from './OLOMenus';
import { OLO, Settings } from '@wix/headless-restaurants-olo/react';
import ItemDetailsDialog from './ItemDetailsDialog';
import type { OLOSettingsServiceConfig } from '@wix/headless-restaurants-olo/services';

// ========================================
// OLO PAGE
// ========================================

interface OLOPageProps {
  /** The ID of the item to display */
  itemId?: string;
  /** Custom dialog title - if not provided, uses default */
  title?: string;
  /** Custom dialog description */
  description?: string;
  /** Custom className for dialog content */
  className?: string;
  /** Pre-loaded OLO settings service config (optional) */
  oloSettingsServiceConfig?: OLOSettingsServiceConfig;
}

/**
 * Dialog wrapper for ItemDetailsPage component
 *
 * @component
 * @example
 * ```tsx
 * // With default trigger
 * <OLOPage
 *   itemId="item-123"
 *   title="Menu Item Details"
 * />
 *
 * // With custom trigger
 * <OLOPage itemId="item-123">
 *   <Button variant="outline">View Details</Button>
 * </OLOPage>
 * ```
 */
export const OLOPage: React.FC<OLOPageProps> = ({
  className,
  ...props
}) => {
  // const { oloSettingsServiceConfig } = useLoaderData<typeof rootRouteLoader>();
  const [oloSettingsServiceConfig, setOloSettingsServiceConfig] = useState<any>(null);
  const [menusServiceConfig, setMenusServiceConfig] = useState<any>(null);

  useEffect(() => {
    rootRouteLoader().then((data) => {
      setOloSettingsServiceConfig(data.oloSettingsServiceConfig);
      setMenusServiceConfig(data.menusServiceConfig);
    });
  }, []);

  const [itemSelected, setItemSelected] = useState<string>();

  const onItemSelected = (item: any) => {
    setItemSelected(item._id);
  };

  console.log('OLOPage', oloSettingsServiceConfig);

  return (
    <div>
      <div>{props.title}</div>
      <div>{props.description}</div>
      {oloSettingsServiceConfig && <OLO.Root oloSettingsServiceConfig={oloSettingsServiceConfig}>
        <Settings.CurrentLocation />
        <Settings.CurrentTimeSlot />
        <ItemDetailsDialog itemId={itemSelected} onDialogClose={setItemSelected} />
        <OLOMenus onItemSelected={onItemSelected} menusServiceConfig={menusServiceConfig} />
      </OLO.Root>}
    </div>
  );
};

export default OLOPage;
