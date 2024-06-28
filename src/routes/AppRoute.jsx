import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onBlankLayout } from 'store/slices/themeSlice';

function AppRoute({
  component: Component, routeKey, blankLayout, ...props
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const isBlank = !!blankLayout;
    dispatch(onBlankLayout(isBlank));
  }, [blankLayout]);

  return <Component {...props} />;
}

export default AppRoute;
