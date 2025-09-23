import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import {
  NavigationProvider,
  type NavigationComponent,
} from "./blog/NavigationContext";
import {
  BlogCategoryRoute,
  blogCategoryRouteLoader,
} from "./routes/blog-category";
import { BlogIndexRoute, blogIndexRouteLoader } from "./routes/blog-index";
import { BlogPostRoute, blogPostRouteLoader } from "./routes/blog-post";

const router = createBrowserRouter(
  [
    {
      element: <Outlet />,
      children: [
        {
          path: "/react-router/blog/",
          element: <BlogIndexRoute />,
          loader: blogIndexRouteLoader,
          index: true,
        },
        {
          path: "/react-router/blog/post/:slug",
          element: <BlogPostRoute />,
          loader: blogPostRouteLoader,
        },
        {
          path: "/react-router/blog/category/:slug",
          element: <BlogCategoryRoute />,
          loader: blogCategoryRouteLoader,
        },
      ],
    },
  ],
  {}
);

const ReactRouterNavigationComponent: NavigationComponent = ({
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

export default function AppRouter() {
  return (
    <NavigationProvider navigationComponent={ReactRouterNavigationComponent}>
      <RouterProvider router={router} />
    </NavigationProvider>
  );
}
