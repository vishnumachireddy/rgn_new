import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Sprout,
    CloudSun,
    TrendingUp,
    MessageSquare,
    LogOut,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const links = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard/farmer', visible: true },
        { icon: <Sprout size={20} />, label: 'Crop Advisory', path: '/dashboard/farmer/crop-advisory', visible: true },
        { icon: <CloudSun size={20} />, label: 'Weather', path: '/dashboard/farmer/weather', visible: true },
        { icon: <TrendingUp size={20} />, label: 'Profit Analytics', path: '/dashboard/farmer/analytics', visible: true },
        { icon: <MessageSquare size={20} />, label: 'AI Chat', path: '/dashboard/farmer/chat', visible: true },
    ].filter(l => l.visible);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 text-xl font-bold text-primary-light">
                    <Sprout size={28} />
                    <span>AgroSmart <span className="text-white">AI</span></span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}
            `}
                    >
                        {link.icon}
                        <span className="font-medium text-sm">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
