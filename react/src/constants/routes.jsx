import Reservations from "../pages/Staff/Reservations";

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
  }
]