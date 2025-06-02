import { PUBLIC_ROUTES } from './public';
import { Routes, Route } from 'react-router-dom';

const AppRouter = () => {
  return (
    <Routes>
      {PUBLIC_ROUTES.map((route, index) => (
        <Route key={index} path={route.path} element={<route.element />} />
      ))}
    </Routes>
  );
};

export default AppRouter;
