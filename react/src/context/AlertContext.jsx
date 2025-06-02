import { createContext, useState, useContext } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { IoWarningOutline } from 'react-icons/io5';
import { FaRegCircleCheck } from 'react-icons/fa6';
import propTypes from 'prop-types';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    isOpen: false,
    message: '',
    type: 'success',
    onClose: null,
    onSuccess: null,
  });

  const showAlert = ({ message, type, onClose, onSuccess }) => {
    setAlert({
      isOpen: true,
      message,
      type,
      onClose,
      onSuccess,
    });
  };

  const closeAlert = () => {
    if (alert.onClose) alert.onClose();
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSuccess = () => {
    if (alert.onSuccess) alert.onSuccess();
    closeAlert();
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center">
            {/* Icon based on type */}
            <div className="mb-4">
              {alert.type === 'error' && (
                <MdOutlineErrorOutline
                  size={70}
                  className="text-red-500 text-4xl mx-auto"
                />
              )}
              {alert.type === 'warning' && (
                <IoWarningOutline
                  size={60}
                  className="text-yellow-500 mx-auto"
                />
              )}
              {alert.type === 'success' && (
                <FaRegCircleCheck
                  size={60}
                  className="text-green-500 text-4xl mx-auto"
                />
              )}
            </div>

            <p
              className="text-gray-800 text-lg font-medium mb-4"
              dangerouslySetInnerHTML={{ __html: alert.message }}
            ></p>

            <div className="flex justify-center gap-4">
              {alert.type === 'success' || alert.type === 'error' ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
                  onClick={handleSuccess}
                >
                  Okay
                </button>
              ) : (
                <div className="flex gap-5">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
                    onClick={handleSuccess}
                  >
                    Okay
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer"
                    onClick={closeAlert}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};

AlertProvider.propTypes = {
  children: propTypes.node.isRequired,
};
