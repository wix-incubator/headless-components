import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { Schedule } from '../components/events/Schedule';

interface SchedulePageProps {
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  eventsPagePath: string;
}

export default function SchedulePage({
  eventServiceConfig,
  scheduleListServiceConfig,
  eventsPagePath,
}: SchedulePageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <Schedule
          eventServiceConfig={eventServiceConfig}
          scheduleListServiceConfig={scheduleListServiceConfig}
          eventsPagePath={eventsPagePath}
        />
      </div>
    </KitchensinkLayout>
  );
}
