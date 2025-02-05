import * as React from 'react';
import { User } from '../../../server/src/interfaces';
// import type { Session } from '@toolpad/core';
import { Session } from '@toolpad/core/AppProvider';
// import { useSession } from '@toolpad/core/useSession';

export interface CustomSession extends Session {
    // org: {
    //     name: string;
    //     url: string;
    //     logo: string;
    // };
    admin: boolean;
}

interface SessionContextType {
    session: CustomSession | null;
    setSession: (session: CustomSession) => void;
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

export const loggedIn = () => {
    return useSession().session !== null;
}
