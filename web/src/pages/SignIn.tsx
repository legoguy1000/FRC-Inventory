import React, { useEffect, useState, useRef } from 'react';
import { AuthProvider, SignInPage } from '@toolpad/core/SignInPage';
import LinearProgress from '@mui/material/LinearProgress';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { useSession } from '../components/SessionContext';
import { API_ENPOINT } from '../config';
import { AuthService } from '../Services';


// const fakeAuth = (): Promise<string> =>
//     new Promise((resolve) => {
//         setTimeout(() => resolve("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"), 250);
//     });
declare const window: any;
type IWindowProps = {
    url: string;
    title: string;
    width: number;
    height: number;
};

type LoginProviders = "google";

const createPopup = ({
    url, title, height, width,
}: IWindowProps) => {
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const externalPopup = window.open(
        url,
        title,
        `width=${width},height=${height},left=${left},top=${top},rel="opener"`,
    );
    localStorage.setItem('loginData', '');
    return externalPopup;
};

export default function SignIn() {
    const { session, setSession, token, setToken, loading } = useSession();
    const [searchParams, setSearchParams] = useSearchParams();
    const [externalWindow, setExternalWindow] = useState<Window | null>(null);
    const [loginData, setLoginData] = useState("");
    const intervalRef = useRef<number>(0);
    const navigate = useNavigate();

    let authProviders: AuthProvider[] = [];
    if (window.GOOGLE_OAUTH_ENABLED) {
        authProviders.push({ id: 'google', name: 'Google' })
    }
    if (window.GITHUB_OAUTH_ENABLED) {
        authProviders.push({ id: 'github', name: 'Github' })
    }

    if (session) {
        return <Navigate to="/" />;
    }

    const handleLogin = {
        google: async (code: string): Promise<{ token: string }> => {
            return await AuthService.loginWithGoogle(code);
            // let token: string = login.token;
        }
    }

    const clearTimer = () => {
        window.clearInterval(intervalRef.current);
    };

    useEffect(() => {
        if (externalWindow) {
            console.log(externalWindow)
            intervalRef.current = window.setInterval(() => {
                console.log("checking for code")
                try {
                    let data = localStorage.getItem('loginData')
                    if (data !== null && data !== "") {
                        console.log(data)
                        setLoginData(data)
                        clearTimer();
                    }
                } catch (error) {
                    console.log(error)
                    clearTimer();
                }
                try {
                    if (externalWindow !== null && externalWindow.closed) {
                        clearTimer();
                    }
                } catch (error) {
                    console.log(error)
                }
            }, 700);
        }
    }, [externalWindow]);

    useEffect(() => {
        console.log(loginData)
        if (loginData === null || loginData === "") {
            return
        }
        let { code, provider, state } = JSON.parse(loginData)
        handleLogin[provider as LoginProviders](code).then((login) => {
            console.log(login)
            let redirectTo = '/home';
            if (state !== null && state !== "") {
                let stateDict = JSON.parse(atob(state).toString());
                redirectTo = stateDict.origin || "/";
            }
            // setToken(login.token);
            navigate(redirectTo, { replace: true });
            setLoginData("")
            setExternalWindow(null)
            localStorage.setItem('loginData', '');
        });
    }, [loginData])
    return (
        <SignInPage
            providers={authProviders}
            signIn={async (provider, formData, callbackUrl) => {
                try {
                    if (provider.id === 'google') {
                        const authUrl = `${API_ENPOINT}/auth/login/google?origin=${searchParams.get('callbackUrl')}`;
                        // window.location.href = authUrl;
                        // navigate(authUrl, { replace: true })
                        setExternalWindow(createPopup({
                            url: authUrl, title: 'OAuth Popup', width: 600, height: 400,
                        }));
                        console.log('asdf')
                        // const popup = window.open(authUrl, 'OAuth Popup', 'width=600,height=400');
                        // let token = await fakeAuth();
                        // result = { success: true, token: token, error: "" }
                    }
                    // if (result?.success && result?.token) {
                    //     // Convert Firebase user to Session format
                    //     // const userSession: Session = {
                    //     //     user: {
                    //     //         name: result.user.displayName || '',
                    //     //         email: result.user.email || '',
                    //     //         image: result.user.photoURL || '',
                    //     //     },
                    //     //     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                    //     // };
                    //     setToken(result.token);
                    //     navigate(decodeURIComponent(callbackUrl || '/'), { replace: true });
                    // }
                    // return { error: result?.error || 'Failed to sign in' };
                } catch (error) {
                    // return {
                    //     error: error instanceof Error ? error.message : 'An error occurred',
                    // };
                }
                return { success: "asdfadsf" };
            }}
        />
    );
}
