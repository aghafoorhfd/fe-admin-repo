import React from 'react';
import PropTypes from 'prop-types';

const Value = (props) => {
  let value;
  switch (props.size) {
    case 'lg':
      value = <h1 className="mb-0 font-weight-bold">{props.value}</h1>;
      break;
    case 'md':
      value = <h2 className="mb-0 font-weight-bold">{props.value}</h2>;
      break;
    case 'sm':
      value = <h3 className="mb-0 font-weight-bold">{props.value}</h3>;
      break;
    default:
      value = <h3 className="mb-0 font-weight-bold">{props.value}</h3>;
  }
  return value;
};

export function CustomStatistic(props) {
  const { size, value, title } = props;
  return (
    <div>
      <Value size={size} value={value} />
      <p className="mb-0 text-muted">{title}</p>
    </div>
  );
}

CustomStatistic.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

CustomStatistic.defaultProps = {
  size: 'md'
};

export default CustomStatistic;
