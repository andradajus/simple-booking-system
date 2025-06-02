import { format } from 'date-fns';
export const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;

export const capitalizeAllLetters = (value) => {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value;
};

export const capitalizeFirstLetter = (value) => {
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return value;
};

export const attachBackendBaseURL = (path) => {
  if (typeof path === 'string' && !path.includes('http')) {
    return `${backendBaseURL}${path}`;
  }
  return path;
};

export const formatDateSlashed = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'MM/dd/yy');
  } catch {
    return '';
  }
};

export const formatDateWord = (date) => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'MMMM d, yyyy');
  } catch {
    return 'N/A';
  }
};
