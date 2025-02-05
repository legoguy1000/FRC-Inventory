import { useState } from 'react';
import { AuthProvider, SignInPage, AuthResponse } from '@toolpad/core/SignInPage';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { useSession } from '../components/SessionContext';
import { API_ENPOINT } from '../config';
import { AuthService } from '../Services';

declare const window: any;
type IWindowProps = {
    url: string;
    title: string;
    width: number;
    height: number;
};

type LoginProviders = "google" | "github";

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
    const { session, setToken } = useSession();
    const [searchParams, setSearchParams] = useSearchParams();
    const [externalWindow, setExternalWindow] = useState<Window | null>(null);
    let intervalRef: NodeJS.Timeout | null = null;
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
        google: async (code: string) => {
            return await AuthService.loginWithGoogle(code);
        },
        github: async (code: string) => {
            return await AuthService.loginWithGithub(code);
        }
    }

    const clearTimer = () => {
        window.clearInterval(intervalRef);
    };

    return (
        <div>
            <SignInPage
                providers={authProviders}
                signIn={async (provider, formData, callbackUrl) => {
                    try {
                        const authUrl = `${API_ENPOINT}/auth/login/${provider.id}?origin=${searchParams.get('callbackUrl')}`;
                        setExternalWindow(createPopup({
                            url: authUrl, title: 'OAuth Popup', width: 600, height: 400,
                        }));
                        // if (provider.id === 'google') {
                        //     const authUrl = `${API_ENPOINT}/auth/login/google?origin=${searchParams.get('callbackUrl')}`;
                        //     setExternalWindow(createPopup({
                        //         url: authUrl, title: 'OAuth Popup', width: 600, height: 400,
                        //     }));
                        // }
                    } catch (error) {
                        // return {
                        //     error: error instanceof Error ? error.message : 'An error occurred',
                        // };
                    }
                    return new Promise<AuthResponse>((resolve) => {
                        let counter = 0;
                        intervalRef = setInterval(() => {
                            counter++;
                            console.log(externalWindow)
                            console.log("checking for code")
                            try {
                                let data = localStorage.getItem('loginData')
                                if (data !== null && data !== "") {
                                    console.log(data)
                                    clearTimer();
                                    let { code, provider, state } = JSON.parse(data)
                                    handleLogin[provider as LoginProviders](code).then((login) => {
                                        console.log(login)
                                        let redirectTo = '/home';
                                        if (state !== null && state !== "") {
                                            let stateDict = JSON.parse(atob(state).toString());
                                            redirectTo = stateDict.origin || "/";
                                        }
                                        // setToast({ message: login.message, open: true, severity: login.error ? "error" : "success" })
                                        if (!login.error && login.token !== null) {
                                            resolve({ success: login.message });
                                            setToken(login.token);
                                            window.setTimeout(() => {
                                                navigate(redirectTo, { replace: true });
                                            }, 1000);
                                        } else {
                                            resolve({ error: login.message });
                                        }
                                        setExternalWindow(null)
                                        localStorage.setItem('loginData', '');
                                    });
                                }
                            } catch (error) {
                                console.log(error)
                                clearTimer();
                            }
                            if (counter == 60) {
                                clearTimer();
                            }
                        }, 1000);
                    });
                }}
            />
        </div>
    );
}
