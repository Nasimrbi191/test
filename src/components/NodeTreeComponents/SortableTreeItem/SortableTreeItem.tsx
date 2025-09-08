import AnimatedTreeItem from "../AnimatedTreeItem/AnimatedTreeItem";
import {forwardRef} from 'react'

const SortableTreeItem = forwardRef((props: any,ref) => {
    return (
        <AnimatedTreeItem
            {...props}
            ref={ref}
        />
    );
})

export default SortableTreeItem;