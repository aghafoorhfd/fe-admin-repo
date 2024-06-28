import React, { useState, useEffect } from 'react';
import Modal from 'components/shared-components/Modal';
import { useTranslation } from 'react-i18next';
import AdminService from 'services/AdminService';
import { useDispatch } from 'react-redux';
import { getUserRolesAndPrivileges } from 'store/slices/plansSlice';
import {
  Form, Input, Tooltip, Row, Col, notification
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { addScreenExamples } from 'constants/MiscConstant';

const AddPrivilegesModal = ({
  setSelectedPrivilege,
  selectedRecord,
  setPrivilegesModalVisible,
  isOpen
}) => {
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFormEditable = Object.keys(selectedRecord)?.length > 0;

  useEffect(() => {
    if (isFormEditable) {
      const {
        name, description, url
      } = selectedRecord;
      form.setFieldsValue({
        privileges: name || '',
        description: description || '',
        url: url || ''
      });
    }
  }, [isFormEditable]);

  const handleCancel = () => {
    setPrivilegesModalVisible(false);
    form.resetFields();
    setIsFormTouched(false);
    setSelectedPrivilege({});
  };

  const handleSubmit = async () => {
    form.validateFields().then(async (values) => {
      const payload = {
        id: isFormEditable ? selectedRecord?.id : values.id,
        name: values.privileges,
        description: values.description || '',
        deleteDecision: false,
        url: values.url
      };
      try {
        if (isFormEditable) {
          await AdminService.updateScreenPrivileges(payload);
          notification.success({ message: t('component.product.admin.update.privileges.success.message') });
        } else {
          await AdminService.addScreenPrivileges({ ...payload, id: selectedRecord?.id });
          notification.success({ message: t('component.product.admin.add.privileges.success.message') });
        }
        dispatch(getUserRolesAndPrivileges());
      } catch (error) {
        notification.error({ message: error?.message });
      } finally {
        handleCancel();
      }
    }).catch((info) => { throw info; });
  };

  return (
    <Modal
      title={isFormEditable ? t('component.admin.privileges.dashboard.table.action.editPrivilege') : t('component.admin.privileges.add.privilege.title')}
      isOpen={isOpen}
      onCancel={handleCancel}
      confirmOnCancel={isFormTouched}
      okText={isFormEditable ? t('component.common.update.label') : t('component.common.save.label')}
      onOk={form.submit}
      okButtonProps={{ disabled: !isFormTouched }}>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        onFieldsChange={() => {
          setIsFormTouched(true);
        }}>
        <Form.Item
          hidden
          data-i="form-item-id"
          name="id">
          <Input />
        </Form.Item>
        <Form.Item
          name="privileges"
          label={t('component.admin.privileges.add.privilege.label')}
          rules={[{ required: true, message: t('component.admin.privileges.add.privilege.rules') }]}>
          <Input placeholder={t('component.admin.privileges.add.privileges.placeholder')} />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('component.admin.privileges.add.description.label')}>
          <Input.TextArea placeholder={t('component.admin.privileges.add.description.placeholder')} rows={2} />
        </Form.Item>
        <Form.Item
          name="url"
          label={(
            <Row className="d-flex flex-row">
              <Col>
                {t('component.admin.privileges.add.url.label')}
              </Col>
              <Col className="px-2">
                <Tooltip title={(
                  <ul>
                    {t('component.admin.privileges.add.url.tooltip')}
                    {
                      addScreenExamples.map(({ admin, dashboard, user }, index) => (
                        <React.Fragment key={`${index + 1}`}>
                          <li>
                            {admin}
                          </li>
                          <li>
                            {dashboard}
                          </li>
                          <li>
                            {user}
                          </li>
                        </React.Fragment>
                      ))
                    }
                  </ul>
        )}>
                  <InfoCircleOutlined className="cursor-pointer" />
                </Tooltip>
              </Col>
            </Row>
  )}
          rules={[{ required: true, message: t('component.admin.privileges.add.url.rules') }]}>
          <Input placeholder={t('component.admin.privileges.add.url.placeholder')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPrivilegesModal;
