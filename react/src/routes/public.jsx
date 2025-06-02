import DashboardProvider from '../layouts/DashboardProvider';
import Login from '../pages/Login';

export const PUBLIC_ROUTES = [
  {
    path: '*',
    element: Login,
  },
  {
    path: 'dashboard/*',
    element: DashboardProvider,
  },
];
