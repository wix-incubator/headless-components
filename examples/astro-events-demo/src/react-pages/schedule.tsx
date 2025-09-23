import '../styles/theme-1.css';
import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { Schedule } from '../components/events/Schedule';

interface SchedulePageProps {
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

export default function SchedulePage({
  eventServiceConfig,
  scheduleListServiceConfig,
}: SchedulePageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <Schedule
          eventServiceConfig={eventServiceConfig}
          scheduleListServiceConfig={scheduleListServiceConfig}
        />
      </div>
    </KitchensinkLayout>
  );
}
