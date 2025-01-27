import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../components/SessionContext';
import { Typography } from '@mui/material';

export default function Layout() {
    return (
        <Typography>This is the home page</Typography>
    );
}
