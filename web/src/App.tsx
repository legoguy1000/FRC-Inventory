import { createContext, useState } from 'react';
import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';
import type { } from '@mui/x-data-grid/themeAugmentation';
import type { } from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AppTheme from './theme/AppTheme';
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from './theme/customizations';
import { Outlet } from "react-router";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export const NavTitleContext = createContext({ title: '', setTitle: (x: any) => { } });
// Provide the context
export const NavProvider = ({ children }) => {
    const [title, setTitle] = useState('');

    return (
        <NavTitleContext.Provider value={{ title, setTitle }}>
            {children}
        </NavTitleContext.Provider>
    );
};

export default function App(props: { disableCustomTheme?: boolean }) {
    const [token, setToken] = useState();

    return (
        <NavProvider>
            <AppTheme {...props} themeComponents={xThemeComponents}>
                <CssBaseline enableColorScheme />
                <Box sx={{ display: 'flex' }}>
                    <SideMenu />
                    <AppNavbar />
                    {/* Main content */}
                    <Box
                        component="main"
                        sx={(theme) => ({
                            flexGrow: 1,
                            backgroundColor: alpha(theme.palette.background.default, 1),
                            overflow: 'auto',
                            height: '100%'
                        })}
                    >
                        <Stack
                            spacing={2}
                            sx={{
                                alignItems: 'center',
                                mx: 3,
                                pb: 5,
                                mt: { xs: 8, md: 0 },
                                height: '100%'
                            }}
                        >
                            <Header />
                            <Outlet />
                        </Stack>
                    </Box>
                </Box>
            </AppTheme>
        </NavProvider>
    );
}
