import { useAuth } from '../../Hooks/useAuth';
import '../../styles/Dashboard.scss'

interface userInfoType {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

function Dashboard() {
    const { userInfo }: { userInfo: userInfoType | null } = useAuth();

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <div className="dashboard__sidebar">
                <h2 className="logo">MyApp</h2>
                <ul>
                    <li className="active">🏠 Dashboard</li>
                    <li>📊 Analytics</li>
                    <li>👤 Profile</li>
                    <li>⚙️ Settings</li>
                </ul>
            </div>
            {/* Main content */}
            <div className="dashboard__main">
                {/* Topbar */}
                <div className="dashboard__topbar">
                    <h2>Welcome back, {userInfo?.firstName} 👋</h2>
                    <div className="profile">
                        <img
                            src="https://i.pravatar.cc/40"
                            alt="user avatar"
                            className="avatar"
                        />
                        <span>{userInfo?.firstName}</span>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="stats">
                    <div className="card">
                        <h3>💰 Earnings</h3>
                        <p>$4,200</p>
                    </div>
                    <div className="card">
                        <h3>📦 Orders</h3>
                        <p>128</p>
                    </div>
                    <div className="card">
                        <h3>👥 Customers</h3>
                        <p>512</p>
                    </div>
                </div>

                {/* Recent activity */}
                <div className="recent">
                    <h3>Recent Activity</h3>
                    <ul>
                        <li>✅ Order #1234 completed</li>
                        <li>💬 New message from Sarah</li>
                        <li>🔔 Subscription renewed</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
