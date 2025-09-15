import type { ComponentPropsWithoutRef } from 'react';

export interface MeetingButtonData {
  bookingUrl: string;
  buttonText?: string;
}

export interface MeetingButtonProps extends ComponentPropsWithoutRef<'button'> {
  bookingUrl: string;
  buttonText?: string;
  asChild?: boolean;
}

export enum TestIds {
  meetingButton = 'meeting-button',
  meetingButtonText = 'meeting-button-text',
}
