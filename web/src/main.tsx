import { createContext, useState, StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate, createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from './components/AuthProvider';
import MainDash from './pages/Dashboard';
import Login from './pages/Login';
import PartsHome from './pages/parts/Parts'
import Part from './pages/parts/Part'
import ProjectHome from './pages/projects/Projects'
import Inventory from './pages/inventory/Inventory'
import SignInPage from './pages/signIn'
import './main.css'
import Layout from './layouts';
import Home from './layouts/home';

const router = createBrowserRouter([
    {
        Component: App, // root layout route
        children: [
            {
                path: '/',
                Component: Home,
                children: [
                    {
                        path: 'home',
                        index: true,
                        // Component: MainDash,
                    },
                ]
            },
            {
                path: '/app',
                Component: Layout,
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
            {
                path: 'sign-in',
                Component: SignInPage,
            },
        ],
    },
]);

ReactDOM.createRoot(document.querySelector("#root")!).render(
    <RouterProvider router={router} />
);
