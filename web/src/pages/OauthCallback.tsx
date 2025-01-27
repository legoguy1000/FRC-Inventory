import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router";
import { AuthService } from '../Services';
import { useSession } from '../components/SessionContext';

type LoginProviders = "google";


export default function Callback() {
    const { session, setSession, token, setToken, loading } = useSession();
    const navigate = useNavigate();
    const location = useLocation();
    const pathArr = location.pathname.split('/')
    const provider = pathArr[pathArr.length - 1]
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    const handleLogin = {
        google: async (code: string) => {
            const login = await AuthService.loginWithGoogle(code);
            console.log(login)
            // window.opener.postMessage({ token: login }, '*');
            setToken(login);
            navigate("/", { replace: true });
        }
    }

    useEffect(() => {
        console.log(provider)
        if (code) {
            console.log(code)
            handleLogin[provider as LoginProviders](code)
        }
    }, [code]);
    return <div>Processing Authentication...{JSON.stringify(session)}</div>;
};
