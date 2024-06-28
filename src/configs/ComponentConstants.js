import React from 'react';

// Public Routes Screens
export const LOGIN = React.lazy(() => import('views/auth-views/authentication/login'));
export const REGISTER = React.lazy(() => import('views/auth-views/authentication/register'));
export const FORGOT_PASSWORD = React.lazy(() => import('views/auth-views/authentication/forgot-password'));
export const SET_PASSWORD = React.lazy(() => import('views/auth-views/authentication/set-password'));
export const PAGE_NOT_FOUND = React.lazy(() => import('views/app-views/dashboards/page-not-found'));

// Protected Routes Screens
export const ANALYTICS_SCREEN = React.lazy(() => import('views/app-views/dashboards/analytics/AnalyticsScreen'));
export const CUSTOMER_ACTIVATION = React.lazy(() => import('views/app-views/dashboards/customer-activation/CustomerActivationScreen'));
export const USER_DASHBOARD = React.lazy(() => import('views/app-views/dashboards/user/UserDashboard'));
export const BILLING_SCREEN = React.lazy(() => import('views/app-views/dashboards/billing/BillingScreen'));
export const PLANS_SCREEN = React.lazy(() => import('views/app-views/dashboards/plans'));
export const PRIVILEGES_SCREEN = React.lazy(() => import('views/app-views/dashboards/add-privileges'));
