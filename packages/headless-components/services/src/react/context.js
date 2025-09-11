import React from 'react';
export const ServiceListContext = React.createContext(null);
export function useServiceListContext() {
    const context = React.useContext(ServiceListContext);
    if (!context) {
        throw new Error('useServiceListContext must be used within a Services.List component');
    }
    return context;
}
