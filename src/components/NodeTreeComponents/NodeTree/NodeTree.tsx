import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import {
    DndContext,
    closestCenter,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import SortableTreeItem from '../SortableTreeItem/SortableTreeItem';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

interface node {
    id: string;
    label: string;
    children: any[];
    priority: string;
}

interface NodeItem {
    id: string;
    label: string;
    children: NodeItem[];
    priority: string;
    parentId?: string | null;
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

    // Flatten tree
    const flattenTree = (nodes: NodeItem[], parentId: string | null = null): NodeItem[] =>
        nodes.flatMap(node => [
            { ...node, parentId },
            ...flattenTree(node.children || [], node.id),
        ]);

    // Rebuild tree
    const rebuildTree = (flatNodes: NodeItem[]): NodeItem[] => {
        const map = new Map<string, NodeItem & { children: NodeItem[] }>();
        const roots: NodeItem[] = [];

        flatNodes.forEach(n => map.set(n.id, { ...n, children: [] }));

        flatNodes.forEach(n => {
            if (n.parentId) {
                const parent = map.get(n.parentId);
                if (parent) parent.children.push(map.get(n.id)!);
            } else {
                roots.push(map.get(n.id)!);
            }
        });

        return roots;
    };


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
            const parentNode = nodes?.find((n) => n.id === newNodeParent);
            if (!parentNode) {
                setError("Parent node not found.");
                return;
            }

            const newChild = {
                id: crypto.randomUUID(),
                label: childrenNodeName,
                children: [],
                priority: "1",
            };

            // ✅ Optimistic update
            const updatedNodes = nodes?.map((n) =>
                n.id === parentNode.id
                    ? { ...n, children: [...(n.children || []), newChild] }
                    : n
            );

            // setNodes(updatedNodes);
            setChildrenNodeName("");
            setIsSuccess(true);
            setSnackbarType("create");
            setOpenDialog(false);

            // ✅ Backend sync
            const res = await fetch(`http://localhost:5000/nodes/${parentNode.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...parentNode,
                    children: [...(parentNode.children || []), newChild],
                }),
            });

            if (!res.ok) {
                setError("Error adding child node.");
                await fetchNodes(); // rollback if failed
            } else {
                await fetchNodes(); // final sync
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

    // delete node 
    const DeleteNode = async () => {
        try {
            const res = await fetch(`http://localhost:5000/nodes/${nodeId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorText = await res.text(); // Get any error message if available
                setError(`${t("Error deleting node.")}${errorText ? `: ${errorText}` : ''}`);
            } else {
                setIsSuccess(true);
                setSnackbarType("delete");
            }

            await fetchNodes();
            setOpenDialog(false);
        } catch (err) {
            console.error("Error deleting node:", err);
            setError(`${t("Error deleting node.")}`);
            await fetchNodes(); // Still refresh in case of partial success
            setOpenDialog(false);
        }
    }

    // delete children node
    const DeleteChildrenNode = async () => {
        if (!selectedChildrenItem) return;

        try {
            const parentNode = nodes?.find(
                (n) => n.children?.some((child) => child.id === selectedChildrenItem.id)
            );

            if (!parentNode) {
                setError("Parent node not found.");
                return;
            }

            const updatedChildren = parentNode.children.filter(
                (child) => child.id !== selectedChildrenItem.id
            );


            // ✅ Optimistic update
            const updatedNodes = nodes?.map((n) =>
                n.id === parentNode.id ? { ...n, children: updatedChildren } : n
            );
            // setNodes(updatedNodes);

            setSelectedChildrenItem(null);
            setSelectedNode(null);
            setNodeNameChildren("");
            setNodeName("");
            setIsSuccess(true);
            setSnackbarType("delete");
            setOpenDialog(false);

            // ✅ Backend sync
            const res = await fetch(`http://localhost:5000/nodes/${parentNode.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...parentNode, children: updatedChildren }),
            });

            if (!res.ok) {
                setError("Error deleting child node.");
                await fetchNodes(); // rollback
            } else {
                await fetchNodes(); // final sync
            }
        } catch (err) {
            console.error("Error deleting child node:", err);
            setError("Error deleting child node.");
            await fetchNodes();
        }
    };

    // handle drag top level nodes
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        // Find dragged + target index
        const oldIndex = nodes?.findIndex((n) => n.id === active.id) ?? -1;
        const newIndex = nodes?.findIndex((n) => n.id === over.id) ?? -1;

        if (oldIndex === -1 || newIndex === -1) return;

        // Reorder locally
        const newNodes = arrayMove(nodes!, oldIndex, newIndex).map((n, idx) => ({
            ...n,
            priority: String(idx + 1), // update priority field
        }));

        setNodes(newNodes);

        // Sync backend
        for (let node of newNodes) {
            await fetch(`http://localhost:5000/nodes/${node.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(node),
            });
        }
    };
    // handle children drag end 
    const handleChildrenDragEnd = async (event: DragEndEvent, parentId: string) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        console.log(parentId);

        // Find the source parent and dragged child
        const sourceParent = nodes?.find((n) =>
            n.id === parentId || n.children?.some((c) => c.id === active.id)
        );

        if (!sourceParent) return;

        // Find the dragged child
        const draggedChild = sourceParent.children?.find((c) => c.id === active.id);
        if (!draggedChild) return;

        // Check if dropped onto another child (possibly new parent)
        const targetNode = nodes?.find((n) => n.id === over.id);
        let targetParent = sourceParent;

        // If dropped on a top-level node that is different, change parent
        if (targetNode && targetNode.id !== parentId) {
            targetParent = targetNode;
        } else {
            // Or dropped onto another child in same parent
            const childParent = nodes?.find((n) =>
                n.children?.some((c) => c.id === over.id)
            );
            if (childParent) targetParent = childParent;
        }

        // Remove child from old parent
        const updatedSourceChildren = sourceParent.children?.filter((c) => c.id !== active.id) || [];

        // Determine new index in target parent's children
        const targetIndex = targetParent.children?.findIndex((c) => c.id === over.id) ?? 0;

        // Insert dragged child into new parent at target index
        const updatedTargetChildren = [
            ...targetParent.children?.slice(0, targetIndex),
            draggedChild,
            ...targetParent.children?.slice(targetIndex),
        ];

        // Update nodes state
        const updatedNodes = nodes?.map((n) => {
            if (n.id === sourceParent.id) return { ...n, children: updatedSourceChildren };
            if (n.id === targetParent.id) return { ...n, children: updatedTargetChildren };
            return n;
        });

        setNodes(updatedNodes);

        // Sync backend
        const parentsToUpdate = [sourceParent, targetParent].filter(Boolean);
        for (let p of parentsToUpdate) {
            await fetch(`http://localhost:5000/nodes/${p.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(p),
            });
        }
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
                                        {
                                            selectedChildrenItem && (

                                                <Button onClick={() => DeleteChildrenNode()}>{t('Yes, Delete')}</Button>
                                            )
                                        }
                                        {
                                            !selectedChildrenItem && (
                                                <Button onClick={() => DeleteNode()}>{t('Yes, Delete')}</Button>

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
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={nodes?.map((n) => n.id) || []}
                        strategy={verticalListSortingStrategy}
                    >
                        <RichTreeViewPro
                            items={nodes?.sort((a, b) => Number(a.priority) - Number(b.priority)) || []}
                            onItemClick={(event, id) => getEachItem(event, id)}
                            itemsReordering
                            slots={{ item: SortableTreeItem }}
                            slotProps={{
                                item: {
                                    onDelete: (id: string) => {
                                        setNodeId(id);
                                        const child = nodes?.flatMap((n) => n.children || []).find((c) => c.id === id);
                                        setSelectedChildrenItem(child || null);
                                        setDialogType("delete");
                                        setOpenDialog(true);
                                    },
                                    onEdit: (id: string) => {
                                        const child = nodes?.flatMap((n) => n.children || []).find((c) => c.id === id);
                                        setSelectedChildrenItem(child || null);
                                        setDialogType("edit");
                                        setOpenDialog(true);
                                    },
                                    renderChildren: (children: node[], parentId: string) => (
                                        <DndContext
                                            collisionDetection={closestCenter}
                                            onDragEnd={(event) => handleChildrenDragEnd(event, parentId)}
                                        >
                                            <SortableContext
                                                items={children.map((c) => c.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {children.map((child) => (
                                                    <SortableTreeItem
                                                        key={child.id}
                                                        itemId={child.id}
                                                        label={child.label}
                                                        onDelete={() => {
                                                            setSelectedChildrenItem(child);
                                                            setDialogType("delete");
                                                            setOpenDialog(true);
                                                        }}
                                                        onEdit={() => {
                                                            setSelectedChildrenItem(child);
                                                            setDialogType("edit");
                                                            setOpenDialog(true);
                                                        }}
                                                    >
                                                        {child.children?.length > 0 &&
                                                            <>
                                                                {child.children.map((grandChild) => (
                                                                    <SortableTreeItem
                                                                        key={grandChild.id}
                                                                        itemId={grandChild.id}
                                                                        label={grandChild.label}
                                                                        onDelete={() => {
                                                                            setSelectedChildrenItem(grandChild);
                                                                            setDialogType("delete");
                                                                            setOpenDialog(true);
                                                                        }}
                                                                        onEdit={() => {
                                                                            setSelectedChildrenItem(grandChild);
                                                                            setDialogType("edit");
                                                                            setOpenDialog(true);
                                                                        }}
                                                                    />
                                                                ))}

                                                            </>

                                                        }
                                                    </SortableTreeItem>
                                                ))}
                                            </SortableContext>
                                        </DndContext>
                                    ),
                                } as any
                            }}
                        />
                    </SortableContext>
                </DndContext>
            </Box>
        </>
    )
}

export default NodeTree
