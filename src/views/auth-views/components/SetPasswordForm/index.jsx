import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LockOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, Row, Col, Alert
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { REGEX } from 'constants/RegexConstant';
import { hideAuthMessage, savePassword } from 'store/slices/authSlice';
import { LOGIN, SIGN_UP } from 'constants/AuthConstant';

function SetPassword({ userId, newUser }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    auth: {
      status, loading, message, showMessage, redirect
    }
  } = useSelector((state) => ({
    auth: state.auth
  }));

  const rules = {
    password: [
      {
        required: true,
        message: t('component.auth.inputField.validationRule.1')
      },
      {
        required: true,
        min: 6,
        message: t('component.auth.inputField.passwordLength.message')
      },
      {
        required: true,
        pattern: REGEX.PASSWORD_FORMAT_REGEX,
        message: t('component.auth.inputField.validationRule.7')
      }
    ],
    confirm: [
      {
        required: true,
        message: t('component.auth.inputField.validationRule.3')
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Passwords do not match!'));
        }
      })
    ]
  };

  const onSavePassword = () => {
    form
      .validateFields()
      .then(({ password }) => {
        dispatch(savePassword({
          password, userId, newUser
        }));
        form.resetFields();
      })
      .catch((info) => {
        throw info;
      });
  };

  const redirectionOnCancel = newUser ? SIGN_UP : LOGIN;

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => dispatch(hideAuthMessage()), 3000);
      const navigateTimer = setTimeout(() => navigate(redirect), 3500);
      return () => {
        clearTimeout(timer, navigateTimer);
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
      <Form
        form={form}
        layout="vertical"
        name="register-form"
        onFinish={onSavePassword}
        data-i="form">
        <Form.Item
          data-i="form-item-password"
          hasFeedback
          label={t('component.auth.newPassword')}
          name="password"
          rules={rules.password}>
          <Input.Password data-i="password" placeholder={t('component.auth.placeholder.newPassword')} prefix={<LockOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item
          data-i="form-item-confirmPassword"
          hasFeedback
          label={t('component.auth.confirmPassword')}
          name="confirmPassword"
          rules={rules.confirm}>
          <Input.Password
            data-i="confirmPassword"
            placeholder={t('component.auth.placeholder.confirmPassword')}
            prefix={<LockOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Button block data-i="cancel-btn" disabled={loading} type="primary" onClick={() => navigate(redirectionOnCancel)}>
                {t('component.auth.cancel')}
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                data-i="save-btn"
                htmlType="submit"
                disabled={loading}
                type="primary">
                {t('component.common.save.label')}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
}

export default SetPassword;
