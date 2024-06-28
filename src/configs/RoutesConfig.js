import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from './AppConfig';
import {
  ANALYTICS_SCREEN,
  BILLING_SCREEN,
  CUSTOMER_ACTIVATION,
  FORGOT_PASSWORD,
  LOGIN,
  PAGE_NOT_FOUND,
  REGISTER,
  SET_PASSWORD,
  USER_DASHBOARD,
  PLANS_SCREEN,
  PRIVILEGES_SCREEN
} from './ComponentConstants';

export const publicRoutes = [
  {
    key: 'login',
    path: `${AUTH_PREFIX_PATH}/login`,
    component: LOGIN
  },
  {
    key: 'register',
    path: `${AUTH_PREFIX_PATH}/register`,
    component: REGISTER
  },
  {
    key: 'forgot-password',
    path: `${AUTH_PREFIX_PATH}/forgot-password`,
    component: FORGOT_PASSWORD
  },
  {
    key: 'set-password',
    path: `${AUTH_PREFIX_PATH}/set-password/:tenantId/:token`,
    component: SET_PASSWORD,
    meta: {
      newUser: true
    }
  },
  {
    key: 'reset-password',
    path: `${AUTH_PREFIX_PATH}/reset-password/:tenantId/:token`,
    component: SET_PASSWORD,
    meta: {
      newUser: false
    }
  },
  {
    key: 'page-not-found',
    path: '/404',
    component: PAGE_NOT_FOUND
  }
];

export const superAdminRoutes = [
  {
    key: 'dashboard.analytics.screen',
    path: `${APP_PREFIX_PATH}/dashboards/analytics`,
    component: ANALYTICS_SCREEN
  },
  {
    key: 'dashboard.customer.activation',
    path: `${APP_PREFIX_PATH}/dashboards/customer-activation`,
    component: CUSTOMER_ACTIVATION
  },
  {
    key: 'dashboard.user.dashboard',
    path: `${APP_PREFIX_PATH}/dashboards/user`,
    component: USER_DASHBOARD
  },
  {
    key: 'dashboard.user.billing',
    path: `${APP_PREFIX_PATH}/dashboards/billing`,
    component: BILLING_SCREEN
  },
  {
    key: 'dashboard.plans',
    path: `${APP_PREFIX_PATH}/dashboards/plans`,
    component: PLANS_SCREEN
  },
  {
    key: 'dashboard.privileges',
    path: `${APP_PREFIX_PATH}/dashboards/privileges`,
    component: PRIVILEGES_SCREEN
  }
];

export const salesRoutes = [
  {
    key: 'dashboard.analytics.screen',
    path: `${APP_PREFIX_PATH}/dashboards/analytics`,
    component: ANALYTICS_SCREEN
  },
  {
    key: 'dashboard.customer.activation',
    path: `${APP_PREFIX_PATH}/dashboards/customer-activation`,
    component: CUSTOMER_ACTIVATION
  },
  {
    key: 'dashboard.user.dashboard',
    path: `${APP_PREFIX_PATH}/dashboards/user`,
    component: USER_DASHBOARD
  }
];

export const supportRoutes = [
  {
    key: 'dashboard.analytics.screen',
    path: `${APP_PREFIX_PATH}/dashboards/analytics`,
    component: ANALYTICS_SCREEN
  },
  {
    key: 'dashboard.customer.activation',
    path: `${APP_PREFIX_PATH}/dashboards/customer-activation`,
    component: CUSTOMER_ACTIVATION
  },
  {
    key: 'dashboard.user.dashboard',
    path: `${APP_PREFIX_PATH}/dashboards/user`,
    component: USER_DASHBOARD
  }
];
