import React, { useEffect, useState } from 'react';
import {
  Col, Row, Typography, Button, Form, notification, Modal
} from 'antd';
import { B2BProductId } from 'constants/PricingPackagesConstant';
import DataTable from 'components/shared-components/DataTable';
import { useTranslation } from 'react-i18next';
import { groupBy, noop, sortBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPlan, deletePlan, editPlan, getPlans, hidePlanMessage
} from 'store/slices/plansSlice';
import moment from 'moment';
import { freePaymentCycle } from 'mock/data/plans';
import {
  PLAN_ACTIONS
} from 'constants/MiscConstant';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import IntlMessage from 'components/util-components/IntlMessage';
import { getColumns } from './PlansTableConfig';
import ExpandedRow from './ExpandedRow';
import AddNewPlanModal from './add-plans-views';
import UserRolePrivilegesModal from './UserRolePrivilegesModal';

const { Title } = Typography;
const { confirm } = Modal;

const PlansScreen = () => {
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [planPackageDiscountRanges, setPlanPackageDiscountRanges] = useState({});
  const [planNameToEdit, setPlanNameToEdit] = useState('');
  const [showUserRolePrivilegesModal, setShowUserRolePrivilegesModal] = useState(false);
  const [planID, setPlanID] = useState();

  const {
    plansList, filter: { pageNumber, pageSize }, totalElements = 10, loading,
    showMessage, message, status
  } = useSelector((state) => ({ ...state.plan }));
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPlans({ pageSize: 10, pageNumber: 0 }));
  }, []);

  useEffect(() => {
    const successMessages = [
      t('component.plan.dashboard.planEdit.success.message'),
      t('component.plan.dashboard.planAdded.success.message'),
      t('component.plan.dashboard.planDelete.success.message')
    ];
    if (showMessage) {
      notification[status]({ message });

      if (successMessages.includes(message)) {
        dispatch(getPlans({ pageSize: 10, pageNumber: 0 }));
      }
      dispatch(hidePlanMessage());
    }
  }, [showMessage]);

  const handleClosePlanModal = () => {
    setShowAddPlanModal(false);
    setPlanNameToEdit('');
    setPlanPackageDiscountRanges({});
  };

  const onAddNewPlan = async (values) => {
    const payload = {
      ...values,
      billingDate: moment(values?.billingDate).format('DD-MM-YYYY'),
      planPackageDiscountRanges,
      productId: B2BProductId
    };

    if (values.planId) {
      if (planNameToEdit === payload.planName) {
        delete payload.planName;
      }

      if (planPackageDiscountRanges[freePaymentCycle.id]) {
        payload.planPackageDiscountRanges = {
          [freePaymentCycle.id]: [{
            minUsers: '0',
            maxUsers: values.maxLicenses,
            discountPerc: '0'
          }]
        };
      }
    }
    dispatch(values.planId ? editPlan(payload) : addPlan(payload));
    handleClosePlanModal();
  };

  const handleEditClick = ({
    planPackages, maxLicenses, name, basePrice, features, id, billingDate
  }) => {
    setShowAddPlanModal(true);
    const planPackagesGroup = groupBy(sortBy(planPackages, ['minUsers']), (n) => n.planPaymentCycleId);

    form.setFieldsValue({
      maxLicenses,
      planName: name,
      amountPerLicense: basePrice,
      featureIds: features?.map((feature) => (feature.id)),
      planId: id,
      planType: 'WEB',
      billingDate: moment(billingDate)
    });
    setPlanPackageDiscountRanges(planPackagesGroup);
    setPlanNameToEdit(name);
  };

  const handleOpenModal = () => {
    setShowAddPlanModal(true);
  };
  const handleAddEditUserPrivileges = ({ id }) => {
    setPlanID(id);
    setShowUserRolePrivilegesModal(true);
  };

  const handleRemovePlanClick = (planId) => {
    dispatch(deletePlan(planId));
  };

  const showRemovePlanConfirmation = ({ id }) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5><IntlMessage id="component.plan.dashboard.remove.confirmation" /></h5>,
      onOk() {
        handleRemovePlanClick(id);
      }
    });
  };

  const handleActions = (actionType, record) => {
    switch (actionType) {
      case PLAN_ACTIONS.EDIT_PLAN:
        handleEditClick(record);
        break;
      case PLAN_ACTIONS.DELETE_PLAN:
        showRemovePlanConfirmation(record);
        break;
      case PLAN_ACTIONS.ADD_EDIT_SCREEN_PRIVILEGES:
        handleAddEditUserPrivileges(record);
        break;
      default:
    }
  };

  return (
    <>
      <Row justify="space-between" align="middle" className="mb-3">
        <Col>
          <Title className="mb-0" strong level={3}>{t('component.admin.plans.dashboard.title')}</Title>
        </Col>
        <Col>
          <Button className="ml-2" type="primary" onClick={handleOpenModal}>
            {t('component.addPlan.form.modal.add.title')}
          </Button>
        </Col>
      </Row>
      <DataTable
        data-i="adminWebPlansDashboard"
        data={plansList}
        columns={getColumns(handleActions)}
        id="id"
        loading={loading}
        showPagination
        totalElements={totalElements}
        pageSize={pageSize}
        currentPage={pageNumber}
        handleChange={noop}
        expandable={{
          expandedRowRender: ({ features, planPackages, key }) => (
            <ExpandedRow
              features={features}
              planPackages={planPackages}
              key={key} />
          )
        }} />
      {
        showAddPlanModal && (
          <AddNewPlanModal
            isFormEditable={planNameToEdit}
            onAddNewPlan={onAddNewPlan}
            onCancel={handleClosePlanModal}
            setPlanPackageDiscountRanges={setPlanPackageDiscountRanges}
            planPackageDiscountRanges={planPackageDiscountRanges}
            form={form} />
        )

      }
      {showUserRolePrivilegesModal
        && (
        <UserRolePrivilegesModal
          planID={planID}
          setShowUserRolePrivilegesModal={setShowUserRolePrivilegesModal} />
        )}
    </>
  );
};

export default PlansScreen;
