import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import {
  EventListPage,
  eventListPageLoader,
} from '@/components/events/EventList';
import {
  EventDetailsPage,
  eventDetailsPageLoader,
} from '@/components/events/EventDetails';
import { SchedulePage, schedulePageLoader } from '@/components/events/Schedule';
import { ThankYouPage, thankYouPageLoader } from '@/components/events/ThankYou';

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/events',
          element: <EventListPage eventDetailsPagePath="/events/:slug" />,
          loader: eventListPageLoader,
        },
        {
          path: '/events/:slug',
          element: (
            <EventDetailsPage
              eventDetailsPagePath="/events/:slug"
              formPagePath="/events/:slug/form"
              schedulePagePath="/events/:slug/schedule"
            />
          ),
          loader: eventDetailsPageLoader,
        },
        {
          path: '/events/:slug/schedule',
          element: <SchedulePage eventDetailsPagePath="/events/:slug" />,
          loader: schedulePageLoader,
        },
        {
          path: '/events/:slug/thank-you',
          element: <ThankYouPage eventDetailsPagePath="/events/:slug" />,
          loader: thankYouPageLoader,
        },
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_NAME,
  }
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
