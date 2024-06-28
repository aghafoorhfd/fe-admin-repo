import {
  Col,
  DatePicker,
  Divider,
  Form, Input, Row, Select
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Modal from 'components/shared-components/Modal/index';
import './add-new-profile-form-styles.css';
import { REGEX } from 'constants/RegexConstant';
import { BILLING_CYCLE_OPTIONS } from 'constants/DropdownOptions';
import { disableDates, disableNumberFieldScroll } from 'utils/utils';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';

const AddNewProfileFormModal = ({
  form, open, onCancel, onOk
}) => {
  const [MONTHLY, YEARLY] = BILLING_CYCLE_OPTIONS;
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [billingCycle, setBillingCycle] = useState();

  const handleBillingCycleChange = (value) => {
    setBillingCycle(value);
  };

  const onCancelHandler = () => {
    form.resetFields();
    setIsFormTouched(false);
    onCancel(false);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
      }).catch((info) => {
        throw info;
      });
  };

  const { t } = useTranslation();
  return (
    <Modal
      forceRender
      data-i="add-new-profile-form-modal"
      width={800}
      open={open}
      title={t('component.addNewProfile.form.modal.popup.title')}
      onCancel={onCancelHandler}
      confirmOnCancel={isFormTouched}
      onOk={form.submit}
      okText={t('component.common.save.label')}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFieldsChange={() => {
          setIsFormTouched(true);
        }}>
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="firstName"
              label={t('component.addNewProfile.form.modal.popup.firstName')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.firstName') })
              },
              {
                min: 3,
                message: t('component.userForm.name.length')
              },
              {
                pattern: REGEX.ALPHABET_ALLOW_FORMAT_REGEX,
                message: t('component.userForm.alphabet.validation')
              }]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.firstName')} />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="lastName"
              label={t('component.addNewProfile.form.modal.popup.lastName')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.lastName') })
              },
              {
                min: 3,
                message: t('component.userForm.name.length')
              },
              {
                pattern: REGEX.ALPHABET_ALLOW_FORMAT_REGEX,
                message: t('component.userForm.alphabet.validation')
              }]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.lastName')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="email"
              label={t('component.addNewProfile.form.modal.popup.email')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.email') })
              },
              {
                type: 'email',
                message: t('component.auth.inputField.validationRule.5')
              }]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.email')} />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="companyName"
              label={t('component.addNewProfile.form.modal.popup.subDomain')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.subDomain') })
              }]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.companyName')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} justify="space-between">
          <Col span={12}>
            <Form.Item
              name="organizationName"
              label={t('component.addNewProfile.form.modal.popup.organizationName')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.organizationName') })
              }]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.organizationName')} />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="planType"
              label={t('component.addNewProfile.form.modal.popup.planType')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.planType') })
              }]}>
              <Select placeholder={t('component.userForm.dropdown.account.type.placeholder')} getPopupContainer={(trigger) => trigger.parentNode}>
                <Select.Option value="B2B">B2B</Select.Option>
                <Select.Option value="WEB" disabled>WEB</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="billingCycle"
              label={t('component.common.label.billingCycle')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.common.label.billingCycle') })
              }]}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                onChange={handleBillingCycleChange}
                placeholder={t('component.admin.billing.dashboard.billingCycle.placeholder')}
                options={[MONTHLY, YEARLY]?.map((e) => ({ label: e?.label, value: e?.value }))} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="amountPerLicense"
              label={t('component.addNewProfile.form.modal.popup.amountPerLicense')}
              rules={[
                {
                  required: true,
                  message: t('component.addNewProfile.form.validation.message', {
                    role: t('component.addNewProfile.form.modal.popup.amountPerLicense')
                  })
                },
                () => ({
                  validator(_, value) {
                    if (value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('component.addNewProfile.input.label.validation.length')));
                  }
                })
              ]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.amountPerLicense')}
                type="number"
                onFocus={disableNumberFieldScroll}
                min={1} />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="billingDate"
              label={t('component.addNewProfile.form.modal.popup.billingDate')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.billingDate') })
              }]}>
              <DatePicker
                format={DATE_FORMAT_MM_DD_YYYY_WITH_SLASH}
                className="w-100"
                placeholder={t('component.projectMetrics.form.placeholder.date')}
                disabledDate={(current) => disableDates(current, billingCycle)}
                getPopupContainer={(trigger) => trigger.parentNode} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="noOfLicenses"
              label={t('component.addNewProfile.form.modal.popup.noOfLicenses')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.noOfLicenses') })
              },
              () => ({
                validator(_, value) {
                  if (value < 50) {
                    return Promise.reject(new Error(t('component.addNewProfile.form.validation.min.noOfLicenses')));
                  }
                  return Promise.resolve();
                }
              })
              ]}>
              <Input
                type="number"
                onFocus={disableNumberFieldScroll}
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.noOfLicenses')} />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="promoCode"
              label={t('component.addNewProfile.form.modal.popup.promoCode')}>
              <Input
                onFocus={disableNumberFieldScroll}
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.promoCode')} />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Modal>
  );
};

AddNewProfileFormModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
};

AddNewProfileFormModal.defaultProps = {
  open: false,
  onCancel: () => {},
  onOk: () => {}
};

export default AddNewProfileFormModal;
