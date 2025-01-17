import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import utils from 'utils';

const { useBreakpoint } = Grid;

function SideContent(props) {
  const { sideContent, sideContentWidth = 250, border } = props;
  return (
    <div
      className={`side-content ${border ? 'with-border' : ''}`}
      style={{ width: `${sideContentWidth}px` }}>
      {sideContent}
    </div>
  );
}

function SideContentMobile(props) {
  const { sideContent, visible, onSideContentClose } = props;
  return (
    <Drawer
      bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
      closable={false}
      onClose={onSideContentClose}
      open={visible}
      placement="left"
      width={320}>
      <div className="h-100">{sideContent}</div>
    </Drawer>
  );
}

export function InnerAppLayout(props) {
  const { mainContent, pageHeader, sideContentGutter = true } = props;
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  const [visible, setVisible] = useState(false);

  const close = () => {
    setVisible(false);
  };

  const openSideContentMobile = () => {
    setVisible(true);
  };

  return (
    <div className="inner-app-layout">
      {isMobile ? (
        <SideContentMobile onSideContentClose={close} open={visible} {...props} />
      ) : (
        <SideContent {...props} />
      )}
      <div
        className={`main-content ${pageHeader ? 'has-page-header' : ''} ${
          sideContentGutter ? 'gutter' : 'no-gutter'
        }`}>
        {isMobile ? (
          <div className={`font-size-lg mb-3 ${!sideContentGutter ? 'pt-3 px-3' : ''}`}>
            <MenuOutlined onClick={() => openSideContentMobile()} />
          </div>
        ) : null}
        {mainContent}
      </div>
    </div>
  );
}

InnerAppLayout.propTypes = {
  sideContent: PropTypes.node.isRequired,
  mainContent: PropTypes.node.isRequired,
  pageHeader: PropTypes.bool.isRequired,
  sideContentWidth: PropTypes.number.isRequired,
  border: PropTypes.bool.isRequired,
  sideContentGutter: PropTypes.bool.isRequired
};

export default InnerAppLayout;
