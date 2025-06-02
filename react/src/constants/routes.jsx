import Reservations from '../pages/Staff/Reservations';
import Rooms from '../pages/Staff/Rooms';

export const STAFF_DASHBOARD_ROUTES = [
  {
    path: '/',
    element: Reservations,
    roles: ['all'],
    label: 'dashboard',
  },
  {
    path: 'reservations',
    element: Reservations,
    roles: ['all'],
    label: 'reservations',
  },
  {
    path: 'rooms',
    element: Rooms,
    roles: ['all'],
    label: 'rooms',
  },
];
