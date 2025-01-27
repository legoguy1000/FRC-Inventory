import * as React from 'react';
import { User } from '../../../server/src/interfaces';
import type { Session } from '@toolpad/core';

// export interface Session {
//     user:
// }

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
