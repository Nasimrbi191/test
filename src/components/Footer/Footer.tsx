import '../../styles/Footer.scss'
import { useTranslation } from 'react-i18next';

function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__grid">
                    <div className="footer__section footer__brand">
                        <h2 className="footer__brand-title">{t('Your Company Name')}</h2>
                        <p className="footer__brand-description">
                            {t('Empowering businesses with innovative solutions. Join us to explore cutting-edge technology and services.')}
                        </p>
                        <div className="footer__social-links">
                            <a href="#" className="footer__social-link">
                                <svg className="footer__social-icon" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.56v14.88A4.56 4.56 0 0 1 19.44 24H4.56A4.56 4.56 0 0 1 0 19.44V4.56A4.56 4.56 0 0 1 4.56 0h14.88A4.56 4.56 0 0 1 24 4.56zM9.6 19.2v-8.4H7.2V8.4h2.4V6.72c0-2.4 1.44-3.84 3.6-3.84 1.08 0 2.04.12 2.28.12v2.64h-1.56c-1.2 0-1.44.6-1.44 1.44V8.4h2.88l-.36 2.4h-2.52v8.4H9.6z" />
                                </svg>
                            </a>
                            <a href="#" className="footer__social-link">
                                <svg className="footer__social-icon" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.94 4.56c-.84.36-1.68.6-2.64.72.96-.6 1.68-1.56 2.04-2.64-.9.54-1.92.96-3 1.2-.84-.96-2.04-1.56-3.36-1.56-2.52 0-4.56 2.04-4.56 4.56 0 .36 0 .72.12 1.08-3.84-.24-7.2-2.04-9.48-4.8-.36.6-.6 1.32-.6 2.04 0 1.56.84 2.88 2.04 3.72-.72 0-1.44-.24-2.04-.6v.12c0 2.16 1.56 4.08 3.6 4.44-.36.12-.84.24-1.32.24-.36 0-.72 0-1.08-.12.72 2.28 2.88 3.96 5.4 4.08-2.04 1.56-4.56 2.52-7.32 2.52-.48 0-.96 0-1.44-.12 2.64 1.68 5.76 2.64 9.12 2.64 10.92 0 16.92-9.12 16.92-16.92v-.72c1.2-.84 2.16-1.92 2.88-3.12z" />
                                </svg>
                            </a>
                            <a href="#" className="footer__social-link">
                                <svg className="footer__social-icon" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.44 3.6 8.16 8.04 9.48.6.12.84-.24.84-.48v-3.36c-3.36.72-4.08-1.56-4.08-1.56-.48-1.2-1.2-1.56-1.2-1.56-1.08-.72.12-.72.12-.72 1.2.12 1.8 1.2 1.8 1.2 1.08 1.8 2.76 1.2 3.48.96.12-.72.48-1.2.84-1.44-2.88-.36-5.88-1.44-5.88-6.36 0-1.44.48-2.64 1.32-3.6-.12-.36-.6-1.68.12-3.48 0 0 1.08-.36 3.6 1.32.96-.24 2.04-.36 3.12-.36s2.16.12 3.12.36c2.52-1.68 3.6-1.32 3.6-1.32.72 1.8.24 3.12.12 3.48.84.96 1.32 2.16 1.32 3.6 0 4.92-3.12 6-5.88 6.36.48.36.84 1.08.84 2.16v3.24c0 .24.24.6.84.48 4.44-1.32 8.04-5.04 8.04-9.48 0-5.52-4.48-10-10-10z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="footer__section footer__links">
                        <h3 className="footer__section-title">{t('Quick Links')}</h3>
                        <ul className="footer__nav-list">
                            <li><a href="#" className="footer__nav-link">{t('Home')}</a></li>
                            <li><a href="#" className="footer__nav-link">{t('Services')}</a></li>
                            <li><a href="#" className="footer__nav-link">{t('About')}</a></li>
                            <li><a href="#" className="footer__nav-link">{t('Contact')}</a></li>
                        </ul>
                    </div>
                    <div className="footer__section footer__newsletter">
                        <h3 className="footer__section-title">{t('Newsletter')}</h3>
                        <p className="footer__newsletter-description">{t('Subscribe to get the latest updates.')}</p>
                        <div className="footer__newsletter-form">
                            <input
                                type="email"
                                placeholder={t('Enter your email')}
                                className="footer__newsletter-input"
                            />
                            <button className="footer__newsletter-button">{t('Subscribe')}</button>
                        </div>
                    </div>
                </div>
                <div className="footer__bottom">
                    <p className="footer__copyright">&copy; {new Date().getFullYear()} {t('YourBrand. All rights reserved.')}</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
