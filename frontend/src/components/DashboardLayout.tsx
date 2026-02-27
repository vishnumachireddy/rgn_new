import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex bg-bg-dark text-white min-h-screen">
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-bg-dark via-bg-dark/95 to-primary/5">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
