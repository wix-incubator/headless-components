import {
  EventFacebookShare,
  EventXShare,
  EventLinkedInShare,
} from '@/components/ui/events';

interface EventSocialShareProps {
  eventPageUrl?: string;
}

export function EventSocialShare({
  eventPageUrl = typeof window !== 'undefined' ? window.location.href : '',
}: EventSocialShareProps) {
  return (
    <div className="flex gap-3">
      <EventFacebookShare asChild eventPageUrl={eventPageUrl}>
        {({ shareUrl }) => (
          <a onClick={() => window.open(shareUrl, '_blank')}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 3C16.9706 3 21 7.02943 21 12C21 16.4922 17.7088 20.2155 13.4062 20.8907V14.6016H15.5033L15.9023 12H13.4062V10.3117C13.4062 9.60001 13.7549 8.90625 14.8729 8.90625H16.0078V6.69141C16.0078 6.69141 14.9779 6.51562 13.9932 6.51562C11.9374 6.51562 10.5938 7.76156 10.5938 10.0172V12H8.30859V14.6016H10.5938V20.8907C6.29117 20.2155 3 16.4922 3 12C3 7.02943 7.02943 3 12 3Z"
              />
            </svg>
          </a>
        )}
      </EventFacebookShare>
      <EventXShare asChild eventPageUrl={eventPageUrl}>
        {({ shareUrl }) => (
          <a onClick={() => window.open(shareUrl, '_blank')}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M4.53657 5L10.3279 12.7218L4.5 19H5.81163L10.9139 13.5034L15.0365 19H19.5L13.3828 10.8438L18.8074 5H17.4958L12.7968 10.0623L9.00009 5H4.53657ZM6.46542 5.96344H8.51597L17.5709 18.0364H15.5203L6.46542 5.96344Z"
              />
            </svg>
          </a>
        )}
      </EventXShare>
      <EventLinkedInShare asChild eventPageUrl={eventPageUrl}>
        {({ shareUrl }) => (
          <a onClick={() => window.open(shareUrl, '_blank')}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18 4C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H18ZM8 10H6V17H8V10ZM12 10H10V17H12V13.5L12.0069 13.3555C12.0796 12.5949 12.7203 12 13.5 12C14.2797 12 14.9204 12.5949 14.9931 13.3555L15 13.5V17H17V13L16.9949 12.8237C16.9037 11.2489 15.5977 10 14 10C13.3085 10 12.6717 10.2339 12.1643 10.627L12.0001 10.7638L12 10ZM7 7C6.44772 7 6 7.44772 6 8C6 8.55228 6.44772 9 7 9C7.55228 9 8 8.55228 8 8C8 7.44772 7.55228 7 7 7Z"
              />
            </svg>
          </a>
        )}
      </EventLinkedInShare>
    </div>
  );
}
