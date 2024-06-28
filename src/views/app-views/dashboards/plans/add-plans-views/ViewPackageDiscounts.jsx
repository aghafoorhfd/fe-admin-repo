import React from 'react';
import {
  Card, Col, Row, Empty
} from 'antd';
import DiscountRange from 'components/shared-components/DiscountRange';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { noop } from 'lodash';
import '../plans.css';

const ViewPackageDiscounts = ({
  packageDiscountsData, onEditPackageDiscount,
  onDeletePackageDiscount, paymentCycleId
}) => {
  const { t } = useTranslation();
  return (
    <Card className="view-disconut-card" title={t('component.discount.plan.form.discounts.title')} bodyStyle={{ height: '240px', overflowY: 'scroll' }}>
      <Row gutter={[8, 8]} className={`${!packageDiscountsData?.length > 0 ? 'd-flex justify-content-center align-items-center h-100' : ''}`}>

        {
                  packageDiscountsData?.length > 0
                    ? packageDiscountsData.map((packageDiscount, index) => (
                      <Col key={`${packageDiscount.discountPerc + index}-${paymentCycleId}`}>
                        <DiscountRange
                          isDeleteBtnDisable={index < packageDiscountsData.length - 1}
                          showActions
                          onDeletePackageDiscount={onDeletePackageDiscount}
                          onEditPackageDiscount={onEditPackageDiscount}
                          index={index}
                          packageDiscount={packageDiscount}
                          className="m-0" />
                      </Col>
                    ))
                    : <Empty />
              }
      </Row>
    </Card>
  );
};
ViewPackageDiscounts.propTypes = {
  onEditPackageDiscount: PropTypes.func,
  onDeletePackageDiscount: PropTypes.func,
  packageDiscountsData: PropTypes.arrayOf(PropTypes.shape(
    {
      minUsers: PropTypes.number,
      maxUsers: PropTypes.number,
      discountPerc: PropTypes.number
    }
  )),
  paymentCycleId: PropTypes.string
};

ViewPackageDiscounts.defaultProps = {
  onEditPackageDiscount: noop,
  onDeletePackageDiscount: noop,
  packageDiscountsData: [],
  paymentCycleId: ''
};

export default ViewPackageDiscounts;
