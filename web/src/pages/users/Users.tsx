import { useState, useEffect } from 'react';
import { User as UserInterface } from '../../../../server/src/interfaces'
import { UserService } from '../../Services';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import {
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowParams,
    GridSlotProps,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import RenderAvatar from '../../components/RenderAvatar'
import { CustomNoRowsOverlay } from '../../internals/components/CustomOverlays'
import Chip from '@mui/material/Chip';

function renderStatus(params: UserInterface) {
    if (params == null || params.enabled === undefined) {
        return '';
    }
    return <Chip label={`${params.enabled ? "Enabled" : "Disabled"}`} color={params.enabled ? 'success' : 'error'} size="small" />;
}
function renderAdmin(params: UserInterface) {
    if (params == null || params.admin === undefined) {
        return '';
    }
    return <Chip label={`${params.admin ? "Admin" : "User"}`} color={params.admin ? 'secondary' : 'primary'} size="small" />;
}

const DEACTIVATE_USER_TOOLTIP = "Disable User"
const ACTIVATE_USER_TOOLTIP = "Enable User"

export default function UsersHome() {
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [data, setData] = useState<UserInterface[]>([]);
    const [editUser, setEditUser] = useState<{ id?: string, name?: string, email?: string }>();
    const [openDialog, setOpenDialog] = useState(false);
    const [editError, setEditError] = useState<{ error: boolean, message: string | undefined, data: { field: string } | undefined } | undefined>({ error: false, message: "", data: { field: "" } });

    const EditToolbar = (props: GridSlotProps['toolbar']) => {
        const addUserButton = () => {
            setOpenDialog(true);
            setEditUser(undefined);
        };
        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={addUserButton} sx={{ marginLeft: 'auto' }}>
                    Add User
                </Button>
                <Button color="primary" startIcon={<RefreshIcon />} onClick={loadUsers}>
                    Refresh
                </Button>
            </GridToolbarContainer>
        );
    }

    const closeDialog = () => {
        setEditLoading(false);
        setEditError(undefined);
        setOpenDialog(false);
    };

    const handleEditClick = (params: GridRowParams) => () => {
        setEditUser({ id: params.row.id, email: params.row.email, name: params.row.name });
        setOpenDialog(true);
    };

    const handleDisableClick = (params: GridRowParams) => async () => {
        let user: UserInterface = params.row
        if (user.enabled) {
            let resp = await UserService.disableUser(user.id);
        } else {
            let resp = await UserService.enableUser(user.id);
        }
        loadUsers();
        // setEditUser({ id: params.row.id, name: params.row.name, owner: params.row.owner });
    };

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: '',
            // flex: 1,
            // minWidth: 200,
            renderCell: RenderAvatar,
            valueGetter: (value, row) =>
                row.name == null || row.avatar == null ? null : { name: row.name, avatar: row.avatar },
            sortable: false,
            filterable: false,
            groupable: false,
            disableExport: true,
        },
        { field: 'name', headerName: 'Name', flex: 1.5, minWidth: 200 },
        { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
        {
            field: 'admin',
            headerName: 'Admin',
            renderCell: (params) => renderAdmin(params.row as any),
            flex: 1.5,
            minWidth: 200
        },
        {
            field: 'enabled',
            headerName: 'Enabled',
            renderCell: (params) => renderStatus(params.row as any),
            flex: 1.5,
            minWidth: 200
        },
        {
            field: 'lastLogin',
            headerName: 'Last Login',
            renderCell: (params) => new Date((params.row as any).lastLogin).toLocaleString(),
            flex: 1.5,
            minWidth: 200
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
                        icon={<Tooltip title="Edit User"><EditIcon /></Tooltip>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(params)}
                        color="inherit"
                    />,
                    <Tooltip title={(params.row as UserInterface).enabled ? DEACTIVATE_USER_TOOLTIP : ACTIVATE_USER_TOOLTIP}>
                        <span>
                            <GridActionsCellItem
                                icon={(params.row as UserInterface).enabled ? <LockIcon /> : <LockOpenIcon />}
                                label="Delete"
                                onClick={handleDisableClick(params)}
                                color="inherit"
                            />
                        </span>
                    </Tooltip>,
                ];
            },
        },
    ];

    const loadUsers = async () => {
        // Till the data is fetch using API
        // the Loading page will show.
        setLoading(true);

        // Await make wait until that
        // promise settles and return its result
        const response: UserInterface[] = await UserService.getUsers();
        // console.log(response)
        // // After fetching data stored it in posts state.
        setData(response);

        // Closed the loading page
        setLoading(false);
    };

    useEffect(() => {
        // Call the function
        loadUsers();
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
                density="comfortable"
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
                        if (formJson.id !== undefined && formJson.id !== '') {
                            resp = await UserService.editUser(formJson.id, { email: formJson.email });
                        } else {
                            resp = await UserService.addUser({ email: formJson.email });
                        }
                        setEditLoading(false);
                        if (!resp.error) {
                            closeDialog();
                            setEditError({ error: false, message: undefined, data: undefined });
                            loadUsers();
                        } else {
                            setEditError({ error: true, message: resp.message, data: resp.data });
                        }
                    },
                }}
            >
                <DialogTitle>{editUser !== undefined && editUser?.id !== '' && `Edit User ${editUser?.name}` || 'Add new Users'}</DialogTitle>
                <DialogContent>
                    {editLoading && <LinearProgress />}
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText> */}
                    <input type="hidden" name="id" value={editUser?.id === null ? '' : editUser?.id} />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={editUser?.email === null ? '' : editUser?.email}
                        error={editError?.data?.field === 'email'}
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
        </Stack>
    )
}
