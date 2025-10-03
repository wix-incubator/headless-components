import { useState } from 'react';
import {
  ScheduleItemTimeSlot,
  ScheduleItemDuration,
  ScheduleItemName,
  ScheduleItemStage,
  ScheduleItemTags,
  ScheduleItemTagRepeater,
  ScheduleItemTagLabel,
  ScheduleItemDescription,
} from '../ui/events';

interface ScheduleItemProps {
  descriptionVisible?: boolean;
}

export function ScheduleItem({
  descriptionVisible = false,
}: ScheduleItemProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
    <div className="flex gap-2 sm:gap-6 flex-col sm:flex-row">
      <div className="min-w-[150px]">
        <ScheduleItemTimeSlot />
        <ScheduleItemDuration asChild>
          {({ durationMinutes }) => <span>{durationMinutes} minutes</span>}
        </ScheduleItemDuration>
      </div>
      <div>
        <ScheduleItemName />
        <ScheduleItemStage asChild className="flex gap-1 items-center">
          {({ stageName }) => (
            <div>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  className="text-foreground"
                  d="M12 3C15.86 3 19 6.14 19 9.999L18.992 10.499C18.855 13.26 16.864 16.637 13.072 20.544C12.786 20.838 12.405 21 12 21L11.8494 20.9925C11.5012 20.9574 11.1783 20.8012 10.928 20.544C7.136 16.637 5.146 13.26 5.008 10.499H5.002L5.001 10.333C5.001 10.286 5 10.241 5 10.194L5.001 10.139L5 9.999C5 6.14 8.14 3 12 3ZM12 4C8.813 4 6.199 6.497 6.011 9.637L6 10.194C6 11.945 6.98 15.041 11.646 19.847C11.742 19.946 11.867 20 12 20C12.133 20 12.259 19.946 12.355 19.847C17.021 15.04 18 11.945 18 10.194L17.989 9.637C17.801 6.497 15.187 4 12 4ZM11.4184 7.0558C12.4064 6.8698 13.4184 7.1758 14.1214 7.8788C14.8244 8.5828 15.1324 9.5928 14.9444 10.5828C14.7194 11.7698 13.7704 12.7188 12.5824 12.9448C12.3914 12.9808 12.1994 12.9988 12.0084 12.9988C11.2134 12.9988 10.4464 12.6888 9.8794 12.1218C9.1754 11.4188 8.8674 10.4088 9.0554 9.4178C9.2804 8.2288 10.2304 7.2798 11.4184 7.0558ZM12.0024 8.0008C11.8704 8.0008 11.7374 8.0128 11.6044 8.0388C10.8284 8.1848 10.1844 8.8288 10.0374 9.6038C9.9104 10.2788 10.1094 10.9388 10.5864 11.4148C11.0614 11.8898 11.7204 12.0888 12.3964 11.9618C13.1714 11.8148 13.8154 11.1708 13.9624 10.3968C14.0904 9.7218 13.8904 9.0628 13.4144 8.5858C13.0324 8.2048 12.5324 8.0008 12.0024 8.0008Z"
                />
              </svg>
              <span>{stageName}</span>
            </div>
          )}
        </ScheduleItemStage>
        <ScheduleItemTags className="flex gap-2 flex-wrap mt-3">
          <ScheduleItemTagRepeater>
            <ScheduleItemTagLabel />
          </ScheduleItemTagRepeater>
        </ScheduleItemTags>
        {descriptionVisible && (
          <div className="group-data-[has-description=false]/schedule-item:hidden mt-3">
            <button
              onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              className="text-foreground text-base font-paragraph hover:underline flex gap-1"
            >
              {isDescriptionOpen ? (
                <>
                  <span>Show Less</span>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      className="text-foreground"
                      fill="currentColor"
                      d="M8.14644661,14.858836 C7.95118446,14.6635739 7.95118446,14.3469914 8.14644661,14.1517292 L12.4989857,9.79289322 L16.8573469,14.1517292 C17.052609,14.3469914 17.052609,14.6635739 16.8573469,14.858836 C16.6620847,15.0540981 16.3455022,15.0540981 16.1502401,14.858836 L12.4989857,11.2071068 L8.85355339,14.858836 C8.65829124,15.0540981 8.34170876,15.0540981 8.14644661,14.858836 Z"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      className="text-foreground"
                      fill="currentColor"
                      d="M8.14644661,10.1464466 C8.34170876,9.95118446 8.65829124,9.95118446 8.85355339,10.1464466 L12.4989857,13.7981758 L16.1502401,10.1464466 C16.3455022,9.95118446 16.6620847,9.95118446 16.8573469,10.1464466 C17.052609,10.3417088 17.052609,10.6582912 16.8573469,10.8535534 L12.4989857,15.2123894 L8.14644661,10.8535534 C7.95118446,10.6582912 7.95118446,10.3417088 8.14644661,10.1464466 Z"
                    />
                  </svg>
                </>
              )}
            </button>
            {isDescriptionOpen && <ScheduleItemDescription className="mt-3" />}
          </div>
        )}
      </div>
    </div>
  );
}
