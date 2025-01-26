import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface InventoryJwtPayload extends JwtPayload {
    firstName: string;
    lastName: string;
    fullName: string;
}

const fakeAuth = (): Promise<string> =>
    new Promise((resolve) => {
        setTimeout(() => resolve("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"), 250);
    });

const AuthContext = createContext<{
    token: string;
    onLogin: () => void;
    onLogout: () => void;
}>({
    token: "",
    onLogin: () => { },
    onLogout: () => { },
});

type AuthProviderProps = {
    children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState(() => {
        const token = localStorage.getItem('token');
        return token ? token : '';
    });
    const [isadmin, setAdmin] = useState(false);

    useEffect(() => {
        let temp = token;
        if (token !== "") {
            try {
                const decoded = jwtDecode<InventoryJwtPayload>(token);
                const decodedHeader = jwtDecode<InventoryJwtPayload>(token, { header: true });
                console.log(decoded);
            } catch (error) {
                temp = "";
                setAdmin(false)
            }
            // const admin = decoded
        } else {
            setAdmin(false)
        }
        localStorage.setItem('token', temp);
    }, [token]);

    const handleLogin = async () => {
        const token = await fakeAuth();

        setToken(token);
    };

    const handleLogout = () => {
        setToken("");
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthProvider, useAuth };
