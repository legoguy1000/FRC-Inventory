import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { DataGrid } from '@mui/x-data-grid';
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Link } from 'react-router';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Chip from '@mui/material/Chip';
import PartService from '../../Services/PartService';


function renderOpen(id: string) {
    return <Button component={Link} to={`/admin/parts/${id}`} variant='text'>
        <OpenInNewIcon />
    </Button>
}

function renderTotal(params: { _count: { inventory: number } }) {
    if (params == null) {
        return <div>0</div>;
    }
    return <div>{params._count.inventory}</div>

}

function renderStatus(params: { _count: { inventory: number }, inventory: [] }) {
    if (params == null) {
        return '';
    }
    let percent = 0;
    if (params._count.inventory != 0) {
        percent = Math.floor(params.inventory.filter(x => x['projectId'] === null).length / params._count.inventory * 100)
    }
    let color: 'success' | 'warning' | 'error';
    if (percent < 25) {
        color = "error";
    } else if (percent < 50) {
        color = "warning";
    } else {
        color = "success"
    }
    return <Chip label={`${percent}%`} color={color} size="small" />;
}

export const columns: GridColDef[] = [
    { field: 'name', headerName: 'Part Name', flex: 1.5, minWidth: 200 },
    { field: 'location', headerName: 'Location', flex: 1.5, minWidth: 200 },
    {
        field: 'total',
        headerName: 'Total Quantity',
        flex: 1.5,
        minWidth: 200,
        valueGetter: (_, row) => row._count.inventory,
    },
    {
        field: 'available',
        headerName: 'Available',
        flex: 1.5,
        minWidth: 200,
        valueGetter: (_, row) => row.inventory.filter(x => x.projectId === null).length,
    },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => renderStatus(params.row as any),
    },
    {
        field: '',
        flex: .1,
        minWidth: 80,
        renderCell: (params) => renderOpen(params.id as any),
        filterable: false,
        sortable: false,
        hideable: false,
        type: "actions"
    },
];

// export const rows: GridRowsProp = [
//     {
//         id: 1,
//         name: "Vex Falcon 500",
//         location: "Falcon Motors Bin",
//         total: 100,
//         available: 12
//     },
// ]

export default function PartsHome() {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<GridRowsProp>([]);

    useEffect(() => {
        const loadPost = async () => {
            // Till the data is fetch using API
            // the Loading page will show.
            setLoading(true);

            // Await make wait until that
            // promise settles and return its result
            const response: GridRowsProp = await PartService.getParts();
            console.log(response)
            // // After fetching data stored it in posts state.
            setPosts(response);

            // Closed the loading page
            setLoading(false);
        };

        // Call the function
        loadPost();
    }, []);

    return (
        <Grid container size={{ xs: 12, lg: 12, xl: 12 }} style={{ width: "100%" }}>
            <DataGrid
                checkboxSelection
                rows={posts}
                columns={columns}
                loading={loading}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                initialState={{
                    pagination: { paginationModel: { pageSize: 20 } },
                }}
                autosizeOptions={{
                    columns: ['name'],
                    includeOutliers: true,
                    includeHeaders: true,
                }}
                pageSizeOptions={[10, 20, 50]}
                disableColumnResize={true}
                density="compact"
                slotProps={{
                    filterPanel: {
                        filterFormProps: {
                            logicOperatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                            columnInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: { mt: 'auto' },
                            },
                            operatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: { mt: 'auto' },
                            },
                            valueInputProps: {
                                InputComponentProps: {
                                    variant: 'outlined',
                                    size: 'small',
                                },
                            },
                        },
                    },
                }}
            />
        </Grid>
    )
}
