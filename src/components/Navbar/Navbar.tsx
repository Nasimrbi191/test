import {
    AppBar,
    Box,
    Container,
    Typography,
    useMediaQuery,
    useTheme,
    IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavbarDrawer from "../NavbarDrawer/NavbarDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined"; // for factory vibe
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import LanguageSwitcher from "../../LanguageSwitcher";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

const links = [
    { to: "/", label: "Home", icon: <HomeOutlinedIcon fontSize="medium" /> },
    { to: "/about", label: "About", icon: <InfoOutlinedIcon fontSize="medium" /> },
    { to: "/contact", label: "Contact", icon: <ContactSupportOutlinedIcon fontSize="medium" /> },
    { to: "/login", label: "login", icon: <LoginOutlinedIcon fontSize="medium" /> },
];

function Navbar() {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [isOnline, setIsOnline] = useState(true);
    const token = localStorage.getItem("token");

    const fetchDataForTestingNetWorkStatus = async () => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5042/hubs/qualitycontrol", {
                accessTokenFactory: () => token ?? "",
            })
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => {
                console.log("Connected to QualityControlHub")
                toast.success(t('Connected to server successfully'));
                setIsOnline(true);
            })
            .catch((err) => {
                console.error("Connection error:", err);
                toast.error(t("Failed to connect to server"));
                setIsOnline(false);
            });
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        const handleNetworkChange = () => {
            if (navigator.onLine) {
                setIsOnline(true);
            } else {
                setIsOnline(false);
            }
        }
        window.addEventListener("scroll", handleScroll);
        window.addEventListener('load', handleNetworkChange)
        window.addEventListener('online', handleNetworkChange);
        window.addEventListener('offline', handleNetworkChange);
        fetchDataForTestingNetWorkStatus();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener('load', handleNetworkChange)
            window.removeEventListener('online', handleNetworkChange);
            window.removeEventListener('offline', handleNetworkChange);
        };
    }, [token]);

    // Navbar scroll hide/show
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = () => {
        if (window.scrollY > lastScrollY) {
            setShowNavbar(false); // scrolling down → hide
        } else {
            setShowNavbar(true); // scrolling up → show
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [lastScrollY]);

    // RTL / LTR fix based on language
    const direction = i18n.language === "fr" ? "rtl" : "ltr";
    return (
        <motion.div
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: showNavbar ? 0 : -120, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
                width: "100%",
                zIndex: 1200,
                direction,
                height: "82px",
                position: "fixed",
                top: 0,
                left: 0,
            }}
        >
            <AppBar
                sx={{
                    backgroundColor: "#fff",
                    color: "#000",
                    boxShadow: "0px 2px 15px rgba(0,0,0,0.08)",
                    py: 1.5, // bigger navbar height
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            py: 1,
                        }}
                    >
                        {/* Logo with Factory Icon */}
                        <Box
                            className="logo"
                            sx={{ display: "flex", alignItems: "center", gap: 1.2 }}
                        >
                            <FactoryOutlinedIcon sx={{ fontSize: 40, color: "#06b6d4" }} />
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{ letterSpacing: 1 }}
                            >
                                CanFactory
                            </Typography>
                        </Box>

                        {/* Nav Links */}
                        {isMobile ? (
                            <>
                                <IconButton onClick={() => setIsOpenDrawer(true)}>
                                    <MenuIcon fontSize="large" />
                                </IconButton>
                                {isOpenDrawer && (
                                    <NavbarDrawer
                                        isOpenDrawer={isOpenDrawer}
                                        setIsOpenDrawer={setIsOpenDrawer}
                                    />
                                )}
                            </>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "2.5rem",
                                    alignItems: "center",
                                    fontWeight: "bold",
                                }}
                            >
                                {links.map((link, i) => (
                                    <Link
                                        key={i}
                                        to={link.to}
                                        style={{
                                            textDecoration: "none",
                                            color: "#000",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1, color: "#06b6d4" }}
                                            transition={{ type: "spring", stiffness: 250 }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                fontSize: "1rem",
                                            }}
                                        >
                                            {link.icon}
                                            <span>{t(link.label)}</span>
                                        </motion.div>
                                    </Link>
                                ))}
                                <LanguageSwitcher />
                                <Typography variant="body2" color={isOnline ? "green" : "red"}>
                                    {t(isOnline ? "status.online" : "status.offline")}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Container>
            </AppBar>
        </motion.div>
    );
}

export default Navbar;
