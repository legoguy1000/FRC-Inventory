import { createContext, useState, useMemo, useEffect } from 'react';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Navigate, Outlet, useNavigate } from "react-router";
import type { Navigation, Authentication, Session, NavigationItem } from '@toolpad/core';
import { SessionContext, CustomSession } from './components/SessionContext';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { UserOrg } from './components/UserOrg';
import { WEBSITE_TITLE } from './config'
import { User } from '../../server/src/interfaces';

interface InventoryJwtPayload extends JwtPayload, User {

}

const BRANDING = {
    title: WEBSITE_TITLE
};


const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'home',
        title: 'Home',
        // icon: <DashboardIcon />,
    },
    {
        segment: 'app/dashboard',
        title: 'Dashboard',
        // icon: <DashboardIcon />,
    },
    {
        segment: 'app/inventory',
        title: 'Inventory',
        // icon: <ShoppingCartIcon />,
    },
];
const NAVIGATION_ADMIN: NavigationItem = {
    segment: "app/admin",
    title: "Admin",
    children: [
        {
            segment: 'projects',
            title: 'Projects',
            // icon: <DescriptionIcon />,
        },
        {
            segment: 'parts',
            title: 'Parts',
            // icon: <DescriptionIcon />,
        },
        {
            segment: 'users',
            title: 'Users',
            // icon: <DescriptionIcon />,
        },
    ],
}

const buildNavBar = (session: CustomSession | null) => {
    let nav: Navigation = [];
    nav = nav.concat(NAVIGATION);
    if (session !== null && session?.admin) {
        nav.push(NAVIGATION_ADMIN)
    }
    return nav;
}
export default function App(props: { disableCustomTheme?: boolean }) {
    const navigate = useNavigate();
    const [session, setSession] = useState<CustomSession | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [sideBarNav, setSideBarNav] = useState<Navigation>(buildNavBar(session));
    const sessionContextValue = useMemo(
        () => ({
            session,
            setSession,
            token,
            setToken,
            loading,
        }),
        [session, loading],
    );
    // let sideBarNav: Navigation = [];
    useEffect(() => {
        if (token != null && token !== "") {
            try {
                const decoded = jwtDecode<InventoryJwtPayload>(token);
                // const decodedHeader = jwtDecode<InventoryJwtPayload>(token, { header: true });
                setSession({
                    user: {
                        id: decoded.id,
                        name: decoded.name,
                        email: decoded.email,
                        image: decoded.avatar,
                    },
                    admin: decoded.admin
                })
                localStorage.setItem('token', token);
            } catch (error) {
                setSession(null)
                localStorage.setItem('token', "");
            }
        } else {
            setSession(null)
        }
    }, [token]);

    const AUTHENTICATION: Authentication = {
        signIn: () => {
            navigate('/sign-in');
        },
        signOut: () => {
            navigate('/')
            localStorage.setItem('token', "");
            setToken(null)
            setSession(null)
        },
    };
    useEffect(() => {
        let token = localStorage.getItem('token')

        if (token != null && token !== "") {
            setToken(token);
        }
    }, []);
    useEffect(() => {
        setSideBarNav(buildNavBar(session));
    }, [session])



    return (
        <ReactRouterAppProvider
            navigation={sideBarNav}
            branding={BRANDING}
            session={session}
            authentication={AUTHENTICATION}
        >
            <SessionContext.Provider value={sessionContextValue}>
                <Outlet />
            </SessionContext.Provider>
        </ReactRouterAppProvider>
    );
}
