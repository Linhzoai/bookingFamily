import { lazy } from 'react';

const Auth = lazy(() => import('../pages/Auth/Auth'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const BookingManagement = lazy(() => import('../pages/Bookings/BookingManagement'));
const ServiceManagement = lazy(() => import('../pages/Services/ServiceManagement'));
const CustomerManagement = lazy(() => import('../pages/Customers/CustomerManagement'));
const AreaManagement = lazy(() => import('../pages/Areas/AreaManagement'));
const StaffManagement = lazy(() => import('../pages/Staff/StaffManagement'));
const SettingManagement = lazy(() => import('../pages/Setting/SettingManagement'));
interface Route {
    path: string;
    component: React.ComponentType;
}

const privateRoutes: Route[] = [
    { path: '/', component: Dashboard },
    { path: '/booking', component: BookingManagement },
    { path: '/service', component: ServiceManagement },
    { path: '/customer', component: CustomerManagement },
    { path: '/area', component: AreaManagement },
    { path: '/staff', component: StaffManagement },
    { path: '/setting', component: SettingManagement },
];

const publicRoutes: Route[] = [
    { path: '/auth', component: Auth },
];

export default { privateRoutes, publicRoutes };