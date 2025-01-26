import * as React from 'react';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { LocalDining } from '@mui/icons-material';

interface InventoryJwtPayload extends JwtPayload {
    firstName: string;
    lastName: string;
    name: string;
}

interface Session {
    user: {
        name?: string;
        email?: string;
        image?: string;
    }
    token: string;
}

interface SessionContextType {
    session: Session | null;
    setToken: (token: string) => void;
    loading: boolean;
}

const SessionContext = React.createContext<SessionContextType>({
    session: null,
    setToken: () => { },
    loading: true,
});

type SessionProviderProps = {
    children: React.ReactNode;
};

const SessionProvider = ({ children }: SessionProviderProps) => {
    const [token, setToken] = React.useState("");
    const [session, setSession] = React.useState<Session | null>(null);

    React.useEffect(() => {
        let token = localStorage.getItem('token');
        setToken(token !== null ? token : '');
    }, []);

    React.useEffect(() => {
        console.log(token)
        if (token !== "") {
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

    let value: SessionContextType = {
        session: null,
        setToken: setToken,
        loading: false
    }
    React.useEffect(() => {
        value.session = session;
        console.log(value)
    }, [session]);


    // const handleLogin = async (session: Session) => {
    //     const token = await fakeAuth();
    //     setToken(token);
    // };

    // const handleLogout = () => {
    //     setToken("");
    // };

    // const value = {
    //     session: session,
    //     setToken: setToken,
    //     loading: false,
    // };

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
const useSession = () => React.useContext(SessionContext);


export { SessionProvider, SessionContext, useSession, type Session }

