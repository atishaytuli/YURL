import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from './layouts/app-layout'
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Redirect from "./pages/Redirect";
import Link from "./pages/Link";
import UrlProvider from "./context";
import RequireAuth from "./components/require-auth";

const router = createBrowserRouter([
  {
    element :<AppLayout/>,
    children :[
      { 
        path: "/", 
        element:<LandingPage />
      },

      { path: "/dashboard", 
        element: 
        <RequireAuth>
                  <Dashboard />
        </RequireAuth>

      },

      { path: "/auth", 
        element: <Auth /> 
      },

      {
        path: "/yurllink:id",
        element:         <RequireAuth>
                  <Link />
        </RequireAuth>

      },

      { path: "/:id", 
        element: <Redirect />
      },

    ]
  }
])

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
      </UrlProvider>
  );
}

export default App;
