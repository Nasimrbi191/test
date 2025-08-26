import i18next from 'i18next'
import './App.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import getThemeConfigs from './Configs/ThemeConfigs'
import { useEffect, useMemo, useState } from 'react'
import createEmotionCache from './Configs/rtlCache'
import { CacheProvider } from '@emotion/react';
import 'vazirmatn/Vazirmatn-font-face.css';
import { RTL_LANGS } from './enums'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Contact from './pages/Contact/Contact'
import About from './pages/About/About'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import { AuthProvider } from './Context/authContext'
import RouteProtection from './RouteProtection/RouteProtection'
import LiveChart from './components/LiveChart/LiveChart'
import DashboardHome from './pages/DashboardHome/DashboardHome'

function App() {
  const [language, setLanguage] = useState(i18next.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
    };
    i18next.on('languageChanged', handleLanguageChange);
    return () => {
      i18next.off('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    getThemeConfigs(language);
    document.documentElement.setAttribute('dir', ['fr'].includes(language) ? 'rtl' : 'ltr');
  }, [language]);

  const baseLang = language.split('-')[0];
  const isRtl = RTL_LANGS.includes(baseLang);

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }, [isRtl]);

  const theme = useMemo(() => getThemeConfigs(language), [language]);
  const cache = useMemo(() => createEmotionCache(isRtl), [isRtl]);
  return (
    <>
      <CacheProvider value={cache}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            {
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<RouteProtection><Dashboard /></RouteProtection>}>
                  <Route path="" element={<DashboardHome />} />
                  <Route path="analytics" element={<LiveChart />} />
                </Route>
              </Routes>
            }
            <CssBaseline />
          </ThemeProvider>
        </AuthProvider>
      </CacheProvider>
    </>
  )
}

export default App
