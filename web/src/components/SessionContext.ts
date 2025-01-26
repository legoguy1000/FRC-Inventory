import * as React from 'react';

export interface Session {
    user: {
        name?: string;
        email?: string;
        image?: string;
    }
    token: string;
}

interface SessionContextType {
    session: Session | null;
    setSession: (session: Session) => void;
    token: string | null;
    setToken: (token: string) => void;
    loading: boolean;
}

export const SessionContext = React.createContext<SessionContextType>({
    session: null,
    setSession: () => { },
    token: null,
    setToken: () => { },
    loading: true,
});

export const useSession = () => React.useContext(SessionContext);
