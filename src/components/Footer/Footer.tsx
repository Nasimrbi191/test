import { Box, Container, Grid, Typography, IconButton, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import { t } from "i18next";

const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

export default function AnimatedFooter() {
    return (
        <Box sx={{ position: "relative", background: "#0f172a", color: "#fff", py: 12, overflow: "hidden" }}>
            {/* Decorative floating icons */}
            <FactoryOutlinedIcon sx={{
                position: "absolute",
                top: "10%",
                left: "5%",
                fontSize: 120,
                color: "rgba(255,255,255,0.03)",
                transform: "rotate(-20deg)",
            }} />
            <LocalDrinkOutlinedIcon sx={{
                position: "absolute",
                bottom: "15%",
                right: "10%",
                fontSize: 100,
                color: "rgba(255,255,255,0.03)",
                transform: "rotate(15deg)",
            }} />

            <Container maxWidth="lg">
                <Grid container spacing={5} justifyContent="space-between">

                    {/* About Section */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            variants={footerVariants}
                        >
                            <Typography variant="h6" fontWeight="bold" mb={2}>{t("about us")}</Typography>
                            <Typography variant="body2">
                                {t("We produce high-quality canned drinks with modern technology and sustainable packaging. Taste the freshness in every can!")}
                            </Typography>
                        </motion.div>
                    </Grid>

                    {/* Newsletter / Subscribe Section */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <Typography variant="h6" fontWeight="bold" mb={2}>{t("Subscribe")}</Typography>
                            <Typography variant="body2" mb={2}>
                                {t("Get the latest updates about our drinks and factory innovations.")}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                <TextField
                                    placeholder={t("Your email")}
                                    variant="filled"
                                    size="small"
                                    sx={{ flex: 1, background: "#1e293b", borderRadius: 1 }}
                                    InputProps={{ disableUnderline: true, sx: { color: "#fff" } }}
                                />
                                <Button variant="contained" color="primary" sx={{ background: "#06b6d4" }}>
                                    <EmailIcon />
                                </Button>
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* Social Media Section */}
                    <Grid item xs={12} md={3}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <Typography variant="h6" fontWeight="bold" mb={2}>{t("Follow Us")}</Typography>
                            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                                <IconButton sx={{ color: "#06b6d4" }}><FacebookIcon /></IconButton>
                                <IconButton sx={{ color: "#06b6d4" }}><InstagramIcon /></IconButton>
                                <IconButton sx={{ color: "#06b6d4" }}><TwitterIcon /></IconButton>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
                {/* Footer Bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1, transition: { duration: 1 } }}
                    viewport={{ once: false, amount: 0.3 }}
                    style={{ textAlign: "center", marginTop: "50px" }}
                >
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        &copy; {new Date().getFullYear()} {t("CanFactory. All rights reserved.")}
                    </Typography>
                </motion.div>
            </Container>
        </Box>
    );
}
