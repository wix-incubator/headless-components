import '../styles/theme-1.css';
import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';

interface SchedulePageProps {
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

export default function SchedulePage({
  eventServiceConfig,
  scheduleListServiceConfig,
}: SchedulePageProps) {
  console.log('eventServiceConfig', eventServiceConfig);
  console.log('scheduleListServiceConfig', scheduleListServiceConfig);

  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <div>Schedule</div>
      </div>
    </KitchensinkLayout>
  );
}
