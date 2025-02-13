import { createContext, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import MainDash from './pages/Dashboard';
import Login from './pages/Login';
import PartsHome from './pages/parts/Parts'
import Part from './pages/parts/Part'
import ProjectHome from './pages/projects/Projects'
import Inventory from './pages/inventory/Inventory'
import './main.css'

ReactDOM.createRoot(document.querySelector("#root")!).render(
    // <React.StrictMode>
    <StyledEngineProvider injectFirst>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App disableCustomTheme={true} />}>
                    <Route path="home" index />
                    <Route path="login" element={<Login />} />
                    <Route path="dashboard" element={<MainDash />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="admin">
                        <Route path="parts">
                            <Route index element={<PartsHome />} />
                            <Route path=":partId" element={<Part />} />
                        </Route>
                        <Route path="projects">
                            <Route index element={<ProjectHome />} />
                            <Route path=":projectId" />
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate replace to="/home" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StyledEngineProvider>
    // </React.StrictMode>
);
