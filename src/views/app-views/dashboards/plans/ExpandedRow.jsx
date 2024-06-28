import React, { memo } from 'react';
import {
  Tag, Tabs
} from 'antd';
import { useTranslation } from 'react-i18next';
import { filter, sortBy } from 'lodash';

const ExpandedRow = ({ features, planPackages, key }) => {
  const { t } = useTranslation();

  const DiscountRange = ({ planPackage }) => (
    <Tag color="blue" className="mt-1">
      {t('component.user.dashboard.label.users')}
      :
      {' '}
      {planPackage.minUsers}
      {' '}
      -
      {' '}
      {planPackage.maxUsers}
      <br />
      {t('component.admin.plans.dashboard.table.column.discount')}
      :
      {' '}
      {planPackage.discountPerc}
    </Tag>
  );

  const sortPlans = (filterValue) => sortBy(
    filter(
      planPackages,
      ({ planPaymentCycleName }) => planPaymentCycleName === 'Free' || planPaymentCycleName === filterValue
    ),
    ['minUsers']
  );

  return (
    <>
      <div className="text-tertiary font-size-md font-weight-semibold">{t('component.admin.plans.dashboard.table.column.features')}</div>
      {features.map((feature) => (
        <Tag color="blue" key={`${key}-${feature.id}`} className="mt-1">
          {feature?.name}
        </Tag>
      ))}
      <div className="text-tertiary font-size-md font-weight-semibold mt-4">{t('component.admin.plans.dashboard.table.column.discountRanges')}</div>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: t('component.product.admin.monthly'),
            key: '1',
            children: sortPlans('Monthly').map((planPackage) => (
              <DiscountRange planPackage={planPackage} key={`${key}-${planPackage.id}`} />
            ))
          },
          {
            label: t('component.product.admin.yearly'),
            key: '2',
            children: sortPlans('Yearly').map((planPackage) => (
              <DiscountRange planPackage={planPackage} key={`${key}-${planPackage.id}`} />
            ))
          }
        ]} />
    </>
  );
};

export default memo(ExpandedRow);
