import React, { useEffect, useState } from 'react';
import Modal from 'components/shared-components/Modal/index';
import { useTranslation } from 'react-i18next';
import {
  Form, notification
} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import SubscriptionService from 'services/AdminService';
import BillingForm from './BillingForm';

const EditBillingModal = (props) => {
  const {
    open, onCloseModal, billingRecord, onSuccess
  } = props;
  const { t } = useTranslation();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [form] = Form.useForm();

  const handleFormSubmission = () => {
    form.validateFields().then(async (formValue) => {
      const planPayload = {
        planType: formValue.clientType,
        productId: billingRecord.productId,
        currencyCode: billingRecord.currencyCode,
        noOfLicenses: formValue.activeUsers,
        amountPerLicense: formValue.rate,
        billingDate: moment(formValue?.billingDate).format('DD-MM-YYYY'),
        customerId: billingRecord?.customer?.customerId,
        planPaymentCycleId: formValue.billingCycle,
        planId: billingRecord.planId
      };
      try {
        await SubscriptionService.upgradePlan(planPayload);
        notification.success({ message: t('component.product.admin.update.success.message') });
        onSuccess();
      } catch (error) {
        notification.error({ message: error?.message });
      } finally {
        onCloseModal();
      }
    }).catch((info) => { throw info; });
  };

  const handleOnCancel = () => {
    form.resetFields();
    onCloseModal();
    setIsFormTouched(false);
  };

  useEffect(() => {
    if (open) {
      const {
        customer, status, planType, planPackage, basePrice, totalLicenses, activatedDate,
        billingDate
      } = billingRecord;

      form.setFieldsValue({
        clientName: `${customer?.firstName} ${customer?.lastName}`,
        clientType: planType,
        product: t('component.common.status.pmo.tracker'),
        dateActivated: moment(activatedDate, 'YYYY-MM-DD'),
        status,
        billingCycle: planPackage?.planPaymentCycleId,
        billingDate: moment(billingDate, 'YYYY-MM-DD'),
        rate: basePrice,
        activeUsers: totalLicenses
      });
    }
  }, [open]);

  return (
    <Modal
      title={t('component.admin.billing.dashboard.modal.title')}
      isOpen={open}
      onCancel={handleOnCancel}
      confirmOnCancel={isFormTouched}
      okText={billingRecord ? t('component.common.update.label') : t('component.common.add.label')}
      onOk={form.submit}
      okButtonProps={{ disabled: !isFormTouched }}
      width={800}>
      <BillingForm
        noOfLicences={billingRecord?.noOfLicences}
        billingDate={billingRecord?.billingDate}
        billingPeriod={billingRecord?.billingCycle}
        form={form}
        planType={billingRecord?.planType}
        handleSubmit={handleFormSubmission}
        setIsFormTouched={setIsFormTouched} />
    </Modal>
  );
};

EditBillingModal.propTypes = {
  open: PropTypes.bool.isRequired
};

export default EditBillingModal;
