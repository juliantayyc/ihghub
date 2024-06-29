import axios from 'axios';
import { APP_SERVER_URL } from '../constants';

const api = axios.create({
  baseURL: APP_SERVER_URL,
  withCredentials: true, // This ensures cookies are sent with requests
});

api.interceptors.request.use((config) => {
  const accessToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1];

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    console.error('No access token found');
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { data } = await axios.post(
        `${APP_SERVER_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      if (data.accessToken) {
        document.cookie = `accessToken=${data.accessToken}; SameSite=Lax;`;
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${data.accessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
