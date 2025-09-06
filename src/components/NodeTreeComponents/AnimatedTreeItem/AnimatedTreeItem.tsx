import * as React from "react";
import {
    useTreeItem,
    TreeItemProvider,
    TreeItemRoot,
    TreeItemContent,
    TreeItemIconContainer,
    TreeItemLabel,
    TreeItemGroupTransition,
} from "@mui/x-tree-view";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, CircularProgress } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface AnimatedTreeItemProps {
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    itemId: string;
    label: string;
    children?: React.ReactNode;
}

const AnimatedTreeItem = React.forwardRef<HTMLLIElement, AnimatedTreeItemProps>(
    ({ itemId, label, children, onDelete, onEdit }, ref) => {
        const {
            getContextProviderProps,
            getRootProps,
            getContentProps,
            getIconContainerProps,
            getLabelProps,
            getGroupTransitionProps,
            status,
        } = useTreeItem({ itemId, children, label, rootRef: ref });

        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: itemId });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        const isFolder = status.expandable;
        const [loading, setLoading] = React.useState(false);
        const [lazyChildren, setLazyChildren] = React.useState<React.ReactNode | null>(null);

        const childIds = React.useMemo(
            () => React.Children.toArray(children).map((c: any) => c.key).join(","),
            [children]
        );

        const prevChildIds = React.useRef(childIds);

        React.useEffect(() => {
            if (childIds !== prevChildIds.current) {
                // only reset if children really changed
                setLazyChildren(null);
                setLoading(false);
                prevChildIds.current = childIds;
            }
        }, [childIds]);

        // --- lazy children logic ---
        React.useEffect(() => {
            if (status.expanded && isFolder && !lazyChildren) {
                setLoading(true);
                const timer = setTimeout(() => {
                    setLazyChildren(children);
                    setLoading(false);
                }, 2000);
                return () => clearTimeout(timer);
            }
            if (!status.expanded) {
                setLazyChildren(null);
                setLoading(false);
            }
        }, [status.expanded, isFolder, lazyChildren, children]);

        return (
            <TreeItemProvider {...getContextProviderProps()}>
                <TreeItemRoot {...getRootProps()} ref={setNodeRef} style={style}>
                    <TreeItemContent {...getContentProps()} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* Drag handle */}
                        <Box
                            {...attributes}
                            {...listeners}
                            sx={{
                                cursor: "grab",
                                display: "flex",
                                alignItems: "center",
                                width: 24,
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={16} />
                            ) : status.expandable ? (
                                status.expanded ? (
                                    <ArrowDropDownIcon fontSize="small" />
                                ) : (
                                    <ArrowLeftIcon fontSize="small" />
                                )
                            ) : null}
                        </Box>
                        {/* Folder/File Icon */}
                        <TreeItemIconContainer {...getIconContainerProps()}>
                            {isFolder ? (status.expanded ? <FolderOpenIcon sx={{ color: "orange" }} /> : <FolderIcon sx={{ color: "orange" }} />) : (
                                <InsertDriveFileIcon sx={{ color: "gray" }} />
                            )}
                        </TreeItemIconContainer>

                        {/* Label */}
                        <TreeItemLabel {...getLabelProps()} onClick={() => onEdit?.(itemId)}>
                            {label}
                        </TreeItemLabel>

                        {/* Delete */}
                        <Box
                            component="span"
                            sx={{ ml: "auto", cursor: "pointer", color: "red" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(itemId);
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </Box>
                    </TreeItemContent>

                    {/* Children */}
                    <TreeItemGroupTransition {...getGroupTransitionProps()}>
                        {lazyChildren}
                    </TreeItemGroupTransition>
                </TreeItemRoot>
            </TreeItemProvider>
        );
    }
);


export default AnimatedTreeItem;
