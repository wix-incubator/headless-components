import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/events/services';
import { Schedule } from '../components/events/Schedule';

interface SchedulePageProps {
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  eventDetailsPagePath: string;
}

export default function SchedulePage({
  eventServiceConfig,
  scheduleListServiceConfig,
  eventDetailsPagePath,
}: SchedulePageProps) {
  return (
    <div className="bg-background">
      <Schedule
        eventServiceConfig={eventServiceConfig}
        scheduleListServiceConfig={scheduleListServiceConfig}
        eventDetailsPagePath={eventDetailsPagePath}
      />
    </div>
  );
}
