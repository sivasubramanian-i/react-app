import axios from 'axios';
import querystring from 'querystring';
import { apiEndPointsBaseURL } from '../utils/url';
const token = localStorage.getItem('token');

export const instance = axios.create({
  baseURL: apiEndPointsBaseURL,
  headers: { 
      'token': token || "",
      'Content-Type': 'application/json' 
    },
  paramsSerializer: p => {
    const params = { ...p };
    return querystring.stringify(params, '&', '=', { arrayFormat: 'repeat' });
  },
});


instance.interceptors.response.use((response) => {
  return response
}, function (error) {
  if (error.response?.status === 401) {
    return Promise.reject(error);
  } else if(error.response?.status === 500){
    error.noAlert = true;
    return Promise.reject(error);
  }
  return Promise.reject(error);
});

export default instance;