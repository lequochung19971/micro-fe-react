import axios from 'axios';
import { getCurrentUser } from './getCurrentUser';
const httpClient = axios.create({
  baseURL: 'https://dummyjson.com',
});

httpClient.interceptors.request.use(
  function (config) {
    const currentUser = getCurrentUser();

    if (currentUser?.token) {
      config.headers['Authorization'] = `Bearer ${currentUser.token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default httpClient;
