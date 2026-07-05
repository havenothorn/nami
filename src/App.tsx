/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as exploreRoute } from './routes/explore';
import { Route as aboutRoute } from './routes/about';
import { Route as postIdRoute } from './routes/posts.$postId';
import { NotFound } from './NotFound';

// Programmatically assemble the routes to guarantee seamless Vite compilation
const routeTree = rootRoute.addChildren([
  indexRoute,
  exploreRoute,
  aboutRoute,
  postIdRoute
]);

// Initialize the TanStack router
export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <NotFound />
});

// Configure module type registration for type-safe route parameters
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
