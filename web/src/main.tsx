import { createContext, useState, StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider, Navigate, To, redirect, useLocation } from "react-router";
import { CustomSession, useSession, loggedIn } from './components/SessionContext';
import MainDash from './pages/Dashboard';
import PartsHome from './pages/parts/Parts'
import ProjectHome from './pages/projects/Projects'
import Inventory from './pages/inventory/Inventory'
import SignInPage from './pages/SignIn'
import OauthCallback from './pages/OauthCallback'
import './main.css'
import Layout from './layouts';
import Home from './pages/home';

const RequireAuth = ({ children, redirectTo, admin = false }: { children: any, redirectTo: To, admin?: boolean }) => {
    const { session } = useSession();
    const location = useLocation();
    let requireAdmin: boolean = false;
    if (admin && !session?.admin) {
        requireAdmin = true;
    }
    if (session && !requireAdmin) {
        return children;
    }
    const redirect = `${redirectTo}?callbackUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirect} replace />;
}

// const adminRoutes = () => {
//     // if (session === null || !session?.admin) {
//     //     return {}
//     // }
//     return {
//         path: 'admin',
//         // loader: async () => {
//         //     const { session } = useSession();
//         //     // const isLoggedIn: boolean = await loggedIn();

//         //     if (session === null || session?.admin) {
//         //         // return redirect("/");
//         //     }

//         //     return null;
//         // },
//         // element: < RequireAuth redirectTo="/sign-in" admin={true} > <></></RequireAuth >,
//         children: [
//             {
//                 path: 'projects',
//                 Component: ProjectHome,
//             },
//             {
//                 path: 'parts',
//                 Component: PartsHome,
//             },
//         ],
//     }
// }

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
                                element: <RequireAuth redirectTo="/sign-in"><MainDash /></RequireAuth>,

                            },
                            {
                                path: 'inventory',
                                Component: Inventory,
                            },
                            {
                                path: 'admin',
                                element: < RequireAuth redirectTo="/sign-in" admin={true} > <></></RequireAuth >,
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
