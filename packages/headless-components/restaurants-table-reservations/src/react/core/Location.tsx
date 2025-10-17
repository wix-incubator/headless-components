import React, { createContext, useContext } from 'react';
import type { ReservationLocation } from '../../services/index.js';

// Context for sharing data between Location components
interface LocationContextValue {
  location: ReservationLocation;
  isSelected: boolean;
  selectLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

// Hook to use Location context
const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('Location components must be used within Location.Root');
  }
  return context;
};

// Root component that accepts location and creates context
export const Root = ({
  children,
  location,
  isSelected,
  selectLocation,
}: {
  children: React.ReactNode;
  location: ReservationLocation;
  isSelected: boolean;
  selectLocation: () => void;
}) => {
  const contextValue: LocationContextValue = {
    location,
    isSelected,
    selectLocation,
  };

  console.log('contextValue', contextValue);
  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

// Name component that provides location name
export const Name = ({
  children,
}: {
  children: (props: { name: string }) => React.ReactNode;
}) => {
  const { location } = useLocationContext();
  // @ts-ignore
  return children({ name: location.location.name });
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
    const { selectLocation, isSelected } = useLocationContext();

    return children({ onClick: selectLocation, isSelected });
  },
};
