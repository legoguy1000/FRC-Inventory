import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../components/SessionContext';

export default function Layout() {
    return (
        <DashboardLayout sx={{ flex: 1 }}>
            <PageContainer style={{ maxWidth: "unset" }}>
                <Outlet />
            </PageContainer>
        </DashboardLayout>
    );
}
