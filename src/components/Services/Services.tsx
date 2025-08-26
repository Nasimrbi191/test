import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import { useTranslation } from "react-i18next";

// Animated card component with multiple directions
const AnimatedServiceCard = ({ service, direction = "top", delay = 0, index }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });
    React.useEffect(() => {
        if (inView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [controls, inView]);

    const variants = {
        hidden: {
            opacity: 0,
            x:
                direction === "left"
                    ? -100
                    : direction === "right"
                        ? 100
                        : 0,
            y:
                direction === "top"
                    ? -50
                    : direction === "bottom"
                        ? 50
                        : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 0.8, delay },
        },
    };

    return (
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
            <Box
                sx={{
                    flex: 1,
                    mt: index % 2 === 0 ? 0 : 6, // zigzag vertical offset
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    p: 2,
                    cursor: "pointer",
                    "&:hover": {
                        scale: 1.05,
                        boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
                        transition: "all 0.3s ease",
                    },
                }}>
                <img
                    src={service.img}
                    alt={service.title}
                    style={{ width: "350px", height: "200px", objectFit: "cover", borderRadius: "15px" , maxWidth : "100%" }}
                />
                <Typography variant="h6" mt={1} fontWeight="bold">
                    {service.title}
                </Typography>
                <Typography variant="body2" mt={1}>
                    {service.description}
                </Typography>
            </Box>
        </motion.div>
    );
};



export default function ServicesSection() {
    const directions = ["top", "bottom", "left", "right"]; // Different direction for each card
    const { t } = useTranslation();
    const services = [
        {
            title: `${t('Production')}`,
            img: "/robotic-arms-sorting-packages-conveyor-belt_23-2152005497.jpg",
            description: `${t('High-speed beverage production lines for every type of drink.')}`,
        },
        {
            title: `${t('Packaging')}`,
            img: "/paper-food-delivery-box-packaging-mockup_439185-5382.avif",
            description: `${t('Eco-friendly and attractive packaging solutions.')}`,
        },
        {
            title: `${t('Logistics')}`,
            img: "/aerial-view-cargo-ship-cargo-container-harbor_335224-1380.avif",
            description: `${t('Fast and secure delivery to your distributors.')}`,
        },
        {
            title: `${t('Quality Control')}`,
            img: "/successful-testing-man-with-clipboard-showing-thumb-up-quality-assurance-business-strategy-approval-bottleneck-analysis-analyst-cartoon-character_335657-408.avif",
            description: `${t('Stringent quality checks to ensure perfect cans every time.')}`,
        },
    ];
    return (
        <Box sx={{ py: 12, position: "relative", background: "#0f172a", color: "#fff" }}>
            {/* Decorative floating icons */}
            <FactoryOutlinedIcon
                sx={{
                    position: "absolute",
                    top: "10%",
                    left: "5%",
                    fontSize: 120,
                    color: "rgba(255,255,255,0.03)",
                    transform: "rotate(-20deg)",
                }}
            />
            <LocalDrinkOutlinedIcon
                sx={{
                    position: "absolute",
                    bottom: "15%",
                    right: "10%",
                    fontSize: 100,
                    color: "rgba(255,255,255,0.03)",
                    transform: "rotate(15deg)",
                }}
            />

            <Typography variant="h4" textAlign="center" mb={6} fontWeight="bold">
                {t("our Services")}
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {services.map((service, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
                        <AnimatedServiceCard
                            service={service}
                            direction={directions[index]}
                            delay={index * 0.3}
                            index={index}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
