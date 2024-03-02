import { createBrowserRouter } from "react-router-dom";

import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";

import { Home } from "./pages/home";
import { CarDetails } from "./pages/car";
import { DashBoard } from "./pages/dashboard";
import { Layout } from "./components/layout";
import { New } from "./pages/dashboard/new";
import { PrivateRoutes } from "./routes/private";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/car/:id",
        element: (
          <PrivateRoutes>
            <CarDetails />
          </PrivateRoutes>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoutes>
            <DashBoard />
          </PrivateRoutes>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <PrivateRoutes>
            <New />
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
]);

export { router };
