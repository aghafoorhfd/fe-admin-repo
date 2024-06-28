import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Form, DatePicker,
  Input,
  Row,
  Col,
  Select
} from 'antd';
import PropTypes from 'prop-types';
import { disableDates, disableNumberFieldScroll } from 'utils/utils';
import { PLAN_TYPE_OPTIONS } from 'constants/DropdownOptions';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';
import { BILLING_OPTIONS } from 'constants/MiscConstant';
import moment from 'moment';

const BillingForm = (props) => {
  const [WEB, B2B] = PLAN_TYPE_OPTIONS;
  const {
    form, setIsFormTouched, handleSubmit, noOfLicences, billingDate, billingPeriod, planType
  } = props;
  const [paymentCycleOptions, setPaymentCycleOptions] = useState([]);
  const [billingCycleName, setBillingCycleName] = useState('');
  const { t } = useTranslation();

  const {
    plan: {
      paymentCycle
    }
  } = useSelector((state) => ({
    plan: state.plan
  }));

  const billingCycle = Form.useWatch('billingCycle', form);

  const clientType = Form.useWatch('clientType', form);

  useEffect(() => {
    if (paymentCycle?.length > 0) {
      setPaymentCycleOptions(paymentCycle.filter(
        ({ name }) => !(name === BILLING_OPTIONS.FREE && clientType === B2B.value)
      ));
    }
    if (clientType === B2B.value && billingPeriod === BILLING_OPTIONS.FREE) {
      form.resetFields(['billingCycle']);
    }
  }, [paymentCycle, clientType]);

  useEffect(() => {
    if (paymentCycleOptions?.length > 0) {
      const paymentCycleName = paymentCycleOptions.find(({ id }) => id === billingCycle)?.name;
      setBillingCycleName(paymentCycleName);
    }
  }, [paymentCycleOptions, billingCycle]);

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      data-i="admin-billing-form"
      onFieldsChange={() => {
        setIsFormTouched(true);
      }}>
      <Row justify="space-between" gutter={24}>
        <Col span={12}>

          <Form.Item name="clientName" label={t('component.admin.billing.dashboard.clientName.input.label')} rules={[{ required: true }]}>
            <Input disabled type="text" placeholder={t('component.admin.billing.dashboard.clientName.placeholder')} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="clientType" label={t('component.admin.billing.dashboard.clientType.input.label')} rules={[{ required: true }]}>
            <Select
              disabled={planType === B2B.value}
              name="clientType"
              getPopupContainer={(trigger) => trigger.parentElement}
              id="form-item-billing-clientType"
              placeholder={t('component.admin.billing.dashboard.clientType.placeholder')}
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) => (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())}
              options={PLAN_TYPE_OPTIONS?.map((e) => ({ label: e?.label, value: e?.value }))} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="product" label={t('component.admin.billing.dashboard.product.input.label')} rules={[{ required: true }]}>
            <Input disabled type="text" placeholder={t('component.admin.billing.dashboard.product.placeholder')} />
          </Form.Item>
        </Col>
        <Col span={12}>

          <Form.Item name="dateActivated" label={t('component.admin.billing.dashboard.dateActivated.input.label')} rules={[{ required: true }]}>
            <DatePicker disabled className="w-100" format={DATE_FORMAT_MM_DD_YYYY_WITH_SLASH} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="status" label={t('component.common.status.label')} rules={[{ required: true }]}>
            <Input disabled placeholder={t('component.common.status.label')} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="billingCycle" label={t('component.common.label.billingCycle')} rules={[{ required: true }]}>
            <Select
              getPopupContainer={(trigger) => trigger.parentElement}
              disabled={clientType === WEB.value}
              options={paymentCycleOptions.map(
                (paymentCycleOption) => ({
                  label: paymentCycleOption?.name,
                  value: paymentCycleOption?.id
                })
              )}
              placeholder={t('component.common.label.billingCycle')} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="billingDate" label={t('component.addNewProfile.form.modal.popup.billingDate')} rules={[{ required: true }]}>
            <DatePicker
              getPopupContainer={(trigger) => trigger.parentElement}
              disabled={clientType === WEB.value}
              className="w-100"
              format={DATE_FORMAT_MM_DD_YYYY_WITH_SLASH}
              disabledDate={(current) => disableDates(
                current,
                billingCycleName,
                planType === B2B.value ? billingDate : moment().startOf('day')
              )} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="rate"
            label={t('component.admin.billing.dashboard.rate.input.label')}
            rules={[{
              required: true,
              message: t('component.addNewProfile.form.validation.message', { role: t('component.admin.billing.dashboard.rate.input.label') })
            },
            () => ({
              validator(_, value) {
                if (value < 0) {
                  return Promise.reject(new Error(t('component.admin.billing.dashboard.input.label.validation.length')));
                }
                return Promise.resolve();
              }
            })
            ]}>
            <Input onFocus={disableNumberFieldScroll} disabled={clientType === WEB.value} type="number" placeholder={t('component.admin.billing.dashboard.rate.input.label')} />
          </Form.Item>
        </Col>

        <Col span={12}>

          <Form.Item
            name="activeUsers"
            label={t('component.admin.billing.dashboard.activeUsers.input.label')}
            rules={[{
              required: true,
              message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.noOfLicenses') })
            },
            () => ({
              validator(_, value) {
                if (value && value < noOfLicences) {
                  return Promise.reject(new Error(t('component.admin.billing.dashboard.form.validation.activeUsers', { noOfLicences })));
                }
                return Promise.resolve();
              }
            })]}>
            <Input onFocus={disableNumberFieldScroll} disabled={clientType === WEB.value} type="number" placeholder={t('component.admin.billing.dashboard.activeUsers.input.label')} />
          </Form.Item>
        </Col>

        <Col span={12}>

          <Form.Item
            name="revenue"
            label={t('component.admin.billing.dashboard.revenue.input.label')}>
            <Input onFocus={(e) => e.target.addEventListener('wheel', (ev) => { ev.preventDefault(); }, { passive: false })} disabled={clientType === WEB.value} type="number" placeholder={t('component.admin.billing.dashboard.revenue.input.label')} />
          </Form.Item>
        </Col>

      </Row>
    </Form>
  );
};

BillingForm.propTypes = {
  setIsFormTouched: PropTypes.func.isRequired
};

export default BillingForm;
