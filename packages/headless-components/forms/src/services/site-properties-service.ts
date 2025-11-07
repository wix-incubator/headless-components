import { siteProperties } from "@wix/business-tools";
import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type ReadOnlySignal
} from "@wix/services-definitions/core-services/signals";

export type SiteProperties = siteProperties.Properties;

export interface SitePropertiesAPI {
  sitePropertiesSignal: ReadOnlySignal<SiteProperties | null>,
  isLoadingSignal: ReadOnlySignal<boolean>,
  errorSignal: ReadOnlySignal<string | null>,
}

export const SitePropertiesDefinition =
  defineService<SitePropertiesAPI>('sitePropertiesService');


export const SitePropertiesService = implementService(
  SitePropertiesDefinition,
  ({getService}) => {
    const signalService = getService(SignalsServiceDefinition);
    console.log('Site Properties signal service', signalService);

    const sitePropertiesSignal = signalService.signal<SiteProperties | null>(null);
    const isLoadingSignal = signalService.signal<boolean>(false);
    const errorSignal = signalService.signal<string | null>(null);

    const loadSiteProperties = async () => {
      isLoadingSignal.set(true);
      errorSignal.set(null);

      try {
        const properties = await fetchSiteProperties();
        if (properties !== undefined) {
          sitePropertiesSignal.set(properties);
        } else {
          throw new Error('Site properties do not exist!');
        }
      } catch (err) {
        errorSignal.set('Failed to load a site properties!');
        throw err;
      } finally {
        isLoadingSignal.set(false);
      }
    };

    loadSiteProperties();

    return {
      sitePropertiesSignal,
      isLoadingSignal,
      errorSignal,
    }
  }
)

const fetchSiteProperties = async (): Promise<SiteProperties | undefined> => {
  const { properties } = await siteProperties.getSiteProperties();
  return properties;
};
