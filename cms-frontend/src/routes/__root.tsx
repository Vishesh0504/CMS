import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "react-hot-toast";

const RootComponent = () => {
  return (
    <div>
      <Toaster />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
};
export const Route = createRootRouteWithContext()({
  component: () => <RootComponent />,
});
