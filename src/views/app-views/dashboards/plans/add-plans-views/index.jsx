import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Button, Form, Input, Row, Select, InputNumber, DatePicker
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/shared-components/Modal/index';
import { REGEX } from 'constants/RegexConstant';
import { noop } from 'lodash';
import { getFeatures } from 'store/slices/plansSlice';
import { freePaymentCycle, paymentCycleMockData } from 'mock/data/plans';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';
import { BILLING_OPTIONS } from 'constants/MiscConstant';
import AddPackageDiscountModal from './AddPackageDiscountModal';
import PlanPackageDiscountWidget from './PlanPackageDiscountWidget';
import '../plans.css';

const btnStyles = {
  btnIconStyle: { fontSize: '20px', strokeWidth: '10' },
  btnStyle: {
    display: 'flex',
    marginTop: '15px',
    marginBottom: '10px'
  }
};

const AddNewPlanModal = ({
  onAddNewPlan, onCancel, planPackageDiscountRanges, setPlanPackageDiscountRanges, form,
  isFormEditable
}) => {
  const dispatch = useDispatch();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const {
    featureOptions
  } = useSelector((state) => ({ ...state.plan }));

  const [showPackageDiscountModal, setShowPackageDiscountModal] = useState(false);

  const [paymentCycleId, setPaymentCycleId] = useState('');
  const [discountModalTitle, setDiscountModalTitle] = useState('');
  const [isAddPlanBtnDisable, setIsAddPlanBtnDisable] = useState(false);
  const { t } = useTranslation();
  const maxLicenses = Form.useWatch('maxLicenses', form);
  const planName = Form.useWatch('planName', form);
  const discountRangesLength = Object.keys(planPackageDiscountRanges).length;
  const isFreePkg = () => planPackageDiscountRanges[freePaymentCycle.id];
  const { FREE } = BILLING_OPTIONS;

  useEffect(() => {
    dispatch(getFeatures());
  }, []);

  const getModalTitle = () => (isFormEditable
    ? t('component.addPlan.form.modal.edit.title')
    : t('component.addPlan.form.modal.add.title'));

  const getOkText = () => (isFormEditable
    ? t('component.common.update.label')
    : t('component.common.save.label'));

  useEffect(() => {
    const { data } = paymentCycleMockData;
    if (!isFreePkg() && data.length > 0) {
      if (discountRangesLength !== data.length) {
        setIsAddPlanBtnDisable(true);
      } else {
        const hasMismatchedMaxUsers = Object.values(planPackageDiscountRanges).some(
          (currentRange) => {
            const { maxUsers } = currentRange[currentRange.length - 1];
            return maxUsers !== maxLicenses;
          }
        );
        setIsAddPlanBtnDisable(hasMismatchedMaxUsers);
      }
    }
  }, [planPackageDiscountRanges, maxLicenses]);

  const onCancelHandler = () => {
    form.resetFields();
    setIsFormTouched(false);
    onCancel();
  };
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onAddNewPlan(values);
        form.resetFields();
      }).catch((info) => {
        throw info;
      });
  };

  const openDiscountModal = (Id, title) => {
    setShowPackageDiscountModal(true);
    setPaymentCycleId(Id);
    setDiscountModalTitle(title);
  };
  const onAddPackageDiscount = (packageDiscounts, Id) => {
    const discountRanges = { ...planPackageDiscountRanges };
    if (packageDiscounts?.length === 0) {
      delete discountRanges[Id];
    } else {
      discountRanges[Id] = [...packageDiscounts];
    }
    setPlanPackageDiscountRanges(discountRanges);
    setIsFormTouched(true);
  };

  const setDiscountRangesFileds = () => {
    const maxUsers = form.getFieldValue('maxLicenses');
    if (maxUsers) {
      const initialRanges = {
        minUsers: 1,
        maxUsers,
        discountPerc: 0
      };
      const payload = {};
      const monthlyId = paymentCycleMockData.data[0]?.id;
      const yearlyId = paymentCycleMockData.data[1]?.id;
      payload[monthlyId] = [initialRanges];
      payload[yearlyId] = [initialRanges];
      setPlanPackageDiscountRanges(payload);
    }
  };

  const getDiscountBtnTitle = (paymentCycle) => `${planPackageDiscountRanges[paymentCycle?.id]?.length > 0 ? t('component.common.update.label') : t('component.common.add.label')}
   ${paymentCycle?.name} ${t('component.discount.plan.form.discounts.title')}`;

  const isOpenDiscountBtnDisable = () => !maxLicenses || maxLicenses < 10;

  return (
    <Modal
      forceRender
      width={900}
      title={getModalTitle()}
      open
      onCancel={onCancelHandler}
      confirmOnCancel={isFormTouched}
      onOk={form.submit}
      okButtonProps={{ disabled: isAddPlanBtnDisable }}
      okText={getOkText()}>
      <Form
        className="plan-form"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFieldsChange={() => {
          setIsFormTouched(true);
        }}
        initialValues={{
          planType: 'WEB',
          currencyCode: 'USD'
        }}>
        <Row gutter={[14, 14]}>
          <Form.Item
            hidden
            data-i="form-item-id"
            name="planId">
            <Input />
          </Form.Item>

          <Col span={12}>
            <Form.Item
              name="planType"
              label={t('component.addPlan.form.field.modal.planType')}
              required>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="planName"
              label={t('component.addPlan.form.field.modal.planName')}
              rules={[{
                required: true,
                message: t('component.addPlan.form.validation.message', { role: t('component.addPlan.form.field.modal.planName') })
              },
              {
                min: 4,
                message: t('component.addPlan.form.field.planName.min.validation')
              }, {
                pattern: REGEX.ALPHA_MIN_THREE_ALLOW_SPECIAL,
                message: t('component.addPlan.form.field.modal.planName.alpha.validation')
              }]}>
              <Input placeholder={t('component.addPlan.form.field.modal.planName.placeholder')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="currencyCode"
              label={t('component.addPlan.form.field.modal.currencyCode')}
              required>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="maxLicenses"
              label={t('component.addPlan.form.field.modal.noOfLicenses')}
              rules={[{
                required: true,
                message: t('component.addPlan.form.field.modal.noOfLicenses.message')
              },
              () => ({
                validator(_, value) {
                  if (value < 10) {
                    return Promise.reject(new Error(t('component.addPlan.form.field.noOfLicenses.min.validation')));
                  }
                  return Promise.resolve();
                }
              })
              ]}>
              <InputNumber
                {...(planName !== FREE && { onBlur: () => setDiscountRangesFileds() })}
                className="w-100"
                disabled={!isFreePkg() && discountRangesLength > 0}
                placeholder={t('component.addPlan.form.field.modal.noOfLicenses.placeholder')} />
            </Form.Item>
            {
                !isFreePkg() && discountRangesLength > 0 && (
                  <span className="plan-warning-text">
                    {t('component.discount.plan.form.validation.info2')}
                  </span>
                )
              }
          </Col>
          <Col span={12}>
            <Form.Item
              name="amountPerLicense"
              label={t('component.addPlan.form.field.modal.billingRate')}
              rules={[{
                required: true,
                message: t('component.addPlan.form.validation.message', { role: t('component.addPlan.form.field.modal.billingRate') })
              }, () => ({
                validator(_, value) {
                  if ((isFreePkg() && value !== 0) || (!isFreePkg() && value < 1)) {
                    return Promise.reject(new Error(t('component.addPlan.form.field.billingRate.validation')));
                  }
                  return Promise.resolve();
                }
              })]}>
              <InputNumber disabled={isFreePkg()} className="w-100" placeholder={t('component.addPlan.form.field.modal.billingRate.placeholder')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="billingDate"
              label={t('component.addPlan.form.field.modal.billingDate')}
              rules={[{
                required: true,
                message: t('component.addPlan.form.validation.message', { role: t('component.addPlan.form.field.modal.billingDate') })
              }]}>
              <DatePicker
                format={DATE_FORMAT_MM_DD_YYYY_WITH_SLASH}
                className="w-100"
                placeholder={t('component.addPlan.form.field.modal.billingDate.placeholder')}
                getPopupContainer={(trigger) => trigger.parentNode} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="featureIds"
              label={t('component.addPlan.form.field.modal.features')}
              rules={[{
                required: true,
                message: t('component.addPlan.form.validation.message', { role: t('component.addPlan.form.field.modal.features') })
              }]}>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder={t('component.addPlan.form.field.modal.features.placeholder')}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)
              || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
                options={featureOptions}
                getPopupContainer={(trigger) => trigger.parentNode} />
            </Form.Item>
          </Col>
          {
              !isFreePkg() && (
                <Col span={24}>
                  {
                    paymentCycleMockData?.data?.map((paymentCycle) => (
                      <React.Fragment key={paymentCycle?.id}>
                        <Button
                          type="primary"
                          disabled={isOpenDiscountBtnDisable()}
                          onClick={() => openDiscountModal(paymentCycle?.id, `${paymentCycle?.name} ${t('component.discount.plan.form.discounts.title')}`)}
                          icon={<PlusOutlined style={btnStyles.btnIconStyle} />}
                          ghost
                          style={btnStyles.btnStyle}>
                          {getDiscountBtnTitle(paymentCycle)}
                        </Button>
                        <PlanPackageDiscountWidget
                          paymentCycleId={paymentCycle?.id}
                          packageDiscounts={planPackageDiscountRanges[paymentCycle?.id]}
                          paymentCycleTitle={`${paymentCycle?.name} ${t('component.discount.plan.form.discounts.title')}`} />
                      </React.Fragment>
                    ))
                  }
                  {isAddPlanBtnDisable && (
                    <span className="plan-warning-text d-inline-block my-1">
                      {t('component.discount.plan.form.validation.info1')}
                    </span>
                  )}
                </Col>
              )
            }
        </Row>
      </Form>
      {
        showPackageDiscountModal && (
          <AddPackageDiscountModal
            maxLicenses={maxLicenses}
            modalTitle={discountModalTitle}
            onAddPackageDiscount={onAddPackageDiscount}
            onCancel={() => setShowPackageDiscountModal(false)}
            paymentCycleId={paymentCycleId}
            packageDiscounts={planPackageDiscountRanges[paymentCycleId]} />
        )
      }

    </Modal>
  );
};
AddNewPlanModal.propTypes = {
  onAddNewPlan: PropTypes.func,
  onCancel: PropTypes.func
};

AddNewPlanModal.defaultProps = {
  onAddNewPlan: noop,
  onCancel: noop
};

export default AddNewPlanModal;
