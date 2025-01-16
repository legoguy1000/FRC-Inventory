import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import MainDash from './pages/Dashboard';
import Login from './pages/Login';
import PartsHome from './pages/parts/PartsHome'
import Part from './pages/parts/Part'

ReactDOM.createRoot(document.querySelector("#root")!).render(
    // <React.StrictMode>
    <StyledEngineProvider injectFirst>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App disableCustomTheme={true} />}>
                    <Route path="home" />
                    <Route path="login" element={<Login />} />
                    <Route path="dashboard" element={<MainDash />} />
                    <Route path="inventory" />
                    <Route path="admin">
                        <Route path="parts">
                            <Route index element={<PartsHome />} />
                            <Route path=":pid" element={<Part />} />
                            {/* <Route element={<PartsLayout />}>
                                <Route path=":pid" element={<Project />} />
                                <Route path=":pid/edit" element={<EditProject />} />
                            </Route> */}
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </BrowserRouter>
    </StyledEngineProvider>
    // </React.StrictMode>
);
