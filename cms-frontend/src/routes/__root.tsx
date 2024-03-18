// import Navbar from "@/components/Navbar";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
const RootComponent = () => {
  return (
    <div>
      {/* <Navbar/> */}
      <Toaster />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
};
export const Route = createRootRouteWithContext()({
  component: () => (
    <AuthProvider>
      <RootComponent />,
    </AuthProvider>
  ),
});
