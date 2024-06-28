import React from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import Loading from 'components/shared-components/Loading';

export function AuthLayout({ children }) {
  const { status } = useThemeSwitcher();

  if (status === 'loading') {
    return <Loading cover="page" />;
  }

  return <div className="auth-container">{children}</div>;
}

export default AuthLayout;
