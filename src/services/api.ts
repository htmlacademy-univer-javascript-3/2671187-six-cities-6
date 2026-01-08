import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
const TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['X-Token'] = token;
    }
    return config;
  });

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return Promise.reject(error);
    }
  );

  return api;
};
