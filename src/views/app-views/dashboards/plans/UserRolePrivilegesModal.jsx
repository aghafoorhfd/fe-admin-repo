import React, { useEffect, useState } from 'react';
import {
  Form, Select, Row, Col
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserRolesAndPrivileges, getUserScreenPrivileges, addUserScreenPriviliges,
  resetUserScreenPrivileges
} from 'store/slices/plansSlice';
import { useTranslation } from 'react-i18next';
import Modal from 'components/shared-components/Modal/index';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import Loading from 'components/shared-components/Loading';

const { Option } = Select;

const UserRolePrivilegesModal = ({ setShowUserRolePrivilegesModal, planID }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [rolesWithChangedScreens, setRolesWithChangedScreens] = useState([]);
  const {
    userRoleOptions, userScreenOptions, rolePrivilegesLoading, userScreenPrivileges
  } = useSelector((state) => ({ ...state.plan }));

  useEffect(() => {
    dispatch(getUserRolesAndPrivileges());
    dispatch(getUserScreenPrivileges(planID));
  }, []);

  const closeUserRolePrivilegesModal = () => {
    dispatch(resetUserScreenPrivileges());
    setShowUserRolePrivilegesModal(false);
  };

  const onCancelHandler = () => {
    form.resetFields();
    setIsFormTouched(false);
    closeUserRolePrivilegesModal();
  };

  const addScreenPrivileges = (rolePrivileges) => {
    dispatch(addUserScreenPriviliges({ rolePrivileges, planID }));
    closeUserRolePrivilegesModal();
  };

  const mapScreensByRole = (roleId, formScreenPrivileges, savedScreenPrivileges) => {
    const formScreens = formScreenPrivileges.map((screenId) => ({
      id: screenId,
      deleteDecision: false
    }));

    const savedScreens = savedScreenPrivileges
      .filter((item) => !formScreenPrivileges.includes(item.screenId))
      .map(({ screenId }) => ({ id: screenId, deleteDecision: true }));

    return { roleId, payloadScreenList: [...formScreens, ...savedScreens] };
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((formValues) => {
        const screensByRole = rolesWithChangedScreens.map((roleId) => {
          const formScreenPrivileges = formValues[roleId] || [];
          const savedScreenPrivileges = userScreenPrivileges?.filter(
            (item) => item.roleId === roleId
          );
          return mapScreensByRole(roleId, formScreenPrivileges, savedScreenPrivileges);
        });
        addScreenPrivileges(screensByRole);
        form.resetFields();
      }).catch((info) => {
        throw info;
      });
  };

  useEffect(() => {
    if (userScreenPrivileges?.length > 0) {
      const initialValues = userScreenPrivileges.reduce((acc, curr) => {
        acc[curr.roleId] = (acc[curr.roleId] || []).concat(curr.screenId);
        return acc;
      }, {});

      form.setFieldsValue(initialValues);
    }
  }, [userScreenPrivileges]);

  const handleValuesChange = (changedValues) => {
    const roleID = Object.keys(changedValues)[0];
    if (!rolesWithChangedScreens.includes(roleID)) {
      setRolesWithChangedScreens((prevRoles) => [...prevRoles, roleID]);
    }
  };

  const getUserPrivilegesForm = () => (!rolePrivilegesLoading
    ? (
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFieldsChange={() => {
          setIsFormTouched(true);
        }}>
        {userRoleOptions.map((role) => (
          <Row key={role.value} gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name={role.label} initialValue={role.value} label={`${role.label} Role`} required>
                <Select disabled style={{ width: '100%' }}>
                  <Option value={role.value} key={role.value}>{role.label}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={role.value}
                label={`${role.label} Screens`}
                rules={[{
                  required: true,
                  message: t('component.admin.addRolePrivileges.form.validation.message', { screen: `${role.label} Screens` })
                }]}>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                  || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  placeholder={`Select Screens for ${role.label}`}
                  getPopupContainer={(trigger) => trigger.parentNode}>
                  {userScreenOptions.map((screen) => (
                    <Option value={screen.value} key={screen.value}>{screen.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        ))}

      </Form>
    ) : (
      <div className="my-4">
        <Loading />
      </div>
    ));

  return (
    <Modal
      open
      forceRender
      title={t('component.admin.addRolePrivileges.form.title')}
      width={750}
      onCancel={onCancelHandler}
      confirmOnCancel={isFormTouched}
      onOk={form.submit}
      okText={t('component.common.save.label')}
      okButtonProps={{ disabled: !isFormTouched }}>
      {
        getUserPrivilegesForm()
      }

    </Modal>
  );
};

UserRolePrivilegesModal.propTypes = {
  setShowUserRolePrivilegesModal: PropTypes.func,
  planID: PropTypes.string
};

UserRolePrivilegesModal.defaultProps = {
  setShowUserRolePrivilegesModal: noop,
  planID: PropTypes.string
};
export default UserRolePrivilegesModal;
