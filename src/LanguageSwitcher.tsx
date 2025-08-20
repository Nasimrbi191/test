import { useTranslation } from 'react-i18next';
import './styles/LanguageSwitcher.scss';
import React from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: 'fr', flag: 'https://flagcdn.com/32x24/ir.png', alt: 'Iran Flag' },
    { code: 'en', flag: 'https://flagcdn.com/32x24/us.png', alt: 'US Flag' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[1];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };
  return (
    <div className="language-switcher">
      <div
        className="language-switcher__select"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={currentLanguage.flag}
          alt={currentLanguage.alt}
          className="language-switcher__flag"
        />
      </div>
      {isOpen && (
        <div className="language-switcher__dropdown">
          {languages.map(lang => (
            <div
              key={lang.code}
              className="language-switcher__option"
              onClick={() => changeLanguage(lang.code)}
            >
              <img src={lang.flag} alt={lang.alt} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;