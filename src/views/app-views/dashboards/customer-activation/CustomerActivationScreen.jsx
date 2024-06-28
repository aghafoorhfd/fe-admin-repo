import React, { useEffect, useState } from 'react';
import {
  Row, Col, Typography, Card, Spin, Button, Form, notification, Input, Select, DatePicker
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import AdminService from 'services/AdminService';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';
import { B2BMonthlyPackage, B2BProductId, B2BYearlyPackage } from 'constants/PricingPackagesConstant';
import { BILLING_CYCLE_OPTIONS, PLAN_TYPE_OPTIONS, STATUS_OPTIONS } from 'constants/DropdownOptions';
import { CUSTOMER_ACTIVATION_ACTIONS } from 'constants/MiscConstant';

// Helper components
import { getAllB2BCustomersPlansList, filters, resetCustomerData } from 'store/slices/customerActivationSlice';
import DataTable from 'components/shared-components/DataTable';
import Filters from 'components/common/filters/Filters';
import useFilter from 'utils/hooks/useFilter';
import { SearchOutlined } from '@ant-design/icons';
import { getColumns } from './CustomerActivationTableConfig';
import './customer-activation-styles.css';
import AddNewProfileFormModal from './addNewProfileFormModal';

export default function CustomerActivationScreen() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { RangePicker } = DatePicker;
  const [addProfileForm] = Form.useForm();
  const [showAddProfileFormModal, setShowAddProfileFormModal] = useState(false);
  const [appliedFilters, , clearFilters] = useFilter('CustomerActivationScreen');
  const { uri } = appliedFilters;
  const [, B2B] = PLAN_TYPE_OPTIONS;
  const {
    loading,
    customersList: {
      data: { totalElements, content = [] } = {}
    },
    filter: { pageNumber, pageSize }
  } = useSelector((state) => state.customerActivation);

  const { Title } = Typography;
  useEffect(() => {
    dispatch(getAllB2BCustomersPlansList());
    return () => {
      clearFilters();
      dispatch(resetCustomerData());
    };
  }, []);

  const tableLoading = {
    spinning: loading,
    indicator: <Spin />
  };

  const addProfileOnOk = async (formValue) => {
    const planPayload = {
      customer: {
        companyName: formValue?.companyName,
        email: formValue?.email,
        firstName: formValue?.firstName,
        lastName: formValue?.lastName,
        organizationName: formValue?.companyName
      },
      noOfLicenses: formValue?.noOfLicenses,
      planType: formValue?.planType,
      currencyCode: 'USD',
      billingDate: moment(formValue?.billingDate).format(DATE_FORMAT_DD_MM_YYYY),
      amountPerLicense: formValue?.amountPerLicense,
      productId: B2BProductId,
      planPackageDiscountRanges: formValue?.billingCycle === 'Monthly' ? B2BMonthlyPackage : B2BYearlyPackage
    };
    try {
      await AdminService.addPlan(planPayload);
      addProfileForm.resetFields();
      notification.success({ message: t('component.product.admin.success.message') });
      dispatch(getAllB2BCustomersPlansList(appliedFilters));
      setShowAddProfileFormModal(false);
    } catch (error) {
      notification.error({ message: error?.message });
    }
  };

  const handleChange = (pagination) => {
    const { current, pageSize: size } = pagination;
    const { applied: { status } = {} } = appliedFilters;

    dispatch(filters({
      pageNumber: current, pageSize: size, uri, status
    }));
  };

  const filterItems = () => (
    [
      {
        name: 'dateRange',
        label: t('component.customer.activation.table.column.activeDate'),
        colSpan: 24,
        render: () => (
          <RangePicker superNextIcon style={{ width: '100%' }} format={DATE_FORMAT_MM_DD_YYYY_WITH_SLASH} />
        ),
        formatter: (value) => value?.map((val) => moment(val)?.format('YYYY-MM-DD'))
      },
      {
        name: 'customer',
        label: t('component.product.admin.company.name'),
        colSpan: 24,
        render: () => (
          <Input placeholder={t('component.product.admin.company.name')} prefix={<SearchOutlined className="mr-0" />} />
        )
      },
      {
        name: 'planType',
        label: t('component.customer.activation.table.column.customerType'),
        colSpan: 12,
        render: () => (
          <Select
            allowClear
            showSearch
            disabled
            showArrow
            options={PLAN_TYPE_OPTIONS}
            placeholder={t('component.customer.activation.form.label.selectType')}
            defaultValue={B2B.value} />
        )
      },
      {
        name: 'status',
        label: t('component.common.status.label'),
        colSpan: 12,
        render: () => (
          <Select
            allowClear
            showSearch
            showArrow
            options={STATUS_OPTIONS}
            placeholder={t('component.common.status.label')} />
        )
      },
      {
        name: 'planPaymentCycle',
        label: t('component.common.label.billingCycle'),
        colSpan: 12,
        render: () => (
          <Select
            allowClear
            showSearch
            showArrow
            options={BILLING_CYCLE_OPTIONS}
            placeholder={t('component.common.label.billingCycle')} />
        )
      }
    ]
  );

  const handleSearch = () => {
    const { applied: { status } } = appliedFilters;
    dispatch(filters({
      pageNumber: 1, pageSize, uri, status
    }));
  };

  const handleClear = () => {
    dispatch(filters({
      pageNumber: 1, pageSize
    }));
  };

  const handleSendInvite = async ({ customer: { customerId } = {} } = {}) => {
    try {
      await AdminService.sendInvite(customerId);
      notification.success({
        message: t('component.customer.activation.sendInviteSuccess')

      });
    } catch (err) {
      notification.error({
        message: err?.message || t('component.customer.activation.sendInviteError')

      });
    }
  };

  const handleActions = (actionType, record) => {
    switch (actionType) {
      case CUSTOMER_ACTIVATION_ACTIONS.SEND_INVITE:
        handleSendInvite(record);
        break;
      default:
    }
  };

  return (
    <>
      <Row align="middle" className="ml-2 mb-3" justify="space-between">
        <Col>
          <Title className="mb-0" strong level={3}>{t('component.customer.activation.heading')}</Title>
        </Col>
        <Col>
          <Filters
            placement="bottomLeft"
            name="CustomerActivationScreen"
            onSearch={handleSearch}
            onClear={handleClear}
            formItems={filterItems()} />
          <Button className="ml-2" type="primary" onClick={() => setShowAddProfileFormModal(true)}>
            {t('component.customer.activation.addNewProfile')}
          </Button>
        </Col>
      </Row>
      <Card className="product-admin-table-container">
        <DataTable
          id="subscriptionId"
          data-i="customerActivationTable"
          columns={getColumns(handleActions)}
          scroll={{ y: 475 }}
          bordered
          handleChange={handleChange}
          data={content}
          currentPage={pageNumber}
          pageSize={pageSize}
          loading={tableLoading}
          showPagination
          totalElements={totalElements} />
      </Card>
      <AddNewProfileFormModal
        form={addProfileForm}
        open={showAddProfileFormModal}
        onCancel={() => setShowAddProfileFormModal(false)}
        onOk={addProfileOnOk} />
    </>
  );
}
