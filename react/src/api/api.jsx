import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = import.meta.env.VITE_BACKEND_API_URL;

export const api = async (
  endpoint,
  method = 'GET',
  body = null,
  pathParams = {},
  params = {},
  customHeaders = {}
) => {
  const token = Cookies.get('Authorization');
  const isFormData = body instanceof FormData;

  const url = endpoint.replace(/:\w+/g, (match) => {
    const key = match.slice(1);
    return pathParams[key] || match;
  });

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' }),
    ...customHeaders,
  };

  try {
    const response = await axios({
      method,
      url: `${baseURL}${url}`,
      headers,
      data: body,
      params,
    });

    return response;
  } catch (error) {
    console.log('Response error:', error);
    throw error.response?.data;
  }
};