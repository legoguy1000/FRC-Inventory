import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../components/SessionContext';
import { UserOrg } from '../components/UserOrg';
import { Account } from '@toolpad/core/Account';

export default function Layout() {
    const { session, loading } = useSession();
    const location = useLocation();
    // if (loading) {
    //     return (
    //         <div style={{ width: '100%' }}>
    //             <LinearProgress />
    //         </div>
    //     );
    // }
    // if (!session) {
    //     // Add the `callbackUrl` search parameter
    //     const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;

    //     return <Navigate to={redirectTo} replace />;
    // }

    // slots={{ toolbarAccount: UserOrg }}
    return (
        <DashboardLayout sx={{ flex: 1 }}>
            <PageContainer style={{ maxWidth: "unset" }}>
                <Outlet />
            </PageContainer>
        </DashboardLayout>
    );
}
