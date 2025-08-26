"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const ScrollRevealOneLine = () => {
    const ref = useRef(null);
    const {t} = useTranslation();

    // Track scroll progress of this section
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "end 20%"],
    });

    // Animate width from 0 → 100%
    const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section
            ref={ref}
            style={{
                minHeight: "300px",
                background: "#0f172a",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "1200px",
                    overflow: "hidden",
                }}
            >
                <motion.h1
                    style={{
                        direction: "ltr",
                        marginBlock: "0px",
                        whiteSpace: "nowrap", 
                        fontSize: "7rem",
                        fontWeight: "bold",
                        color: "#fff",
                        width, // 👈 animated width
                        background: "linear-gradient(90deg,#06b6d4,#a855f7)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {t('From Production Line to Perfection in Every Can')} 
                </motion.h1>
            </div>
        </section>
    );
};

export default ScrollRevealOneLine;
