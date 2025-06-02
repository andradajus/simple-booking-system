import { Route, Routes } from 'react-router-dom';
import { DASHBOARD_ROUTES } from './private';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const DashboardRouter = () => {
  const { role } = useContext(UserContext);

  return (
    <Routes>
      {DASHBOARD_ROUTES.map(
        (route, index) =>
          (route.roles.includes(role) || route.roles.includes('all')) && (
            <Route key={index} path={route.path} element={<route.element />} />
          )
      )}
    </Routes>
  );
};

export default DashboardRouter;
