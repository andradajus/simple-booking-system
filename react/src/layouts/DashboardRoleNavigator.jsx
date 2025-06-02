import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import StaffDashboardLayout from './StaffDashboardLayout';
import NotStaffDashboardLayout from './NotStaffDashboardLayout';

const DashboardRoleNavigator = () => {
  const { isStaff } = useContext(UserContext);

  return (
    <>{isStaff ? <StaffDashboardLayout /> : <NotStaffDashboardLayout />}</>
  );
};

export default DashboardRoleNavigator;
