import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthService } from '../Services';
import { useSession } from '../components/SessionContext';
import { Stack } from '@mui/material';

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
    return <div>
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
        >
            <Stack alignItems="center">
                <div style={{ fontSize: "xxx-large" }}>Processing Authentication......</div>
                <CircularProgress color="primary" size="30vh" />
            </Stack>
        </Backdrop>
    </div>;
};
