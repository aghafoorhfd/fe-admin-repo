import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { SIDE_NAV_WIDTH, SIDE_NAV_DARK, NAV_TYPE_SIDE } from 'constants/ThemeConstant';
import MenuContent from './MenuContent';

const { Sider } = Layout;

export function SideNav({
  navCollapsed, sideNavTheme, routeInfo, hideGroupTitle, user
}) {
  const props = {
    sideNavTheme, routeInfo, hideGroupTitle, user
  };
  return (
    <Sider
      className={`side-nav ${sideNavTheme === SIDE_NAV_DARK ? 'side-nav-dark' : ''}`}
      collapsed={navCollapsed}
      width={SIDE_NAV_WIDTH}>
      <Scrollbars autoHide>
        <MenuContent type={NAV_TYPE_SIDE} {...props} />
      </Scrollbars>
    </Sider>
  );
}

const mapStateToProps = ({ theme, auth }) => {
  const { navCollapsed, sideNavTheme } = theme;
  const { user } = auth;
  return { navCollapsed, sideNavTheme, user };
};

export default connect(mapStateToProps)(SideNav);
