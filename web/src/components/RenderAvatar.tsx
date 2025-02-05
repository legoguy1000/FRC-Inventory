import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid';

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    let child = ""
    if (name !== "") {
        child = `${name.split(' ')[0][0].toLocaleUpperCase()}${name.split(' ')[1][0].toLocaleUpperCase()}`
    }
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: child,
    };
}

export default function RenderAvatar(
    params: GridRenderCellParams<{ name: string; avatar: string }, any, any>,
) {
    if (params.value == null) {
        return '';
    }

    return (
        <Box sx={{ height: '100%', display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Avatar src={params.value?.avatar} {...stringAvatar(params.value?.name)} />
        </Box>
    );
}
