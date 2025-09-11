import React from 'react';
import { useService } from '@wix/services-manager-react';
import { ServicesListServiceDefinition } from '../../services/services-list-service';
export const Root = React.forwardRef((props, ref) => {
    const { children, servicesListConfig } = props;
    return (React.createElement(ServiceListProvider, { servicesListConfig: servicesListConfig }, children));
});
Root.displayName = 'ServiceList.Root';
const ServiceListProvider = ({ children, servicesListConfig, }) => {
    const servicesList = useService(ServicesListServiceDefinition);
    React.useEffect(() => {
        servicesList.services.set(servicesListConfig.services);
        if (servicesListConfig.pagingMetadata) {
            servicesList.pagingMetadata.set(servicesListConfig.pagingMetadata);
        }
    }, [servicesListConfig]);
    return React.createElement(React.Fragment, null, children);
};
export const Error = ({ children }) => {
    const servicesList = useService(ServicesListServiceDefinition);
    const error = servicesList.error.get();
    return React.createElement(React.Fragment, null, children({ error }));
};
