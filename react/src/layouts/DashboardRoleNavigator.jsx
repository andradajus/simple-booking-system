import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const DashboardRoleNavigator = () => {
  const { role } = useContext(UserContext);

  console.log('ROLE', role);

  return (
    <>
    </>
  );
};

export default DashboardRoleNavigator;
