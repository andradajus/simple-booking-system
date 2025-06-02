import { createContext, useState, useEffect } from 'react';
import { API } from '../api/api';
import propTypes from 'prop-types';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUserDetails = async () => {
    setLoading(true);
    try {
      const response = await API.getCurrentUserDetails();
      setUser(response.data);
      setRole(response.data.role);
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
        role,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: propTypes.node.isRequired,
};
