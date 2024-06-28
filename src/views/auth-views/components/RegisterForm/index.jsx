import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, Alert, Row, Col, notification
} from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signUp, hideAuthMessage, showLoading } from 'store/slices/authSlice';
import { REGEX } from 'constants/RegexConstant';
import { LOGIN } from 'constants/AuthConstant';
import { STATUS } from 'constants/StatusConstant';

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    auth: {
      loading, message, showMessage, status
    }
  } = useSelector((state) => ({
    auth: state.auth
  }));

  const rules = {
    firstName: [
      {
        required: true,
        message: t('component.inputField.message.firstName')

      },
      {
        min: 3,
        message: t('component.inputField.message.firstName.length')
      },
      {
        pattern: REGEX.ALPHABET_ALLOW_FORMAT_REGEX,
        message: t('component.userForm.alphabet.validation')
      }
    ],
    lastName: [
      {
        required: true,
        message: t('component.inputField.message.lastName')
      },
      {
        min: 3,
        message: t('component.inputField.message.lastName.length')
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
    ]
  };

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSignUp = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(showLoading());
        dispatch(signUp(values));
      })
      .catch((info) => {
        const notificationParam = {
          message: ''
        };

        notificationParam.message = info.message;
        notification.error(notificationParam);
      });
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => dispatch(hideAuthMessage()), 3000);
      if (status === STATUS.SUCCESS) {
        form.resetFields();
      }
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showMessage]);

  return (
    <>
      <motion.div
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0
        }}
        initial={{ opacity: 0, marginBottom: 0 }}>
        <Alert message={message} showIcon type={status} />
      </motion.div>
      <Form form={form} layout="vertical" name="register-form" onFinish={onSignUp}>
        <Form.Item name="firstName" label={t('component.inputField.label.firstName')} rules={rules.firstName} hasFeedback>
          <Input data-i="firstName" placeholder={t('component.inputField.label.firstName')} prefix={<UserOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item name="lastName" label={t('component.inputField.label.lastName')} rules={rules.lastName} hasFeedback>
          <Input data-i="lastName" placeholder={t('component.inputField.label.lastName')} prefix={<UserOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item hasFeedback label={t('component.label.email')} name="email" rules={rules.email}>
          <Input data-i="email" placeholder={t('component.auth.email')} prefix={<MailOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Button block disabled={loading || showMessage} type="primary" onClick={() => navigate(LOGIN)}>
                {t('component.button.back')}
              </Button>
            </Col>
            <Col span={12}>
              <Button block disabled={loading || showMessage} data-i="sign-up" htmlType="submit" loading={loading} type="primary">
                {t('component.button.signUp')}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};

export default RegisterForm;
