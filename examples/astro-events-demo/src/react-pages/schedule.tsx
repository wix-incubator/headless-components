import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/events/services';
import { Schedule } from '../components/events/Schedule';

interface SchedulePageProps {
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  eventPageUrl: string;
}

export default function SchedulePage({
  eventServiceConfig,
  scheduleListServiceConfig,
  eventPageUrl,
}: SchedulePageProps) {
  return (
    <div className="bg-background">
      <Schedule
        eventServiceConfig={eventServiceConfig}
        scheduleListServiceConfig={scheduleListServiceConfig}
        eventPageUrl={eventPageUrl}
      />
    </div>
  );
}
