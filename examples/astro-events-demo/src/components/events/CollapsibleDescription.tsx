import { useState } from 'react';
import { ScheduleItemDescription } from '../ui/events/ScheduleItem';

export function CollapsibleDescription() {
  const [open, setOpen] = useState(false);

  return (
    <div className="group-data-[has-description=false]/schedule-item:hidden mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="text-foreground text-base font-paragraph hover:underline flex items-center gap-1"
      >
        {open ? (
          <>
            <span>Show Less</span>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                className="text-foreground"
                d="M8.14644661,14.858836 C7.95118446,14.6635739 7.95118446,14.3469914 8.14644661,14.1517292 L12.4989857,9.79289322 L16.8573469,14.1517292 C17.052609,14.3469914 17.052609,14.6635739 16.8573469,14.858836 C16.6620847,15.0540981 16.3455022,15.0540981 16.1502401,14.858836 L12.4989857,11.2071068 L8.85355339,14.858836 C8.65829124,15.0540981 8.34170876,15.0540981 8.14644661,14.858836 Z"
              />
            </svg>
          </>
        ) : (
          <>
            <span>Show More</span>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                className="text-foreground"
                d="M8.14644661,10.1464466 C8.34170876,9.95118446 8.65829124,9.95118446 8.85355339,10.1464466 L12.4989857,13.7981758 L16.1502401,10.1464466 C16.3455022,9.95118446 16.6620847,9.95118446 16.8573469,10.1464466 C17.052609,10.3417088 17.052609,10.6582912 16.8573469,10.8535534 L12.4989857,15.2123894 L8.14644661,10.8535534 C7.95118446,10.6582912 7.95118446,10.3417088 8.14644661,10.1464466 Z"
              />
            </svg>
          </>
        )}
      </button>
      {open && <ScheduleItemDescription />}
    </div>
  );
}
