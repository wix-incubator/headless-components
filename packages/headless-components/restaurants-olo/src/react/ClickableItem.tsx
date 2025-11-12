import React from 'react';
import { CoreClickableItem } from './core/ClickableItem.js';

function ClickableItem({
  onItemSelected,
  children,
}: {
  onItemSelected: (item: any) => void;
  children: React.ReactNode;
}) {
  const selectItem = (item: any, callback: () => void) => {
    callback();
    onItemSelected(item);
  };
  return (
    <CoreClickableItem>
      {({ item, itemSelected }: { item: any; itemSelected: () => void }) => (
        <div
          onClick={() => {
            selectItem(item, itemSelected);
          }}
        >
          {children}
        </div>
      )}
    </CoreClickableItem>
  );
}

export const Actions = {
  Select: ClickableItem,
};
