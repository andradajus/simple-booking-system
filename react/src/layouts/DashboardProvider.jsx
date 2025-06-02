import { AlertProvider } from '../context/AlertContext';
import { UserProvider } from '../context/UserContext';
import DashboardRoleNavigator from './DashboardRoleNavigator';

const DashboardProvider = () => {
  return (
    <UserProvider>
      <AlertProvider>
        <DashboardRoleNavigator />
      </AlertProvider>
    </UserProvider>
  );
};

export default DashboardProvider;
