import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Container, Typography, Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

const FadeInSection = ({ children, delay = 0 }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

    React.useEffect(() => {
        if (inView) controls.start("visible");
        else controls.start("hidden");
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay } },
            }}
        >
            {children}
        </motion.div>
    );
};

export default function HeroSection() {
    const { t } = useTranslation();
    return (
        <div
            style={{
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                color: "#fff",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
                paddingBlock: "100px",
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center" justifyContent={"center"} sx={{
                    flexWrap: { xs: "wrap", md: "nowrap" }
                }}>
                    {/* Left Side: Text */}
                    <Grid item xs={12} md={6}>
                        <FadeInSection>
                            <Typography sx={{ fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.2 }} variant="h2" fontWeight="bold" gutterBottom>
                                {t("Refreshing Energy in Every Can")}
                            </Typography>
                            <Typography variant="h6" color="grey.400" gutterBottom>
                                {t("State-of-the-art canned drink production for a healthier, fresher tomorrow.")}
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    borderRadius: "30px",
                                    px: 4,
                                    background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
                                }}
                            >
                                {t("Explore Factory")}
                            </Button>
                        </FadeInSection>
                    </Grid>

                    {/* Right Side: Animated Can */}
                    <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
                        <motion.div
                            initial={{ rotate: -15, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 1 }}
                            style={{
                                display: "inline-block",
                                padding: "30px",
                                borderRadius: "20px",
                                background: "rgba(255, 255, 255, 0.05)",
                            }}
                        >
                            <motion.img
                                src="https://cdn-icons-png.flaticon.com/512/1047/1047462.png"
                                alt="Drink Can"
                                style={{ width: "180px", height: "auto" }}
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            />
                        </motion.div>
                    </Grid>
                </Grid>

                {/* 🚀 Hero Product Line (Animated Cans) */}
                <Grid container spacing={5} mt={10} justifyContent="center">
                    {[
                        { label: t("Cola"), img: "/Free3DCoca-ColaBottleCanMockup_PSD_900x.webp" },
                        { label: t("Energy"), img: "/realistic-soda-can-mockup-free-download-by-pixelbuddha-main-x2-medium.jpg" },
                        { label: t("Juice"), img: "/pngtree-3d-canned-juice-png-image_5816930.jpg" },
                        { label: t("Sparkling Water"), img: "/Soda-Can-Mockup-Free-PSD-.jpg" },
                    ].map((item, i) => (
                        <Grid item key={i}>
                            <FadeInSection delay={i * 0.3}>
                                <motion.div
                                    whileHover={{ scale: 1.12 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    animate={{
                                        y: [0, -10, 0], // floating effect
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 4,
                                        ease: "easeInOut",
                                        delay: i * 0.4,
                                    }}
                                    style={{
                                        borderRadius: "20px",
                                        background: "rgba(255, 255, 255, 0.15)",
                                        backdropFilter: "blur(12px)",
                                        textAlign: "center",
                                        width: 220,
                                        height: 280,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Spotlight glow effect on hover */}
                                    <motion.div
                                        whileHover={{ opacity: 1 }}
                                        initial={{ opacity: 0 }}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: "radial-gradient(circle at center, rgba(255,255,255,0.3), transparent 70%)",
                                            zIndex: 1,
                                        }}
                                    />
                                    <img
                                        src={item.img}
                                        alt={item.label}
                                        style={{
                                            width: "222px",
                                            height: "100%",
                                            objectFit: "cover",
                                            zIndex: 2,
                                        }}
                                    />
                                    <Typography
                                        mt={2}
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ color: "#fff", zIndex: 2 }}
                                    >
                                        {item.label}
                                    </Typography>
                                </motion.div>
                            </FadeInSection>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
}
