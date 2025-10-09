import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  Link,
} from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import {
  EventListPage,
  eventListPageLoader,
} from '@/components/events/EventList/EventListPage';
import {
  EventDetailsPage,
  eventDetailsPageLoader,
} from '@/components/events/EventDetails/EventDetailsPage';
import { FormPage, formPageLoader } from '@/components/events/Form/FormPage';
import {
  SchedulePage,
  schedulePageLoader,
} from '@/components/events/Schedule/SchedulePage';
import {
  ThankYouPage,
  thankYouPageLoader,
} from '@/components/events/ThankYou/ThankYouPage';
import {
  NavigationProvider,
  type NavigationComponent,
} from '@/components/NavigationContext';

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Outlet />
    </div>
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
              thankYouPagePath="/events/:slug/thank-you"
            />
          ),
          loader: eventDetailsPageLoader,
        },
        {
          path: '/events/:slug/form',
          element: <FormPage thankYouPagePath="/events/:slug/thank-you" />,
          loader: formPageLoader,
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
    basename: '/react-router',
  }
);

export default function AppRouter() {
  return (
    <NavigationProvider navigationComponent={NavigationComponent}>
      <RouterProvider router={router} />
    </NavigationProvider>
  );
}

const NavigationComponent: NavigationComponent = ({
  route,
  children,
  ...props
}) => {
  return (
    <Link to={route} {...props}>
      {children}
    </Link>
  );
};
