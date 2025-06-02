import { Routes, Route } from 'react-router-dom'
import { STAFF_DASHBOARD_ROUTES } from '../../constants/routes'

const StaffDashboard = () => {
  return (
    <Routes>
      {STAFF_DASHBOARD_ROUTES.map(
        (route, index) =>
            <Route key={index} path={route.path} element={<route.element />} />
      )}
    </Routes>
  )
}

export default StaffDashboard