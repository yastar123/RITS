import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { AuthContextValue } from "./hooks/use-auth";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient, auth: undefined! as AuthContextValue },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
