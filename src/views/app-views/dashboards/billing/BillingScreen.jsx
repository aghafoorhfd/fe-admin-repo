import React, { useEffect, useState } from 'react';
import {
  Col, Row, Spin, Typography
} from 'antd';
import DataTable from 'components/shared-components/DataTable';
import { useTranslation } from 'react-i18next';
import { getAllCustomersPlansList, filters, resetAnalyticsData } from 'store/slices/analyticsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { adminBillingDashboardColumns } from './adminBillingDashboardColumns';
import EditBillingModal from './EditBillingModal';

const { Title } = Typography;

const BillingScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [billingRecord, setBillingRecord] = useState(null);

  const {
    loading,
    customersList: {
      data: { totalElements, content = [] } = {}
    },
    filter: { pageNumber, pageSize }
  } = useSelector((state) => state.analytics);

  const handleEditClick = (record) => {
    setShowModal(true);
    setBillingRecord(record);
  };

  useEffect(() => {
    dispatch(getAllCustomersPlansList());
    return () => {
      dispatch(resetAnalyticsData());
    };
  }, []);

  const handleChange = (pagination) => {
    const { current, pageSize: size } = pagination;
    dispatch(filters({ pageNumber: current, pageSize: size }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBillingRecord(null);
  };

  const tableLoading = {
    spinning: loading,
    indicator: <Spin />
  };

  return (
    <>
      <Row justify="space-between" align="middle" className="mb-3">
        <Col>
          <Title className="mb-0" strong level={3}>{t('component.admin.billing.dashboard.title')}</Title>
        </Col>
      </Row>
      <DataTable
        data-i="adminBillingDashboard"
        data={content}
        columns={adminBillingDashboardColumns(handleEditClick)}
        id="subscriptionId"
        loading={tableLoading}
        showPagination
        totalElements={totalElements}
        pageSize={pageSize}
        currentPage={pageNumber}
        handleChange={handleChange} />

      <EditBillingModal
        open={showModal}
        onCloseModal={handleCloseModal}
        billingRecord={billingRecord}
        onSuccess={() => dispatch(filters({ pageNumber, pageSize }))} />
    </>
  );
};

export default BillingScreen;
