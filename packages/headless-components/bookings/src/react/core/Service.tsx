import React from 'react';
import { services } from '@wix/bookings';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  ServiceService,
  ServiceServiceDefinition,
  type ServiceServiceConfig,
} from '../../services/service-service.js';
import { WixMediaImage } from '@wix/headless-media/react';

export interface RootProps {
  children: React.ReactNode;
  serviceConfig: ServiceServiceConfig;
  className?: string;
}

export interface ServiceNameProps {
  children: (props: ServiceNameRenderProps) => React.ReactNode;
}

export interface ServiceNameRenderProps {
  name: string;
}

export interface ServiceDescriptionProps {
  children: (props: ServiceDescriptionRenderProps) => React.ReactNode;
}

export interface ServiceDescriptionRenderProps {
  description: string | null;
}

export interface ServicePriceProps {
  children: (props: ServicePriceRenderProps) => React.ReactNode;
}

export interface ServicePriceRenderProps {
  price: {
    value: number;
    currency: string;
  } | null;
}

export interface ServiceImageRenderProps {
  image: string | null;
  alt: string;
}

export interface ServiceCategoryProps {
  children: (props: ServiceCategoryRenderProps) => React.ReactNode;
}

export interface ServiceCategoryRenderProps {
  category: {
    name: string;
  } | null;
}

export interface ServiceLoadingProps {
  children: (props: ServiceLoadingRenderProps) => React.ReactNode;
}

export interface ServiceLoadingRenderProps {
  isLoading: boolean;
}

export interface ServiceContentProps {
  children: (props: ServiceContentRenderProps) => React.ReactNode;
}

export interface ServiceContentRenderProps {
  service: services.Service;
}

function Content(props: ServiceContentProps) {
  const serviceService = useService(ServiceServiceDefinition);
  const service = serviceService.service.get();

  return props.children({ service });
}

function Loading(props: ServiceLoadingProps) {
  const serviceService = useService(ServiceServiceDefinition);
  const isLoading = serviceService.isLoading.get();

  return props.children({ isLoading });
}

export function Name(props: ServiceNameProps) {
  const serviceService = useService(ServiceServiceDefinition);
  const service = serviceService.service.get();

  if (!service) return null;

  return props.children({ name: service.name || '' });
}

export function Description(props: ServiceDescriptionProps) {
  const serviceService = useService(ServiceServiceDefinition);
  const service = serviceService.service.get();

  if (!service) return null;

  return props.children({ description: service.description || null });
}

export function Price(props: ServicePriceProps) {
  const serviceService = useService(ServiceServiceDefinition);
  const service = serviceService.service.get();

  if (!service) return null;

  const price = service.payment?.fixed?.price
    ? {
        value: Number(service.payment.fixed.price.value),
        currency: service.payment.fixed.price.currency || '',
      }
    : null;

  return props.children({ price });
}

export function Image() {
  const serviceService = useService(ServiceServiceDefinition);
  const service = serviceService.service.get();

  if (!service || !service.media?.mainMedia?.image) return null;

  //WA until the issue with media will be solved
  const image = service.media?.mainMedia?.image?.replace(/v1\/[\w-]+\//, 'v1/');

  return <WixMediaImage media={{ image }} alt={service.name || ''} />;
}

export function Root(props: RootProps) {
  const { serviceConfig, children } = props;

  const services = createServicesMap().addService(
    ServiceServiceDefinition,
    ServiceService,
    serviceConfig,
  );

  return <WixServices servicesMap={services}>{children}</WixServices>;
}

// Set display names for components
Root.displayName = 'Service.Root';
Content.displayName = 'Service.Content';
Loading.displayName = 'Service.Loading';
Name.displayName = 'Service.Name';
Description.displayName = 'Service.Description';
Price.displayName = 'Service.Price';
Image.displayName = 'Service.Image';

export const Service = {
  Root,
  Content,
  Loading,
  Name,
  Description,
  Price,
  Image,
};
