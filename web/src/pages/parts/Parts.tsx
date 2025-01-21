import { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import { Part as PartInterface, Inventory as InventoryInterface, Part } from '../../../../server/src/interfaces'
import { PartService, PartCreate } from '../../Services';
import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import {
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowParams,
    GridSlotProps,
} from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import Autocomplete from '@mui/material/Autocomplete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';


function renderStatus(params: PartInterface) {
    if (params == null || params._count?.inventory === undefined || params.inventory === undefined) {
        return '';
    }
    let percent = 0;
    if (params._count?.inventory != 0) {
        percent = Math.floor(params.inventory?.filter(x => x.projectId === null).length / params._count?.inventory * 100)
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

const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .no-rows-primary': {
        fill: '#3D4751',
        ...theme.applyStyles('light', {
            fill: '#AEB8C2',
        }),
    },
    '& .no-rows-secondary': {
        fill: '#1D2126',
        ...theme.applyStyles('light', {
            fill: '#E8EAED',
        }),
    },
}));
function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={96}
                viewBox="0 0 452 257"
                aria-hidden
                focusable="false"
            >
                <path
                    className="no-rows-primary"
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Box sx={{ mt: 2 }}>No rows</Box>
        </StyledGridOverlay>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const DELETE_PROJET_TOOLTIP = "Delete Part"
const DELETE_PROJET_TOOLTIP_ERROR = "Part cannot be deleted while there is an active inventory"

export default function ProjectsHome() {
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [data, setData] = useState<PartInterface[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [vendors, setVendors] = useState<string[]>([]);
    const [editPart, setEditPart] = useState<PartCreate>();
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [bulkAddDialog, setBulkAddDialog] = useState(false);
    const [editError, setEditError] = useState<{ error: boolean, message: string | undefined, data: { field: string } | undefined } | undefined>({ error: false, message: "", data: { field: "" } });
    const [bulkAdd, setBulkAdd] = useState<{ error: boolean, message: string, data: { error: boolean, message: string }[] }>({ error: false, message: "", data: [] });

    const EditToolbar = (props: GridSlotProps['toolbar']) => {
        const handleClick = () => {
            setOpenDialog(true);
            setEditPart(undefined);
        };
        return (
            <GridToolbarContainer>
                <Tooltip title="Uploade Parts List">
                    <Button color='primary' startIcon={<CloudUploadIcon />}
                        component="label"
                        role={undefined}
                        onClick={(e) => {
                            // e.preventDefault();
                        }}>
                        <VisuallyHiddenInput
                            type="file"
                            accept=".csv"
                            onChange={(event) => {
                                if (event?.target?.files !== undefined && event?.target?.files?.length === 1) {
                                    setLoading(true)
                                    const fileReader = new FileReader();
                                    fileReader.onload = async function (event) {
                                        if (event === null || event.target === null || event?.target?.result === null) {
                                            return;
                                        }
                                        const text = event.target.result as string;
                                        const csvHeader = text.slice(0, text.indexOf("\n")).split(",");
                                        const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");

                                        const array = csvRows.map((i: string) => {
                                            const values = i.split(",");
                                            const obj = csvHeader.reduce((object, header, index) => {
                                                object[header] = values[index];
                                                return object;
                                            }, {});
                                            return obj;
                                        });
                                        console.log(array);
                                        const resp = await PartService.bulkAdd(array as Part[]);
                                        setBulkAdd(resp);
                                        setBulkAddDialog(true)
                                        setLoading(false);
                                    };
                                    fileReader.readAsText(event?.target?.files[0]);
                                }
                            }}
                        />
                    </Button>
                </Tooltip>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} sx={{ marginLeft: 'auto' }}>
                    Add Part
                </Button>
                <Button color="primary" startIcon={<RefreshIcon />} onClick={loadParts}>
                    Refresh
                </Button>
            </GridToolbarContainer>
        );
    }

    const closeDialog = () => {
        setEditLoading(false);
        setEditError(undefined);
        setOpenDialog(false);
        setConfirmDeleteDialog(false)
        setBulkAddDialog(false);
    };

    const handleEditClick = (params: GridRowParams) => () => {
        setEditPart(params.row);
        setOpenDialog(true);
    };

    const handleDeleteClick = (params: GridRowParams) => () => {
        setEditPart(params.row);
        setConfirmDeleteDialog(true);
    };

    const deleteProject = async () => {
        setEditLoading(true);
        if (editPart === undefined || editPart.id === undefined) {
            setEditLoading(false);
            return
        }
        const resp = await PartService.deletePart(editPart.id);
        setEditLoading(false);
        if (!resp.error) {
            closeDialog();
            setEditError({ error: false, message: undefined, data: undefined });
        } else {
            setEditError({ error: true, message: resp.message, data: resp.data });
        }
        loadParts();
    };

    const columns: GridColDef[] = [
        { field: 'vendor', headerName: 'Vendor', flex: 1.5, minWidth: 200 },
        { field: 'name', headerName: 'Part Name', flex: 1.5, minWidth: 200 },
        { field: 'category', headerName: 'Part Category', flex: 1.5, minWidth: 200 },
        { field: 'location', headerName: 'Location', flex: 1.5, minWidth: 200 },
        {
            field: 'total',
            headerName: 'Total Quantity',
            flex: 1.5,
            minWidth: 200,
            valueGetter: (_, row: PartInterface) => {
                if (row?._count?.inventory !== undefined) {
                    return row._count.inventory;
                }
                return 0;
            },
        },
        {
            field: 'available',
            headerName: 'Available',
            flex: 1.5,
            minWidth: 200,
            valueGetter: (_, row: PartInterface) => {
                if (row?.inventory !== undefined) {
                    return row.inventory.filter((x: InventoryInterface) => x.projectId === null).length;
                }
                return 0;
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 80,
            renderCell: (params) => renderStatus(params.row as any),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: (params: GridRowParams) => {
                return [
                    <GridActionsCellItem
                        icon={<Tooltip title="Edit Project"><EditIcon /></Tooltip>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(params)}
                        color="inherit"
                    />,
                    <Tooltip title={params.row._count.inventory == 0 ? DELETE_PROJET_TOOLTIP : DELETE_PROJET_TOOLTIP_ERROR}>
                        <span>
                            <GridActionsCellItem
                                icon={<DeleteIcon />}
                                label="Delete"
                                onClick={handleDeleteClick(params)}
                                color="inherit"
                                disabled={params.row._count.inventory > 0}
                            />
                        </span>
                    </Tooltip>,
                ];
            },
        },
    ];

    const loadParts = async () => {
        // Till the data is fetch using API
        // the Loading page will show.
        setLoading(true);

        // Await make wait until that
        // promise settles and return its result
        const response: PartInterface[] = await PartService.getParts(true);
        const locations: string[] = Array.from(new Set(response.map(x => x?.location).filter(x => x !== undefined)));
        const categories: string[] = Array.from(new Set(response.map(x => x?.category).filter(x => x !== undefined)));
        const vendors: string[] = Array.from(new Set(response.map(x => x?.vendor).filter(x => x !== undefined)));
        // // After fetching data stored it in posts state.
        setData(response);
        setCategories(categories)
        setLocations(locations)
        setVendors(vendors)

        // Closed the loading page
        setLoading(false);
    };

    useEffect(() => {
        // Call the function
        loadParts();
    }, []);

    return (
        <Stack useFlexGap direction="column" style={{ width: "100%" }} sx={{ flexGrow: 0, p: 1, justifyContent: 'space-between' }}>
            <DataGrid
                disableRowSelectionOnClick
                rows={data}
                columns={columns}
                loading={loading}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                initialState={{
                    pagination: { paginationModel: { pageSize: 20 } },
                    sorting: {
                        sortModel: [{ field: 'createdAt', sort: 'desc' }],
                    },
                }}
                autosizeOptions={{
                    columns: ['name'],
                    includeOutliers: true,
                    includeHeaders: true,
                }}
                pageSizeOptions={[10, 20, 50]}
                disableColumnResize={true}
                density="compact"
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay,
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
            {/* Add/edit project dialog */}
            <Dialog
                open={openDialog}
                onClose={closeDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        setEditLoading(true);
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        let resp;
                        console.log(formJson)
                        if (formJson.id !== undefined && formJson.id !== '') {
                            resp = await PartService.editPart(formJson.id, { name: formJson.name, vendor: formJson.vendor, category: formJson.category, location: formJson.location });
                        } else {
                            resp = await PartService.addPart({ name: formJson.name, vendor: formJson.vendor, category: formJson.category, location: formJson.location });
                        }
                        setEditLoading(false);
                        if (!resp.error) {
                            closeDialog();
                            setEditError({ error: false, message: undefined, data: undefined });
                            loadParts();
                        } else {
                            setEditError({ error: true, message: resp.message, data: resp.data });
                        }
                    },
                }}
            >
                <DialogTitle>{editPart !== undefined && editPart?.id !== '' && `Edit Part ${editPart?.vendor} ${editPart?.name}` || 'Add new Part'}</DialogTitle>
                <DialogContent>
                    {editLoading && <LinearProgress />}
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText> */}
                    <input type="hidden" name="id" value={editPart?.id === null ? '' : editPart?.id} />
                    <Autocomplete
                        id="vendor"
                        freeSolo
                        options={vendors}
                        defaultValue={editPart?.vendor === null ? '' : editPart?.vendor}
                        renderInput={(params) => <TextField {...params} required name="vendor" id='vendor' label="Part Vendor/Manufacturer" variant='standard' error={editError?.data?.field === 'vendor'} />}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Part Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={editPart?.name === null ? '' : editPart?.name}
                        error={editError?.data?.field === 'name'}
                        helperText={editError?.message}
                    />
                    <Autocomplete
                        id="category"
                        freeSolo
                        options={categories}
                        defaultValue={editPart?.category === null ? '' : editPart?.category}
                        renderInput={(params) => <TextField {...params} required name="category" id='category' label="Category" variant='standard' error={editError?.data?.field === 'category'} />}
                    />
                    <Autocomplete
                        id="location"
                        freeSolo
                        options={locations}
                        defaultValue={editPart?.location === null ? '' : editPart?.location}
                        renderInput={(params) => <TextField {...params} required name="location" id='location' label="Location" variant='standard' error={editError?.data?.field === 'location'} />}
                    />
                    <TextField
                        margin="dense"
                        id="image_url"
                        name="image_url"
                        label="Image URL"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={editPart?.image_url === null ? '' : editPart?.image_url}
                        error={editError?.data?.field === 'image_url'}
                        helperText={editError?.message}
                    />
                    <TextField
                        margin="dense"
                        id="website"
                        name="website"
                        label="Website"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={editPart?.website === null ? '' : editPart?.website}
                        error={editError?.data?.field === 'website'}
                        helperText={editError?.message}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button
                        type="submit"
                        loading={editLoading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Delete project confirmation dialog */}
            <Dialog
                open={confirmDeleteDialog}
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want to delete Part {editPart?.vendor} {editPart?.name}?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action is permanant. Parts cannot be deleted with active inventory.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} autoFocus>Cancel</Button>
                    <Button onClick={deleteProject} color='error'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Bulk Upload Response Dialog */}
            <Dialog
                open={bulkAddDialog}
                onClose={closeDialog}
                maxWidth="lg"
            >
                <DialogTitle id="alert-dialog-title">
                    Bulk Add Parts
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <List dense>
                            {bulkAdd.data.map(x => {
                                return (
                                    <ListItem>
                                        <Alert severity={x.error ? "error" : "success"} style={{ width: '100%' }}>
                                            {x.message}
                                        </Alert>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} autoFocus>close</Button>
                </DialogActions>
            </Dialog>
        </Stack >
    )
}
