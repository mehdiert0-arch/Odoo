import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Clients from "../pages/Clients";
import ClientDetails from "../pages/ClientDetails";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/clients',
                element: <Clients />
            },
            {
                path: '/clients/:id',
                element: <ClientDetails />
            },
            {
                path: '/products',
                element: <Products />
            },
            {
                path: '/products/:id',
                element: <ProductDetails />
            }
        ]
    },

    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <div className="auth-card">
                    <h2 className="auth-title">Regstration not implemented yet as per AuthController.</h2>
                    <br />
                    <a style={{ color: '#818cf8', cursor: 'pointer' }} onClick={() => window.history.back()}>Go back to login</a>
                </div>
            }
        ]
    },

    {
        path: '*',
        element: <div id="center">
            <h1>404 Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    }

]);

export default router;
