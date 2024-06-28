import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
  Typography,
  Empty
} from 'antd';
import DiscountRange from 'components/shared-components/DiscountRange';

const { Paragraph } = Typography;
const planStyles = {
  rowStyle: {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #E4E7EC',
    borderRadius: '8px 8px 8px 8px'
  },
  columnStyle: {
    background: '#3E79F7',
    borderRadius: '8px 0px 0px 8px'
  },
  discountRangeStyle: {
    margin: '5px 0px 4px 9px'
  },
  discountColumnStyle: {
    height: '155px',
    overflowY: 'scroll'
  },
  paragraphStyle: { color: 'white', paddingLeft: '30px' }
};

const PlanPackageDiscountWidget = ({
  packageDiscounts,
  paymentCycleTitle, paymentCycleId
}) => (
  <div>
    <Row
      justify="start"
      style={planStyles.rowStyle}>
      <Col
        justify="start"
        span={3}
        className="d-flex align-items-center fw-bold left-column"
        style={planStyles.columnStyle}>
        <Paragraph
          strong
          className="mb-0"
          style={planStyles.paragraphStyle}>
          {paymentCycleTitle}
        </Paragraph>
      </Col>
      <Col
        span={21}
        style={planStyles.discountColumnStyle}>
        <Row className={`${!packageDiscounts?.length > 0 ? 'd-flex justify-content-center align-items-center h-100' : ''}`}>
          {
                packageDiscounts?.length > 0
                  ? packageDiscounts.map((packageDiscount, index) => (
                    <Col key={`${packageDiscount.discountPerc + index}-${paymentCycleId}`} style={planStyles.discountRangeStyle}>
                      <DiscountRange packageDiscount={packageDiscount} className="m-0" />
                    </Col>
                  ))
                  : <Empty />
            }
        </Row>
      </Col>
    </Row>
  </div>
);

PlanPackageDiscountWidget.propTypes = {
  packageDiscounts: PropTypes.arrayOf(PropTypes.shape(
    {
      minUsers: PropTypes.number,
      maxUsers: PropTypes.number,
      discountPerc: PropTypes.number
    }
  )),
  paymentCycleTitle: PropTypes.string,
  paymentCycleId: PropTypes.string
};

PlanPackageDiscountWidget.defaultProps = {
  packageDiscounts: [],
  paymentCycleTitle: '',
  paymentCycleId: ''
};

export default PlanPackageDiscountWidget;
