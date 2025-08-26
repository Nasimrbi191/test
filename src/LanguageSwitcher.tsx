import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";

const languages = [
  { code: "fr", flag: "https://flagcdn.com/32x24/ir.png", label: "FA" },
  { code: "en", flag: "https://flagcdn.com/32x24/us.png", label: "EN" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentLang =
    languages.find((lang) => lang.code === i18n.language) || languages[1];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setAnchorEl(null);
  };

  // Update HTML direction automatically
  useEffect(() => {
    document.documentElement.dir = i18n.language === "fr" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <>
      <Tooltip title="Change Language">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <motion.div whileHover={{ scale: 1.2 }}>
            <Avatar
              src={currentLang.flag}
              alt={currentLang.label}
              sx={{ width: 32, height: 22, borderRadius: "4px" }}
            />
          </motion.div>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
            <Avatar
              src={lang.flag}
              alt={lang.label}
              sx={{ width: 32, height: 22, borderRadius: "4px", mr: 1 }}
            />
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
