import React, { useEffect } from 'react';
import {
  Card, Row, Col, Form, Input, Button, Space, Alert, Image
} from 'antd';
import { motion } from 'framer-motion';
import { MailOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordRequest, hideAuthMessage } from 'store/slices/authSlice';
import IntlMessage from 'components/util-components/IntlMessage';
import { LOGIN } from 'constants/AuthConstant';
import './index.css';

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-17.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};

function ForgotPassword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    auth: {
      loading, message: sentMessageContent, showMessage, status
    },
    theme: { currentTheme }
  } = useSelector((state) => ({
    auth: state.auth,
    theme: state.theme
  }));

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => dispatch(hideAuthMessage()), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  });

  const onSend = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(forgotPasswordRequest({
          ...values
        }));
        form.resetFields();
      })
      .catch((info) => {
        throw info;
      });
  };

  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col lg={9} md={20} sm={20} xs={20}>
            <Card>
              <div className="my-2">
                <div className="text-center">
                  <Image
                    width={170}
                    preview={false}
                    src={`/img/${currentTheme === 'light' ? 'pmo-logo.png' : 'pmo-logo.png'}`} />
                  <h3 className="mt-3 font-weight-bold">
                    <IntlMessage id="component.auth.forgotPassword" />
                  </h3>
                  <Space>
                    <IntlMessage id="component.forgotPassword.subHeading" />
                  </Space>
                  <motion.div
                    animate={{
                      opacity: showMessage ? 1 : 0,
                      marginBottom: showMessage ? 20 : 0
                    }}
                    initial={{ opacity: 0, marginBottom: 0 }}>
                    <Alert message={sentMessageContent} showIcon type={status} />
                  </motion.div>
                </div>
                <Row justify="center">
                  <Col lg={20} md={20} sm={24} xs={24}>
                    <Form form={form} layout="vertical" name="forget-password" onFinish={onSend}>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: <IntlMessage id="component.auth.inputField.validationRule.4" />
                          },
                          {
                            type: 'email',
                            message: <IntlMessage id="component.auth.inputField.validationRule.5" />
                          }
                        ]}>
                        <Input
                          data-i="input-email"
                          placeholder={t('component.auth.email')}
                          prefix={<MailOutlined className="text-primary" />} />
                      </Form.Item>
                      <Form.Item>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Button data-i="back-btn" block disabled={loading || showMessage} type="primary" onClick={() => navigate(LOGIN)}>
                              {t('component.button.back')}
                            </Button>
                          </Col>
                          <Col span={12}>
                            <Button
                              data-i="send-email-btn"
                              block
                              htmlType="submit"
                              type="primary"
                              disabled={loading}>
                              {loading ? (
                                <div>
                                  <IntlMessage id="component.auth.sending" />
                                </div>
                              ) : (
                                <div>
                                  <IntlMessage id="component.auth.send" />
                                </div>
                              )}
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ForgotPassword;
