import {
  UserOutlined
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { ROLES } from '../constants/RolesConstant';

const dashBoardNavTree = [
  {
    key: 'dashboards',
    path: `${APP_PREFIX_PATH}/dashboards`,
    breadcrumb: false,
    icon: '',
    isGroupTitle: true,
    navAccess: [
      ROLES.SYSTEM_ADMIN,
      ROLES.SALES,
      ROLES.SUPPORT
    ],
    submenu: [
      {
        key: 'dashboards-admin',
        title: 'sidenav.dashboard.admin',
        icon: UserOutlined,
        breadcrumb: false,
        navAccess: [
          ROLES.SYSTEM_ADMIN,
          ROLES.SALES,
          ROLES.SUPPORT
        ],
        submenu: [

          {
            key: 'dashboard.analytics',
            path: `${APP_PREFIX_PATH}/dashboards/analytics`,
            title: 'sidenav.analytics',
            breadcrumb: false,
            submenu: [],
            navAccess: [
              ROLES.SYSTEM_ADMIN,
              ROLES.SALES,
              ROLES.SUPPORT
            ]
          },
          {
            key: 'dashboard.customer.activation',
            path: `${APP_PREFIX_PATH}/dashboards/customer-activation`,
            title: 'sidenav.customerActivation',
            breadcrumb: false,
            submenu: [],
            navAccess: [
              ROLES.SYSTEM_ADMIN,
              ROLES.SALES,
              ROLES.SUPPORT
            ]
          },
          {
            key: 'dashboard.plans',
            path: `${APP_PREFIX_PATH}/dashboards/plans`,
            title: 'sidenav.plans',
            breadcrumb: false,
            submenu: [],
            navAccess: [
              ROLES.SYSTEM_ADMIN,
              ROLES.SALES,
              ROLES.SUPPORT
            ]
          },
          {
            key: 'dashboard.privileges',
            path: `${APP_PREFIX_PATH}/dashboards/privileges`,
            title: 'sidenav.privileges',
            breadcrumb: false,
            submenu: [],
            navAccess: [
              ROLES.SYSTEM_ADMIN,
              ROLES.SALES,
              ROLES.SUPPORT
            ]
          },
          {
            key: 'dashboard.customer.billing',
            path: `${APP_PREFIX_PATH}/dashboards/billing`,
            title: 'sidenav.billing',
            breadcrumb: false,
            submenu: [],
            navAccess: [
              ROLES.SYSTEM_ADMIN,
              ROLES.SALES,
              ROLES.SUPPORT
            ]
          },
          {
            key: 'dashboard.user.dashboard',
            path: `${APP_PREFIX_PATH}/dashboards/user`,
            title: 'sidenav.userDashboard',
            breadcrumb: false,
            submenu: [],
            navAccess: [
              ROLES.SYSTEM_ADMIN,
              ROLES.SALES,
              ROLES.SUPPORT
            ]
          }

        ]
      }
    ]
  }
];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
