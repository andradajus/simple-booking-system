import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import NotStaffDashboard from './NotStaffDashboard';
import StaffDashboard from './StaffDashboard';

const DashboardRoleNavigator = () => {
  const { isStaff } = useContext(UserContext);

  return (
    <>
      {isStaff ? (
        <StaffDashboard />
      ) : (
        <NotStaffDashboard />
      )}
    </>
  );
};

export default DashboardRoleNavigator;
