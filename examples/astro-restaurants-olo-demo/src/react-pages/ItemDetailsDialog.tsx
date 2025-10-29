import React, { useEffect, useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogClose
// } from '@/components/ui/dialog';
// import { ItemDetailsPage } from './ItemDetailsPage';
// import { Button } from '@/components/ui/button';
import {ItemDetailsLayout} from './ItemDetailsPage';
// import { ItemServiceConfig, loadItemServiceConfig } from '@/components/restaurants-olo/services/itemDetailsService';
import { Cart } from '@wix/ecom/components';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';


// ========================================
// OLO PAGE DIALOG WRAPPER
// ========================================
// A dialog wrapper component that displays ItemDetailsPage in a modal
// Provides a clean modal interface for viewing item details

interface ItemDetailsDialogProps {
  /** The ID of the item to display */
  itemId?: string;
  /** Whether the dialog is open */
  /** Callback when dialog open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom trigger element - if not provided, uses default button */
  trigger?: React.ReactNode;
  /** Custom dialog title - if not provided, uses default */
  title?: string;
  /** Custom dialog description */
  description?: string;
  /** Custom className for dialog content */
  className?: string;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Callback when item is selected */
  onDialogClose?: (item: any) => void;
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
 *
 * // Controlled dialog
 * <OLOPage
 *   itemId="item-123"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */
export const ItemDetailsDialog: React.FC<ItemDetailsDialogProps> = ({
  itemId,
  onOpenChange,
  trigger,
  title = "Item Details",
  description,
  className,
  showCloseButton = true,
  onDialogClose,
  ...props
}) => {

  const [open, setOpen] = useState(false);
  const onClose = () => {
    onDialogClose?.(undefined);
  };

  useEffect(() => {
    setOpen(!!itemId);
  }, [itemId]);

  const dialogContent = (
    <DialogContent
      className={`bg-white max-w-6xl max-h-[90vh] overflow-y-auto ${className || ''}`}
      {...props}
    >
      {/* Dialog Header */}
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        {description && (
          <DialogDescription>{description}</DialogDescription>
        )}
      </DialogHeader>

      {/* Main Content - ItemDetailsPage */}
      <div className="w-full">
        <ItemDetailsLayout itemId={itemId} itemDetailsServiceConfig={{}} onClose={onClose} />
      </div>

      {/* Optional Close Button in Footer */}
      {showCloseButton && (
        <div className="flex justify-end pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </DialogClose>
        </div>
      )}

      <Cart.LineItemAdded>
        {({ onAddedToCart }) => {
          useEffect(
            () =>
              onAddedToCart(() => {
                onClose();
              }),
            [onAddedToCart]
          );

          return null;
        }}
      </Cart.LineItemAdded>
    </DialogContent>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {dialogContent}
    </Dialog>
  );
};

export default ItemDetailsDialog;
