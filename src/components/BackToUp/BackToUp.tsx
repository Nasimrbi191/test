import  { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTopButton() {
    const [show, setShow] = useState(false);

    // Show button when scrollY > 300
    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // smooth scrolling
        });
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                        position: "fixed",
                        bottom: 30,
                        right: 30,
                        zIndex: 1500,
                    }}
                >
                    <IconButton
                        onClick={scrollToTop}
                        sx={{
                            background: "#06b6d4",
                            color: "#fff",
                            "&:hover": { background: "#0ea5e9", transform: "scale(1.1)" },
                            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                        }}
                    >
                        <ArrowUpwardIcon />
                    </IconButton>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
