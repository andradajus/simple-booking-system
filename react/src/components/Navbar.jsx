import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { capitalizeFirstLetter } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
      <span className="font-bold text-lg">BookMeNot</span>
      <div className="flex space-x-4">
        <span
          onClick={() => navigate('/dashboard')}
          className="cursor-pointer hover:underline duration-300 ease-in-out hover:text-gray-300"
        >
          Reservations
        </span>
        {user.is_staff && (
          <span
            onClick={() => navigate('/dashboard/rooms')}
            className="cursor-pointer hover:underline duration-300 ease-in-out hover:text-gray-300"
          >
            Rooms
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <span className="font-medium">
          {capitalizeFirstLetter(user.username)}
        </span>
        <button
          onClick={() => {
            localStorage.removeItem('Authorization');
            Cookies.remove('Authorization');
            navigate('/login');
          }}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded cursor-pointer text-white hover:underline transition duration-200 ease-in-out"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
