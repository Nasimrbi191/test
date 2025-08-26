import { useTranslation } from 'react-i18next';
import QualityControlEntry from '../../components/QualityControlEntryLists/QualityControlEntry';

function DashboardHome() {
    const {t} = useTranslation();
    return (
        <div>
            {/* Stats cards */}
            <div className="stats">
                <div className="card">
                    <h3>💰 {t('Earnings')}</h3>
                    <p>$4,200</p>
                </div>
                <div className="card">
                    <h3>📦 {t('Orders')}</h3>
                    <p>128</p>
                </div>
                <div className="card">
                    <h3>👥 {t('Customers')}</h3>
                    <p>512</p>
                </div>
            </div>
            {/* Recent activity */}
            <div className="recent">
                <h3>{t('Recent Activity')}</h3>
                <ul>
                    <li>✅ {t('Order')} #1234 {t('completed')}</li>
                    <li>💬 {t('New message from')} Sarah</li>
                    <li>🔔 {t('Subscription renewed')}</li>
                </ul>
            </div>
            <QualityControlEntry />
        </div>
    )
}

export default DashboardHome
