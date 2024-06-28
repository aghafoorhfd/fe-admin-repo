import React from 'react';
import PropTypes from 'prop-types';
import { Card as AntdCard } from 'antd';
import CardHeader from './CardHeader';

const Card = (props) => {
  const {
    heading, description, actionBtn, children, ...restProps
  } = props;

  return (
    <AntdCard {...restProps}>
      {heading && (
      <CardHeader heading={heading} description={description} actionBtn={actionBtn} />
      )}
      {children}
    </AntdCard>
  );
};

Card.propTypes = {
  bordered: PropTypes.bool,
  heading: PropTypes.string,
  actionBtn: PropTypes.node,
  description: PropTypes.string
};

Card.defaultProps = {
  bordered: false,
  heading: '',
  actionBtn: '',
  description: ''
};

export { Card };
