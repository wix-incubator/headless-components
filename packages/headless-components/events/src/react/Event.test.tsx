import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React, { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Event as EventType } from '../services/event-service.js';
import * as Event from './Event';

const mockEvent: EventType = {
  _id: 'test-event-id',
  title: 'Event Title',
  slug: 'event-title',
  status: 'UPCOMING',
  mainImage: 'https://example.com/image.jpg',
  dateAndTimeSettings: {
    startDate: new Date('2026-01-15T21:00:00Z'),
    endDate: new Date('2026-01-15T23:00:00Z'),
    timeZoneId: 'America/New_York',
    dateAndTimeTbd: false,
    dateAndTimeTbdMessage: '',
    hideEndDate: false,
    showTimeZone: true,
  },
  location: {
    type: 'VENUE',
    name: 'New York',
    address: {
      // @ts-expect-error
      formatted: '123 Main St, New York, NY 10001',
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
  },
  shortDescription: 'Short event description',
  description: {
    nodes: [],
    documentStyle: {},
  },
  registration: {
    type: 'RSVP',
    status: 'OPEN_RSVP',
    rsvp: {
      // @ts-expect-error
      formId: 'test-form-id',
    },
  },
};

const renderEvent = (children: ReactElement, event = mockEvent) =>
  render(<Event.Root event={event}>{children}</Event.Root>);

describe('Event Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Event.Image', () => {
    it('should render event image', () => {
      renderEvent(<Event.Image className="image-class" />);

      const element = screen.getByTestId('event-image');

      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('image-class');
      expect(element).toHaveProperty('tagName', 'IMG');
    });

    it('should render with asChild using React element', () => {
      renderEvent(
        <Event.Image asChild>
          <img className="image-class" />
        </Event.Image>,
      );

      const element = screen.getByTestId('event-image');

      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('image-class');
      expect(element).toHaveProperty('tagName', 'IMG');
    });

    it('should render with asChild using render function', () => {
      const renderFunction = vi.fn((props, ref) => (
        <img
          ref={ref}
          data-testid="custom-image"
          src={props.src}
          alt={props.alt}
        />
      ));

      renderEvent(
        <Event.Image asChild className="image-class">
          {renderFunction}
        </Event.Image>,
      );

      const element = screen.getByTestId('custom-image');

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          src: expect.stringContaining('static.wixstatic.com'),
        }),
        expect.any(Object),
      );
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('image-class');
      expect(element).toHaveProperty('tagName', 'IMG');
    });
  });

  describe('Event.Title', () => {
    it('should render event title', () => {
      renderEvent(<Event.Title className="title-class" />);

      const element = screen.getByTestId('event-title');

      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('title-class');
      expect(element).toHaveProperty('tagName', 'SPAN');
      expect(element).toHaveTextContent(mockEvent.title!);
    });

    it('should render with asChild using React element', () => {
      renderEvent(
        <Event.Title asChild>
          <h2 className="title-class" />
        </Event.Title>,
      );

      const element = screen.getByTestId('event-title');

      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('title-class');
      expect(element).toHaveProperty('tagName', 'H2');
      expect(element).toHaveTextContent(mockEvent.title!);
    });

    it('should render with asChild using render function', () => {
      const renderFunction = vi.fn((props, ref) => (
        <h2 ref={ref} data-testid="custom-title">
          {props.title}
        </h2>
      ));

      renderEvent(
        <Event.Title asChild className="title-class">
          {renderFunction}
        </Event.Title>,
      );

      const element = screen.getByTestId('custom-title');

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          title: mockEvent.title,
        }),
        expect.any(Object),
      );
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('title-class');
      expect(element).toHaveProperty('tagName', 'H2');
      expect(element).toHaveTextContent(mockEvent.title!);
    });
  });

  describe('Event.Date', () => {
    it('should render event date', () => {
      renderEvent(<Event.Date className="date-class" />);

      const element = screen.getByTestId('event-date');

      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('date-class');
      expect(element).toHaveProperty('tagName', 'SPAN');
      expect(element).toHaveTextContent('Thu, Jan 15');
    });

    it('should render event date with format: full', () => {
      renderEvent(<Event.Date className="date-class" format="full" />);

      const element = screen.getByTestId('event-date');

      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('date-class');
      expect(element).toHaveProperty('tagName', 'SPAN');
      expect(element).toHaveTextContent(
        'Jan 15, 2026, 04:00 PM - Jan 15, 2026, 06:00 PM EST',
      );
    });

    it('should render with asChild using React element', () => {
      renderEvent(
        <Event.Date asChild>
          <time className="date-class" />
        </Event.Date>,
      );

      const element = screen.getByTestId('event-date');

      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('date-class');
      expect(element).toHaveProperty('tagName', 'TIME');
      expect(element).toHaveTextContent('Thu, Jan 15');
    });

    it('should render with asChild using render function', () => {
      const renderFunction = vi.fn((props, ref) => (
        <time ref={ref} data-testid="custom-date">
          {props.formattedDate}
        </time>
      ));

      renderEvent(
        <Event.Date asChild className="date-class">
          {renderFunction}
        </Event.Date>,
      );

      const element = screen.getByTestId('custom-date');

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: mockEvent.dateAndTimeSettings!.startDate,
          endDate: mockEvent.dateAndTimeSettings!.endDate,
          timeZoneId: mockEvent.dateAndTimeSettings!.timeZoneId,
          dateAndTimeTbd: mockEvent.dateAndTimeSettings!.dateAndTimeTbd,
          dateAndTimeTbdMessage: null,
          hideEndDate: mockEvent.dateAndTimeSettings!.hideEndDate,
          showTimeZone: mockEvent.dateAndTimeSettings!.showTimeZone,
          formattedDate: 'Thu, Jan 15',
        }),
        expect.any(Object),
      );
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('date-class');
      expect(element).toHaveProperty('tagName', 'TIME');
      expect(element).toHaveTextContent('Thu, Jan 15');
    });
  });
});
