import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Hooks/useAuth';
import '../../styles/Dashboard.scss';
import LanguageSwitcher from '../../LanguageSwitcher';
import { Link, Outlet, useNavigate } from 'react-router-dom';
interface userInfoType {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

function Dashboard() {
    const { userInfo }: { userInfo: userInfoType | null } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <div className="dashboard__sidebar">
                <h2 className="logo">{t('Main Dashboard')}</h2>
                <ul>
                    <li>
                        <Link to="/dashboard" className="active">
                            🏠 {t('Dashboard')}
                        </Link>
                    </li>
                    <li>
                        📊 <Link to="/dashboard/analytics">{t('Analytics')}</Link>
                    </li>
                    <li>👤 {t('Profile')}</li>
                    <li>⚙️ {t('Settings')}</li>
                    <li>📝 {t('Help')}</li>
                    <li onClick={handleLogOut}>🔒 {t('Logout')}</li>
                    <li>
                        🌐 <Link to="/">{t('Home Page')}</Link>
                    </li>
                </ul>
            </div>
            {/* Main content */}
            <div className="dashboard__main">
                {/* Topbar */}
                <div className="dashboard__topbar">
                    <h2>
                        {t('Welcome back')}, {userInfo?.firstName} 👋
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="profile">
                            <img
                                src="https://i.pravatar.cc/40"
                                alt="user avatar"
                                className="avatar"
                            />
                            <span>{userInfo?.firstName}</span>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default Dashboard;