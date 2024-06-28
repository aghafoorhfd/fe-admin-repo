import React from 'react';
import { useSelector } from 'react-redux';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import {
  publicRoutes,
  salesRoutes,
  superAdminRoutes,
  supportRoutes
} from '../configs/RoutesConfig';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AppRoute from './AppRoute';

function Routes() {
  const role = useSelector((state) => state?.auth?.user);
  const routes = {
    SYSTEM_ADMIN: superAdminRoutes,
    SALES: salesRoutes,
    SUPPORT: supportRoutes
  };

  const renderRoutes = () => (
    routes[role]?.map((route) => (
      <React.Fragment key={route.path}>
        <Route key={route.path} path="/" element={<Navigate to={route.path} />} />
        <Route
          path={route.path}
          element={(
            <AppRoute
              routeKey={route.key}
              component={route.component}
              {...route.meta} />
          )} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </React.Fragment>
    ))
  );

  return (
    <RouterRoutes>
      <Route path="/" element={<ProtectedRoute />}>
        {renderRoutes()}
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <React.Fragment key={route.path}>
            <Route
              path={route.path}
              element={
                <AppRoute routeKey={route.key} component={route.component} {...route.meta} />
              } />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </React.Fragment>
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </RouterRoutes>
  );
}

export default Routes;
