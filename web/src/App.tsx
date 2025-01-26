import { createContext, useState, useMemo, useEffect } from 'react';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from "react-router";
import type { Navigation, Authentication } from '@toolpad/core';
import { SessionContext, type Session } from './components/SessionContext';
import { jwtDecode, JwtPayload } from "jwt-decode";

interface InventoryJwtPayload extends JwtPayload {
    firstName: string;
    lastName: string;
    name: string;
}


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
    {
        kind: 'divider',
    },
    {
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
        ],
    }
];
const BRANDING = {
    title: 'My Toolpad Core App',
};


export default function App(props: { disableCustomTheme?: boolean }) {
    const navigate = useNavigate();
    const [session, setSession] = useState<Session | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
    useEffect(() => {
        console.log(token)
        if (token != null && token !== "") {
            try {
                const decoded = jwtDecode<InventoryJwtPayload>(token);
                const decodedHeader = jwtDecode<InventoryJwtPayload>(token, { header: true });
                setSession({
                    user: {
                        name: decoded.name,
                        image: "",
                        email: ""
                    },
                    token: token
                })
                console.log(decoded);
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
            // setSession(null)
        },
    };
    useEffect(() => {
        let token = localStorage.getItem('token')

        if (token != null && token !== "") {
            setToken(token);
        }
        // Returns an `unsubscribe` function to be called during teardown
        // const unsubscribe = onAuthStateChanged((user: User | null) => {
        //     if (user) {
        //         setSession({
        //             user: {
        //                 name: user.displayName || '',
        //                 email: user.email || '',
        //                 image: user.photoURL || '',
        //             },
        //         });
        //     } else {
        //         setSession(null);
        //     }
        //     setLoading(false);
        // });

        // return () => unsubscribe();
    }, []);

    return (
        <ReactRouterAppProvider
            navigation={NAVIGATION}
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
