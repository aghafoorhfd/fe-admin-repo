import PropTypes from 'prop-types';

const CardHeader = (props) => {
  const { heading, actionBtn, description } = props;
  return (
    <div className="card-header">
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-tertiary font-size-xl font-weight-semibold">{heading}</div>
        <div>{actionBtn}</div>
      </div>
      <div className="text-gray-light mt-1">{description}</div>
    </div>
  );
};

CardHeader.propTypes = {
  heading: PropTypes.string.isRequired,
  actionBtn: PropTypes.node,
  description: PropTypes.string
};

CardHeader.defaultProps = {
  actionBtn: '',
  description: ''
};

export default CardHeader;
