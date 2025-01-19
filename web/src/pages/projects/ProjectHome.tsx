import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { DataGrid } from '@mui/x-data-grid';
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Link } from 'react-router';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Chip from '@mui/material/Chip';
import { Project as ProjectInterface } from '../../../../server/src/interfaces'
import ProjectService from '../../Services/ProjectService';


function renderOpen(id: string) {
    return <Button component={Link} to={`/admin/projects/${id}`} variant='text'>
        <OpenInNewIcon />
    </Button>
}

export const columns: GridColDef[] = [
    { field: 'name', headerName: 'Project Name', flex: 1.5, minWidth: 200 },
    {
        field: '_parts',
        headerName: 'Number of allocated parts',
        flex: 1.5,
        minWidth: 200,
        valueGetter: (_, row) => row._count.inventory,
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

export default function ProjectsHome() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ProjectInterface[]>([]);

    useEffect(() => {
        const loadPost = async () => {
            // Till the data is fetch using API
            // the Loading page will show.
            setLoading(true);

            // Await make wait until that
            // promise settles and return its result
            const response: ProjectInterface[] = await ProjectService.getProjects();
            console.log(response)
            // // After fetching data stored it in posts state.
            setData(response);

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
                rows={data}
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
