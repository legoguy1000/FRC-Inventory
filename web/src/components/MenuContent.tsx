import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { NavLink, Link, useLocation } from "react-router";

const mainListItems = [
    { text: 'Home', icon: <HomeRoundedIcon />, "page": "/home" },
    { text: 'Dashboard', icon: <AnalyticsRoundedIcon />, "page": "/dashboard" },
    { text: 'Inventory', icon: <HomeRepairServiceIcon />, "page": "/inventory" },
];

const adminItems = [
    { text: 'Projects', icon: <HomeRepairServiceIcon />, "page": "/admin/projects" },
    { text: 'Parts', icon: <HomeRepairServiceIcon />, "page": "/admin/parts" }
]

const secondaryListItems = [
    { text: 'Settings', icon: <SettingsRoundedIcon /> },
    { text: 'About', icon: <InfoRoundedIcon /> },
    { text: 'Feedback', icon: <HelpRoundedIcon /> },
];


export default function MenuContent() {
    const path = useLocation().pathname;
    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <Stack sx={{}}>
                <List dense>
                    {mainListItems.map((item, index) => (
                        <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton selected={item.page === path} component={NavLink} to={item.page}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <List dense>
                    <ListItem>
                        <ListItemIcon>ADMIN</ListItemIcon>
                    </ListItem>
                    {adminItems.map((item, index) => (
                        <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton selected={item.page === path} component={NavLink} to={item.page}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Stack>
            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
