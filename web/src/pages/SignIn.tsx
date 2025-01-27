'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import LinearProgress from '@mui/material/LinearProgress';
import { Navigate, useNavigate } from 'react-router';
import { useSession } from '../components/SessionContext';
import { API_ENPOINT } from '../Services/config';

// const fakeAuth = (): Promise<string> =>
//     new Promise((resolve) => {
//         setTimeout(() => resolve("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"), 250);
//     });

export default function SignIn() {
    const { session, setSession, token, setToken, loading } = useSession();
    const navigate = useNavigate();

    // if (loading) {
    //     return <LinearProgress />;
    // }

    if (session) {
        return <Navigate to="/" />;
    }

    window.addEventListener('message', (event) => {
        if (event.data.token) {
            console.log(`asdfasdfadsf ${event.data.token}`)
        }
    });

    return (
        <SignInPage
            providers={[
                { id: 'google', name: 'Google' },
                { id: 'github', name: 'GitHub' },
                // { id: 'credentials', name: 'Credentials' },
            ]}
            signIn={async (provider, formData, callbackUrl) => {
                let result;
                try {
                    if (provider.id === 'google') {
                        const authUrl = `${API_ENPOINT}/auth/login/google?origin=${window.location.origin}`;
                        navigate(authUrl)
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
                    return {};
                    // }
                    return { error: result?.error || 'Failed to sign in' };
                } catch (error) {
                    return {
                        error: error instanceof Error ? error.message : 'An error occurred',
                    };
                }
            }}
        />
    );
}
