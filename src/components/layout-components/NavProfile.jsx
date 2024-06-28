import React from 'react';
import { Menu, Dropdown, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { signOut } from 'store/slices/authSlice';

export function NavProfile() {
  const {
    auth: {
      userProfile: {
        firstName, lastName, accessTypeName
      } = {}
    } = {}
  } = useSelector((state) => ({
    auth: state.auth
  }));
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const handleClick = ({ key }) => {
    if (key === 'Sign Out') {
      handleSignOut();
    }
  };

  const menu = (
    <Menu
      items={[
        {
          key: 'Sign Out',
          label: t('component.button.signOut'),
          icon: <LogoutOutlined className="font-size-md" />
        }
      ]}
      onClick={handleClick} />
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
      <div className="nav-item">
        <div className="d-flex align-items-center">
          <Avatar icon={<UserOutlined />} />
          <div className="pl-2 d-none d-sm-block profile-text">
            <div className="font-size-base font-weight-bold">{`${firstName} ${lastName}`}</div>
            <span className="opacity-0-8">{accessTypeName}</span>
          </div>
        </div>
      </div>
    </Dropdown>
  );
}

export default NavProfile;
