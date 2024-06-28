import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';

const Icon = <LoadingOutlined spin style={{ fontSize: 35 }} />;

function Loading(props) {
  const { align, cover } = props;
  return (
    <div className={`loading text-${align} cover-${cover}`}>
      <Spin indicator={Icon} />
    </div>
  );
}

Loading.propTypes = {
  cover: PropTypes.string,
  align: PropTypes.string
};

Loading.defaultProps = {
  align: 'center',
  cover: 'inline'
};

export default Loading;
