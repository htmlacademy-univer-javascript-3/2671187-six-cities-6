import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { LOCAL_STORAGE_TOKEN } from './constants';

const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
const TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
  });

  api.interceptors.request.use(config => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
    if (token && typeof token === 'string') {
      config.headers['X-Token'] = token;
    }
    return config;
  });

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
        if (token) {
          localStorage.removeItem(LOCAL_STORAGE_TOKEN);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};
