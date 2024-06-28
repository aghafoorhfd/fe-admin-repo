import { notification } from 'antd';
import axios from 'axios';
import i18n from 'i18next';
import { signOutSuccess } from 'store/slices/authSlice';
import { transformError } from 'utils/http';
import { AUTH_TOKEN } from '../constants/AuthConstant';
import store from '../store';

const { t } = i18n;

const service = axios.create({
  timeout: 60000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Config
const TOKEN_PAYLOAD_KEY = 'authorization';

// API Request interceptor
service.interceptors.request.use(
  (config) => {
    const cloneConfig = { ...config };
    const jwtToken = localStorage.getItem(AUTH_TOKEN) || null;

    if (jwtToken) {
      cloneConfig.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${jwtToken}`;
    }

    return cloneConfig;
  },
  (error) => {
    // Do something with request error here
    notification.error({
      message: 'Error'
    });
    Promise.reject(error);
  }
);

// API respone interceptor
service.interceptors.response.use(
  (response) => (response?.data),
  (error) => {
    const notificationParam = {
      message: ''
    };
    // Remove token and redirect
    if (!error?.response || error?.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN);
      store.dispatch(signOutSuccess(t('component.auth.token.expired.error')));
    }

    if (error?.response?.status === 404) {
      notificationParam.message = t('component.auth.notFound.error');
    }

    if (error?.response?.status === 500) {
      notificationParam.message = t('component.auth.internalServer.error');
    }

    if (error?.response?.status === 508) {
      notificationParam.message = t('component.auth.timeOut.error');
    }

    if (notificationParam.message) {
      notification.error(notificationParam);
    }
    const err = transformError(error);
    return Promise.reject(err);
  }
);

export default service;
