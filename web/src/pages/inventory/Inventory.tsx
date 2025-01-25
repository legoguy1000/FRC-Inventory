import { useState, useEffect } from 'react';
import { Inventory, Part, Project, Project as ProjectInterface } from '../../../../server/src/interfaces'
import { PartService, ProjectService } from '../../Services';
import { Grid2, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import InventoryService from '../../Services/InventoryService';
import {
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridToolbarExport,
    GridSlotProps,
} from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Theme, useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface InventoryTable {
    id: string;
    projectName: string | undefined;
    projectId: string | undefined;
    partName: string | undefined;
    partVendor: string | undefined;
    partId: string | undefined;
    quantity: number;
}
export default function InventoryHome() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<InventoryTable[]>();
    const [parts, setParts] = useState<Part[]>([]);
    const [tableData, setTableData] = useState<InventoryTable[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjects, setSelectedProject] = useState<Project[]>([]);
    const [selectedParts, setSelectedParts] = useState<Part[]>([]);


    const EditToolbar = (props: GridSlotProps['toolbar']) => {
        // const handleClick = () => {
        //     setOpenDialog(true);
        //     setEditProject(undefined);
        // };
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
                <Button color="primary" startIcon={<RefreshIcon />} onClick={loadInventory} sx={{ marginLeft: 'auto' }} >
                    Refresh
                </Button>
            </GridToolbarContainer>
        );
    }

    const loadInventory = async () => {
        // Till the data is fetch using API
        // the Loading page will show.
        setLoading(true);

        // Await make wait until that
        // promise settles and return its result
        const response: Inventory[] = await InventoryService.getInvetory();
        const rawInventory = response.filter(x => x.partId !== null);
        const inventory: { [id: string]: InventoryTable; } = {};
        rawInventory.forEach(x => {
            let key = `${x.projectId}-${x.partId}`;
            if (inventory[key] === undefined) {
                inventory[key] = {
                    id: key,
                    projectName: x.project?.name,
                    projectId: x.projectId,
                    partName: x.part.name,
                    partVendor: x.part.vendor,
                    partId: x.partId,
                    quantity: 0
                }
            }
            inventory[key].quantity++;
        });
        var inventoryArr = Object.keys(inventory).map(function (key) {
            return inventory[key];
        });
        console.log(inventoryArr);
        // // After fetching data stored it in posts state.
        setData(inventoryArr);

        // Closed the loading page
        setLoading(false);
    };

    const loadProjects = async () => {
        // Till the data is fetch using API
        // the Loading page will show.
        setLoading(true);

        // Await make wait until that
        // promise settles and return its result
        const response: Project[] = await ProjectService.getProjects();

        console.log(response);
        // // After fetching data stored it in posts state.
        setProjects(response);

        // Closed the loading page
        setLoading(false);
    };

    const loadParts = async () => {
        // Till the data is fetch using API
        // the Loading page will show.
        setLoading(true);

        // Await make wait until that
        // promise settles and return its result
        const response: Part[] = await PartService.getParts();

        console.log(response);
        // // After fetching data stored it in posts state.
        setParts(response);

        // Closed the loading page
        setLoading(false);
    };

    const updateTableData = () => {
        let temp: InventoryTable[] | undefined = data;
        if (temp == undefined) {
            return;
        }
        if (selectedProjects.length > 0) {
            let proj = selectedProjects.map(x => x.id)
            console.log(proj)
            temp = temp.filter(x => x.projectId !== undefined && proj.indexOf(x.projectId) !== -1);
        }
        if (selectedParts.length > 0) {
            let part = selectedParts.map(x => x.id)
            temp = temp.filter(x => x.partId !== undefined && part.indexOf(x.partId) !== -1);
        }
        setTableData(temp);
    }

    useEffect(() => {
        // Call the function
        loadInventory();
        loadProjects();
        loadParts();
        updateTableData();
    }, []);

    useEffect(() => {
        updateTableData();
    }, [selectedParts, selectedProjects, data]);


    const columns: GridColDef[] = [
        {
            field: 'projectName',
            headerName: 'Project Name',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'partName',
            headerName: 'Part Name',
            flex: 1,
            minWidth: 200,
            valueGetter: (_, row) => `${row.partVendor} ${row.partName}`,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            // flex: 1.5,
            minWidth: 150,
        },
        // {
        //     field: 'createdAt',
        //     headerName: 'Created',
        //     flex: 1.5,
        //     minWidth: 200,
        //     valueFormatter: (_, row) => new Date(row.createdAt).toLocaleDateString(),
        // },
        // {
        //     field: '_parts',
        //     headerName: 'Number of allocated parts',
        //     flex: 1.5,
        //     minWidth: 200,
        //     valueGetter: (_, row) => row._count.inventory,
        // },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerName: 'Actions',
        //     width: 100,
        //     cellClassName: 'actions',
        //     getActions: (params: GridRowParams) => {
        //         return [
        //             <GridActionsCellItem
        //                 icon={<Tooltip title="Edit Project"><EditIcon /></Tooltip>}
        //                 label="Edit"
        //                 className="textPrimary"
        //                 onClick={handleEditClick(params)}
        //                 color="inherit"
        //             />,
        //             <Tooltip title={params.row._count.inventory == 0 ? DELETE_PROJET_TOOLTIP : DELETE_PROJET_TOOLTIP_ERROR}>
        //                 <span>
        //                     <GridActionsCellItem
        //                         icon={<DeleteIcon />}
        //                         label="Delete"
        //                         onClick={handleDeleteClick(params)}
        //                         color="inherit"
        //                         disabled={params.row._count.inventory > 0}
        //                     />
        //                 </span>
        //             </Tooltip>,
        //         ];
        //     },
        // },
    ];
    return (
        <Stack useFlexGap direction="column" style={{ width: "100%" }} sx={{ flexGrow: 0, p: 1, justifyContent: 'space-between' }}>
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <FormControl sx={{ flexGrow: 1 }} fullWidth>
                        <Autocomplete
                            multiple
                            id="tags-outlined"
                            options={projects}
                            getOptionLabel={(option) => option.name}
                            getOptionKey={(option) => option.id}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Projects"
                                    placeholder="Project Filter"
                                />
                            )}
                            onChange={(event: any, newValue: Project[]) => {
                                setSelectedProject(newValue);
                            }}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <FormControl sx={{ flexGrow: 1 }} fullWidth>
                        <Autocomplete
                            multiple
                            limitTags={4}
                            id="tags-outlined"
                            options={parts}
                            getOptionLabel={(part) => `${part.vendor} ${part.name}`}
                            getOptionKey={(option) => option.id}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Parts"
                                    placeholder="Parts Filter"
                                />
                            )}
                            onChange={(event: any, newValue: Part[]) => {
                                setSelectedParts(newValue);
                            }}
                        />
                    </FormControl>
                </Grid2>
            </Grid2>
            <Grid2 size={12}>
                <DataGrid
                    disableRowSelectionOnClick
                    disableColumnFilter
                    rows={tableData}
                    columns={columns}
                    loading={loading}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                    initialState={{
                        pagination: { paginationModel: { pageSize: 20 } },
                        sorting: {
                            sortModel: [{ field: 'projectName', sort: 'asc' }],
                        },
                    }}
                    autosizeOptions={{
                        // columns: ['projectName', 'partName', 'quantity'],
                        includeOutliers: true,
                        includeHeaders: true,
                    }}
                    pageSizeOptions={[10, 20, 50]}
                    disableColumnResize={true}

                    density="compact"
                    slots={{
                        // noRowsOverlay: CustomNoRowsOverlay,
                        toolbar: EditToolbar
                    }}
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

            </Grid2>
        </Stack >
    )
}
