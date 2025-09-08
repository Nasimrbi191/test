import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SortableTreeItem from '../SortableTreeItem/SortableTreeItem';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';


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
    const [nodeNameChildren, setNodeNameChildren] = useState<string>();
    const [newNodeName, setNewNodeName] = useState('');
    const [error, setError] = useState('');
    const [childrenNodeName, setChildrenNodeName] = useState('');
    const [newNodeParent, setNewNodeParent] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedNode, setSelectedNode] = useState<node | null>(null);
    const [snackbarType, setSnackbarType] = useState('');
    const [selectedChildrenItem, setSelectedChildrenItem] = useState<node | null>(null);
    const [nodeId, setNodeId] = useState('');
    const newNodeId = crypto.randomUUID();


    const fetchNodes = async () => {
        try {
            const response = await fetch('http://localhost:5000/nodes');
            const data = await response.json();
            setNodes(data);
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    };


    useEffect(() => {
        fetchNodes();
    }, []);

    const handleDialogOpen = (type: string) => {
        setDialogType(type);
        setOpenDialog(true);
    };

    function findNodeById(nodes: any[], id: string): any | null {
        for (const node of nodes) {
            if (node.id === id) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    const getEachItem = (event: React.MouseEvent, id: any) => {
        const fullItem = nodes?.find((node: any) => node.id === id);
        setSelectedNode(fullItem || null);
        const fullItemChildren = findNodeById(nodes, id);
        setSelectedChildrenItem(fullItemChildren || null);
        setNodeName(fullItem?.label || '');
        setNodeNameChildren(fullItemChildren?.label || '');
        setNodeId(id);
    }

    useEffect(() => {
        setNewNodeParent(selectedNode ? selectedNode?.id : selectedChildrenItem?.id)
    }, [selectedNode, selectedChildrenItem])


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

    // add Child To Tree

    function addChildToTree(nodes, parentId, newChild) {
        return nodes.map(node => {
            if (node.id === parentId) {
                return { ...node, children: [...(node.children || []), newChild] };
            }

            if (node.children && node.children.length > 0) {
                return { ...node, children: addChildToTree(node.children, parentId, newChild) };
            }

            return node;
        });
    }

    // add node children
    const AddNodeChildren = async () => {
        if (!childrenNodeName || !newNodeParent) {
            setError(`${t("Please enter a node name and select a parent node.")}`);
            return;
        }

        try {
            const newChild = {
                id: crypto.randomUUID(),
                label: childrenNodeName,
                children: [],
                priority: "1",
            };

            // ✅ Update tree locally
            const updatedNodes = addChildToTree(nodes, newNodeParent, newChild);
            setNodes(updatedNodes);

            setChildrenNodeName("");
            setIsSuccess(true);
            setSnackbarType("create");
            setOpenDialog(false);

            // ✅ Find the top-level parent that contains this nested parent
            const findTopParent = (nodes, parentId) => {
                for (let node of nodes) {
                    if (node.id === parentId) return node;
                    if (node.children?.length) {
                        const found = findTopParent(node.children, parentId);
                        if (found) return node; // return the ancestor top-level
                    }
                }
                return null;
            };

            const topParent = findTopParent(updatedNodes, newNodeParent);

            if (!topParent) {
                setError("Top-level parent not found.");
                return;
            }

            // ✅ Save whole top-level parent to backend
            const res = await fetch(`http://localhost:5000/nodes/${topParent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(topParent),
            });

            if (!res.ok) {
                setError("Error saving updated tree.");
                await fetchNodes(); // rollback
            } else {
                await fetchNodes(); // refresh
            }
        } catch (err) {
            console.error("Error adding child node:", err);
            setError("Error adding child node.");
            await fetchNodes();
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

    function updateNodeInTree(nodes, nodeId, updates) {
        return nodes.map(node => {
            if (node.id === nodeId) {
                return { ...node, ...updates };
            }

            if (node.children && node.children.length > 0) {
                return { ...node, children: updateNodeInTree(node.children, nodeId, updates) };
            }

            return node;
        });
    }

    // edit children node
    const EditChildrenNode = async () => {
        if (!selectedChildrenItem || !nodeNameChildren) {
            setError(`${t("Please select a node and enter a name.")}`);
            return;
        }

        try {
            // ✅ Update the node locally (recursively)
            const updatedNodes = updateNodeInTree(nodes, selectedChildrenItem.id, {
                label: nodeNameChildren,
            });
            setNodes(updatedNodes);

            // ✅ Find the top-level parent of the edited node
            const findTopParent = (nodes, nodeId) => {
                for (let node of nodes) {
                    if (node.id === nodeId) return node;
                    if (node.children?.length) {
                        const found = findTopParent(node.children, nodeId);
                        if (found) {
                            return node; // bubble up: return ancestor
                        }
                    }
                }
                return null;
            };

            const topParent = findTopParent(updatedNodes, selectedChildrenItem.id);

            if (!topParent) {
                setError(`${t("Top-level parent not found.")}`);
                return;
            }

            // ✅ Save updated top parent to backend
            const res = await fetch(`http://localhost:5000/nodes/${topParent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(topParent),
            });

            if (!res.ok) {
                setError(`${t("Error editing node.")}`);
                await fetchNodes(); // rollback
            } else {
                setNodeNameChildren("");
                setIsSuccess(true);
                setSnackbarType("edit");
                setOpenDialog(false);
                await fetchNodes(); // refresh
            }
        } catch (err) {
            console.error("Error editing node:", err);
            setError(`${t("Error editing node.")}`);
        }
    };

    // delet node in any level 
    const DeleteNodeUnified = async (nodeId: string) => {
        if (!nodeId) return;

        try {
            const isTopParent = nodes.some(node => node.id === nodeId);

            if (isTopParent) {
                const res = await fetch(`http://localhost:5000/nodes/${nodeId}`, { method: "DELETE" });
                if (!res.ok) {
                    const errorText = await res.text();
                    setError(`Error deleting node${errorText ? `: ${errorText}` : ""}`);
                } else {
                    setIsSuccess(true);
                    setSnackbarType("delete");
                }
                await fetchNodes();
                setOpenDialog(false);
                return;
            }

            // Recursive delete
            function deleteNodeInTree(nodesArray: any[], nodeId: string): any[] {
                return nodesArray
                    .map(node => {
                        if (node.id === nodeId) return null;
                        if (node.children?.length) {
                            return { ...node, children: deleteNodeInTree(node.children, nodeId) };
                        }
                        return node;
                    })
                    .filter(Boolean);
            }

            // Find top-level parent BEFORE deletion
            const findTopParent = (nodesArray: any[], nodeId: string): any | null => {
                for (let node of nodesArray) {
                    if (node.children?.some(child => child.id === nodeId)) return node;
                    if (node.children?.length) {
                        const found = findTopParent(node.children, nodeId);
                        if (found) return node;
                    }
                }
                return null;
            };

            const topParent = findTopParent(nodes, nodeId);

            if (!topParent) {
                setError("Top-level parent not found.");
                return;
            }

            // ✅ Optimistic update
            const updatedNodes = deleteNodeInTree(nodes, nodeId);
            setNodes(updatedNodes);

            // ✅ Send updated top-level parent
            const updatedTopParent = updatedNodes.find(n => n.id === topParent.id);
            if (!updatedTopParent) {
                setError("Updated top-level parent not found.");
                return;
            }

            const res = await fetch(`http://localhost:5000/nodes/${updatedTopParent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTopParent),
            });

            if (!res.ok) {
                setError("Error deleting node.");
                await fetchNodes();
            } else {
                setIsSuccess(true);
                setSnackbarType("delete");
                await fetchNodes();
                setOpenDialog(false);
            }
        } catch (err) {
            console.error("Error deleting node:", err);
            setError("Error deleting node.");
            await fetchNodes();
        }
    };

    // all nodes
    function renderNodes(nodes, level = 0) {
        return nodes.flatMap(node => [
            <MenuItem key={node.id} value={node.id}>
                {"—".repeat(level)} {node.label}
            </MenuItem>,
            ...(node.children ? renderNodes(node.children, level + 1) : [])
        ]);
    }

    const treeRef = useRef<any>(null);

    const handleItemPositionChange = async () => {
        const newTree = treeRef?.current?.getItemTree();
        const res = await fetch("http://localhost:5000/nodes");
        const nodes = await res.json();

        await Promise.all(
            nodes.map((node: any) =>
                fetch(`http://localhost:5000/nodes/${node.id}`, { method: "DELETE" })
            )
        );

        await Promise.all(
            newTree.map((node: any) =>
                fetch("http://localhost:5000/nodes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(node),
                })
            )
        );

        console.log("Database replaced successfully");
    };



    return (
        <>

            {/* Snackbars */}
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
                                                sx={{ mt: 4, overflow: 'auto' }}
                                                label={t('Parent Node')}
                                            >
                                                {renderNodes(nodes)}
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
                                        {
                                            selectedChildrenItem && (

                                                <Button onClick={() => DeleteNodeUnified(nodeId)}>{t('Yes, Delete')}</Button>
                                            )
                                        }
                                    </DialogActions>
                                </>
                            )
                        }
                    </Dialog>
                </Box>
            </Box>
            <Box>
                <h1>{t('Node Tree')}</h1>
            </Box>
            {/* tree view */}
            <Box sx={{ width: '100%', maxWidth: 360 }}>
                <RichTreeViewPro
                    apiRef={treeRef}
                    items={nodes || []}
                    itemsReordering
                    onItemPositionChange={handleItemPositionChange}
                    slots={{ item: SortableTreeItem }}
                    onItemClick={(event, id) => getEachItem(event, id)}
                    slotProps={{
                        item: {
                            onDoubleClick: (event: React.MouseEvent, id: string) => {
                                event.preventDefault();
                                setDialogType("edit");
                                setOpenDialog(true);
                                getEachItem(event, id);
                            },
                            onDelete: (event:React.MouseEvent,id: string) => {
                                setNodeId(id);
                                setDialogType("delete");
                                setOpenDialog(true);
                                getEachItem(event, id);
                            },
                        } as any,
                    }}
                />
            </Box>
        </>
    )
}

export default NodeTree
