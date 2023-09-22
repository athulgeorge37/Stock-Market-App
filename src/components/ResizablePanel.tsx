import { motion } from "framer-motion";
import { type ReactNode } from "react";
import useMeasure from "react-use-measure";

interface ResizablePanelProps {
    children: ReactNode;
}

const ResizablePanel = ({ children }: ResizablePanelProps) => {
    // simply wrapping this will not actually animate the children
    // you still need AnimatePresence and conditionally render the part whose height will change
    // surrounding elements of ResizablePanel will smoothing animate
    // height of children will also smoothly animate
    const [ref, bounds] = useMeasure();

    return (
        <motion.div
            animate={{ height: bounds.height > 0 ? bounds.height : undefined }}
        >
            <div ref={ref}>{children}</div>
        </motion.div>
    );
};

export default ResizablePanel;
