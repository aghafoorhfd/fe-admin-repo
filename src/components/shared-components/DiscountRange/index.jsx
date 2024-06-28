import React from 'react';
import {
  Tag, Button
} from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import './index.css';

const DiscountRange = ({
  packageDiscount, className, onEditPackageDiscount,
  onDeletePackageDiscount, index, showActions, isDeleteBtnDisable
}) => {
  const { t } = useTranslation();
  return (
    <Tag color="blue" className={`discount-tag mt-1 ${className}`}>
      {t('component.user.dashboard.label.users')}
      :
      {packageDiscount.minUsers}
      -
      {packageDiscount.maxUsers}
      {showActions && (
      <span className="ml-2">
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEditPackageDiscount(packageDiscount, index)} />
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => onDeletePackageDiscount(index)}
          disabled={isDeleteBtnDisable}
          className="ml-1" />
      </span>
      )}
      <br />
      {t('component.admin.plans.dashboard.table.column.discount')}
      :
      {(packageDiscount.discountPerc * 100).toFixed(2)}
    </Tag>
  );
};

DiscountRange.propTypes = {
  onEditPackageDiscount: PropTypes.func,
  onDeletePackageDiscount: PropTypes.func,
  packageDiscount: PropTypes.shape({
    minUsers: PropTypes.number,
    maxUsers: PropTypes.number,
    discountPerc: PropTypes.number
  }),
  className: PropTypes.string,
  index: PropTypes.number,
  showActions: PropTypes.bool,
  isDeleteBtnDisable: PropTypes.bool
};

DiscountRange.defaultProps = {
  onEditPackageDiscount: noop,
  onDeletePackageDiscount: noop,
  className: '',
  index: 0,
  showActions: false,
  isDeleteBtnDisable: false,
  packageDiscount: {}
};

export default DiscountRange;
