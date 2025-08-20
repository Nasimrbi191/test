import { AppBar, Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Link } from "react-router-dom"
import '../../styles/Navbar.scss'
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../../LanguageSwitcher";
import NavbarDrawer from "../NavbarDrawer/NavbarDrawer";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";

function Navbar() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    return (
        <Container maxWidth="lg">
            <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 'none', color: '#000' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: { xs: 'space-between', sm: 'space-around' } }}>
                    <div className="logo">
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            <img src="/logo.jpg" alt="Logo" style={{ height: '40px' }} />
                        </Typography>
                    </div>
                    {
                        isMobile ?
                            <>
                                <MenuIcon onClick={() => setIsOpenDrawer(true)} />
                                {
                                    isOpenDrawer &&
                                    <NavbarDrawer isOpenDrawer={isOpenDrawer} setIsOpenDrawer={setIsOpenDrawer} />
                                }
                            </>
                            :
                            <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <li>
                                    <Link to="/" style={{ textDecoration: 'none', color: '#000' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {t('Home')}
                                        </Typography>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" style={{ textDecoration: 'none', color: '#000' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {t('About')}
                                        </Typography>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" style={{ textDecoration: 'none', color: '#000' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {t('Contact')}
                                        </Typography>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" style={{ textDecoration: 'none', color: '#000' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {t('login')}
                                        </Typography>
                                    </Link>
                                </li>
                                <LanguageSwitcher />
                            </div>
                    }
                </Box>
            </AppBar>
        </Container >
    )
}

export default Navbar
