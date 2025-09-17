import React, { createContext, useContext } from 'react';
import type { TimeSlot } from '../../services/index.js';

// Context for sharing data between TimeSlot components
interface TimeSlotContextValue {
  timeSlot: TimeSlot;
  isSelected: boolean;
  selectTimeSlot: () => void;
  status: TimeSlot['status'];
}

const TimeSlotContext = createContext<TimeSlotContextValue | null>(null);

// Hook to use TimeSlot context
const useTimeSlotContext = () => {
  const context = useContext(TimeSlotContext);
  if (!context) {
    throw new Error('TimeSlot components must be used within TimeSlot.Root');
  }
  return context;
};

// Root component that accepts timeSlot and creates context
export const Root = ({
  children,
  timeSlot,
  isSelected,
  selectTimeSlot,
}: {
  children: React.ReactNode;
  timeSlot: TimeSlot;
  isSelected: boolean;
  selectTimeSlot: () => void;
}) => {
  const contextValue: TimeSlotContextValue = {
    timeSlot,
    isSelected,
    selectTimeSlot,
    status: timeSlot.status,
  };

  return (
    <TimeSlotContext.Provider value={contextValue}>
      {children}
    </TimeSlotContext.Provider>
  );
};

// Time component that provides time slot time
export const Time = ({
  children,
}: {
  children: (props: { time: Date }) => React.ReactNode;
}) => {
  const { timeSlot } = useTimeSlotContext();
  return children({ time: timeSlot.startDate! });
};

// Action.Select component that provides selection functionality
export const Action = {
  Select: ({
    children,
  }: {
    children: (props: {
      onClick: () => void;
      isSelected: boolean;
      status: TimeSlot['status'];
    }) => React.ReactNode;
  }) => {
    const { selectTimeSlot, isSelected, status } = useTimeSlotContext();

    return children({ onClick: selectTimeSlot, isSelected, status });
  },
};
