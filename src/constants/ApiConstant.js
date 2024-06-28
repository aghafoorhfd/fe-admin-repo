import { env } from '../configs/EnvironmentConfig';

export const REACT_APP_BASE_URL = env.REACT_APP_URL;

export const ADMIN_SERVICE_BASE_URL = env.ADMIN_SERVICE;
export const ADMIN_SERVICE_USERS = `${ADMIN_SERVICE_BASE_URL}/admin_service/api/admin/users`;
export const USER_PROFILE = `${ADMIN_SERVICE_USERS}/user-profile`;
export const REGISTER_USER = `${ADMIN_SERVICE_USERS}/register`;
export const FORGOT_PASSWORD = `${ADMIN_SERVICE_USERS}/forgot-password`;
export const VERIFY_EMAIL = `${ADMIN_SERVICE_USERS}/verify-email`;
export const SET_CREDENTIALS = `${ADMIN_SERVICE_USERS}/credentials`;
export const LOGIN = `${ADMIN_SERVICE_USERS}/login`;

export const ADMIN_SERVICE_PLANS = `${ADMIN_SERVICE_BASE_URL}/admin_service/api/admin/plans`;
export const ADMIN_SERVICE_CUSTOMERS = `${ADMIN_SERVICE_BASE_URL}/admin_service/api/admin/customers`;

export const AUTH_SERVICE_BASE_URL = env.AUTH_SERVICE;
export const AUTH_SERVICE = `${AUTH_SERVICE_BASE_URL}/auth_service/api/users`;
export const RESET_CREDENTIALS = `${AUTH_SERVICE}/reset-password`;

export const SUBSCRIPTION_SERVICE_BASE_URL = env.SUBSCRIPTION_SERVICE;
export const SUBSCRIPTION_SERVICE = `${SUBSCRIPTION_SERVICE_BASE_URL}/subscription_service/api`;
