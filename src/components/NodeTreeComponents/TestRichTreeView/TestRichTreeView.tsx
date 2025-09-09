import * as React from 'react';
import Box from '@mui/material/Box';
import {
    randomInt,
    randomName,
    randomId,
    randomBoolean,
} from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import type { TreeViewBaseItem } from '@mui/x-tree-view';


export type ItemType = TreeViewBaseItem<{
    id: string;
    label: string;
    childrenCount?: number;
}>;

export const initialItems: ItemType[] = [
    {
        "id": "55b0168c-cada-46b0-bdec-82498205c7e9",
        "label": "تعتتتت",
        "priority": "1",
        "children": [
            {
                "id": "d0a1aa62-72ad-4f8f-b1dd-7f33a2078d1a",
                "label": "t6tyty",
                "priority": "1",
                "children": [
                    {
                        "id": "016f0fd3-ec40-4d0e-8ba1-cffb4447d412",
                        "label": "rrrrr",
                        "children": [
                            {
                                "id": "11dfc5c6-555f-4054-829b-74e06edd4d8c",
                                "label": "111",
                                "children": [
                                    {
                                        "id": "96f97192-9ed9-4677-82a6-b22ebc4b1a15",
                                        "label": "11111",
                                        "children": [
                                            {
                                                "id": "bdca5aca-a7d1-4410-b835-8c7e636fa39f",
                                                "label": "11111",
                                                "children": [],
                                                "priority": "1"
                                            }
                                        ],
                                        "priority": "1"
                                    }
                                ],
                                "priority": "1"
                            }
                        ],
                        "priority": "1"
                    }
                ]
            },
            {
                "id": "173856c9-df86-4eb0-8325-8da1de2f0e52",
                "label": "22222222222222222222222222222222222222222222222222222222222",
                "priority": "1"
            }
        ]
    },
    {
        "id": "4d2dd727-5eff-42cd-ae0b-ace3a844c74f",
        "label": "ergertgh",
        "priority": "1"
    }
]

const fetchData = async (): Promise<ItemType[]> => {
    // const length: number = randomInt(2, 10);
    // const rows = Array.from({ length }, () => ({
    //     id: randomId(),
    //     label: randomName({}, {}),
    //     ...(randomBoolean() ? { childrenCount: length } : {}),
    // }));
    // const response = await fetch('http://localhost:5000/nodes');
    // const data = await response.json();

    const data = [{
        "id": "55b0168c-cada-46b0-bdec-82498205c7e9",
        "label": "تعتتتت",
        "priority": "1",
        "children": [
            {
                "id": "d0a1aa62-72ad-4f8f-b1dd-7f33a2078d1a",
                "label": "t6tyty",
                "priority": "1",
                "children": [
                    {
                        "id": "016f0fd3-ec40-4d0e-8ba1-cffb4447d412",
                        "label": "rrrrr",
                        "children": [
                            {
                                "id": "11dfc5c6-555f-4054-829b-74e06edd4d8c",
                                "label": "111",
                                "children": [
                                    {
                                        "id": "96f97192-9ed9-4677-82a6-b22ebc4b1a15",
                                        "label": "11111",
                                        "children": [
                                            {
                                                "id": "bdca5aca-a7d1-4410-b835-8c7e636fa39f",
                                                "label": "11111",
                                                "children": [],
                                                "priority": "1"
                                            }
                                        ],
                                        "priority": "1"
                                    }
                                ],
                                "priority": "1"
                            }
                        ],
                        "priority": "1"
                    }
                ]
            },
            {
                "id": "173856c9-df86-4eb0-8325-8da1de2f0e52",
                "label": "22222222222222222222222222222222222222222222222222222222222",
                "priority": "1"
            }
        ]
    },]

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
};

export default function LazyLoadingInitialState() {
    return (
        <Box sx={{ width: '300px' }}>
            <RichTreeViewPro
                items={initialItems}
                itemsReordering
                slotProps={{
                    item: {
                        onDoubleClick: (event: React.MouseEvent, id: string) => {
                            event.preventDefault();
                            // setDialogType("edit");
                            // setOpenDialog(true);
                            // getEachItem(event, id);
                        },
                        onDelete: (event: React.MouseEvent, id: string) => {
                            // setNodeId(id);
                            // setDialogType("delete");
                            // setOpenDialog(true);
                            // getEachItem(event, id);
                        },
                    } as any,
                }}
                dataSource={{
                    getChildrenCount: (item) => item?.childrenCount as number,
                    getTreeItems: fetchData,
                }}
            />
        </Box>
    );
}
