import * as React from "react";
import { motion } from "framer-motion";
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
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, CircularProgress } from "@mui/material";

interface AnimatedTreeItemProps {
    onDeleteParent?: (id: string) => void;
    onDeleteChild?: (id: string) => void;
    onEdit?: (id: string) => void;
    itemId: string;
    label: string;
    children?: React.ReactNode;
}

const AnimatedTreeItem = React.forwardRef<HTMLLIElement, AnimatedTreeItemProps>(
    ({ itemId, label, children, onDeleteParent, onDeleteChild, onEdit, ...other }, ref) => {
        const {
            getContextProviderProps,
            getRootProps,
            getContentProps,
            getIconContainerProps,
            getLabelProps,
            getGroupTransitionProps,
            status,
        } = useTreeItem({ itemId, children, label, rootRef: ref });

        const isFolder = status.expandable;
        const [loading, setLoading] = React.useState(false);
        const [lazyChildren, setLazyChildren] = React.useState<React.ReactNode | null>(null);

        React.useEffect(() => {
            if (status.expanded && isFolder && !lazyChildren) {
                setLoading(true);
                const timer = setTimeout(() => {
                    setLazyChildren(children);
                    setLoading(false);
                }, 2000); // 2 seconds lazy load
                return () => clearTimeout(timer);
            }

            if (!status.expanded) {
                // Reset when collapsed
                setLazyChildren(null);
                setLoading(false);
            }
        }, [status.expanded, isFolder, lazyChildren, children]);

        return (
            <TreeItemProvider {...getContextProviderProps()}>
                <TreeItemRoot {...getRootProps(other)}>
                    <TreeItemContent
                        {...getContentProps()}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        {/* Arrow or Loading Spinner */}
                        {isFolder && (
                            <Box sx={{ width: 24, display: "flex", justifyContent: "center" }}>
                                {loading ? (
                                    <CircularProgress size={16} />
                                ) : (
                                    <motion.div
                                        animate={{ rotate: status.expanded ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ display: "flex" }}
                                    >
                                        <ArrowRightIcon fontSize="small" />
                                    </motion.div>
                                )}
                            </Box>
                        )}

                        {/* Folder/File Icon */}
                        <TreeItemIconContainer {...getIconContainerProps()}>
                            {isFolder ? (
                                status.expanded ? (
                                    <FolderOpenIcon sx={{ color: "orange" }} />
                                ) : (
                                    <FolderIcon sx={{ color: "orange" }} />
                                )
                            ) : (
                                <InsertDriveFileIcon sx={{ color: "gray" }} />
                            )}
                        </TreeItemIconContainer>

                        {/* Label */}
                        <TreeItemLabel {...getLabelProps()} onClick={() => onEdit?.(itemId)}>
                            {label}
                        </TreeItemLabel>

                        {/* Delete Button */}
                        <Box
                            component="span"
                            sx={{ ml: "auto", cursor: "pointer", color: "red" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isFolder) onDeleteParent?.(itemId);
                                else onDeleteChild?.(itemId);
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </Box>
                    </TreeItemContent>

                    {/* Children */}
                    <TreeItemGroupTransition {...getGroupTransitionProps()}>
                        {
                            lazyChildren
                        }
                    </TreeItemGroupTransition>
                </TreeItemRoot>
            </TreeItemProvider>
        );
    }
);

export default AnimatedTreeItem;
