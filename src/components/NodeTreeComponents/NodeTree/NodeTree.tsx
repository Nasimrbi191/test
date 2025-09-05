import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import AnimatedTreeItem from '../AnimatedTreeItem/AnimatedTreeItem';


interface node {
    id: string;
    label: string;
    children: any[];
    priority: string;
}


function NodeTree() {
    const { t } = useTranslation();
    const [nodes, setNodes] = useState<node[]>();
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('create');
    const [nodeName, setNodeName] = useState('');
    const [nodeNameChildren, setNodeNameChildren] = useState();
    const [newNodeName, setNewNodeName] = useState('');
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [childrenNodeName, setChildrenNodeName] = useState('');
    const [newNodeParent, setNewNodeParent] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedNode, setSelectedNode] = useState<node | null>(null);
    const [snackbarType, setSnackbarType] = useState('');
    const [selectedChildrenItem, setSelectedChildrenItem] = useState<node | null>(null);
    const [nodeId, setNodeId] = useState('');
    const newNodeId = crypto.randomUUID();


    const fetchNodes = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/nodes');
            const data = await response.json();
            setNodes(data);
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    }, [nodes]);

    useEffect(() => {
        fetchNodes();
    }, []);

    const handleDialogOpen = (type: string) => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const getEachItem = (event: React.MouseEvent, id: any) => {
        const fullItem = nodes?.find((node: any) => node.id === id);
        setSelectedNode(fullItem || null);
        const fullItemChildren = nodes?.filter((node: any) => node?.children?.length > 0).map((node) => node.children).flat().find((node: any) => node.id === id);
        setSelectedChildrenItem(fullItemChildren || null);
        setNodeName(fullItem?.label || '');
        setNodeNameChildren(fullItemChildren?.label || '');
        setNodeId(id);
    }

    // add node
    const AddNode = async () => {
        const newNode = {
            id: newNodeId,
            label: newNodeName,
            children: [],
            priority: "1"
        }

        if (!newNodeName) {
            setError(`${t('Please enter a node name.')}`);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/nodes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNode),
            });
            const data = await res.json();
            if (!data) {
                setNewNodeName('');
                setError(`${t('Error adding node.')}`);
            } else {
                setNewNodeName('');
                setIsSuccess(true);
                setSnackbarType('create');
            }
            await fetchNodes();
            setOpenDialog(false);

        } catch (err) {
            console.error('Error adding node:', err);
        }
    }

    // add chidren node 
    const AddNodeChildren = async () => {
        if (!childrenNodeName || !newNodeParent) {
            setError(`${t("Please enter a node name and select a parent node.")}`);
            return;
        }

        try {
            // 1. Find the parent node
            const parentNode = nodes?.find((n) => n.id === newNodeParent);
            if (!parentNode) {
                setError("Parent node not found.");
                return;
            }

            // 2. Create new child
            const newChild = {
                id: crypto.randomUUID(),
                label: childrenNodeName,
                children: [],
                priority: "1",
            };

            // 3. Append to existing children
            const updatedParent = {
                ...parentNode,
                children: [...(parentNode.children || []), newChild],
            };

            // 4. PUT update to backend
            const res = await fetch(`http://localhost:5000/nodes/${parentNode.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedParent),
            });

            const data = await res.json();

            if (!data) {
                setError(`${t("Error adding child node.")}`);
            } else {
                setIsSuccess(true);
                setSnackbarType("create");
                setChildrenNodeName("");
            }

            await fetchNodes();
            setOpenDialog(false);
        } catch (err) {
            console.error("Error adding child node:", err);
            setError("Error adding child node.");
        }
    };


    // edit node
    const EditNode = async () => {
        if (!nodeName) {
            setError(`${t('Please enter a node name.')}`);
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/nodes/${nodeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: nodeId,
                    label: nodeName,
                    children: selectedNode?.children,
                    priority: "1"
                }),
            });
            const data = await res.json();
            if (!data) {
                setError(`${t('Error editing node.')}`);
            } else {
                setNodeName('');
                setIsSuccess(true);
                setSnackbarType('edit');
            }
            await fetchNodes();
            setOpenDialog(false);

        } catch (err) {
            console.error('Error editing node:', err);
        }
    }

    // edit children node
    const EditChildrenNode = async () => {
        try {
            // Find parent of this child if not already selected
            const parentNode =
                selectedNode ||
                nodes?.find(
                    (n) =>
                        n.children &&
                        n.children.length > 0 &&
                        n.children.some((child) => child.id === selectedChildrenItem?.id)
                );

            if (!parentNode) {
                setError(`${t("Parent node not found.")}`);
                return;
            }

            // Update only the clicked child
            const updatedChildren =
                parentNode.children && parentNode.children.length > 0
                    ? parentNode.children.map((child) =>
                        child.id === selectedChildrenItem?.id
                            ? { ...child, label: nodeNameChildren }
                            : child
                    )
                    : [];

            const res = await fetch(`http://localhost:5000/nodes/${parentNode.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...parentNode,
                    children: updatedChildren,
                }),
            });

            const data = await res.json();
            if (!data) {
                setError(`${t("Error editing child node.")}`);
            } else {
                setNodeNameChildren("");
                setIsSuccess(true);
                setSnackbarType("edit");
            }

            await fetchNodes();
            setOpenDialog(false);
        } catch (err) {
            console.error("Error editing child node:", err);
        }
    };

    //    delete node 
    const DeleteNode = async () => {
        try {
            const res = await fetch(`http://localhost:5000/nodes/${nodeId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!data) {
                setError(`${t("Error deleting node.")}`);
            } else {
                setIsSuccess(true);
                setSnackbarType("delete");
            }
            await fetchNodes();
            setOpenDialog(false);
        } catch (err) {
            console.error("Error deleting node:", err);
        }
    }

    // delete children node 
    const DeleteChildrenNode = async () => {
        if (!selectedChildrenItem) return;

        try {
            // 1. Find parent node that has this child
            const parentNode = nodes?.find(
                (n) =>
                    n.children &&
                    n.children.length > 0 &&
                    n.children.some((child) => child.id === selectedChildrenItem.id)
            );

            if (!parentNode) {
                setError("Parent node not found.");
                return;
            }

            // 2. Remove the child from parent's children
            const updatedChildren = parentNode.children.filter(
                (child) => child.id !== selectedChildrenItem.id
            );

            // 3. PUT updated parent to json-server
            const res = await fetch(`http://localhost:5000/nodes/${parentNode.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...parentNode,
                    children: updatedChildren,
                }),
            });

            const data = await res.json();

            if (!data) {
                setError("Error deleting child node.");
            } else {
                setIsSuccess(true);
                setSnackbarType("delete");
                setSelectedChildrenItem(null);
            }

            // 4. Refresh tree
            await fetchNodes();
            setOpenDialog(false);
        } catch (err) {
            console.error("Error deleting child node:", err);
            setError("Error deleting child node.");
        }
    };



    return (
        <>
            {(error !== '' || isSuccess) && (
                <Snackbar open={error !== '' || isSuccess} autoHideDuration={3000} onClose={() => {
                    setError('');
                    setIsSuccess(false);
                }}>
                    <Alert onClose={() => {
                        setError('');
                        setIsSuccess(false);
                    }} severity={error !== '' ? "error" : "success"} sx={{ width: '100%' }}>
                        {
                            error !== '' && error
                        }
                        {
                            snackbarType === 'create' && t('Node added successfully!')
                        }
                        {
                            snackbarType === 'edit' && t('Node edited successfully!')
                        }
                        {
                            snackbarType === 'delete' && t('Node deleted successfully!')
                        }
                    </Alert>
                </Snackbar>
            )}
            {/* Dialog box */}
            <Box>
                <Button sx={{ mt: 2, mb: 2, borderRadius: 1, border: 1 }} onClick={() => handleDialogOpen('create')} startIcon={<AddIcon />}>{t('Add Node')}</Button>
                <Button sx={{ mt: 2, mb: 2, borderRadius: 1, border: 1, ml: 2 }} onClick={() => handleDialogOpen('createChildren')} startIcon={<AddIcon />}>{t('Add Node Children')}</Button>
                <Box>
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        {
                            dialogType === 'create' && (
                                <>
                                    <DialogTitle>{t('Add Node')}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {t('Please enter the details of the new node')}
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            value={newNodeName}
                                            onChange={(e) => setNewNodeName(e.target.value)}
                                            id="name"
                                            label={t('Node Name')}
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => {
                                            setOpenDialog(false);
                                            setNewNodeName('');
                                        }}>{t('Cancel')}</Button>
                                        <Button onClick={() => AddNode()}>{t('Add')}</Button>
                                    </DialogActions>
                                </>
                            )
                        }
                        {
                            dialogType === 'createChildren' && (
                                <>
                                    <DialogTitle>{t('Add Node Children')}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {t('Please enter the details of the new node')}
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            value={childrenNodeName}
                                            onChange={(e) => setChildrenNodeName(e.target.value)}
                                            id="name"
                                            label={t('Node Name')}
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                        />
                                        <FormControl fullWidth sx={{ mt: 4 }}>
                                            <InputLabel id="demo-simple-select-label">{t('Parent Node')}</InputLabel>
                                            <Select
                                                value={newNodeParent}
                                                onChange={(e) => setNewNodeParent(e.target.value)}
                                                fullWidth
                                                variant="standard"
                                                sx={{ mt: 4 }}
                                                label={t('Parent Node')}
                                            >
                                                {nodes?.map((node) => (
                                                    <MenuItem key={node.id} value={node.id}>
                                                        {node.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => {
                                            setOpenDialog(false);
                                            setChildrenNodeName('');
                                        }}>{t('Cancel')}</Button>
                                        <Button onClick={() => AddNodeChildren()}>{t('Add')}</Button>
                                    </DialogActions>
                                </>
                            )
                        }
                        {
                            dialogType === 'edit' && (
                                <>
                                    <DialogTitle>{t('Edit Node')}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {t('Please enter the details of the new node')}
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            value={selectedChildrenItem ? nodeNameChildren : nodeName}
                                            onChange={(e) =>
                                                selectedChildrenItem
                                                    ? setNodeNameChildren(e.target.value)
                                                    : setNodeName(e.target.value)
                                            }
                                            id="name"
                                            label={t('Node Name')}
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setOpenDialog(false)}>{t('Cancel')}</Button>
                                        {
                                            !selectedChildrenItem && (
                                                <Button onClick={() => EditNode()}>{t('Edit')}</Button>
                                            )
                                        }
                                        {
                                            selectedChildrenItem && (
                                                <Button onClick={() => EditChildrenNode()}>{t('Edit Child')}</Button>
                                            )
                                        }
                                    </DialogActions>
                                </>
                            )
                        }
                        {
                            dialogType === 'delete' && (
                                <>
                                    <DialogTitle>{t('Delete Node')}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {t('Are you sure you want to delete this item? This action cannot be undone.')}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setOpenDialog(false)}>{t('Cancel')}</Button>
                                        <Button onClick={() => DeleteNode()}>{t('Yes, Delete')}</Button>
                                    </DialogActions>
                                </>
                            )
                        }
                        {dialogType === "deleteChild" && (
                            <>
                                <DialogTitle>{t("Delete Child Node")}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        {t("Are you sure you want to delete this child?")}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpenDialog(false)}>{t("Cancel")}</Button>
                                    <Button onClick={() => DeleteChildrenNode()}>{t("Yes, Delete")}</Button>
                                </DialogActions>
                            </>
                        )}
                    </Dialog>
                </Box>
            </Box>
            <Box>
                <h1>{t('Node Tree')}</h1>
            </Box>
            <Box sx={{ width: '100%', maxWidth: 360 }}>
                <RichTreeView
                    items={nodes || []}
                    onItemClick={(event, id) => getEachItem(event, id)}
                    slots={{ item: AnimatedTreeItem }}
                    slotProps={{
                        item: {
                            onDeleteParent: (id: string) => {
                                setNodeId(id);
                                setDialogType("delete");
                                setOpenDialog(true);
                            },
                            onDeleteChild: (id: string) => {
                                const child = nodes
                                    ?.flatMap((n) => n.children || [])
                                    .find((c) => c.id === id);
                                setSelectedChildrenItem(child || null);
                                setDialogType("deleteChild");
                                setOpenDialog(true);
                            },
                            onEdit: (id: string) => {
                                const child = nodes
                                    ?.flatMap((n) => n.children || [])
                                    .find((c) => c.id === id);
                                setSelectedChildrenItem(child || null);
                                setDialogType("edit");
                                setOpenDialog(true);
                            }
                        } as any,
                    }}
                    sx={{ maxWidth: 600 }}
                />
            </Box>
        </>
    )
}

export default NodeTree
