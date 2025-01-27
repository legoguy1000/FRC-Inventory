import { createContext, useState, StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import MainDash from './pages/Dashboard';
import PartsHome from './pages/parts/Parts'
import ProjectHome from './pages/projects/Projects'
import Inventory from './pages/inventory/Inventory'
import SignInPage from './pages/SignIn'
import OauthCallback from './pages/OauthCallback'
import './main.css'
import Layout from './layouts';
import Home from './pages/home';

const router = createBrowserRouter([
    {
        path: '/',
        Component: App, // root layout route
        children: [
            {
                Component: Layout,
                children: [
                    {
                        path: 'home',
                        Component: Home,
                    },
                    {
                        path: 'app',
                        children: [
                            {
                                path: 'dashboard',
                                Component: MainDash,

                            },
                            {
                                path: 'inventory',
                                Component: Inventory,
                            },
                            {
                                path: 'admin',
                                children: [
                                    {
                                        path: 'projects',
                                        Component: ProjectHome,
                                    },
                                    {
                                        path: 'parts',
                                        Component: PartsHome,
                                    },
                                ],
                            }
                        ],
                    },
                ],
            },
            {
                path: 'sign-in',
                Component: SignInPage,
            },
            {
                path: 'auth/callback',
                Component: OauthCallback,
                children: [
                    {
                        path: 'google',
                    },
                    {
                        path: 'github',
                    },
                ],
            },
            {
                index: true,
                element: < Navigate to="/home" replace={true} />,
            },
            {
                path: "*",
                element: < Navigate to="/home" replace={true} />,
            },
        ]
    }]);

ReactDOM.createRoot(document.querySelector("#root")!).render(
    <RouterProvider router={router} />
);
