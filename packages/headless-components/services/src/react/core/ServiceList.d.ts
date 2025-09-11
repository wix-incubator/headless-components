import React from 'react';
import { ServicesListServiceConfig } from '../../services/services-list-service';
export interface ServiceListRootProps {
    children: React.ReactNode;
    servicesListConfig: ServicesListServiceConfig;
}
export declare const Root: React.ForwardRefExoticComponent<ServiceListRootProps & React.RefAttributes<HTMLElement>>;
interface ErrorProps {
    children: (props: {
        error: string | null;
    }) => React.ReactNode;
}
export declare const Error: React.FC<ErrorProps>;
export {};
