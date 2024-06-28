import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Grid, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import navigationConfig from 'configs/NavigationConfig';
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from 'constants/ThemeConstant';
import utils from 'utils';
import { onMobileNavToggle } from 'store/slices/themeSlice';
import Icon from '../util-components/Icon';
import IntlMessage from '../util-components/IntlMessage';
import './MenuContent.css';

const { useBreakpoint } = Grid;

const setLocale = (localeKey, isLocaleOn = true) => {
  const localeStatus = isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();
  return localeStatus;
};

const setDefaultOpen = (key) => {
  const keyList = [];
  let keyString = '';
  if (key) {
    const arr = key.split('-');
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      // eslint-disable-next-line no-unused-expressions
      index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
      keyList.push(keyString);
    }
  }
  return keyList;
};

function MenuItem({ title, icon, path }) {
  const dispatch = useDispatch();

  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');

  const closeMobileNav = () => {
    if (isMobile) {
      dispatch(onMobileNavToggle(false));
    }
  };

  return (
    <Row align="middle">
      {icon && <Icon type={icon} />}
      <span style={{ paddingTop: 3 }}>{setLocale(title)}</span>
      {path && <Link onClick={closeMobileNav} to={path} />}
    </Row>
  );
}

const getSideNavMenuItem = (navItem, user) => navItem.map((nav) => {
  const roleHasPermission = nav?.navAccess?.find((roles) => roles === user);
  return (
    {
      key: nav.key,
      style: { display: roleHasPermission ? 'block' : 'none' },
      label: (
        <MenuItem
          title={nav.title}
          {...(nav.isGroupTitle ? {} : { path: nav.path, icon: nav.icon })} />
      ),
      ...(nav.isGroupTitle ? { type: 'group' } : {}),
      ...(nav.submenu.length > 0 ? { children: getSideNavMenuItem(nav.submenu, user) } : {})
    }
  );
});

const getTopNavMenuItem = (navItem) => navItem.map((nav) => ({
  key: nav.key,
  label: (
    <MenuItem
      icon={nav.icon}
      title={nav.title}
      {...(nav.isGroupTitle ? {} : { path: nav.path })} />
  ),
  ...(nav.submenu.length > 0 ? { children: getTopNavMenuItem(nav.submenu) } : {})
}));

function SideNavContent(props) {
  const { routeInfo, hideGroupTitle, user } = props;

  const sideNavTheme = useSelector((state) => state.theme.sideNavTheme);

  const menuItems = getSideNavMenuItem(navigationConfig, user);

  return (
    <Menu
      className={`side-nav-bar ${hideGroupTitle ? 'hide-group-title' : ''}`}
      defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
      defaultSelectedKeys={[routeInfo?.key]}
      items={menuItems}
      mode="inline"
      style={{ height: '100%', borderRight: 0, fontSize: 16 }}
      theme={sideNavTheme === SIDE_NAV_LIGHT ? 'light' : 'dark'} />
  );
}

function TopNavContent() {
  const topNavColor = useSelector((state) => state.theme.topNavColor);

  const menuItems = useMemo(() => getTopNavMenuItem(navigationConfig), []);

  return <Menu items={menuItems} mode="horizontal" style={{ backgroundColor: topNavColor }} />;
}

function MenuContent(props) {
  return props.type === NAV_TYPE_SIDE ? (
    <SideNavContent {...props} />
  ) : (
    <TopNavContent {...props} />
  );
}

export default MenuContent;
