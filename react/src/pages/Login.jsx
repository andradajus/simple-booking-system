import { useState, useEffect } from 'react';
import { api } from '../api/api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { AuthenticationAPI } from '../constants/constants';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const authenticated = await api(AuthenticationAPI.LOGIN, 'POST', {
        username: formData.username,
        password: formData.password,
      });
      Cookies.set('Authorization', authenticated.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setError(null);
  };

  useEffect(() => {
    const authToken = Cookies.get('Authorization');
    if (authToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <main className="bg-gray-100 h-screen w-full flex items-center justify-center">
      <div className="gap-20 p-2">
        <div className="bg-white p-10 rounded-4xl shadow-xl min-w-xs">
          <form onSubmit={loginHandler} className="flex flex-col gap-4">
            <div>
              <div className="flex justify-center text-center text-3xl mb-2 text-[#6C6D6F] gap-1">
                <p className="text-blue-500">Booking </p>
                <p className="text-blue-700">System</p>
              </div>
              <p className="text-center break-normal mt-5 text-[#49454F] text-sm">
                Please enter your details
              </p>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="pt-2 pb-2 border-gray-300 text-[#49454F]"
              >
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`placeholder:text-sm p-2 rounded-full border border-gray-300 block w-full px-5 ${error ? 'border-2 border-red-500 focus:ring-0 focus:outline-0' : ''}`}
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="flex flex-col relative">
              <label
                htmlFor="password"
                className="pt-2 pb-2 border-gray-300 text-[#49454F]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`placeholder:text-sm p-2 rounded-full border border-gray-300 block w-full px-5 ${error ? 'border-2 border-red-500 focus:ring-0 focus:outline-0' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition duration-300 ease-in-out hover:scale-110 hover:opacity-80"
                >
                  {showPassword ? (
                    <FaRegEyeSlash size={20} />
                  ) : (
                    <FaRegEye size={20} />
                  )}
                </button>
              </div>

              {error && (
                <div className="flex text-red-500 text-xs mt-2 text-center items-center gap-2 justify-center">
                  <MdOutlineErrorOutline />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <div className="flex mt-5 ">
              <button
                type="submit"
                className="flex w-full  text-center justify-center p-3 bg-blue-500 hover:bg-blue-700 text-white rounded-full px-5 py-1 cursor-pointer hover:underline duration-200 ease-in-out"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;