import axios from './axiosConfig';

export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get('/auth/user');
  return response.data;
};
