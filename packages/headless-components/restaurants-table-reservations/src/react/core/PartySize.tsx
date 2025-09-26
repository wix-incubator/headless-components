import React, { createContext, useContext } from 'react';

// Context for sharing data between PartySize components
interface PartySizeContextValue {
  partySize: number;
  isSelected: boolean;
  selectPartySize: () => void;
}

const PartySizeContext = createContext<PartySizeContextValue | null>(null);

// Hook to use PartySize context
const usePartySizeContext = () => {
  const context = useContext(PartySizeContext);
  if (!context) {
    throw new Error('PartySize components must be used within PartySize.Root');
  }
  return context;
};

// Root component that accepts partySize and creates context
export const Root = ({
  children,
  partySize,
  isSelected,
  selectPartySize,
}: {
  children: React.ReactNode;
  partySize: number;
  isSelected: boolean;
  selectPartySize: () => void;
}) => {
  const contextValue: PartySizeContextValue = {
    partySize,
    isSelected,
    selectPartySize,
  };

  return (
    <PartySizeContext.Provider value={contextValue}>
      {children}
    </PartySizeContext.Provider>
  );
};

// Size component that provides party size value
export const Size = ({
  children,
}: {
  children: (props: { size: number }) => React.ReactNode;
}) => {
  const { partySize } = usePartySizeContext();

  return children({ size: partySize });
};

// Action.Select component that provides selection functionality
export const Action = {
  Select: ({
    children,
  }: {
    children: (props: {
      onClick: () => void;
      isSelected: boolean;
    }) => React.ReactNode;
  }) => {
    const { selectPartySize, isSelected } = usePartySizeContext();

    return children({ onClick: selectPartySize, isSelected });
  },
};
