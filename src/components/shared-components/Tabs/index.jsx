import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { useNavigate, useLocation } from 'react-router-dom';
/*
  Wrapper component for the Tabs
*/
const BasicTabs = ({
  items, tabBarExtraContent, onTabChange, selectedTab, pillShaped
}) => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [activeTab, setActiveTab] = useState(selectedTab);

  useEffect(() => {
    if (hash) {
      setActiveTab(hash.slice(1));
      onTabChange(hash.slice(1));
    }
  }, [hash]);

  const tabChangeHandler = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
    navigate(`#${tab}`);
  };

  return (
    <Tabs
      className={pillShaped ? 'pill-shape-tabs' : ''}
      activeKey={activeTab}
      key={activeTab}
      defaultActiveKey={activeTab}
      tabBarExtraContent={tabBarExtraContent}
      onChange={tabChangeHandler}
      items={items} />
  );
};

BasicTabs.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  tabBarExtraContent: PropTypes.node,
  onTabChange: PropTypes.func,
  selectedTab: PropTypes.string,
  pillShaped: PropTypes.bool
};

BasicTabs.defaultProps = {
  selectedTab: 'ACTIVE',
  tabBarExtraContent: null,
  onTabChange: noop,
  pillShaped: false
};
export default BasicTabs;
