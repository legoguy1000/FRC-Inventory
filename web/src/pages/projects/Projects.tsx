import { useState, useEffect } from 'react';
import { Project as ProjectInterface } from '../../../../server/src/interfaces'
import { ProjectService } from '../../Services';
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
import { CustomNoRowsOverlay } from '../../internals/components/CustomOverlays'

const DELETE_PROJET_TOOLTIP = "Delete Project"
const DELETE_PROJET_TOOLTIP_ERROR = "Project cannot be deleted while parts are assigned"

export default function ProjectsHome() {
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [data, setData] = useState<ProjectInterface[]>([]);
    const [editProject, setEditProject] = useState<{ id: string | undefined, name: string | undefined, owner: string | undefined }>();
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [editError, setEditError] = useState<{ error: boolean, message: string | undefined, data: { field: string } | undefined } | undefined>({ error: false, message: "", data: { field: "" } });


    const EditToolbar = (props: GridSlotProps['toolbar']) => {
        const handleClick = () => {
            setOpenDialog(true);
            setEditProject(undefined);
        };
        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} sx={{ marginLeft: 'auto' }}>
                    Add Project
                </Button>
                <Button color="primary" startIcon={<RefreshIcon />} onClick={loadProjects}>
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
    };

    const handleEditClick = (params: GridRowParams) => () => {
        setEditProject({ id: params.row.id, name: params.row.name, owner: params.row.owner });
        setOpenDialog(true);
    };

    const handleDeleteClick = (params: GridRowParams) => () => {
        setEditProject({ id: params.row.id, name: params.row.name, owner: params.row.owner });
        setConfirmDeleteDialog(true);
    };

    const deleteProject = async () => {
        setEditLoading(true);
        if (editProject === undefined || editProject.id === undefined) {
            setEditLoading(false);
            return
        }
        const resp = await ProjectService.deleteProject(editProject.id);
        setEditLoading(false);
        if (!resp.error) {
            closeDialog();
            setEditError({ error: false, message: undefined, data: undefined });
        } else {
            setEditError({ error: true, message: resp.message, data: resp.data });
        }
        loadProjects();
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Project Name', flex: 1.5, minWidth: 200 },
        { field: 'owner', headerName: 'Project Owner', flex: 1.5, minWidth: 200 },
        {
            field: 'createdAt',
            headerName: 'Created',
            flex: 1.5,
            minWidth: 200,
            valueFormatter: (_, row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            field: '_parts',
            headerName: 'Number of allocated parts',
            flex: 1.5,
            minWidth: 200,
            valueGetter: (_, row) => row._count.inventory,
        }, {
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

    const loadProjects = async () => {
        // Till the data is fetch using API
        // the Loading page will show.
        setLoading(true);

        // Await make wait until that
        // promise settles and return its result
        const response: ProjectInterface[] = await ProjectService.getProjects();
        // console.log(response)
        // // After fetching data stored it in posts state.
        setData(response);

        // Closed the loading page
        setLoading(false);
    };

    useEffect(() => {
        // Call the function
        loadProjects();
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
                        if (formJson.id !== undefined && formJson.id !== '') {
                            resp = await ProjectService.editProject(formJson.id, { name: formJson.name, owner: formJson.owner });
                        } else {
                            resp = await ProjectService.addProject({ name: formJson.name, owner: formJson.owner });
                        }
                        setEditLoading(false);
                        if (!resp.error) {
                            closeDialog();
                            setEditError({ error: false, message: undefined, data: undefined });
                            loadProjects();
                        } else {
                            setEditError({ error: true, message: resp.message, data: resp.data });
                        }
                    },
                }}
            >
                <DialogTitle>{editProject !== undefined && editProject?.id !== '' && `Edit Project ${editProject?.name}` || 'Add new Project'}</DialogTitle>
                <DialogContent>
                    {editLoading && <LinearProgress />}
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <input type="hidden" name="id" value={editProject?.id === null ? '' : editProject?.id} />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Project Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={editProject?.name === null ? '' : editProject?.name}
                        error={editError?.data?.field === 'name'}
                        helperText={editError?.message}
                    />
                    <TextField
                        margin="dense"
                        id="owner"
                        name="owner"
                        label="Project Owner"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={editProject?.owner === null ? '' : editProject?.owner}
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
                    Are you sure you want to delete Project {editProject?.name}?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action is permanant. Project cannot be deleted until all parts assigned to the project are unassigned and returned to the inventory.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} autoFocus>Cancel</Button>
                    <Button onClick={deleteProject} color='error'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
