import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthService } from '../Services';
import { useSession } from '../components/SessionContext';
import { Stack } from '@mui/material';
import { red } from '@mui/material/colors';

export default function Callback() {
    const { session, setSession, token, setToken, loading } = useSession();
    const navigate = useNavigate();
    const location = useLocation();
    const pathArr = location.pathname.split('/')
    const provider = pathArr[pathArr.length - 1]
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    useEffect(() => {
        if (code) {
            localStorage.setItem('loginData', JSON.stringify({
                code: code,
                provider: provider,
                state: state || ""
            }));
            window.close();
        }
    }, [code]);

    return <div>
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
        >
            <Stack alignItems="center">
                <div style={{ fontSize: "xxx-large" }}>Processing</div>
                <CircularProgress color="primary" size="30vh" />
                <div style={{ fontSize: "xxx-large" }}>Authentication......</div>
            </Stack>
        </Backdrop>
    </div>;
};
