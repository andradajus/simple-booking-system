import { createContext, useState, useEffect } from 'react';
import { api } from '../api/api';
import propTypes from 'prop-types';
import Cookies from 'js-cookie';
import { AuthenticationAPI } from '../constants/constants';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isStaff, setIsStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUserDetails = async () => {
    setLoading(true);
    try {
      const response = await api(AuthenticationAPI.ME, 'GET');
      setUser(response.data);
      setIsStaff(response.data.is_staff);
      setTimeout(() => {
        setLoading(false);
      }, 2500);
      console.log('CURRENT_USER_DETAILS', response.data);
    } catch (error) {
      Cookies.remove('Authorization');
      window.location.href = '/login';
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCurrentUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-screen justify-center items-center relative">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        isStaff,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: propTypes.node.isRequired,
};
