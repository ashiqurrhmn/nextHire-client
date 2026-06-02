import { DashboardSideBar } from '@/components/dashboard/DashboardSideBar';
import React from 'react';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex flex-col lg:flex-row h-screen gap-0 lg:gap-6 overflow-hidden bg-black">
            <DashboardSideBar />
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
    );
};

export default DashboardLayout;