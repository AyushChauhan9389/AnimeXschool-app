import axios from 'axios';

import { getAuthToken } from './tokensApi';

const baseUrl = 'https://api.lelekart.com';

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(async config => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
