import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CountryPhoneInput, { ConfigProvider } from 'antd-country-phone-input';
import en from 'world_countries_lists/data/countries/en/world.json';
import { useDispatch, useSelector } from 'react-redux';
import parsePhoneNumber from 'libphonenumber-js';
import { noop } from 'lodash';
import {
  addUser, editUser, resetStatus, toggleForm
} from 'store/slices/userSlice';
import { USER_FORM_ACCESSTYPE } from 'constants/DropdownOptions';
import { REGEX } from 'constants/RegexConstant';
import { STATUS } from 'constants/StatusConstant';
import { capitalize } from 'utils/utils';
import Modal from 'components/shared-components/Modal/index';

const { SUCCESS } = STATUS;
const UserForm = ({
  selectedRecord, setSelectedRecord, action, setAction = noop
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isFormTouched, setIsFormTouched] = useState(false);
  // const [accessTypeOptions, setAccessTypeOptions] = useState(USER_FORM_ACCESSTYPE);
  const dispatch = useDispatch();

  const {
    user: { isFormVisible, status, loading }
  } = useSelector((state) => ({
    user: state.user
  }));

  const defaultPhone = {
    short: 'US',
    phone: '',
    code: ''
  };
  const isFormEditable = Object.keys(selectedRecord)?.length > 0;

  const getModalTitle = () => (isFormEditable
    ? t('component.userForm.edit.user.title')
    : t('component.userForm.add.user.title'));

  const getOkText = () => (isFormEditable
    ? t('component.common.update.label')
    : t('component.common.add.label'));

  const getSecondaryButtonText = () => t('component.auth.cancel');

  const getSecondaryButtonAction = () => {
    if (isFormEditable && action?.actionType && action?.actionHandler) {
      return () => action.actionHandler(selectedRecord);
    }
    return 'close';
  };
  useEffect(() => {
    if (status === SUCCESS) {
      form.resetFields();
      setIsFormTouched(false);
      setSelectedRecord({});
      dispatch(resetStatus());
    }
  }, [status]);

  useEffect(() => {
    if (isFormEditable) {
      const {
        firstName, id, lastName, accessType, email, phoneNumber
      } = selectedRecord;
      let parsedPhoneNumber = parsePhoneNumber(`+${phoneNumber}`);
      parsedPhoneNumber = {
        short: parsedPhoneNumber?.country || defaultPhone.short,
        phone: parsedPhoneNumber?.nationalNumber || defaultPhone.phone,
        code: parsedPhoneNumber?.countryCallingCode || defaultPhone.code
      };
      form.setFieldsValue({
        id, firstName, lastName, accessType, email, phoneNumber: parsedPhoneNumber
      });
    } else {
      // set default phone when creating new user
      form.setFieldsValue({
        phoneNumber: defaultPhone
      });
    }
  }, [selectedRecord]);

  const rules = {
    firstName: [
      {
        required: true,
        message: t('component.userForm.name.required')
      },
      {
        min: 3,
        message: t('component.userForm.name.length')
      },
      {
        pattern: REGEX.ALPHABET_ALLOW_FORMAT_REGEX,
        message: t('component.userForm.alphabet.validation')
      }
    ],
    lastName: [
      {
        required: true,
        message: t('component.userForm.lastName.required')
      },
      {
        pattern: REGEX.ALPHABET_ALLOW_FORMAT_REGEX,
        message: t('component.userForm.alphabet.validation')
      }
    ],
    email: [
      {
        required: true,
        message: t('component.auth.inputField.validationRule.4')
      },
      {
        type: 'email',
        message: t('component.auth.inputField.validationRule.5')
      }
    ],
    options: [
      {
        required: true,
        message: t('component.userForm.dropdown.value.required')
      }
    ],
    phoneNumber: [
      () => ({
        validator(_, value) {
          const containsAlphabetic = REGEX.ALPHABETICAL_ALLOW_FORMAT_REGEX.test(value?.phone);
          if (containsAlphabetic) {
            return Promise.reject(
              new Error(
                t(
                  'component.userForm.label.number.validation'
                )
              )
            );
          }
          return Promise.resolve();
        }
      })
    ]
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const {
          id, email, phoneNumber, accessType, firstName, lastName
        } = values || {};
        const { countryCallingCode = '', nationalNumber = '' } = parsePhoneNumber(
          phoneNumber.phone,
          phoneNumber.short
        ) || {};
        const payload = {
          id,
          email,
          accessType,
          ...(phoneNumber.phone ? { phoneNumber: `${countryCallingCode}${nationalNumber}` } : {}),
          firstName: capitalize(firstName),
          lastName: capitalize(lastName)
        };
        dispatch(isFormEditable ? editUser(payload) : addUser(payload));
      })
      .catch((info) => {
        throw info;
      });
  };

  const handleCancel = () => {
    dispatch(toggleForm(false));
    setIsFormTouched(false);
    setAction({ actionType: null, actionHandler: noop });
    form.resetFields();
    setSelectedRecord({});
  };

  const secondaryActionsButtons = () => (
    [
      {
        action: getSecondaryButtonAction(),
        block: true,
        colSpan: 12,
        label: getSecondaryButtonText(),
        type: 'default'
      },
      {
        action: form.submit,
        block: true,
        colSpan: 12,
        label: getOkText(),
        disable: loading,
        loading,
        type: 'primary'
      }
    ]
  );

  const filteredOptions = () => USER_FORM_ACCESSTYPE;

  const userFormContent = () => (
    <ConfigProvider locale={en}>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        name="user-modal-form"
        data-i="user-form"
        onFieldsChange={() => {
          setIsFormTouched(true);
        }}>
        <Form.Item hidden data-i="form-item-id" name="id">
          <Input />
        </Form.Item>
        <Form.Item
          data-i="form-item-firstName"
          name="firstName"
          label={t('component.inputField.label.firstName')}
          rules={rules.firstName}
          hasFeedback>
          <Input
            data-i="form-item-firstName-inputField"
            allowClear
            placeholder={t('component.inputField.message.firstName')} />
        </Form.Item>
        <Form.Item
          data-i="form-item-lastName"
          name="lastName"
          label={t('component.inputField.label.lastName')}
          rules={rules.lastName}
          hasFeedback>
          <Input
            data-i="form-item-lastName-inputField"
            allowClear
            placeholder={t('component.inputField.message.lastName')} />
        </Form.Item>
        <Form.Item
          data-i="form-item-accessType"
          name="accessType"
          label={t('component.userForm.label.accessType')}
          rules={rules.options}
          hasFeedback>
          <Select
            name="accessType"
            data-i="form-item-accessType-inputField"
            allowClear
            showSearch
            placeholder={t('component.userForm.dropdown.placeholder')}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) => (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())}
            options={filteredOptions()}
            getPopupContainer={(trigger) => trigger.parentNode} />
        </Form.Item>
        <Form.Item
          data-i="form-item-email"
          name="email"
          label={t('component.label.email')}
          rules={rules.email}
          hasFeedback>
          <Input
            data-i="form-item-email-inputField"
            disabled={isFormEditable}
            allowClear
            placeholder={t('component.auth.email')} />
        </Form.Item>
        <Form.Item
          data-i="form-item-number"
          name="phoneNumber"
          rules={rules.phoneNumber}
          label={t('component.userForm.label.number')}>
          <CountryPhoneInput inline />
        </Form.Item>
      </Form>
    </ConfigProvider>
  );

  return (
    <Modal
      destroyOnClose
      forceRender
      data-i="user-form-modal"
      confirmOnCancel={isFormTouched}
      open={isFormVisible}
      title={getModalTitle()}
      description={isFormEditable ? t('component.userForm.edit.user.description') : t('component.userForm.add.user.description')}
      onOk={form.submit}
      okText={getOkText()}
      onCancel={handleCancel}
      footer={null}
      secondaryActionsButtons={secondaryActionsButtons()}>
      {userFormContent()}
    </Modal>
  );
};

UserForm.propTypes = {
  setSelectedRecord: PropTypes.func.isRequired,
  selectedRecord: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    accessType: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string
  }),
  action: PropTypes.shape({
    actionType: PropTypes.string,
    actionHandler: PropTypes.func
  })
};

UserForm.defaultProps = {
  selectedRecord: {},
  action: {
    actionType: '',
    actionHandler: noop
  }
};

export default UserForm;
